import { Link } from "react-router-dom";
import {
FiArrowLeft,
FiClock,
FiMapPin,
FiPackage,
FiTruck,
} from "react-icons/fi";

export default function Shipping() {
const shippingMethods = [
{
icon: FiTruck,
title: "الشحن العادي",
time: "2 - 5 أيام عمل",
price: "25 MAD",
text: "خيار مناسب للطلبات العادية داخل مناطق التوصيل المتاحة.",
},
{
icon: FiClock,
title: "الشحن السريع",
time: "1 - 2 يوم عمل",
price: "45 MAD",
text: "خيار أسرع للطلبات التي تحتاج إلى وصول في وقت أقصر.",
},
];

return ( <main className="policy-page"> <section className="policy-hero"> <div className="policy-container"> <span>AMAROC / الشحن</span> <h1>سياسة الشحن</h1> <p>
كل ما تحتاج إلى معرفته حول خيارات الشحن، مدة التوصيل وتكلفة
إرسال طلبك. </p> </div> </section>
 
  <section className="policy-content">
    <div className="policy-container">
      <div className="shipping-methods">
        {shippingMethods.map((method) => {
          const Icon = method.icon;

          return (
            <article className="shipping-card" key={method.title}>
              <div className="shipping-icon">
                <Icon />
              </div>

              <div className="shipping-card-content">
                <h2>{method.title}</h2>
                <p>{method.text}</p>

                <div className="shipping-meta">
                  <strong>{method.time}</strong>
                  <strong>{method.price}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <article className="policy-section">
        <div className="policy-title">
          <FiPackage />
          <h2>متى يتم تجهيز الطلب؟</h2>
        </div>

        <p>
          بعد تأكيد الطلب، نقوم بتجهيزه للشحن. قد تختلف مدة التجهيز حسب
          توفر المنتج وحجم الطلب، ويتم احتساب مدة التوصيل بعد إرسال
          الطلب مع شركة الشحن.
        </p>
      </article>

      <article className="policy-section">
        <div className="policy-title">
          <FiMapPin />
          <h2>مناطق التوصيل</h2>
        </div>

        <p>
          نوفر التوصيل إلى المدن والمناطق المتاحة ضمن شبكة الشحن الخاصة
          بنا. قد تختلف مدة الوصول حسب المدينة وموقع التسليم.
        </p>
      </article>

      <article className="policy-section">
        <h2>الشحن المجاني</h2>

        <p>
          الطلبات التي تصل قيمتها إلى 500 MAD أو أكثر تستفيد من الشحن
          المجاني وفقاً لخيار الشحن العادي.
        </p>
      </article>

      <article className="policy-section">
        <h2>تأخر الطلبات</h2>

        <p>
          قد تحدث بعض التأخيرات الاستثنائية بسبب ظروف النقل أو العوامل
          الخارجة عن سيطرتنا. في هذه الحالة نعمل على متابعة الطلب
          ومساعدتك في الحصول عليه في أقرب وقت ممكن.
        </p>
      </article>

      <div className="policy-bottom">
        <p>هل تريد البدء بالتسوق؟</p>

        <Link to="/products">
          اكتشف المنتجات
          <FiArrowLeft />
        </Link>
      </div>
    </div>
  </section>

  <style>{`
    .policy-page {
      direction: rtl;
      background: #ffffff;
      color: #171717;
      font-family: inherit;
    }

    .policy-container {
      width: min(1000px, calc(100% - 40px));
      margin: 0 auto;
    }

    .policy-hero {
      padding: 80px 0;
      background: #f7f3ed;
      border-bottom: 1px solid #e7dfd5;
    }

    .policy-hero span {
      color: #8a6f52;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .policy-hero h1 {
      margin: 18px 0 15px;
      font-size: clamp(40px, 6vw, 65px);
      line-height: 1.1;
      font-weight: 900;
    }

    .policy-hero p {
      max-width: 700px;
      margin: 0;
      color: #6e6e6e;
      font-size: 18px;
      line-height: 1.9;
    }

    .policy-content {
      padding: 70px 0 100px;
    }

    .shipping-methods {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 55px;
    }

    .shipping-card {
      display: flex;
      gap: 22px;
      padding: 28px;
      border: 1px solid #e6e0d8;
      border-radius: 22px;
      background: #ffffff;
    }

    .shipping-icon {
      width: 52px;
      height: 52px;
      flex: 0 0 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      background: #f7f3ed;
      color: #8a6f52;
    }

    .shipping-icon svg {
      width: 22px;
      height: 22px;
    }

    .shipping-card h2 {
      margin: 0 0 8px;
      font-size: 20px;
    }

    .shipping-card p,
    .policy-section p {
      color: #6b6b6b;
      line-height: 2;
      margin: 0;
    }

    .shipping-meta {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-top: 20px;
      padding-top: 17px;
      border-top: 1px solid #eeeae5;
    }

    .shipping-meta strong:last-child {
      color: #8a6f52;
    }

    .policy-section {
      padding: 32px 0;
      border-top: 1px solid #ece9e5;
    }

    .policy-section h2 {
      margin: 0 0 14px;
      font-size: 23px;
    }

    .policy-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .policy-title svg {
      color: #8a6f52;
    }

    .policy-bottom {
      margin-top: 35px;
      padding: 30px;
      border-radius: 20px;
      background: #171717;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .policy-bottom p {
      margin: 0;
    }

    .policy-bottom a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 20px;
      border-radius: 12px;
      background: #ffffff;
      color: #171717;
      text-decoration: none;
      font-weight: 800;
      white-space: nowrap;
    }

    @media (max-width: 700px) {
      .policy-container {
        width: min(100% - 28px, 1000px);
      }

      .policy-hero {
        padding: 55px 0;
      }

      .policy-content {
        padding: 50px 0 70px;
      }

      .shipping-methods {
        grid-template-columns: 1fr;
      }

      .shipping-card {
        padding: 23px;
      }

      .policy-bottom {
        align-items: stretch;
        flex-direction: column;
      }

      .policy-bottom a {
        justify-content: center;
      }
    }
  `}</style>
</main>
 

);
}
