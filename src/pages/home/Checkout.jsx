import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
FiArrowRight,
FiCheck,
FiChevronLeft,
FiLock,
FiMapPin,
FiPhone,
FiMail,
FiPackage,
FiShoppingBag,
FiTruck,
FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
const navigate = useNavigate();

const {
cartItems,
subtotal,
cartCount,
isEmpty,
clearCart,
} = useCart();

const [isSubmitting, setIsSubmitting] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(false);
const [orderNumber, setOrderNumber] = useState("");

const [formData, setFormData] = useState({
firstName: "",
lastName: "",
phone: "",
email: "",
city: "",
address: "",
notes: "",
});

const [shippingMethod, setShippingMethod] = useState("standard");
const [paymentMethod, setPaymentMethod] = useState("cod");

const shippingOptions = {
standard: {
id: "standard",
name: "التوصيل العادي",
description: "التوصيل خلال 2 إلى 4 أيام عمل",
price: 25,
},
express: {
id: "express",
name: "التوصيل السريع",
description: "التوصيل خلال 24 إلى 48 ساعة",
price: 45,
},
};

const selectedShipping =
shippingOptions[shippingMethod];

const shippingPrice = useMemo(() => {
if (subtotal >= 500) {
return 0;
}

 
return selectedShipping.price;
 

}, [subtotal, selectedShipping.price]);

const total = useMemo(() => {
return Number(subtotal || 0) + shippingPrice;
}, [subtotal, shippingPrice]);

const freeShippingRemaining = useMemo(() => {
return Math.max(0, 500 - Number(subtotal || 0));
}, [subtotal]);

const handleChange = (event) => {
const { name, value } = event.target;

 
setFormData((current) => ({
  ...current,
  [name]: value,
}));
 

};

const validateForm = () => {
const requiredFields = [
{
field: "firstName",
message: "يرجى إدخال الاسم الأول.",
},
{
field: "lastName",
message: "يرجى إدخال اسم العائلة.",
},
{
field: "phone",
message: "يرجى إدخال رقم الهاتف.",
},
{
field: "city",
message: "يرجى اختيار المدينة.",
},
{
field: "address",
message: "يرجى إدخال عنوان التوصيل.",
},
];
 
for (const item of requiredFields) {
  if (!formData[item.field].trim()) {
    toast.error(item.message);
    return false;
  }
}

const phone = formData.phone.replace(/\s+/g, "");

if (!/^(?:\+212|0)([5-7]\d{8})$/.test(phone)) {
  toast.error("يرجى إدخال رقم هاتف مغربي صحيح.");
  return false;
}

if (formData.email.trim()) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email.trim())) {
    toast.error("يرجى إدخال بريد إلكتروني صحيح.");
    return false;
  }
}

return true;
 

};

const handleSubmit = async (event) => {
event.preventDefault();
 
if (isEmpty || cartItems.length === 0) {
  toast.error("السلة فارغة.");
  navigate("/products");
  return;
}

if (!validateForm()) {
  return;
}

setIsSubmitting(true);

try {
  /*
   * =====================================================
   * ORDER DATA
   * =====================================================
   *
   * هذا هو الشكل الذي سنرسله لاحقاً إلى الـ Backend.
   * لا نعتمد على بيانات السعر القادمة من الفورم.
   * المنتجات والأسعار تأتي من cartItems.
   */

  const orderData = {
    customer: {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    },

    shippingAddress: {
      city: formData.city.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
    },

    shipping: {
      method: selectedShipping.id,
      name: selectedShipping.name,
      price: shippingPrice,
    },

    payment: {
      method: paymentMethod,
    },

    items: cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      thumbnail: item.thumbnail,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
      color: item.color || null,
      size: item.size || null,
    })),

    pricing: {
      subtotal: Number(subtotal || 0),
      shipping: Number(shippingPrice || 0),
      total: Number(total || 0),
      currency: "MAD",
    },

    itemsCount: cartCount,
  };

  /*
   * =====================================================
   * TEMPORARY FRONTEND ORDER CREATION
   * =====================================================
   *
   * حالياً لا يوجد endpoint لإنشاء الطلب في الـ Backend
   * الذي نعمل عليه.
   *
   * نحفظ الطلب محلياً مؤقتاً حتى تكون واجهة Checkout
   * قابلة للاختبار بالكامل.
   *
   * عندما ننشئ /api/orders سنستبدل هذا الجزء بطلب Axios.
   */

  const generatedOrderNumber =
    `AM-${Date.now().toString().slice(-8)}`;

  const localOrder = {
    ...orderData,
    orderNumber: generatedOrderNumber,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const existingOrders = (() => {
    try {
      const saved =
        localStorage.getItem("amaroc_orders");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  })();

  localStorage.setItem(
    "amaroc_orders",
    JSON.stringify([
      localOrder,
      ...existingOrders,
    ])
  );

  setOrderNumber(generatedOrderNumber);
  setOrderSuccess(true);

  clearCart();

  toast.success("تم تسجيل طلبك بنجاح.");
} catch (error) {
  console.error(
    "Checkout error:",
    error
  );

  toast.error(
    "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."
  );
} finally {
  setIsSubmitting(false);
}
 

};

if (orderSuccess) {
return ( <main className="checkout-page"> <section className="checkout-success"> <div className="success-icon"> <FiCheck /> </div>

 
      <span className="success-eyebrow">
        AMAROC
      </span>

      <h1>
        تم تأكيد طلبك
      </h1>

      <p>
        شكراً لك. تم تسجيل طلبك بنجاح
        وسنتواصل معك لتأكيد تفاصيل التوصيل.
      </p>

      <div className="success-order-number">
        <span>
          رقم الطلب
        </span>

        <strong>
          {orderNumber}
        </strong>
      </div>

      <div className="success-actions">
        <Link
          to="/products"
          className="success-primary"
        >
          متابعة التسوق
        </Link>

        <Link
          to="/"
          className="success-secondary"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </section>

    <style>{`
      .checkout-page {
        width: 100%;
        min-height: 70vh;
        direction: rtl;
        background: #fafafa;
        color: #171717;
        font-family:
          "Cairo",
          "Tajawal",
          Arial,
          sans-serif;
      }

      .checkout-success {
        width: min(620px, calc(100% - 32px));
        margin: 0 auto;
        padding: 100px 0;
        text-align: center;
      }

      .success-icon {
        width: 76px;
        height: 76px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: #111;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .success-icon svg {
        width: 34px;
        height: 34px;
      }

      .success-eyebrow {
        color: #777;
        font-size: 11px;
        letter-spacing: .18em;
        font-weight: 700;
      }

      .checkout-success h1 {
        margin: 12px 0 12px;
        font-size: clamp(30px, 5vw, 44px);
        font-weight: 650;
      }

      .checkout-success > p {
        margin: 0 auto;
        max-width: 500px;
        color: #777;
        font-size: 14px;
        line-height: 2;
      }

      .success-order-number {
        margin: 30px auto 0;
        padding: 18px 22px;
        border: 1px solid #e5e5e5;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .success-order-number span {
        color: #888;
        font-size: 12px;
      }

      .success-order-number strong {
        font-size: 15px;
        letter-spacing: .08em;
      }

      .success-actions {
        margin-top: 28px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .success-primary,
      .success-secondary {
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
      }

      .success-primary {
        background: #111;
        color: #fff;
      }

      .success-secondary {
        border: 1px solid #ddd;
        background: #fff;
        color: #222;
      }

      @media (max-width: 520px) {
        .checkout-success {
          padding: 70px 0;
        }

        .success-actions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </main>
);
 

}

if (isEmpty) {
return ( <main className="checkout-page"> <section className="checkout-empty"> <div className="empty-icon"> <FiShoppingBag /> </div>

 
      <span>
        AMAROC
      </span>

      <h1>
        سلتك فارغة
      </h1>

      <p>
        لا يمكنك إتمام عملية الشراء
        قبل إضافة منتجات إلى السلة.
      </p>

      <Link
        to="/products"
        className="empty-shopping-button"
      >
        العودة إلى المنتجات
      </Link>
    </section>

    <style>{`
      .checkout-page {
        width: 100%;
        min-height: 70vh;
        direction: rtl;
        background: #fafafa;
        color: #171717;
        font-family:
          "Cairo",
          "Tajawal",
          Arial,
          sans-serif;
      }

      .checkout-empty {
        min-height: 65vh;
        width: min(600px, calc(100% - 32px));
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .empty-icon {
        width: 70px;
        height: 70px;
        border: 1px solid #ddd;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 22px;
      }

      .empty-icon svg {
        width: 28px;
        height: 28px;
      }

      .checkout-empty > span {
        color: #777;
        font-size: 11px;
        letter-spacing: .18em;
        font-weight: 700;
      }

      .checkout-empty h1 {
        margin: 10px 0;
        font-size: 34px;
      }

      .checkout-empty p {
        margin: 0;
        color: #777;
        font-size: 13px;
        line-height: 2;
      }

      .empty-shopping-button {
        margin-top: 25px;
        min-height: 48px;
        padding: 0 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #111;
        color: #fff;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
      }
    `}</style>
  </main>
);
 

}

return ( <main className="checkout-page"> <div className="checkout-container">

 
    <div className="checkout-top">
      <div>
        <span>
          AMAROC
        </span>

        <h1>
          إتمام الطلب
        </h1>
      </div>

      <Link
        to="/products"
        className="continue-shopping"
      >
        <FiArrowRight />
        متابعة التسوق
      </Link>
    </div>

    <div className="checkout-layout">

      {/* =====================================================
          CHECKOUT FORM
      ===================================================== */}

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >

        {/* CUSTOMER INFORMATION */}

        <section className="checkout-card">
          <div className="card-heading">
            <div className="heading-icon">
              <FiUser />
            </div>

            <div>
              <h2>
                معلومات العميل
              </h2>

              <p>
                أدخل معلومات التواصل الخاصة بك
              </p>
            </div>
          </div>

          <div className="form-grid two-columns">

            <label className="form-field">
              <span>
                الاسم الأول
                <b>*</b>
              </span>

              <div className="input-wrapper">
                <FiUser />

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="مثال: محمد"
                  autoComplete="given-name"
                />
              </div>
            </label>

            <label className="form-field">
              <span>
                اسم العائلة
                <b>*</b>
              </span>

              <div className="input-wrapper">
                <FiUser />

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="مثال: العلوي"
                  autoComplete="family-name"
                />
              </div>
            </label>

            <label className="form-field">
              <span>
                رقم الهاتف
                <b>*</b>
              </span>

              <div className="input-wrapper">
                <FiPhone />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06XXXXXXXX"
                  autoComplete="tel"
                  dir="ltr"
                />
              </div>
            </label>

            <label className="form-field">
              <span>
                البريد الإلكتروني
                <small>
                  اختياري
                </small>
              </span>

              <div className="input-wrapper">
                <FiMail />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
            </label>

          </div>
        </section>

        {/* SHIPPING ADDRESS */}

        <section className="checkout-card">
          <div className="card-heading">
            <div className="heading-icon">
              <FiMapPin />
            </div>

            <div>
              <h2>
                عنوان التوصيل
              </h2>

              <p>
                أين نرسل طلبك؟
              </p>
            </div>
          </div>

          <div className="form-grid">

            <label className="form-field">
              <span>
                المدينة
                <b>*</b>
              </span>

              <div className="input-wrapper">
                <FiMapPin />

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="">
                    اختر المدينة
                  </option>

                  <option value="الدار البيضاء">
                    الدار البيضاء
                  </option>

                  <option value="الرباط">
                    الرباط
                  </option>

                  <option value="مراكش">
                    مراكش
                  </option>

                  <option value="طنجة">
                    طنجة
                  </option>

                  <option value="فاس">
                    فاس
                  </option>

                  <option value="أكادير">
                    أكادير
                  </option>

                  <option value="مكناس">
                    مكناس
                  </option>

                  <option value="وجدة">
                    وجدة
                  </option>

                  <option value="تطوان">
                    تطوان
                  </option>

                  <option value="القنيطرة">
                    القنيطرة
                  </option>

                  <option value="الجديدة">
                    الجديدة
                  </option>

                  <option value="آسفي">
                    آسفي
                  </option>

                  <option value="بني ملال">
                    بني ملال
                  </option>

                  <option value="خريبكة">
                    خريبكة
                  </option>

                  <option value="أخرى">
                    مدينة أخرى
                  </option>
                </select>
              </div>
            </label>

            <label className="form-field">
              <span>
                العنوان بالتفصيل
                <b>*</b>
              </span>

              <div className="input-wrapper textarea-wrapper">
                <FiMapPin />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="الحي، الشارع، رقم المنزل أو الشقة..."
                  rows="3"
                  autoComplete="street-address"
                />
              </div>
            </label>

            <label className="form-field">
              <span>
                ملاحظات الطلب
                <small>
                  اختياري
                </small>
              </span>

              <div className="input-wrapper textarea-wrapper">
                <FiPackage />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أي ملاحظات خاصة بالتوصيل..."
                  rows="3"
                />
              </div>
            </label>

          </div>
        </section>

        {/* SHIPPING METHOD */}

        <section className="checkout-card">
          <div className="card-heading">
            <div className="heading-icon">
              <FiTruck />
            </div>

            <div>
              <h2>
                طريقة الشحن
              </h2>

              <p>
                اختر الطريقة المناسبة لك
              </p>
            </div>
          </div>

          <div className="shipping-options">

            {Object.values(
              shippingOptions
            ).map((option) => {
              const isSelected =
                shippingMethod === option.id;

              const isFree =
                subtotal >= 500;

              return (
                <label
                  key={option.id}
                  className={
                    isSelected
                      ? "shipping-option active"
                      : "shipping-option"
                  }
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={option.id}
                    checked={isSelected}
                    onChange={(event) =>
                      setShippingMethod(
                        event.target.value
                      )
                    }
                  />

                  <div className="shipping-radio">
                    <span />
                  </div>

                  <div className="shipping-option-info">
                    <strong>
                      {option.name}
                    </strong>

                    <span>
                      {option.description}
                    </span>
                  </div>

                  <div className="shipping-option-price">
                    {isFree
                      ? "مجاني"
                      : `${option.price} MAD`}
                  </div>
                </label>
              );
            })}

          </div>

          {subtotal < 500 && (
            <div className="free-shipping-note">
              <FiTruck />

              <span>
                أضف{" "}
                <strong>
                  {freeShippingRemaining.toFixed(2)} MAD
                </strong>{" "}
                للحصول على شحن مجاني.
              </span>
            </div>
          )}

          {subtotal >= 500 && (
            <div className="free-shipping-note success">
              <FiCheck />

              <span>
                مبروك! حصلت على
                <strong>
                  {" "}
                  الشحن المجاني
                </strong>
                .
              </span>
            </div>
          )}
        </section>

        {/* PAYMENT */}

        <section className="checkout-card">
          <div className="card-heading">
            <div className="heading-icon">
              <FiLock />
            </div>

            <div>
              <h2>
                طريقة الدفع
              </h2>

              <p>
                اختر طريقة الدفع عند استلام طلبك
              </p>
            </div>
          </div>

          <div className="payment-options">

            <label
              className={
                paymentMethod === "cod"
                  ? "payment-option active"
                  : "payment-option"
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              />

              <div className="payment-check">
                <FiCheck />
              </div>

              <div>
                <strong>
                  الدفع عند الاستلام
                </strong>

                <span>
                  ادفع نقداً عند استلام طلبك
                </span>
              </div>
            </label>

          </div>

          <div className="secure-payment">
            <FiLock />

            <span>
              معلوماتك محمية ويتم التعامل معها
              بشكل آمن.
            </span>
          </div>
        </section>

        {/* MOBILE SUBMIT */}

        <button
          type="submit"
          className="mobile-submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "جاري تأكيد الطلب..."
            : `تأكيد الطلب • ${total.toFixed(2)} MAD`}
        </button>

      </form>

      {/* =====================================================
          ORDER SUMMARY
      ===================================================== */}

      <aside className="order-summary">

        <div className="summary-card">

          <div className="summary-heading">
            <div>
              <span>
                طلبك
              </span>

              <h2>
                ملخص الطلب
              </h2>
            </div>

            <span className="summary-count">
              {cartCount}{" "}
              {cartCount === 1
                ? "منتج"
                : "منتجات"}
            </span>
          </div>

          <div className="summary-items">

            {cartItems.map((item) => (
              <div
                className="summary-item"
                key={item.itemKey}
              >
                <Link
                  to={`/products/${item.slug}`}
                  className="summary-image"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                  />

                  <span>
                    {item.quantity}
                  </span>
                </Link>

                <div className="summary-item-info">
                  <Link
                    to={`/products/${item.slug}`}
                  >
                    {item.name}
                  </Link>

                  {(item.color ||
                    item.size) && (
                    <div className="summary-variants">
                      {item.color && (
                        <span>
                          {item.color.name}
                        </span>
                      )}

                      {item.color &&
                        item.size && (
                          <i>
                            •
                          </i>
                        )}

                      {item.size && (
                        <span>
                          {item.size.name}
                        </span>
                      )}
                    </div>
                  )}

                  <span className="summary-item-price">
                    {Number(item.price || 0).toFixed(2)}
                    {" "}
                    {item.currency || "MAD"}
                  </span>
                </div>

                <strong className="summary-line-total">
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                  {" "}
                  {item.currency || "MAD"}
                </strong>
              </div>
            ))}

          </div>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>
              المنتجات
            </span>

            <strong>
              {Number(subtotal || 0).toFixed(2)}
              {" "}
              MAD
            </strong>
          </div>

          <div className="summary-row">
            <span>
              الشحن
            </span>

            <strong>
              {shippingPrice === 0
                ? "مجاني"
                : `${shippingPrice.toFixed(2)} MAD`}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <div>
              <span>
                الإجمالي
              </span>

              <small>
                شامل تكلفة الشحن
              </small>
            </div>

            <strong>
              {total.toFixed(2)}
              {" "}
              MAD
            </strong>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="desktop-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "جاري تأكيد الطلب..."
              : "تأكيد الطلب"}

            {!isSubmitting && (
              <FiChevronLeft />
            )}
          </button>

          <div className="summary-security">
            <FiLock />

            <span>
              عملية شراء آمنة وموثوقة
            </span>
          </div>

        </div>

        <Link
          to="/products"
          className="back-to-shopping"
        >
          <FiArrowRight />
          العودة للتسوق
        </Link>

      </aside>

    </div>
  </div>

  <style>{`
    .checkout-page {
      width: 100%;
      min-height: 75vh;
      direction: rtl;
      background: #fafafa;
      color: #171717;
      font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;
    }

    .checkout-container {
      width: min(
        1200px,
        calc(100% - 48px)
      );
      margin: 0 auto;
      padding: 100px 0 90px;
    }

    .checkout-top {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 30px;
      margin-bottom: 35px;
    }

    .checkout-top > div > span {
      color: #777;
      font-size: 10px;
      letter-spacing: .18em;
      font-weight: 700;
    }

    .checkout-top h1 {
      margin: 8px 0 0;
      font-size: 34px;
      line-height: 1.3;
      font-weight: 650;
    }

    .continue-shopping {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #333;
      text-decoration: none;
      font-size: 12px;
      border-bottom: 1px solid #333;
      padding-bottom: 5px;
    }

    .continue-shopping svg {
      width: 14px;
      height: 14px;
    }

    .checkout-layout {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        390px;
      gap: 28px;
      align-items: start;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .checkout-card {
      background: #fff;
      border: 1px solid #e6e6e6;
      padding: 28px;
    }

    .card-heading {
      display: flex;
      align-items: center;
      gap: 13px;
      padding-bottom: 23px;
      margin-bottom: 23px;
      border-bottom: 1px solid #ededed;
    }

    .heading-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111;
      color: #fff;
    }

    .heading-icon svg {
      width: 17px;
      height: 17px;
    }

    .card-heading h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 650;
    }

    .card-heading p {
      margin: 4px 0 0;
      color: #888;
      font-size: 11px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 19px;
    }

    .form-grid.two-columns {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field > span {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #333;
    }

    .form-field > span b {
      color: #b42318;
      font-weight: 600;
    }

    .form-field > span small {
      color: #999;
      font-size: 9px;
      font-weight: 400;
      margin-right: auto;
    }

    .input-wrapper {
      min-height: 48px;
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      background: #fff;
      transition:
        border-color .2s ease,
        box-shadow .2s ease;
    }

    .input-wrapper:focus-within {
      border-color: #111;
      box-shadow:
        0 0 0 3px rgba(0,0,0,.04);
    }

    .input-wrapper > svg {
      width: 15px;
      height: 15px;
      color: #888;
      margin: 0 13px;
      flex-shrink: 0;
    }

    .input-wrapper input,
    .input-wrapper select,
    .input-wrapper textarea {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      color: #222;
      font-family: inherit;
      font-size: 12px;
    }

    .input-wrapper input,
    .input-wrapper select {
      height: 46px;
    }

    .input-wrapper select {
      cursor: pointer;
    }

    .input-wrapper textarea {
      resize: vertical;
      min-height: 80px;
      padding: 13px 0;
      line-height: 1.8;
    }

    .textarea-wrapper {
      align-items: flex-start;
    }

    .textarea-wrapper > svg {
      margin-top: 16px;
    }

    .shipping-options,
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .shipping-option {
      position: relative;
      min-height: 74px;
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 14px 15px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
      transition:
        border-color .2s ease,
        background .2s ease;
    }

    .shipping-option:hover {
      border-color: #aaa;
    }

    .shipping-option.active {
      border-color: #111;
      background: #fafafa;
    }

    .shipping-option input,
    .payment-option input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .shipping-radio {
      width: 18px;
      height: 18px;
      border: 1px solid #aaa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .shipping-option.active
    .shipping-radio {
      border-color: #111;
    }

    .shipping-option.active
    .shipping-radio span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #111;
    }

    .shipping-option-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .shipping-option-info strong {
      font-size: 12px;
      font-weight: 650;
    }

    .shipping-option-info span {
      color: #888;
      font-size: 10px;
    }

    .shipping-option-price {
      white-space: nowrap;
      font-size: 11px;
      font-weight: 650;
    }

    .free-shipping-note {
      margin-top: 15px;
      min-height: 42px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f7f7f7;
      color: #777;
      font-size: 10px;
    }

    .free-shipping-note svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .free-shipping-note strong {
      color: #222;
    }

    .free-shipping-note.success {
      color: #267a3d;
    }

    .free-shipping-note.success strong {
      color: #267a3d;
    }

    .payment-option {
      position: relative;
      min-height: 72px;
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 14px 15px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
      transition: border-color .2s ease;
    }

    .payment-option:hover,
    .payment-option.active {
      border-color: #111;
    }

    .payment-check {
      width: 19px;
      height: 19px;
      border: 1px solid #aaa;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .payment-option.active
    .payment-check {
      background: #111;
      border-color: #111;
      color: #fff;
    }

    .payment-check svg {
      width: 12px;
      height: 12px;
      opacity: 0;
    }

    .payment-option.active
    .payment-check svg {
      opacity: 1;
    }

    .payment-option > div:last-child {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .payment-option strong {
      font-size: 12px;
    }

    .payment-option span {
      color: #888;
      font-size: 10px;
    }

    .secure-payment {
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 7px;
      color: #888;
      font-size: 10px;
    }

    .secure-payment svg {
      width: 13px;
      height: 13px;
    }

    .order-summary {
      position: sticky;
      top: 20px;
    }

    .summary-card {
      background: #fff;
      border: 1px solid #e2e2e2;
      padding: 26px;
    }

    .summary-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 15px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9e9e9;
    }

    .summary-heading > div > span {
      color: #888;
      font-size: 10px;
    }

    .summary-heading h2 {
      margin: 5px 0 0;
      font-size: 20px;
      font-weight: 650;
    }

    .summary-count {
      color: #777;
      font-size: 10px;
      padding-top: 5px;
      white-space: nowrap;
    }

    .summary-items {
      display: flex;
      flex-direction: column;
    }

    .summary-item {
      min-height: 92px;
      padding: 15px 0;
      display: flex;
      align-items: center;
      gap: 11px;
      border-bottom: 1px solid #ededed;
    }

    .summary-image {
      position: relative;
      width: 66px;
      height: 74px;
      flex-shrink: 0;
      background: #f6f6f6;
      overflow: visible;
    }

    .summary-image img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .summary-image > span {
      position: absolute;
      top: -7px;
      left: -7px;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111;
      color: #fff;
      font-size: 9px;
      font-weight: 600;
    }

    .summary-item-info {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-item-info > a {
      color: #222;
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      line-height: 1.6;
    }

    .summary-variants {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #999;
      font-size: 9px;
    }

    .summary-variants i {
      font-style: normal;
    }

    .summary-item-price {
      color: #777;
      font-size: 9px;
    }

    .summary-line-total {
      white-space: nowrap;
      font-size: 10px;
      font-weight: 650;
    }

    .summary-divider {
      height: 1px;
      background: #e7e7e7;
      margin: 4px 0;
    }

    .summary-row {
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      font-size: 11px;
    }

    .summary-row span {
      color: #888;
    }

    .summary-row strong {
      font-weight: 600;
    }

    .summary-total {
      padding: 17px 0 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .summary-total > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-total span {
      font-size: 14px;
      font-weight: 650;
    }

    .summary-total small {
      color: #999;
      font-size: 9px;
    }

    .summary-total strong {
      font-size: 21px;
      font-weight: 700;
    }

    .desktop-submit,
    .mobile-submit {
      width: 100%;
      min-height: 53px;
      border: none;
      background: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 650;
      cursor: pointer;
      transition: background .2s ease;
    }

    .desktop-submit {
      margin-top: 20px;
    }

    .desktop-submit:hover,
    .mobile-submit:hover {
      background: #292929;
    }

    .desktop-submit:disabled,
    .mobile-submit:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .desktop-submit svg {
      width: 16px;
      height: 16px;
    }

    .summary-security {
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: #999;
      font-size: 9px;
    }

    .summary-security svg {
      width: 12px;
      height: 12px;
    }

    .back-to-shopping {
      margin-top: 12px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border: 1px solid #ddd;
      background: #fff;
      color: #333;
      text-decoration: none;
      font-size: 11px;
    }

    .back-to-shopping svg {
      width: 14px;
      height: 14px;
    }

    .mobile-submit {
      display: none;
    }

    @media (max-width: 1050px) {
      .checkout-layout {
        grid-template-columns:
          minmax(0, 1fr)
          340px;
        gap: 20px;
      }

      .checkout-card {
        padding: 23px;
      }

      .summary-card {
        padding: 22px;
      }
    }

    @media (max-width: 850px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
        order: -1;
      }

      .summary-card {
        padding: 23px;
      }

      .desktop-submit {
        display: none;
      }

      .mobile-submit {
        display: flex;
      }
    }

    @media (max-width: 600px) {
      .checkout-container {
        width: calc(100% - 30px);
        padding: 28px 0 60px;
      }

      .checkout-top {
        align-items: flex-start;
        flex-direction: column;
        gap: 18px;
        margin-bottom: 25px;
      }

      .checkout-top h1 {
        font-size: 29px;
      }

      .continue-shopping {
        font-size: 11px;
      }

      .checkout-card {
        padding: 19px;
      }

      .form-grid.two-columns {
        grid-template-columns: 1fr;
      }

      .card-heading {
        padding-bottom: 18px;
        margin-bottom: 18px;
      }

      .heading-icon {
        width: 36px;
        height: 36px;
      }

      .shipping-option {
        padding: 12px;
      }

      .shipping-option-price {
        font-size: 10px;
      }

      .summary-card {
        padding: 19px;
      }

      .summary-item {
        gap: 9px;
      }

      .summary-image {
        width: 58px;
        height: 66px;
      }

      .summary-line-total {
        font-size: 9px;
      }

      .summary-total strong {
        font-size: 18px;
      }
    }

    @media (max-width: 420px) {
      .checkout-container {
        width: calc(100% - 24px);
      }

      .checkout-card {
        padding: 16px;
      }

      .summary-card {
        padding: 16px;
      }

      .shipping-option-info span {
        display: none;
      }

      .summary-item-price {
        font-size: 8px;
      }
    }
  `}</style>
</main>
 

);
}
