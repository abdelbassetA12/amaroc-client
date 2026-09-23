import React, { useCallback, useEffect, useMemo, useState } from "react";
 
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import API_BASE from "../../config/api";
/* ============================================================
   API CONFIG
   ============================================================ */

 

 

const REQUEST_OPTIONS = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

/* ============================================================
   CONSTANTS
   ============================================================ */

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  out_for_delivery: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
  returned: "مرتجع",
};

const PAYMENT_LABELS = {
  pending: "في الانتظار",
  paid: "مدفوع",
  failed: "فشل الدفع",
  refunded: "مسترد",
};

const STATUS_CLASSES = {
  pending: "pending",
  confirmed: "confirmed",
  processing: "processing",
  shipped: "shipped",
  out_for_delivery: "out-for-delivery",
  delivered: "delivered",
  cancelled: "cancelled",
  returned: "returned",
};

const PAYMENT_CLASSES = {
  pending: "payment-pending",
  paid: "payment-paid",
  failed: "payment-failed",
  refunded: "payment-refunded",
};

/* ============================================================
   ICONS
   ============================================================ */

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10" />
        <path d="M3 4v6h6" />
        <path d="M4 13a8.1 8.1 0 0 0 14.9 4L21 14" />
        <path d="M21 20v-6h-6" />
      </>
    ),
    filter: (
      <>
        <path d="M4 5h16" />
        <path d="M7 12h10" />
        <path d="M10 19h4" />
      </>
    ),
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    box: (
      <>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
      </>
    ),
    phone: (
      <>
        <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6L17 12l4 1.5v3c0 2-1.5 3.5-3.5 3.5C10.6 20 4 13.4 4 6.5 4 4.5 5.5 3 7 3Z" />
      </>
    ),
    map: (
      <>
        <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    creditCard: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),
    package: (
      <>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="m8 10 8-4" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || null}</svg>;
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatMoney(value, currency = "MAD") {
  const amount = Number(value || 0);

  return `${new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} ${currency}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCustomerName(customer) {
  if (!customer) return "—";

  return `${customer.firstName || ""} ${
    customer.lastName || ""
  }`.trim() || "—";
}

function getInitials(customer) {
  const first = customer?.firstName?.charAt(0) || "";
  const last = customer?.lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "C";
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || "—";
}

function getPaymentLabel(status) {
  return PAYMENT_LABELS[status] || status || "—";
}

function getStatusClass(status) {
  return STATUS_CLASSES[status] || "pending";
}

function getPaymentClass(status) {
  return PAYMENT_CLASSES[status] || "payment-pending";
}

function isClosedStatus(status) {
  return ["delivered", "cancelled", "returned"].includes(status);
}

/* ============================================================
   API
   ============================================================ */

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...REQUEST_OPTIONS,
    ...options,
    headers: {
      ...REQUEST_OPTIONS.headers,
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "حدث خطأ أثناء الاتصال بالخادم."
    );
  }

  return data;
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }) {
  return (
    <span
      className={`orders-status-badge ${getStatusClass(
        status
      )}`}
    >
      <span className="orders-status-dot" />
      {getStatusLabel(status)}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`orders-payment-badge ${getPaymentClass(
        status
      )}`}
    >
      {getPaymentLabel(status)}
    </span>
  );
}

/* ============================================================
   ORDER DETAIL DRAWER
   ============================================================ */

function OrderDetails({
  order,
  onClose,
  onStatusUpdated,
  onPaymentUpdated,
  onCancelled,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "pending"
  );

  const [statusNote, setStatusNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(
    order?.payment?.status || "pending"
  );

  const [cancelReason, setCancelReason] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] =
    useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setSelectedStatus(order?.status || "pending");
    setPaymentStatus(
      order?.payment?.status || "pending"
    );
    setStatusNote("");
    setCancelReason("");
    setActionError("");
  }, [order]);

  if (!order) {
    return null;
  }

  const closed = isClosedStatus(order.status);

  async function updateStatus() {
    if (selectedStatus === order.status) {
      return;
    }

    setUpdatingStatus(true);
    setActionError("");

    try {
      const result = await apiRequest(
        `${API_BASE}/admin/${order._id}/status`,
       
        {
          method: "PATCH",
          body: JSON.stringify({
            status: selectedStatus,
            note: statusNote,
          }),
        }
      );

      onStatusUpdated(result.order);
      setStatusNote("");
    } catch (error) {
      setActionError(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function updatePayment() {
    if (paymentStatus === order.payment?.status) {
      return;
    }

    setUpdatingPayment(true);
    setActionError("");

    try {
      const result = await apiRequest(
        `${API_BASE}/admin/${order._id}/payment`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: paymentStatus,
          }),
        }
      );

      onPaymentUpdated(result.order);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setUpdatingPayment(false);
    }
  }

  async function cancelOrder() {
    if (closed) {
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من إلغاء هذا الطلب؟ سيتم إرجاع المخزون."
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setActionError("");

    try {
      const result = await apiRequest(
        `${API_BASE}/admin/${order._id}/cancel`,
        {
          method: "PATCH",
          body: JSON.stringify({
            reason: cancelReason,
          }),
        }
      );

      onCancelled(result.order);
      setCancelReason("");
    } catch (error) {
      setActionError(error.message);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <div
        className="orders-drawer-overlay"
        onMouseDown={onClose}
      />

      <aside
        className="orders-drawer"
        dir="rtl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="orders-drawer-header">
          <div>
            <div className="orders-drawer-kicker">
              تفاصيل الطلب
            </div>

            <h2>{order.orderNumber}</h2>

            <div className="orders-drawer-date">
              {formatDate(order.createdAt)}
            </div>
          </div>

          <button
            className="orders-icon-button"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="orders-drawer-body">
          {actionError && (
            <div className="orders-action-error">
              <Icon name="alert" size={18} />
              <span>{actionError}</span>
            </div>
          )}

          {/* ==================================================
             ORDER HEADER
             ================================================== */}

          <section className="orders-detail-section orders-detail-summary">
            <div className="orders-detail-summary-main">
              <div className="orders-detail-avatar">
                {getInitials(order.customer)}
              </div>

              <div>
                <h3>
                  {getCustomerName(order.customer)}
                </h3>

                <p>
                  {order.customer?.phone || "—"}
                </p>

                {order.customer?.email && (
                  <p>{order.customer.email}</p>
                )}
              </div>
            </div>

            <StatusBadge status={order.status} />
          </section>

          {/* ==================================================
             CUSTOMER
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="user" size={18} />
              <span>بيانات العميل</span>
            </div>

            <div className="orders-info-grid">
              <div className="orders-info-item">
                <span>الاسم</span>
                <strong>
                  {getCustomerName(order.customer)}
                </strong>
              </div>

              <div className="orders-info-item">
                <span>الهاتف</span>
                <strong>
                  {order.customer?.phone || "—"}
                </strong>
              </div>

              <div className="orders-info-item">
                <span>البريد الإلكتروني</span>
                <strong>
                  {order.customer?.email || "غير متوفر"}
                </strong>
              </div>
            </div>
          </section>

          {/* ==================================================
             SHIPPING ADDRESS
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="map" size={18} />
              <span>عنوان التوصيل</span>
            </div>

            <div className="orders-address-card">
              <strong>
                {order.shippingAddress?.city || "—"}
              </strong>

              <span>
                {order.shippingAddress?.address || "—"}
              </span>

              {order.shippingAddress?.notes && (
                <small>
                  ملاحظات:{" "}
                  {order.shippingAddress.notes}
                </small>
              )}
            </div>
          </section>

          {/* ==================================================
             ITEMS
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="package" size={18} />
              <span>
                المنتجات ({order.itemsCount || 0})
              </span>
            </div>

            <div className="orders-items-list">
              {(order.items || []).map((item, index) => (
                <div
                  className="orders-detail-product"
                  key={`${item.productId}-${item.variantId || "default"}-${index}`}
                >
                  <div className="orders-product-image">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                      />
                    ) : (
                      <Icon
                        name="package"
                        size={22}
                      />
                    )}
                  </div>

                  <div className="orders-product-info">
                    <strong>{item.name}</strong>

                    {item.sku && (
                      <span>SKU: {item.sku}</span>
                    )}

                    <div className="orders-product-options">
                      {item.color && (
                        <span>
                          اللون: {item.color}
                        </span>
                      )}

                      {item.size && (
                        <span>
                          المقاس: {item.size}
                        </span>
                      )}

                      {item.volume !== null &&
                        item.volume !== undefined && (
                          <span>
                            الحجم: {item.volume}{" "}
                            {item.volumeUnit || ""}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="orders-product-price">
                    <strong>
                      {formatMoney(
                        item.lineTotal,
                        order.pricing?.currency
                      )}
                    </strong>

                    <span>
                      {item.quantity} ×{" "}
                      {formatMoney(
                        item.price,
                        order.pricing?.currency
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==================================================
             SHIPPING
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="truck" size={18} />
              <span>الشحن</span>
            </div>

            <div className="orders-shipping-card">
              <div>
                <strong>
                  {order.shipping?.name || "—"}
                </strong>

                {order.shipping?.code && (
                  <span>
                    {order.shipping.code}
                  </span>
                )}
              </div>

              <div className="orders-shipping-price">
                {order.shipping
                  ?.freeShippingApplied ? (
                  <>
                    <span className="orders-free">
                      شحن مجاني
                    </span>

                    <small>
                      تم تطبيق الشحن المجاني
                    </small>
                  </>
                ) : (
                  <strong>
                    {formatMoney(
                      order.shipping?.price,
                      order.shipping?.currency ||
                        order.pricing?.currency
                    )}
                  </strong>
                )}
              </div>
            </div>

            {order.shipping?.delivery && (
              <div className="orders-delivery-info">
                <span>
                  مدة التوصيل:{" "}
                  {order.shipping.delivery.min ??
                    "—"}
                  {order.shipping.delivery.max !==
                    null &&
                  order.shipping.delivery.max !==
                    undefined
                    ? ` - ${order.shipping.delivery.max}`
                    : ""}{" "}
                  {order.shipping.delivery.unit ||
                    "days"}
                </span>
              </div>
            )}
          </section>

          {/* ==================================================
             PRICING
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="creditCard" size={18} />
              <span>ملخص المبلغ</span>
            </div>

            <div className="orders-pricing-card">
              <div>
                <span>المجموع الفرعي</span>
                <strong>
                  {formatMoney(
                    order.pricing?.subtotal,
                    order.pricing?.currency
                  )}
                </strong>
              </div>

              <div>
                <span>الشحن</span>
                <strong>
                  {formatMoney(
                    order.pricing?.shipping,
                    order.pricing?.currency
                  )}
                </strong>
              </div>

              <div>
                <span>الخصم</span>
                <strong>
                  {formatMoney(
                    order.pricing?.discount,
                    order.pricing?.currency
                  )}
                </strong>
              </div>

              <div className="orders-total-row">
                <span>الإجمالي</span>
                <strong>
                  {formatMoney(
                    order.pricing?.total,
                    order.pricing?.currency
                  )}
                </strong>
              </div>
            </div>
          </section>

          {/* ==================================================
             PAYMENT
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="creditCard" size={18} />
              <span>الدفع</span>
            </div>

            <div className="orders-payment-row">
              <div>
                <span>طريقة الدفع</span>
                <strong>
                  {order.payment?.method === "cod"
                    ? "الدفع عند الاستلام"
                    : order.payment?.method ||
                      "—"}
                </strong>
              </div>

              <PaymentBadge
                status={order.payment?.status}
              />
            </div>

            <div className="orders-control-row">
              <select
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(
                    event.target.value
                  )
                }
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {getPaymentLabel(status)}
                  </option>
                ))}
              </select>

              <button
                className="orders-secondary-button"
                onClick={updatePayment}
                disabled={
                  updatingPayment ||
                  paymentStatus ===
                    order.payment?.status
                }
              >
                {updatingPayment
                  ? "جاري الحفظ..."
                  : "تحديث الدفع"}
              </button>
            </div>
          </section>

          {/* ==================================================
             STATUS CONTROL
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="refresh" size={18} />
              <span>إدارة الحالة</span>
            </div>

            {closed ? (
              <div className="orders-closed-message">
                <Icon name="check" size={18} />
                <span>
                  هذا الطلب مغلق ولا يمكن تغيير حالته.
                </span>
              </div>
            ) : (
              <>
                <div className="orders-control-row">
                  <select
                    value={selectedStatus}
                    onChange={(event) =>
                      setSelectedStatus(
                        event.target.value
                      )
                    }
                  >
                    {ORDER_STATUSES.map(
                      (status) => (
                        <option
                          value={status}
                          key={status}
                        >
                          {getStatusLabel(status)}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    className="orders-primary-button"
                    onClick={updateStatus}
                    disabled={
                      updatingStatus ||
                      selectedStatus ===
                        order.status
                    }
                  >
                    {updatingStatus
                      ? "جاري التحديث..."
                      : "تحديث الحالة"}
                  </button>
                </div>

                <textarea
                  className="orders-note-input"
                  placeholder="ملاحظة اختيارية لسجل الطلب..."
                  value={statusNote}
                  onChange={(event) =>
                    setStatusNote(
                      event.target.value
                    )
                  }
                  maxLength={1000}
                />
              </>
            )}
          </section>

          {/* ==================================================
             CANCEL
             ================================================== */}

          {!closed && (
            <section className="orders-detail-section orders-danger-section">
              <div className="orders-section-title danger">
                <Icon name="alert" size={18} />
                <span>إلغاء الطلب</span>
              </div>

              <p>
                عند إلغاء الطلب سيقوم السيرفر بإرجاع
                الكمية إلى المخزون.
              </p>

              <textarea
                className="orders-note-input"
                placeholder="سبب الإلغاء..."
                value={cancelReason}
                onChange={(event) =>
                  setCancelReason(
                    event.target.value
                  )
                }
                maxLength={1000}
              />

              <button
                className="orders-danger-button"
                onClick={cancelOrder}
                disabled={cancelling}
              >
                {cancelling
                  ? "جاري الإلغاء..."
                  : "إلغاء الطلب وإرجاع المخزون"}
              </button>
            </section>
          )}

          {/* ==================================================
             STATUS HISTORY
             ================================================== */}

          <section className="orders-detail-section">
            <div className="orders-section-title">
              <Icon name="calendar" size={18} />
              <span>سجل الطلب</span>
            </div>

            <div className="orders-timeline">
              {(order.statusHistory || [])
                .slice()
                .reverse()
                .map((history, index) => (
                  <div
                    className="orders-timeline-item"
                    key={`${history.status}-${history.createdAt}-${index}`}
                  >
                    <div className="orders-timeline-line">
                      <span />
                    </div>

                    <div className="orders-timeline-content">
                      <div>
                        <strong>
                          {getStatusLabel(
                            history.status
                          )}
                        </strong>

                        <time>
                          {formatDate(
                            history.createdAt
                          )}
                        </time>
                      </div>

                      {history.note && (
                        <p>{history.note}</p>
                      )}

                      <small>
                        بواسطة:{" "}
                        {history.changedBy ||
                          "system"}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* ==================================================
             META
             ================================================== */}

          <section className="orders-detail-meta">
            <div>
              <span>تاريخ الإنشاء</span>
              <strong>
                {formatDate(order.createdAt)}
              </strong>
            </div>

            <div>
              <span>آخر تحديث</span>
              <strong>
                {formatDate(order.updatedAt)}
              </strong>
            </div>

            <div>
              <span>أنشئ بواسطة</span>
              <strong>
                {order.createdBy || "customer"}
              </strong>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function Orders() {
   const [sidebarOpen, setSidebarOpen] =
      useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [limit] = useState(20);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  /* ==========================================================
     LOAD ORDERS
     ========================================================== */

  const loadOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (status) {
          params.set("status", status);
        }

        const result = await apiRequest(
          `${API_ROOT}/admin?${params.toString()}`
        );

        setOrders(result.orders || []);

        setPagination(
          result.pagination || {
            page,
            limit,
            total: 0,
            pages: 0,
          }
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, status]
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ==========================================================
     SEARCH
     ========================================================== */

  function submitSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function changeStatusFilter(value) {
    setStatus(value);
    setPage(1);
  }

  /* ==========================================================
     OPEN ORDER
     ========================================================== */

  async function openOrder(order) {
    setSelectedOrder(order);
    setDetailsLoading(true);

    try {
      const result = await apiRequest(
        `${API_ROOT}/admin/${order._id}`
      );

      setSelectedOrder(result.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  /* ==========================================================
     UPDATE LOCAL ORDER
     ========================================================== */

  function updateOrderInState(updatedOrder) {
    if (!updatedOrder) return;

    setOrders((current) =>
      current.map((item) =>
        item._id === updatedOrder._id
          ? updatedOrder
          : item
      )
    );

    setSelectedOrder(updatedOrder);
  }

  /* ==========================================================
     PAGE CONTROLS
     ========================================================== */

  const pages = pagination.pages || 0;

  const visiblePages = useMemo(() => {
    if (pages <= 1) {
      return pages ? [1] : [];
    }

    const result = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);

    for (let number = start; number <= end; number++) {
      result.push(number);
    }

    return result;
  }, [page, pages]);

  const hasFilters =
    Boolean(search) || Boolean(status);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="admin-orders">
      <AdminSidebar
     isOpen={sidebarOpen}
         onClose={() =>
         setSidebarOpen(false)
     }
      />
    <div
      className="orders-page"
    
    >
      <AdminHeader
            onMenuClick={() =>
          setSidebarOpen(true)
              }
        />
        
      <div className="orders-container">
        {/* ======================================================
           HEADER
           ====================================================== */}

        <header className="orders-page-header">
          <div>
            <div className="orders-eyebrow">
              إدارة المتجر
            </div>

            <h1>الطلبات</h1>

            <p>
              إدارة ومتابعة جميع الطلبات الواردة
              من متجرك.
            </p>
          </div>

          <button
            className={`orders-refresh-button ${
              refreshing ? "is-loading" : ""
            }`}
            onClick={() =>
              loadOrders({ silent: true })
            }
            disabled={refreshing}
          >
            <Icon name="refresh" size={18} />

            <span>
              {refreshing
                ? "جاري التحديث..."
                : "تحديث"}
            </span>
          </button>
        </header>

        {/* ======================================================
           TOOLBAR
           ====================================================== */}

        <section className="orders-toolbar">
          <form
            className="orders-search"
            onSubmit={submitSearch}
          >
            <Icon name="search" size={19} />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="ابحث برقم الطلب، اسم العميل، الهاتف أو البريد..."
            />

            {searchInput && (
              <button
                type="button"
                className="orders-search-clear"
                onClick={() => {
                  setSearchInput("");
                  if (search) {
                    clearSearch();
                  }
                }}
              >
                <Icon name="close" size={16} />
              </button>
            )}

            <button
              type="submit"
              className="orders-search-submit"
            >
              بحث
            </button>
          </form>

          <button
            className={`orders-filter-button ${
              showFilters ? "active" : ""
            }`}
            onClick={() =>
              setShowFilters((value) => !value)
            }
          >
            <Icon name="filter" size={18} />
            الفلاتر
            {hasFilters && (
              <span className="orders-filter-count">
                {(search ? 1 : 0) +
                  (status ? 1 : 0)}
              </span>
            )}
          </button>
        </section>

        {/* ======================================================
           FILTERS
           ====================================================== */}

        {showFilters && (
          <section className="orders-filters">
            <div className="orders-filter-group">
              <label>حالة الطلب</label>

              <select
                value={status}
                onChange={(event) =>
                  changeStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="">
                  جميع الحالات
                </option>

                {ORDER_STATUSES.map(
                  (orderStatus) => (
                    <option
                      value={orderStatus}
                      key={orderStatus}
                    >
                      {getStatusLabel(
                        orderStatus
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            {hasFilters && (
              <button
                className="orders-clear-filters"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setStatus("");
                  setPage(1);
                }}
              >
                مسح الفلاتر
              </button>
            )}
          </section>
        )}

        {/* ======================================================
           ERROR
           ====================================================== */}

        {error && (
          <div className="orders-error">
            <div className="orders-error-icon">
              <Icon name="alert" size={20} />
            </div>

            <div>
              <strong>
                تعذر تحميل الطلبات
              </strong>

              <span>{error}</span>
            </div>

            <button
              onClick={() => loadOrders()}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* ======================================================
           STATS BAR
           ====================================================== */}

        {!loading && !error && (
          <div className="orders-results-bar">
            <span>
              {pagination.total || 0} طلب
            </span>

            {search && (
              <span className="orders-active-filter">
                نتائج البحث عن:{" "}
                <strong>{search}</strong>
              </span>
            )}

            {status && (
              <span className="orders-active-filter">
                الحالة:{" "}
                <strong>
                  {getStatusLabel(status)}
                </strong>
              </span>
            )}
          </div>
        )}

        {/* ======================================================
           TABLE
           ====================================================== */}

        <section className="orders-table-card">
          {loading ? (
            <OrdersSkeleton />
          ) : orders.length === 0 ? (
            <EmptyOrders
              hasFilters={hasFilters}
              onClear={() => {
                setSearchInput("");
                setSearch("");
                setStatus("");
                setPage(1);
              }}
            />
          ) : (
            <>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>الطلب</th>
                      <th>العميل</th>
                      <th>المنتجات</th>
                      <th>الإجمالي</th>
                      <th>الدفع</th>
                      <th>الحالة</th>
                      <th>التاريخ</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        {/* ORDER */}

                        <td>
                          <div className="orders-number">
                            <strong>
                              {order.orderNumber}
                            </strong>

                            <span>
                              #{String(
                                order._id || ""
                              ).slice(-8)}
                            </span>
                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div className="orders-customer">
                            <div className="orders-avatar">
                              {getInitials(
                                order.customer
                              )}
                            </div>

                            <div>
                              <strong>
                                {getCustomerName(
                                  order.customer
                                )}
                              </strong>

                              <span>
                                {order.customer
                                  ?.phone || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ITEMS */}

                        <td>
                          <div className="orders-items-cell">
                            <strong>
                              {order.itemsCount ||
                                0}
                            </strong>

                            <span>
                              {order.itemsCount ===
                              1
                                ? "منتج"
                                : "منتجات"}
                            </span>
                          </div>
                        </td>

                        {/* TOTAL */}

                        <td>
                          <div className="orders-total-cell">
                            <strong>
                              {formatMoney(
                                order.pricing
                                  ?.total,
                                order.pricing
                                  ?.currency
                              )}
                            </strong>

                            <span>
                              {formatMoney(
                                order.pricing
                                  ?.subtotal,
                                order.pricing
                                  ?.currency
                              )}{" "}
                              قبل الشحن
                            </span>
                          </div>
                        </td>

                        {/* PAYMENT */}

                        <td>
                          <PaymentBadge
                            status={
                              order.payment?.status
                            }
                          />
                        </td>

                        {/* STATUS */}

                        <td>
                          <StatusBadge
                            status={
                              order.status
                            }
                          />
                        </td>

                        {/* DATE */}

                        <td>
                          <div className="orders-date-cell">
                            <strong>
                              {formatShortDate(
                                order.createdAt
                              )}
                            </strong>

                            <span>
                              {new Date(
                                order.createdAt
                              ).toLocaleTimeString(
                                "fr-MA",
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </td>

                        {/* ACTION */}

                        <td>
                          <button
                            className="orders-view-button"
                            onClick={() =>
                              openOrder(order)
                            }
                          >
                            <Icon
                              name="eye"
                              size={17}
                            />
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ==================================================
                 PAGINATION
                 ================================================== */}

              <div className="orders-pagination">
                <div className="orders-pagination-info">
                  عرض{" "}
                  <strong>
                    {orders.length}
                  </strong>{" "}
                  من{" "}
                  <strong>
                    {pagination.total || 0}
                  </strong>{" "}
                  طلب
                </div>

                <div className="orders-pagination-controls">
                  <button
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) =>
                        Math.max(
                          current - 1,
                          1
                        )
                      )
                    }
                  >
                    <Icon
                      name="chevronRight"
                      size={18}
                    />
                  </button>

                  {visiblePages.map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        className={
                          pageNumber === page
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setPage(pageNumber)
                        }
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                  <button
                    disabled={
                      page >= pages
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.min(
                          current + 1,
                          pages
                        )
                      )
                    }
                  >
                    <Icon
                      name="chevronLeft"
                      size={18}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ========================================================
         DETAILS DRAWER
         ======================================================== */}

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          onStatusUpdated={
            updateOrderInState
          }
          onPaymentUpdated={
            updateOrderInState
          }
          onCancelled={
            updateOrderInState
          }
        />
      )}

      {detailsLoading && (
        <div className="orders-details-loading">
          <div className="orders-spinner" />
          <span>جاري تحميل تفاصيل الطلب...</span>
        </div>
      )}
      
    </div>


   <style>
{`

/* =========================================================
   ADMIN ORDERS — GLOBAL RESET
========================================================= */

.admin-orders,
.admin-orders *,
.admin-orders *::before,
.admin-orders *::after {
  box-sizing: border-box;
}

.admin-orders {
  --orders-primary: #5b4ce8;
  --orders-primary-dark: #4c3dd1;
  --orders-primary-soft: #f0eeff;

  --orders-bg: #f6f7fb;
  --orders-surface: #ffffff;
  --orders-surface-soft: #fafaff;

  --orders-border: #e7e8ef;
  --orders-border-soft: #eff0f4;

  --orders-text: #181b28;
  --orders-text-strong: #252938;
  --orders-text-muted: #777c8d;
  --orders-text-light: #9da1af;

  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  background: var(--orders-bg);
  color: var(--orders-text);

  font-family:
    Inter,
    "Noto Sans Arabic",
    "Segoe UI",
    Arial,
    sans-serif;

 
}


/* =========================================================
   PAGE LAYOUT
========================================================= */

/*
  Sidebar is a sibling of .orders-page.
  Therefore .orders-page must NOT have margin-left/right.
*/

.orders-page {
  position: relative;

  width: calc(100% - 270px);
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
 margin-left: 270px;
  flex: 1 1 auto;

  background: var(--orders-bg);
  color: var(--orders-text);

   
}

.orders-page *,
.orders-page *::before,
.orders-page *::after {
  box-sizing: border-box;
}


/* =========================================================
   MAIN CONTAINER
========================================================= */

.orders-container {
  width: 100%;
  max-width: 1540px;

  margin: 0 auto;

  padding:
    34px
    34px
    60px;

}


/* =========================================================
   PAGE HEADER
========================================================= */

.orders-page-header {
  width: 100%;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;

  margin-bottom: 28px;
}

.orders-page-header > div:first-child {
  min-width: 0;
}

.orders-eyebrow {
  display: inline-flex;
  align-items: center;

  margin-bottom: 8px;

  color: var(--orders-primary);

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 0.02em;
}

.orders-page-header h1 {
  margin: 0;

  color: var(--orders-text);

  font-size: 32px;
  line-height: 1.2;

  font-weight: 850;

  letter-spacing: -0.035em;
}

.orders-page-header p {
  margin: 9px 0 0;

  color: var(--orders-text-muted);

  font-size: 14px;
  line-height: 1.7;
}


/* =========================================================
   REFRESH BUTTON
========================================================= */

.orders-refresh-button {
  flex: 0 0 auto;

  height: 44px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  padding: 0 16px;

  border: 1px solid var(--orders-border);
  border-radius: 11px;

  background: var(--orders-surface);
  color: #343746;

  font-family: inherit;
  font-size: 13px;
  font-weight: 750;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.orders-refresh-button:hover {
  border-color: #d5d1fa;

  background: #fcfbff;

  color: var(--orders-primary);

  box-shadow:
    0 8px 24px rgba(38, 32, 100, 0.07);

  transform: translateY(-1px);
}

.orders-refresh-button:active {
  transform: translateY(0);
}

.orders-refresh-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.orders-refresh-button.is-loading svg {
  animation: orders-spin 0.8s linear infinite;
}


/* =========================================================
   TOOLBAR
========================================================= */

.orders-toolbar {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 14px;
}


/* =========================================================
   SEARCH
========================================================= */

.orders-search {
  min-width: 0;
  flex: 1;

  height: 48px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 12px;

  border: 1px solid var(--orders-border);
  border-radius: 12px;

  background: var(--orders-surface);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.orders-search:focus-within {
  border-color: #7668f5;

  box-shadow:
    0 0 0 4px rgba(91, 76, 232, 0.08);
}

.orders-search > svg {
  flex: 0 0 auto;

  color: #9296a5;
}

.orders-search input {
  flex: 1;

  width: 100%;
  min-width: 0;

  height: 100%;

  padding: 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: var(--orders-text);

  font-family: inherit;
  font-size: 13px;

  direction: rtl;
}

.orders-search input::placeholder {
  color: #a5a8b4;
}

.orders-search-clear {
  width: 27px;
  height: 27px;

  flex: 0 0 auto;

  display: grid;
  place-items: center;

  padding: 0;

  border: 0;
  border-radius: 7px;

  background: #f1f1f6;
  color: #747888;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.orders-search-clear:hover {
  background: #e9e8f1;
  color: #343746;
}

.orders-search-submit {
  height: 34px;

  flex: 0 0 auto;

  padding: 0 17px;

  border: 0;
  border-radius: 9px;

  background: var(--orders-primary);
  color: #ffffff;

  font-family: inherit;
  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.orders-search-submit:hover {
  background: var(--orders-primary-dark);
  transform: translateY(-1px);
}


/* =========================================================
   FILTER BUTTON
========================================================= */

.orders-filter-button {
  height: 48px;

  flex: 0 0 auto;

  min-width: 108px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 15px;

  border: 1px solid var(--orders-border);
  border-radius: 12px;

  background: var(--orders-surface);
  color: #3c4050;

  font-family: inherit;
  font-size: 13px;
  font-weight: 750;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.orders-filter-button:hover,
.orders-filter-button.active {
  border-color: #d5d0fa;

  background: #faf9ff;

  color: var(--orders-primary);
}

.orders-filter-count {
  min-width: 20px;
  height: 20px;

  display: inline-grid;
  place-items: center;

  padding: 0 5px;

  border-radius: 20px;

  background: var(--orders-primary);
  color: #ffffff;

  font-size: 10px;
  font-weight: 850;
}


/* =========================================================
   FILTER PANEL
========================================================= */

.orders-filters {
  width: 100%;

  display: flex;
  align-items: flex-end;

  gap: 16px;

  margin-bottom: 14px;
  padding: 18px;

  border: 1px solid var(--orders-border);
  border-radius: 13px;

  background: var(--orders-surface);

  box-shadow:
    0 3px 15px rgba(20, 24, 45, 0.025);
}

.orders-filter-group {
  width: 240px;
  max-width: 100%;
}

.orders-filter-group label {
  display: block;

  margin-bottom: 7px;

  color: #6d7282;

  font-size: 11px;
  font-weight: 750;
}

.orders-filter-group select,
.orders-control-row select {
  width: 100%;
  height: 42px;

  padding: 0 12px;

  border: 1px solid #dedfe7;
  border-radius: 9px;

  outline: 0;

  background: #ffffff;
  color: #292c3a;

  font-family: inherit;
  font-size: 12px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.orders-filter-group select:focus,
.orders-control-row select:focus {
  border-color: var(--orders-primary);

  box-shadow:
    0 0 0 3px rgba(91, 76, 232, 0.07);
}

.orders-clear-filters {
  height: 42px;

  padding: 0 14px;

  border: 0;
  border-radius: 8px;

  background: transparent;
  color: var(--orders-primary);

  font-family: inherit;
  font-size: 12px;
  font-weight: 800;

  cursor: pointer;
}

.orders-clear-filters:hover {
  background: var(--orders-primary-soft);
}


/* =========================================================
   ERROR
========================================================= */

.orders-error {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 13px;

  margin-bottom: 16px;
  padding: 14px 16px;

  border: 1px solid #f0d4d4;
  border-radius: 12px;

  background: #fff9f9;
}

.orders-error-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 auto;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background: #ffe8e8;
  color: #d24b4b;
}

.orders-error > div:nth-child(2) {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.orders-error strong {
  color: #8f2929;

  font-size: 12px;
  font-weight: 850;
}

.orders-error span {
  overflow-wrap: anywhere;

  color: #a25757;

  font-size: 11px;
}

.orders-error button {
  margin-right: auto;

  flex: 0 0 auto;

  padding: 6px 8px;

  border: 0;
  border-radius: 7px;

  background: transparent;
  color: #b53636;

  font-family: inherit;
  font-size: 11px;
  font-weight: 800;

  cursor: pointer;
}

.orders-error button:hover {
  background: #ffecec;
}


/* =========================================================
   RESULTS BAR
========================================================= */

.orders-results-bar {
  min-height: 30px;

  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-bottom: 8px;

  color: #7d8190;

  font-size: 11px;
}

.orders-active-filter {
  display: inline-flex;
  align-items: center;

  padding: 4px 9px;

  border-radius: 6px;

  background: var(--orders-primary-soft);
  color: #5b4ce8;
}

.orders-active-filter strong {
  margin-right: 3px;
  font-weight: 850;
}


/* =========================================================
   TABLE CARD
========================================================= */

.orders-table-card {
  width: 100%;

  overflow: hidden;

  border: 1px solid var(--orders-border);
  border-radius: 15px;

  background: var(--orders-surface);

  box-shadow:
    0 5px 25px rgba(25, 29, 55, 0.035);
}


/* =========================================================
   TABLE WRAPPER
========================================================= */

.orders-table-wrapper {
  width: 100%;

  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;

  scrollbar-width: thin;
  scrollbar-color: #d7d8e1 transparent;
}

.orders-table-wrapper::-webkit-scrollbar {
  height: 7px;
}

.orders-table-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.orders-table-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #d8d9e2;
}


/* =========================================================
   TABLE
========================================================= */

.orders-table {
  width: 100%;
  min-width: 1080px;

  border-collapse: separate;
  border-spacing: 0;

  text-align: right;
}

.orders-table thead {
  background: #fafaff;
}

.orders-table th {
  height: 49px;

  padding: 0 17px;

  border-bottom: 1px solid #e9eaf0;

  color: #85899a;

  font-size: 10px;
  font-weight: 850;

  white-space: nowrap;
}

.orders-table td {
  height: 76px;

  padding: 10px 17px;

  border-bottom: 1px solid #f0f1f5;

  vertical-align: middle;
}

.orders-table tbody tr {
  transition:
    background 0.15s ease;
}

.orders-table tbody tr:hover {
  background: #fcfcff;
}

.orders-table tbody tr:last-child td {
  border-bottom: 0;
}


/* =========================================================
   ORDER NUMBER
========================================================= */

.orders-number {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.orders-number strong {
  color: #272a39;

  font-size: 12px;
  font-weight: 850;

  white-space: nowrap;
}

.orders-number span {
  color: #a0a4b1;

  font-size: 9px;

  direction: ltr;
  text-align: right;

  white-space: nowrap;
}


/* =========================================================
   CUSTOMER
========================================================= */

.orders-customer {
  min-width: 175px;

  display: flex;
  align-items: center;

  gap: 10px;
}

.orders-avatar {
  width: 37px;
  height: 37px;

  flex: 0 0 37px;

  display: grid;
  place-items: center;

  border-radius: 11px;

  background: var(--orders-primary-soft);
  color: var(--orders-primary);

  font-size: 10px;
  font-weight: 900;
}

.orders-customer > div:last-child {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.orders-customer strong {
  display: block;

  max-width: 170px;

  overflow: hidden;

  color: #292c3a;

  font-size: 11px;
  font-weight: 850;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.orders-customer span {
  color: #9296a5;

  font-size: 9px;

  direction: ltr;
  text-align: right;

  white-space: nowrap;
}


/* =========================================================
   ITEMS
========================================================= */

.orders-items-cell {
  display: flex;
  align-items: baseline;

  gap: 5px;

  white-space: nowrap;
}

.orders-items-cell strong {
  color: #2b2e3c;

  font-size: 13px;
  font-weight: 850;
}

.orders-items-cell span {
  color: #969aaa;

  font-size: 10px;
}


/* =========================================================
   TOTAL
========================================================= */

.orders-total-cell {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.orders-total-cell strong {
  color: #252838;

  font-size: 12px;
  font-weight: 850;

  direction: ltr;
  text-align: right;

  white-space: nowrap;
}

.orders-total-cell span {
  color: #a0a3b0;

  font-size: 9px;

  white-space: nowrap;
}


/* =========================================================
   STATUS BADGES
========================================================= */

.orders-status-badge {
  min-width: max-content;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 6px 9px;

  border-radius: 7px;

  font-size: 9px;
  font-weight: 850;

  white-space: nowrap;
}

.orders-status-dot {
  width: 6px;
  height: 6px;

  flex: 0 0 6px;

  border-radius: 50%;

  background: currentColor;
}

.orders-status-badge.pending {
  background: #fff6df;
  color: #a36c05;
}

.orders-status-badge.confirmed {
  background: #edf3ff;
  color: #3e68b8;
}

.orders-status-badge.processing {
  background: #f1edff;
  color: #6850cf;
}

.orders-status-badge.shipped {
  background: #edf8ff;
  color: #237ca9;
}

.orders-status-badge.out-for-delivery {
  background: #e9f8f1;
  color: #25845f;
}

.orders-status-badge.delivered {
  background: #e8f8ef;
  color: #228353;
}

.orders-status-badge.cancelled {
  background: #fff0f0;
  color: #c74747;
}

.orders-status-badge.returned {
  background: #f4efff;
  color: #7853bd;
}


/* =========================================================
   PAYMENT
========================================================= */

.orders-payment-badge {
  display: inline-flex;
  align-items: center;

  padding: 6px 9px;

  border-radius: 7px;

  font-size: 9px;
  font-weight: 850;

  white-space: nowrap;
}

.orders-payment-badge.payment-pending {
  background: #fff6e5;
  color: #a36d09;
}

.orders-payment-badge.payment-paid {
  background: #e8f8ef;
  color: #258254;
}

.orders-payment-badge.payment-failed {
  background: #fff0f0;
  color: #c64545;
}

.orders-payment-badge.payment-refunded {
  background: #f1edff;
  color: #7150bd;
}


/* =========================================================
   DATE
========================================================= */

.orders-date-cell {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.orders-date-cell strong {
  color: #474b5b;

  font-size: 10px;
  font-weight: 750;

  white-space: nowrap;
}

.orders-date-cell span {
  color: #a0a3b0;

  font-size: 9px;

  white-space: nowrap;
}


/* =========================================================
   VIEW BUTTON
========================================================= */

.orders-view-button {
  height: 34px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 0 10px;

  border: 1px solid #e4e5ed;
  border-radius: 8px;

  background: #ffffff;
  color: #5d5f70;

  font-family: inherit;
  font-size: 10px;
  font-weight: 850;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.orders-view-button:hover {
  border-color: #d3cef9;

  background: #f8f7ff;

  color: var(--orders-primary);

  transform: translateY(-1px);
}


/* =========================================================
   PAGINATION
========================================================= */

.orders-pagination {
  min-height: 65px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  padding: 0 18px;

  border-top: 1px solid var(--orders-border-soft);

  background: #ffffff;
}

.orders-pagination-info {
  color: #858998;

  font-size: 10px;
}

.orders-pagination-info strong {
  color: #464a59;
}

.orders-pagination-controls {
  display: flex;
  align-items: center;

  gap: 5px;
}

.orders-pagination-controls button {
  min-width: 31px;
  height: 31px;

  display: grid;
  place-items: center;

  padding: 0 7px;

  border: 1px solid #e5e6ed;
  border-radius: 8px;

  background: #ffffff;
  color: #606476;

  font-family: inherit;
  font-size: 10px;
  font-weight: 750;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.orders-pagination-controls button:hover:not(:disabled) {
  border-color: #d4cffc;

  color: var(--orders-primary);

  background: #faf9ff;
}

.orders-pagination-controls button.active {
  border-color: var(--orders-primary);

  background: var(--orders-primary);
  color: #ffffff;
}

.orders-pagination-controls button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}


/* =========================================================
   EMPTY STATE
========================================================= */

.orders-empty {
  min-height: 430px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  padding: 40px 20px;

  text-align: center;
}

.orders-empty-icon {
  width: 68px;
  height: 68px;

  display: grid;
  place-items: center;

  margin-bottom: 17px;

  border-radius: 19px;

  background: var(--orders-primary-soft);
  color: #6959ed;
}

.orders-empty h3 {
  margin: 0;

  color: #292c3a;

  font-size: 17px;
  font-weight: 850;
}

.orders-empty p {
  max-width: 390px;

  margin: 8px 0 20px;

  color: #9094a4;

  font-size: 12px;
  line-height: 1.8;
}


/* =========================================================
   GENERAL BUTTONS
========================================================= */

.orders-primary-button,
.orders-secondary-button,
.orders-danger-button {
  min-height: 40px;

  border-radius: 9px;

  padding: 0 14px;

  border: 0;

  font-family: inherit;
  font-size: 11px;
  font-weight: 850;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.orders-primary-button {
  background: var(--orders-primary);
  color: #ffffff;
}

.orders-primary-button:hover {
  background: var(--orders-primary-dark);
}

.orders-secondary-button {
  background: #f1f1f7;
  color: #454958;
}

.orders-secondary-button:hover {
  background: #e8e8f0;
}

.orders-danger-button {
  width: 100%;

  background: #fff0f0;
  color: #c63e3e;
}

.orders-danger-button:hover {
  background: #ffe5e5;
}

.orders-primary-button:disabled,
.orders-secondary-button:disabled,
.orders-danger-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


/* =========================================================
   DRAWER OVERLAY
========================================================= */

.orders-drawer-overlay {
  position: fixed;

  inset: 0;

  z-index: 1000;

  background: rgba(15, 18, 32, 0.38);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  animation: orders-fade-in 0.2s ease;
}


/* =========================================================
   DRAWER
========================================================= */

.orders-drawer {
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;

  z-index: 1001;

  width: min(620px, 100vw);

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background: #ffffff;

  box-shadow:
    -18px 0 55px rgba(21, 23, 43, 0.16);

  animation: orders-drawer-in 0.25s ease;
}

.orders-drawer-header {
  min-height: 94px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  padding: 18px 24px;

  border-bottom: 1px solid #ececf2;

  background: #ffffff;
}

.orders-drawer-kicker {
  margin-bottom: 5px;

  color: var(--orders-primary);

  font-size: 10px;
  font-weight: 850;
}

.orders-drawer-header h2 {
  margin: 0;

  color: #222534;

  font-size: 18px;
  font-weight: 850;

  direction: ltr;
  text-align: right;
}

.orders-drawer-date {
  margin-top: 4px;

  color: #999dab;

  font-size: 9px;
}

.orders-icon-button {
  width: 37px;
  height: 37px;

  flex: 0 0 37px;

  display: grid;
  place-items: center;

  padding: 0;

  border: 1px solid #e7e8ee;
  border-radius: 10px;

  background: #ffffff;
  color: #777b8a;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.orders-icon-button:hover {
  border-color: #dddde6;

  background: #f7f7fa;

  color: #252837;
}


/* =========================================================
   DRAWER BODY
========================================================= */

.orders-drawer-body {
  flex: 1;

  min-height: 0;

  overflow-y: auto;

  padding: 20px 24px 35px;

  scrollbar-width: thin;
  scrollbar-color: #d9dae2 transparent;
}

.orders-drawer-body::-webkit-scrollbar {
  width: 7px;
}

.orders-drawer-body::-webkit-scrollbar-track {
  background: transparent;
}

.orders-drawer-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #d9dae2;
}


/* =========================================================
   DETAIL SECTIONS
========================================================= */

.orders-detail-section {
  padding: 20px 0;

  border-bottom: 1px solid #eeeef3;
}

.orders-detail-section:first-child {
  padding-top: 4px;
}

.orders-section-title {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 15px;

  color: #3d4050;

  font-size: 12px;
  font-weight: 850;
}

.orders-section-title svg {
  flex: 0 0 auto;

  color: var(--orders-primary);
}

.orders-section-title.danger {
  color: #a62d2d;
}

.orders-section-title.danger svg {
  color: #cf4242;
}


/* =========================================================
   DETAIL SUMMARY
========================================================= */

.orders-detail-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.orders-detail-summary-main {
  display: flex;
  align-items: center;

  gap: 12px;

  min-width: 0;
}

.orders-detail-avatar {
  width: 48px;
  height: 48px;

  flex: 0 0 48px;

  display: grid;
  place-items: center;

  border-radius: 14px;

  background: var(--orders-primary-soft);
  color: var(--orders-primary);

  font-size: 14px;
  font-weight: 900;
}

.orders-detail-summary h3 {
  margin: 0 0 3px;

  color: #282b3a;

  font-size: 14px;
  font-weight: 850;
}

.orders-detail-summary p {
  margin: 2px 0;

  color: #858999;

  font-size: 10px;

  direction: ltr;
  text-align: right;
}


/* =========================================================
   INFO GRID
========================================================= */

.orders-info-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 10px;
}

.orders-info-item {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 12px;

  border-radius: 10px;

  background: #f8f8fb;
}

.orders-info-item span {
  color: #9296a5;

  font-size: 9px;
}

.orders-info-item strong {
  overflow-wrap: anywhere;

  color: #343746;

  font-size: 10px;
}


/* =========================================================
   ADDRESS
========================================================= */

.orders-address-card {
  display: flex;
  flex-direction: column;

  gap: 6px;

  padding: 14px;

  border-radius: 11px;

  background: #f8f8fb;
}

.orders-address-card strong {
  color: #343746;

  font-size: 11px;
}

.orders-address-card span {
  color: #646879;

  font-size: 11px;
  line-height: 1.7;
}

.orders-address-card small {
  color: #999cab;

  font-size: 9px;
  line-height: 1.7;
}


/* =========================================================
   PRODUCTS
========================================================= */

.orders-items-list {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.orders-detail-product {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 10px;

  border: 1px solid #ededf2;
  border-radius: 11px;

  background: #ffffff;
}

.orders-product-image {
  width: 54px;
  height: 54px;

  flex: 0 0 54px;

  display: grid;
  place-items: center;

  overflow: hidden;

  border-radius: 9px;

  background: #f4f4f7;
  color: #9a9eaa;
}

.orders-product-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.orders-product-info {
  min-width: 0;

  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 4px;
}

.orders-product-info > strong {
  overflow: hidden;

  color: #333644;

  font-size: 10px;
  font-weight: 850;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.orders-product-info > span {
  color: #9a9daa;

  font-size: 8px;
}

.orders-product-options {
  display: flex;

  flex-wrap: wrap;

  gap: 5px;
}

.orders-product-options span {
  padding: 3px 5px;

  border-radius: 4px;

  background: #f4f3f8;
  color: #858896;

  font-size: 7px;
}

.orders-product-price {
  flex: 0 0 auto;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 4px;

  white-space: nowrap;
}

.orders-product-price strong {
  color: #303341;

  font-size: 10px;

  direction: ltr;
}

.orders-product-price span {
  color: #999daa;

  font-size: 8px;

  direction: ltr;
}


/* =========================================================
   SHIPPING
========================================================= */

.orders-shipping-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  padding: 13px;

  border-radius: 11px;

  background: #f8f8fb;
}

.orders-shipping-card > div:first-child {
  display: flex;
  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.orders-shipping-card strong {
  color: #333645;

  font-size: 11px;
}

.orders-shipping-card span {
  color: #999daa;

  font-size: 8px;
}

.orders-shipping-price {
  flex: 0 0 auto;

  text-align: left;
}

.orders-shipping-price strong {
  direction: ltr;
}

.orders-shipping-price small {
  display: block;

  margin-top: 3px;

  color: #999daa;

  font-size: 7px;
}

.orders-free {
  color: #258254 !important;

  font-size: 10px !important;
  font-weight: 850;
}

.orders-delivery-info {
  margin-top: 8px;

  color: #9295a3;

  font-size: 9px;
}


/* =========================================================
   PRICING
========================================================= */

.orders-pricing-card {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.orders-pricing-card > div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.orders-pricing-card span {
  color: #888c9b;

  font-size: 10px;
}

.orders-pricing-card strong {
  color: #3b3e4c;

  font-size: 10px;

  direction: ltr;
}

.orders-pricing-card .orders-total-row {
  margin-top: 5px;

  padding-top: 14px;

  border-top: 1px dashed #dedfe7;
}

.orders-total-row span {
  color: #292c3a;

  font-size: 12px;
  font-weight: 850;
}

.orders-total-row strong {
  color: var(--orders-primary);

  font-size: 15px;
  font-weight: 900;
}


/* =========================================================
   PAYMENT / CONTROLS
========================================================= */

.orders-payment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 12px;
}

.orders-payment-row > div {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.orders-payment-row span {
  color: #9699a8;

  font-size: 9px;
}

.orders-payment-row strong {
  color: #353847;

  font-size: 10px;
}

.orders-control-row {
  display: flex;
  align-items: center;

  gap: 8px;
}

.orders-control-row select {
  flex: 1;
}

.orders-note-input {
  width: 100%;
  min-height: 74px;

  margin-top: 10px;

  padding: 11px 12px;

  resize: vertical;

  border: 1px solid #e1e2e9;
  border-radius: 9px;

  outline: 0;

  background: #ffffff;
  color: #343746;

  font-family: inherit;
  font-size: 10px;
  line-height: 1.7;
}

.orders-note-input:focus {
  border-color: var(--orders-primary);

  box-shadow:
    0 0 0 3px rgba(91, 76, 232, 0.07);
}

.orders-note-input::placeholder {
  color: #a2a5b0;
}

.orders-closed-message {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 12px;

  border-radius: 9px;

  background: #f0faf5;
  color: #31805d;

  font-size: 10px;
}


/* =========================================================
   DANGER
========================================================= */

.orders-danger-section p {
  margin: -3px 0 10px;

  color: #9295a2;

  font-size: 9px;
  line-height: 1.7;
}

.orders-danger-button {
  margin-top: 9px;
}


/* =========================================================
   TIMELINE
========================================================= */

.orders-timeline {
  display: flex;
  flex-direction: column;
}

.orders-timeline-item {
  position: relative;

  display: flex;

  gap: 11px;
}

.orders-timeline-line {
  position: relative;

  width: 16px;

  flex: 0 0 16px;

  display: flex;
  justify-content: center;
}

.orders-timeline-line::after {
  content: "";

  position: absolute;

  top: 13px;
  bottom: -14px;

  width: 1px;

  background: #e4e5eb;
}

.orders-timeline-item:last-child
.orders-timeline-line::after {
  display: none;
}

.orders-timeline-line span {
  position: relative;
  z-index: 2;

  width: 9px;
  height: 9px;

  margin-top: 5px;

  border-radius: 50%;

  background: #6a5af0;

  box-shadow:
    0 0 0 4px #efedff;
}

.orders-timeline-content {
  flex: 1;

  min-width: 0;

  padding-bottom: 17px;
}

.orders-timeline-content > div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;
}

.orders-timeline-content strong {
  color: #3d4050;

  font-size: 10px;
}

.orders-timeline-content time {
  color: #a0a3ae;

  font-size: 8px;
}

.orders-timeline-content p {
  margin: 5px 0 3px;

  color: #777b8b;

  font-size: 9px;
  line-height: 1.6;
}

.orders-timeline-content small {
  color: #a1a4af;

  font-size: 7px;
}


/* =========================================================
   META
========================================================= */

.orders-detail-meta {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 8px;

  padding-top: 20px;
}

.orders-detail-meta > div {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 10px;

  border-radius: 8px;

  background: #f8f8fb;
}

.orders-detail-meta span {
  color: #a0a3af;

  font-size: 7px;
}

.orders-detail-meta strong {
  overflow-wrap: anywhere;

  color: #555968;

  font-size: 8px;
}


/* =========================================================
   ACTION ERROR
========================================================= */

.orders-action-error {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  padding: 10px 12px;

  border-radius: 9px;

  background: #fff1f1;
  color: #bc3d3d;

  font-size: 9px;
}


/* =========================================================
   DETAILS LOADING
========================================================= */

.orders-details-loading {
  position: fixed;

  left: 25px;
  bottom: 25px;

  z-index: 1100;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px 13px;

  border: 1px solid #e3e4eb;
  border-radius: 10px;

  background: #ffffff;

  box-shadow:
    0 10px 30px rgba(23, 25, 46, 0.13);

  color: #5f6374;

  font-size: 9px;
}

.orders-spinner {
  width: 16px;
  height: 16px;

  flex: 0 0 16px;

  border: 2px solid #e3e3eb;
  border-top-color: var(--orders-primary);

  border-radius: 50%;

  animation: orders-spin 0.7s linear infinite;
}


/* =========================================================
   SKELETON
========================================================= */

.orders-skeleton {
  width: 100%;
}

.orders-skeleton-row {
  min-height: 76px;

  display: grid;

  grid-template-columns:
    1fr
    1.4fr
    0.7fr
    1fr
    0.8fr
    1fr
    0.8fr
    0.5fr;

  align-items: center;

  gap: 20px;

  padding: 0 17px;

  border-bottom: 1px solid #f0f1f5;
}

.orders-skeleton-row span {
  width: 100%;
  height: 12px;

  border-radius: 5px;

  background:
    linear-gradient(
      90deg,
      #f1f1f5 25%,
      #e8e8ee 50%,
      #f1f1f5 75%
    );

  background-size: 200% 100%;

  animation:
    orders-skeleton 1.4s infinite;
}

.orders-skeleton-row span:nth-child(2) {
  width: 80%;
}

.orders-skeleton-row span:nth-child(3) {
  width: 45%;
}

.orders-skeleton-row span:nth-child(4) {
  width: 65%;
}

.orders-skeleton-row span:nth-child(5) {
  width: 60%;
}

.orders-skeleton-row span:nth-child(6) {
  width: 70%;
}

.orders-skeleton-row span:nth-child(7) {
  width: 70%;
}

.orders-skeleton-row span:nth-child(8) {
  width: 35%;
}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes orders-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes orders-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes orders-drawer-in {
  from {
    transform: translateX(35px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes orders-skeleton {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}


/* =========================================================
   LARGE SCREENS
========================================================= */

@media (min-width: 1500px) {

  .orders-container {
    padding-left: 42px;
    padding-right: 42px;
  }

  .orders-page-header h1 {
    font-size: 34px;
  }

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

  .orders-container {
    padding:
      28px
      24px
      50px;
  }

  .orders-page-header h1 {
    font-size: 29px;
  }

  .orders-page-header p {
    font-size: 13px;
  }

}


/* =========================================================
   SIDEBAR / TABLET LAYOUT
========================================================= */

@media (max-width: 900px) {

  /*
    The sidebar becomes an overlay/drawer.
    The page must therefore use the full viewport width.
  */

  .orders-page {
    width: 100%;
    min-width: 0;
     margin-left: 0;
  }

  .orders-container {
    padding:
      25px
      20px
      45px;
  }

  .orders-page-header {
    align-items: flex-start;
  }

  .orders-page-header h1 {
    font-size: 27px;
  }

  .orders-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .orders-filter-button {
    width: 100%;
  }

  .orders-filters {
    align-items: stretch;
  }

  .orders-filter-group {
    width: 100%;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 640px) {

  .orders-container {
    padding:
      20px
      12px
      32px;
  }

  .orders-page-header {
    flex-direction: column;

    align-items: stretch;

    gap: 16px;

    margin-bottom: 20px;
  }

  .orders-page-header h1 {
    font-size: 25px;
  }

  .orders-page-header p {
    max-width: 100%;

    font-size: 12px;
  }

  .orders-refresh-button {
    width: 100%;
  }

  .orders-search {
    height: 46px;
  }

  .orders-search input {
    font-size: 12px;
  }

  .orders-search-submit {
    padding: 0 12px;
  }

  .orders-filters {
    flex-direction: column;

    align-items: stretch;

    padding: 15px;
  }

  .orders-filter-group {
    width: 100%;
  }

  .orders-results-bar {
    align-items: flex-start;

    flex-direction: column;

    gap: 6px;
  }

  .orders-pagination {
    min-height: auto;

    align-items: center;

    flex-direction: column;

    padding: 14px 12px;

    gap: 12px;
  }

  .orders-pagination-controls {
    width: 100%;

    justify-content: center;
  }

  /*
    Drawer becomes a full-screen mobile sheet.
  */

  .orders-drawer {
    width: 100%;
  }

  .orders-drawer-header {
    min-height: 78px;

    padding:
      14px
      16px;
  }

  .orders-drawer-body {
    padding:
      16px
      16px
      30px;
  }

  .orders-info-grid {
    grid-template-columns: 1fr;
  }

  .orders-detail-meta {
    grid-template-columns: 1fr;
  }

  .orders-detail-product {
    align-items: flex-start;
  }

  .orders-product-price {
    align-items: flex-end;
  }

  .orders-control-row {
    flex-direction: column;

    align-items: stretch;
  }

  .orders-control-row select,
  .orders-control-row button {
    width: 100%;
  }

  .orders-details-loading {
    left: 12px;
    right: 12px;

    bottom: 12px;

    justify-content: center;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 420px) {

  .orders-container {
    padding:
      18px
      10px
      28px;
  }

  .orders-page-header h1 {
    font-size: 23px;
  }

  .orders-search {
    gap: 7px;

    padding:
      0
      9px;
  }

  .orders-search-submit {
    padding: 0 10px;

    font-size: 11px;
  }

  .orders-empty {
    min-height: 360px;
  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .admin-orders *,
  .admin-orders *::before,
  .admin-orders *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

}

`}
</style>

   
      
    </div>
    
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyOrders({
  hasFilters,
  onClear,
}) {
  return (
    <div className="orders-empty">
      <div className="orders-empty-icon">
        <Icon name="box" size={30} />
      </div>

      <h3>
        {hasFilters
          ? "لا توجد نتائج"
          : "لا توجد طلبات حتى الآن"}
      </h3>

      <p>
        {hasFilters
          ? "لم نعثر على طلبات تطابق الفلاتر الحالية."
          : "ستظهر الطلبات الجديدة هنا عند وصولها."}
      </p>

      {hasFilters && (
        <button
          className="orders-primary-button"
          onClick={onClear}
        >
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}

/* ============================================================
   SKELETON
   ============================================================ */

function OrdersSkeleton() {
  return (
    <div className="orders-skeleton">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            className="orders-skeleton-row"
            key={index}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )
      )}
    </div>
  );
}

