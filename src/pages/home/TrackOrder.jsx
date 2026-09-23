import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiSearch,
  FiTruck,
  FiXCircle,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import "./TrackOrder.css";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const STATUS_LABELS = {
  pending: "في انتظار التأكيد",
  confirmed: "تم تأكيد الطلب",
  processing: "جاري تجهيز الطلب",
  shipped: "تم شحن الطلب",
  out_for_delivery: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "تم إلغاء الطلب",
  returned: "تم إرجاع الطلب",
};

const STATUS_ICONS = {
  pending: FiClock,
  confirmed: FiCheckCircle,
  processing: FiPackage,
  shipped: FiTruck,
  out_for_delivery: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
  returned: FiXCircle,
};

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function formatMoney(value, currency = "MAD") {
  return `${Number(value || 0).toFixed(2)} ${currency}`;
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("ar-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || "غير معروف";
}

function getStatusIcon(status) {
  return STATUS_ICONS[status] || FiPackage;
}

function isStatusCompleted(currentStatus, status) {
  if (currentStatus === "cancelled" || currentStatus === "returned") {
    return false;
  }

  return STATUS_ORDER.indexOf(currentStatus) >= STATUS_ORDER.indexOf(status);
}

export default function TrackOrder() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    phone: "",
  });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const orderNumber = formData.orderNumber.trim().toUpperCase();
    const phone = formData.phone.trim();

    if (!orderNumber || !phone) {
      setError("أدخل رقم الطلب ورقم الهاتف.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/track`,
        { orderNumber, phone },
        { timeout: 20000 }
      );

      const payload = response.data?.data ?? response.data;
      const trackedOrder = payload?.order ?? payload;

      if (!response.data?.success || !trackedOrder?.orderNumber) {
        throw new Error("TRACKING_RESPONSE_INVALID");
      }

      setOrder(trackedOrder);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "تعذر العثور على الطلب. تأكد من رقم الطلب ورقم الهاتف.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order?.status || "pending";
  const isClosed = currentStatus === "cancelled" || currentStatus === "returned";
  const history = Array.isArray(order?.statusHistory)
    ? [...order.statusHistory].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    : [];

  return (
    <main className="track-order-page" dir="rtl">
      <div className="track-order-container">
        <header className="track-order-header">
          <Link to="/" className="track-back-link">
            <FiArrowRight />
            العودة إلى المتجر
          </Link>

          <span className="track-eyebrow">AMAROC</span>
          <h1>تتبع طلبك</h1>
          <p>
            أدخل رقم الطلب ورقم الهاتف المستخدم عند الشراء لمعرفة آخر تحديثات
            طلبك.
          </p>
        </header>

        <section className="track-search-card">
          <form onSubmit={handleSubmit} className="track-search-form">
            <div className="track-field">
              <label htmlFor="orderNumber">رقم الطلب</label>
              <input
                id="orderNumber"
                name="orderNumber"
                type="text"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="مثال: AM-20260921-123456"
                autoComplete="off"
              />
            </div>

            <div className="track-field">
              <label htmlFor="phone">رقم الهاتف</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06XXXXXXXX"
                autoComplete="tel"
                dir="ltr"
              />
            </div>

            {error && <p className="track-error">{error}</p>}

            <button type="submit" className="track-submit" disabled={loading}>
              <FiSearch />
              {loading ? "جاري البحث..." : "تتبع الطلب"}
            </button>
          </form>
        </section>

        {order && (
          <section className="track-result" aria-live="polite">
            <div className="track-result-heading">
              <div>
                <span className="track-result-label">رقم الطلب</span>
                <h2>{order.orderNumber}</h2>
              </div>
              <span className={`track-status-badge status-${currentStatus}`}>
                {getStatusLabel(currentStatus)}
              </span>
            </div>

            <div className="track-summary-grid">
              <div className="track-summary-item">
                <FiClock />
                <span>تاريخ الطلب</span>
                <strong>{formatDate(order.createdAt)}</strong>
              </div>

              <div className="track-summary-item">
                <FiPackage />
                <span>عدد المنتجات</span>
                <strong>{order.itemsCount || order.items?.length || 0}</strong>
              </div>

              <div className="track-summary-item">
                <FiTruck />
                <span>طريقة الشحن</span>
                <strong>{order.shipping?.name || "—"}</strong>
              </div>

              <div className="track-summary-item">
                <FiMapPin />
                <span>التكلفة الإجمالية</span>
                <strong>
                  {formatMoney(order.pricing?.total, order.pricing?.currency)}
                </strong>
              </div>
            </div>

            <div className="track-section">
              <div className="track-section-title">
                <FiTruck />
                <h3>مراحل الطلب</h3>
              </div>

              {isClosed ? (
                <div className={`track-closed-message closed-${currentStatus}`}>
                  {getStatusLabel(currentStatus)}
                </div>
              ) : (
                <div className="track-timeline">
                  {STATUS_ORDER.map((status) => {
                    const Icon = getStatusIcon(status);
                    const completed = isStatusCompleted(currentStatus, status);
                    const active = currentStatus === status;

                    return (
                      <div
                        key={status}
                        className={`track-step ${completed ? "completed" : ""} ${
                          active ? "active" : ""
                        }`}
                      >
                        <div className="track-step-icon">
                          <Icon />
                        </div>
                        <div className="track-step-content">
                          <strong>{getStatusLabel(status)}</strong>
                          {active && <span>الحالة الحالية لطلبك</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="track-section">
              <div className="track-section-title">
                <FiClock />
                <h3>سجل التحديثات</h3>
              </div>

              {history.length === 0 ? (
                <p className="track-empty-history">لا توجد تحديثات إضافية.</p>
              ) : (
                <div className="track-history">
                  {history.map((entry, index) => (
                    <div className="track-history-item" key={`${entry.status}-${entry.createdAt}-${index}`}>
                      <span className="track-history-dot" />
                      <div>
                        <strong>{getStatusLabel(entry.status)}</strong>
                        <p>{entry.note || "تم تحديث حالة الطلب."}</p>
                        <time>{formatDate(entry.createdAt)}</time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="track-section">
              <div className="track-section-title">
                <FiPackage />
                <h3>المنتجات</h3>
              </div>

              <div className="track-items">
                {(order.items || []).map((item, index) => (
                  <div className="track-item" key={`${item.productId}-${index}`}>
                    <div className="track-item-info">
                      <strong>{item.name}</strong>
                      <span>الكمية: {item.quantity}</span>
                      {item.color && <span>اللون: {item.color}</span>}
                      {item.size && <span>المقاس: {item.size}</span>}
                      {item.volume && (
                        <span>
                          الحجم: {item.volume} {item.volumeUnit || ""}
                        </span>
                      )}
                    </div>
                    <strong>
                      {formatMoney(item.lineTotal, order.pricing?.currency)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="track-section track-total-section">
              <div>
                <span>المجموع الفرعي</span>
                <strong>
                  {formatMoney(order.pricing?.subtotal, order.pricing?.currency)}
                </strong>
              </div>
              <div>
                <span>الشحن</span>
                <strong>
                  {formatMoney(order.pricing?.shipping, order.pricing?.currency)}
                </strong>
              </div>
              <div className="track-total-row">
                <span>الإجمالي</span>
                <strong>
                  {formatMoney(order.pricing?.total, order.pricing?.currency)}
                </strong>
              </div>
            </div>

            <div className="track-contact-note">
              <FiPhone />
              <span>إذا احتجت إلى مساعدة بخصوص طلبك، تواصل مع خدمة العملاء.</span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
