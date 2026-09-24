import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiTruck,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRotateCcw,
  FiCheckCircle,
  FiXCircle,
  FiSettings,
  FiClock,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSave,
  FiAlertCircle,
  FiPackage,
} from "react-icons/fi";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loading from "../../components/common/Loading";
import API_BASE from "../../config/api";
 

const EMPTY_METHOD = {
  name: "",
  code: "",
  description: "",
  price: 0,
  currency: "MAD",
  delivery: {
    min: 2,
    max: 4,
    unit: "days",
  },
  freeShippingEligible: true,
  enabled: true,
  sortOrder: 0,
};

const EMPTY_SETTINGS = {
  enabled: true,
  freeShipping: {
    enabled: true,
    minimumOrder: 500,
  },
  currency: "MAD",
};

export default function Shipping() {
   const [sidebarOpen, setSidebarOpen] =
    useState(false);
  /* ============================================================
     STATE
  ============================================================ */

  const [methods, setMethods] = useState([]);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [error, setError] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const [search, setSearch] = useState("");
  const [enabledFilter, setEnabledFilter] = useState("all");
  const [deletedFilter, setDeletedFilter] = useState("false");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [showDeleted, setShowDeleted] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const [form, setForm] = useState(EMPTY_METHOD);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [savingSettings, setSavingSettings] = useState(false);

  const [actionId, setActionId] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    type: "",
    message: "",
  });

  /* ============================================================
     TOAST
  ============================================================ */

  const showToast = useCallback((type, message) => {
    setToast({
      visible: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        visible: false,
        type: "",
        message: "",
      });
    }, 3500);
  }, []);

  /* ============================================================
     API HELPER
  ============================================================ */

  const apiRequest = useCallback(async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.message || "حدث خطأ أثناء تنفيذ العملية."
      );
    }

    return data;
  }, []);

  /* ============================================================
     LOAD SETTINGS
  ============================================================ */

  const loadSettings = useCallback(async () => {
    try {
      setSettingsLoading(true);
      setSettingsError("");

      const data = await apiRequest(
        "/api/shipping/admin/settings"
      );

      if (data.success && data.settings) {
        setSettings({
          enabled: data.settings.enabled !== false,

          freeShipping: {
            enabled:
              data.settings.freeShipping?.enabled !== false,

            minimumOrder:
              Number(
                data.settings.freeShipping?.minimumOrder || 0
              ),
          },

          currency: data.settings.currency || "MAD",
        });
      }
    } catch (err) {
      console.error("LOAD SHIPPING SETTINGS:", err);

      setSettingsError(
        err.message || "تعذر تحميل إعدادات الشحن."
      );
    } finally {
      setSettingsLoading(false);
    }
  }, [apiRequest]);

  /* ============================================================
     LOAD METHODS
  ============================================================ */

  const loadMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (enabledFilter !== "all") {
        params.set("enabled", enabledFilter);
      }

      params.set("deleted", deletedFilter);
      params.set("page", page);
      params.set("limit", limit);

      const data = await apiRequest(
        `/api/shipping/admin?${params.toString()}`
      );

      if (data.success) {
        setMethods(data.methods || []);

        setPagination(
          data.pagination || {
            page,
            limit,
            total: 0,
            pages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      }
    } catch (err) {
      console.error("LOAD SHIPPING METHODS:", err);

      setError(
        err.message || "تعذر تحميل طرق الشحن."
      );
    } finally {
      setLoading(false);
    }
  }, [
    apiRequest,
    search,
    enabledFilter,
    deletedFilter,
    page,
    limit,
  ]);

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMethods();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadMethods]);

  /* ============================================================
     SEARCH RESET
  ============================================================ */

  useEffect(() => {
    setPage(1);
  }, [search, enabledFilter, deletedFilter]);

  /* ============================================================
     FORM HANDLERS
  ============================================================ */

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateDelivery = (field, value) => {
    setForm((previous) => ({
      ...previous,
      delivery: {
        ...previous.delivery,
        [field]: value,
      },
    }));
  };

  /* ============================================================
     OPEN CREATE
  ============================================================ */

  const openCreateModal = () => {
    setEditingMethod(null);
    setForm({
      ...EMPTY_METHOD,
      delivery: {
        ...EMPTY_METHOD.delivery,
      },
    });
    setFormError("");
    setModalOpen(true);
  };

  /* ============================================================
     OPEN EDIT
  ============================================================ */

  const openEditModal = (method) => {
    setEditingMethod(method);

    setForm({
      name: method.name || "",
      code: method.code || "",
      description: method.description || "",
      price: Number(method.price || 0),
      currency: method.currency || "MAD",

      delivery: {
        min: Number(method.delivery?.min || 0),
        max: Number(method.delivery?.max || 0),
        unit: method.delivery?.unit || "days",
      },

      freeShippingEligible:
        method.freeShippingEligible !== false,

      enabled: method.enabled !== false,

      sortOrder: Number(method.sortOrder || 0),
    });

    setFormError("");
    setModalOpen(true);
  };

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingMethod(null);
    setFormError("");
  };

  /* ============================================================
     VALIDATE FORM
  ============================================================ */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "يرجى إدخال اسم طريقة الشحن.";
    }

    if (!form.code.trim()) {
      return "يرجى إدخال كود طريقة الشحن.";
    }

    if (!/^[a-z0-9_-]+$/i.test(form.code.trim())) {
      return "الكود يجب أن يحتوي فقط على الأحرف والأرقام و _ أو -.";
    }

    if (Number(form.price) < 0) {
      return "سعر الشحن لا يمكن أن يكون سالباً.";
    }

    if (Number(form.delivery.min) < 0) {
      return "الحد الأدنى لمدة التوصيل غير صحيح.";
    }

    if (Number(form.delivery.max) < 0) {
      return "الحد الأقصى لمدة التوصيل غير صحيح.";
    }

    if (
      Number(form.delivery.max) <
      Number(form.delivery.min)
    ) {
      return "الحد الأقصى لمدة التوصيل يجب أن يكون أكبر من أو يساوي الحد الأدنى.";
    }

    if (Number(form.sortOrder) < 0) {
      return "ترتيب الظهور لا يمكن أن يكون سالباً.";
    }

    return "";
  };

  /* ============================================================
     SAVE METHOD
  ============================================================ */

  const handleSaveMethod = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        name: form.name.trim(),

        code: form.code.trim().toLowerCase(),

        description: form.description.trim(),

        price: Number(form.price),

        currency:
          form.currency.trim().toUpperCase() || "MAD",

        delivery: {
          min: Number(form.delivery.min),
          max: Number(form.delivery.max),
          unit: form.delivery.unit,
        },

        freeShippingEligible:
          Boolean(form.freeShippingEligible),

        enabled: Boolean(form.enabled),

        sortOrder: Number(form.sortOrder),
      };

      let data;

      if (editingMethod) {
        data = await apiRequest(
          `/api/shipping/admin/${editingMethod._id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        data = await apiRequest(
          "/api/shipping/admin",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (data.success) {
        showToast(
          "success",
          editingMethod
            ? "تم تحديث طريقة الشحن بنجاح."
            : "تم إنشاء طريقة الشحن بنجاح."
        );

        setModalOpen(false);
        setEditingMethod(null);

        await loadMethods();
      }
    } catch (err) {
      console.error("SAVE SHIPPING METHOD:", err);

      setFormError(
        err.message || "تعذر حفظ طريقة الشحن."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     TOGGLE METHOD
  ============================================================ */

  const handleToggle = async (method) => {
    try {
      setActionId(method._id);

      const data = await apiRequest(
        `/api/shipping/admin/${method._id}/toggle`,
        {
          method: "PATCH",
        }
      );

      if (data.success) {
        showToast(
          "success",
          method.enabled
            ? "تم تعطيل طريقة الشحن."
            : "تم تفعيل طريقة الشحن."
        );

        await loadMethods();
      }
    } catch (err) {
      console.error("TOGGLE SHIPPING:", err);

      showToast(
        "error",
        err.message || "تعذر تغيير حالة طريقة الشحن."
      );
    } finally {
      setActionId(null);
    }
  };

  /* ============================================================
     DELETE METHOD
  ============================================================ */

  const handleDelete = async (method) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف طريقة الشحن "${method.name}"؟`
    );

    if (!confirmed) return;

    try {
      setActionId(method._id);

      const data = await apiRequest(
        `/api/shipping/admin/${method._id}`,
        {
          method: "DELETE",
        }
      );

      if (data.success) {
        showToast(
          "success",
          "تم حذف طريقة الشحن بنجاح."
        );

        await loadMethods();
      }
    } catch (err) {
      console.error("DELETE SHIPPING:", err);

      showToast(
        "error",
        err.message || "تعذر حذف طريقة الشحن."
      );
    } finally {
      setActionId(null);
    }
  };

  /* ============================================================
     RESTORE METHOD
  ============================================================ */

  const handleRestore = async (method) => {
    try {
      setActionId(method._id);

      const data = await apiRequest(
        `/api/shipping/admin/${method._id}/restore`,
        {
          method: "PATCH",
        }
      );

      if (data.success) {
        showToast(
          "success",
          "تم استعادة طريقة الشحن بنجاح."
        );

        await loadMethods();
      }
    } catch (err) {
      console.error("RESTORE SHIPPING:", err);

      showToast(
        "error",
        err.message || "تعذر استعادة طريقة الشحن."
      );
    } finally {
      setActionId(null);
    }
  };

  /* ============================================================
     SETTINGS UPDATE
  ============================================================ */

  const updateSettings = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateFreeShipping = (field, value) => {
    setSettings((previous) => ({
      ...previous,

      freeShipping: {
        ...previous.freeShipping,
        [field]: value,
      },
    }));
  };

  /* ============================================================
     SAVE SETTINGS
  ============================================================ */

  const handleSaveSettings = async () => {
    if (
      Number(settings.freeShipping.minimumOrder) < 0
    ) {
      showToast(
        "error",
        "الحد الأدنى للشحن المجاني غير صحيح."
      );

      return;
    }

    try {
      setSavingSettings(true);
      setSettingsError("");

      const payload = {
        enabled: Boolean(settings.enabled),

        freeShipping: {
          enabled:
            Boolean(settings.freeShipping.enabled),

          minimumOrder:
            Number(
              settings.freeShipping.minimumOrder
            ),
        },

        currency:
          settings.currency.trim().toUpperCase() || "MAD",
      };

      const data = await apiRequest(
        "/api/shipping/admin/settings",
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (data.success) {
        setSettings({
          enabled: data.settings.enabled !== false,

          freeShipping: {
            enabled:
              data.settings.freeShipping?.enabled !== false,

            minimumOrder:
              Number(
                data.settings.freeShipping?.minimumOrder || 0
              ),
          },

          currency:
            data.settings.currency || "MAD",
        });

        showToast(
          "success",
          "تم حفظ إعدادات الشحن بنجاح."
        );
      }
    } catch (err) {
      console.error("SAVE SHIPPING SETTINGS:", err);

      setSettingsError(
        err.message || "تعذر حفظ إعدادات الشحن."
      );

      showToast(
        "error",
        err.message || "تعذر حفظ إعدادات الشحن."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  /* ============================================================
     HELPERS
  ============================================================ */

  const getDeliveryText = (method) => {
    const min = Number(method.delivery?.min || 0);
    const max = Number(method.delivery?.max || 0);

    const unit = method.delivery?.unit || "days";

    const unitMap = {
      hours: "ساعة",
      days: "يوم",
      weeks: "أسبوع",
    };

    const translatedUnit = unitMap[unit] || unit;

    if (min === max) {
      return `${min} ${translatedUnit}`;
    }

    return `${min} - ${max} ${translatedUnit}`;
  };

  const formatPrice = (price, currency = "MAD") => {
    return `${Number(price || 0).toFixed(2)} ${currency}`;
  };

  const stats = useMemo(() => {
    const active = methods.filter(
      (method) => method.enabled
    ).length;

    const freeEligible = methods.filter(
      (method) => method.freeShippingEligible
    ).length;

    const deleted = methods.filter(
      (method) => method.isDeleted
    ).length;

    return {
      total: pagination.total || 0,
      active,
      freeEligible,
      deleted,
    };
  }, [methods, pagination.total]);

 if (loading) {
  return <Loading text="جاري تحميل الطلبات" />;
}

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="admin-shipping">
      <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() =>
                      setSidebarOpen(false)
                    }
                  />

    <div className="shipping-page">
       <AdminHeader
                        onMenuClick={() =>
                          setSidebarOpen(true)
                        }
                      />

      <div className="main">
        {/* ======================================================
          TOAST
      ====================================================== */}
      

      {toast.visible && (
        <div
          className={`shipping-toast shipping-toast-${toast.type}`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle />
          ) : (
            <FiAlertCircle />
          )}

          <span>{toast.message}</span>

          <button
            type="button"
            onClick={() =>
              setToast({
                visible: false,
                type: "",
                message: "",
              })
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="shipping-header">
        <div className="shipping-header-content">
          <div className="shipping-title-wrapper">
            <div className="shipping-title-icon">
              <FiTruck />
            </div>

            <div>
              <h1>إدارة الشحن</h1>

              <p>
                إدارة طرق الشحن وإعدادات التوصيل والشحن المجاني
              </p>
            </div>
          </div>

          <button
            className="shipping-primary-btn"
            type="button"
            onClick={openCreateModal}
          >
            <FiPlus />
            <span>إضافة طريقة شحن</span>
          </button>
        </div>
      </div>

      {/* ======================================================
          GLOBAL SHIPPING STATUS
      ====================================================== */}

      <section className="shipping-settings-card">
        <div className="shipping-card-heading">
          <div className="shipping-card-heading-icon">
            <FiSettings />
          </div>

          <div>
            <h2>إعدادات الشحن العامة</h2>

            <p>
              التحكم في نظام الشحن والشحن المجاني للمتجر
            </p>
          </div>
        </div>

        {settingsError && (
          <div className="shipping-inline-error">
            <FiAlertCircle />
            <span>{settingsError}</span>
          </div>
        )}

        {settingsLoading ? (
          <div className="shipping-settings-loading">
            <div className="shipping-spinner" />
            <span>جاري تحميل الإعدادات...</span>
          </div>
        ) : (
          <>
            <div className="shipping-settings-grid">
              {/* SYSTEM */}

              <div className="shipping-setting-box">
                <div className="shipping-setting-info">
                  <div className="shipping-setting-icon">
                    <FiTruck />
                  </div>

                  <div>
                    <strong>نظام الشحن</strong>

                    <span>
                      تفعيل أو تعطيل الشحن في المتجر
                    </span>
                  </div>
                </div>

                <label className="shipping-switch">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(event) =>
                      updateSettings(
                        "enabled",
                        event.target.checked
                      )
                    }
                  />

                  <span />
                </label>
              </div>

              {/* FREE SHIPPING */}

              <div className="shipping-setting-box">
                <div className="shipping-setting-info">
                  <div className="shipping-setting-icon">
                    <FiPackage />
                  </div>

                  <div>
                    <strong>الشحن المجاني</strong>

                    <span>
                      تفعيل الشحن المجاني عند بلوغ الحد الأدنى
                    </span>
                  </div>
                </div>

                <label className="shipping-switch">
                  <input
                    type="checkbox"
                    checked={
                      settings.freeShipping.enabled
                    }
                    onChange={(event) =>
                      updateFreeShipping(
                        "enabled",
                        event.target.checked
                      )
                    }
                  />

                  <span />
                </label>
              </div>

              {/* MINIMUM */}

              <div className="shipping-setting-field">
                <label>
                  الحد الأدنى للشحن المجاني
                </label>

                <div className="shipping-input-with-suffix">
                  <input
                    type="number"
                    min="0"
                    value={
                      settings.freeShipping.minimumOrder
                    }
                    disabled={
                      !settings.freeShipping.enabled
                    }
                    onChange={(event) =>
                      updateFreeShipping(
                        "minimumOrder",
                        event.target.value
                      )
                    }
                  />

                  <span>{settings.currency}</span>
                </div>
              </div>

              {/* CURRENCY */}

              <div className="shipping-setting-field">
                <label>العملة</label>

                <input
                  type="text"
                  maxLength={10}
                  value={settings.currency}
                  onChange={(event) =>
                    updateSettings(
                      "currency",
                      event.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>

            <div className="shipping-settings-footer">
              <div className="shipping-free-preview">
                {settings.freeShipping.enabled ? (
                  <>
                    <FiCheckCircle />

                    <span>
                      الشحن مجاني للطلبات التي تبلغ{" "}
                      <strong>
                        {Number(
                          settings.freeShipping
                            .minimumOrder || 0
                        ).toFixed(2)}{" "}
                        {settings.currency}
                      </strong>{" "}
                      أو أكثر.
                    </span>
                  </>
                ) : (
                  <>
                    <FiXCircle />

                    <span>
                      الشحن المجاني غير مفعل حالياً.
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                className="shipping-save-settings-btn"
                onClick={handleSaveSettings}
                disabled={savingSettings}
              >
                {savingSettings ? (
                  <>
                    <span className="shipping-btn-spinner" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FiSave />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </section>

      {/* ======================================================
          STATS
      ====================================================== */}

      <section className="shipping-stats-grid">
        <div className="shipping-stat-card">
          <div className="shipping-stat-icon">
            <FiTruck />
          </div>

          <div>
            <span>إجمالي الطرق</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="shipping-stat-card">
          <div className="shipping-stat-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>الطرق المفعلة</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="shipping-stat-card">
          <div className="shipping-stat-icon">
            <FiPackage />
          </div>

          <div>
            <span>تدعم الشحن المجاني</span>
            <strong>{stats.freeEligible}</strong>
          </div>
        </div>

        <div className="shipping-stat-card">
          <div className="shipping-stat-icon">
            <FiTrash2 />
          </div>

          <div>
            <span>المحذوفة</span>
            <strong>{stats.deleted}</strong>
          </div>
        </div>
      </section>

      {/* ======================================================
          METHODS CARD
      ====================================================== */}

      <section className="shipping-methods-card">
        <div className="shipping-methods-header">
          <div>
            <h2>طرق الشحن</h2>

            <p>
              إدارة طرق التوصيل المتاحة للعملاء
            </p>
          </div>

          <button
            type="button"
            className="shipping-secondary-btn"
            onClick={openCreateModal}
          >
            <FiPlus />
            إضافة طريقة
          </button>
        </div>

        {/* FILTERS */}

        <div className="shipping-filters">
          <div className="shipping-search">
            <FiSearch />

            <input
              type="search"
              placeholder="ابحث بالاسم أو الكود أو الوصف..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <select
            value={enabledFilter}
            onChange={(event) =>
              setEnabledFilter(event.target.value)
            }
          >
            <option value="all">
              كل الحالات
            </option>

            <option value="true">
              مفعلة فقط
            </option>

            <option value="false">
              معطلة فقط
            </option>
          </select>

          <select
            value={deletedFilter}
            onChange={(event) => {
              setDeletedFilter(event.target.value);

              setShowDeleted(
                event.target.value === "true"
              );
            }}
          >
            <option value="false">
              الحالية
            </option>

            <option value="true">
              المحذوفة
            </option>
          </select>
        </div>

        {/* ERROR */}

        {error && (
          <div className="shipping-main-error">
            <FiAlertCircle />

            <div>
              <strong>تعذر تحميل البيانات</strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadMethods}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* TABLE */}

        <div className="shipping-table-wrapper">
          {loading ? (
            <div className="shipping-table-loading">
              <div className="shipping-spinner" />
              <span>
                جاري تحميل طرق الشحن...
              </span>
            </div>
          ) : methods.length === 0 ? (
            <div className="shipping-empty">
              <div className="shipping-empty-icon">
                <FiTruck />
              </div>

              <h3>
                {search
                  ? "لم يتم العثور على نتائج"
                  : showDeleted
                  ? "لا توجد طرق شحن محذوفة"
                  : "لا توجد طرق شحن"}
              </h3>

              <p>
                {search
                  ? "جرب استخدام كلمات بحث مختلفة."
                  : "ابدأ بإضافة أول طريقة شحن إلى متجرك."}
              </p>

              {!search && !showDeleted && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="shipping-primary-btn"
                >
                  <FiPlus />
                  إضافة طريقة شحن
                </button>
              )}
            </div>
          ) : (
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>طريقة الشحن</th>
                  <th>السعر</th>
                  <th>مدة التوصيل</th>
                  <th>الشحن المجاني</th>
                  <th>الحالة</th>
                  <th>الترتيب</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {methods.map((method) => (
                  <tr key={method._id}>
                    {/* METHOD */}

                    <td>
                      <div className="shipping-method-name">
                        <div className="shipping-method-icon">
                          <FiTruck />
                        </div>

                        <div>
                          <strong>
                            {method.name}
                          </strong>

                          <span>
                            {method.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}

                    <td>
                      <div className="shipping-price">
                        <FiDollarSign />

                        <span>
                          {formatPrice(
                            method.price,
                            method.currency
                          )}
                        </span>
                      </div>
                    </td>

                    {/* DELIVERY */}

                    <td>
                      <div className="shipping-delivery">
                        <FiClock />

                        <span>
                          {getDeliveryText(method)}
                        </span>
                      </div>
                    </td>

                    {/* FREE SHIPPING */}

                    <td>
                      {method.freeShippingEligible ? (
                        <span className="shipping-badge shipping-badge-free">
                          <FiCheckCircle />
                          مؤهل
                        </span>
                      ) : (
                        <span className="shipping-badge shipping-badge-muted">
                          غير مؤهل
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td>
                      {method.enabled ? (
                        <span className="shipping-badge shipping-badge-active">
                          <span className="shipping-status-dot" />
                          مفعلة
                        </span>
                      ) : (
                        <span className="shipping-badge shipping-badge-disabled">
                          <span className="shipping-status-dot" />
                          معطلة
                        </span>
                      )}
                    </td>

                    {/* ORDER */}

                    <td>
                      <span className="shipping-sort-order">
                        {method.sortOrder}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="shipping-actions">
                        {!method.isDeleted ? (
                          <>
                            <button
                              type="button"
                              className="shipping-action-btn shipping-action-edit"
                              title="تعديل"
                              onClick={() =>
                                openEditModal(method)
                              }
                              disabled={
                                actionId === method._id
                              }
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              type="button"
                              className={`shipping-action-btn ${
                                method.enabled
                                  ? "shipping-action-disable"
                                  : "shipping-action-enable"
                              }`}
                              title={
                                method.enabled
                                  ? "تعطيل"
                                  : "تفعيل"
                              }
                              onClick={() =>
                                handleToggle(method)
                              }
                              disabled={
                                actionId === method._id
                              }
                            >
                              {method.enabled ? (
                                <FiXCircle />
                              ) : (
                                <FiCheckCircle />
                              )}
                            </button>

                            <button
                              type="button"
                              className="shipping-action-btn shipping-action-delete"
                              title="حذف"
                              onClick={() =>
                                handleDelete(method)
                              }
                              disabled={
                                actionId === method._id
                              }
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="shipping-action-btn shipping-action-restore"
                            title="استعادة"
                            onClick={() =>
                              handleRestore(method)
                            }
                            disabled={
                              actionId === method._id
                            }
                          >
                            <FiRotateCcw />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}

        {!loading &&
          methods.length > 0 &&
          pagination.pages > 1 && (
            <div className="shipping-pagination">
              <div>
                عرض{" "}
                <strong>
                  {methods.length}
                </strong>{" "}
                من أصل{" "}
                <strong>
                  {pagination.total}
                </strong>
              </div>

              <div className="shipping-pagination-controls">
                <button
                  type="button"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    setPage((previous) =>
                      Math.max(previous - 1, 1)
                    )
                  }
                >
                  <FiChevronRight />
                </button>

                <span>
                  الصفحة{" "}
                  <strong>
                    {pagination.page}
                  </strong>{" "}
                  من{" "}
                  <strong>
                    {pagination.pages}
                  </strong>
                </span>

                <button
                  type="button"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    setPage((previous) =>
                      previous + 1
                    )
                  }
                >
                  <FiChevronLeft />
                </button>
              </div>
            </div>
          )}
      </section>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {modalOpen && (
        <div
          className="shipping-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="shipping-modal">
            <div className="shipping-modal-header">
              <div>
                <div className="shipping-modal-icon">
                  <FiTruck />
                </div>

                <div>
                  <h2>
                    {editingMethod
                      ? "تعديل طريقة الشحن"
                      : "إضافة طريقة شحن"}
                  </h2>

                  <p>
                    أدخل بيانات طريقة التوصيل
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                <FiX />
              </button>
            </div>

            <form
              className="shipping-form"
              onSubmit={handleSaveMethod}
            >
              {formError && (
                <div className="shipping-form-error">
                  <FiAlertCircle />

                  <span>{formError}</span>
                </div>
              )}

              {/* BASIC */}

              <div className="shipping-form-section">
                <div className="shipping-form-section-title">
                  <span>المعلومات الأساسية</span>
                </div>

                <div className="shipping-form-grid">
                  <div className="shipping-form-group">
                    <label>
                      اسم طريقة الشحن
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      placeholder="مثال: التوصيل العادي"
                      onChange={(event) =>
                        updateForm(
                          "name",
                          event.target.value
                        )
                      }
                      maxLength={100}
                    />
                  </div>

                  <div className="shipping-form-group">
                    <label>
                      الكود
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      value={form.code}
                      placeholder="standard_shipping"
                      onChange={(event) =>
                        updateForm(
                          "code",
                          event.target.value
                            .toLowerCase()
                        )
                      }
                      maxLength={50}
                      disabled={Boolean(editingMethod)}
                    />

                    <small>
                      أحرف إنجليزية وأرقام و - أو _
                    </small>
                  </div>

                  <div className="shipping-form-group shipping-form-full">
                    <label>الوصف</label>

                    <textarea
                      value={form.description}
                      placeholder="وصف مختصر لطريقة الشحن..."
                      onChange={(event) =>
                        updateForm(
                          "description",
                          event.target.value
                        )
                      }
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div className="shipping-form-section">
                <div className="shipping-form-section-title">
                  <span>السعر والتوصيل</span>
                </div>

                <div className="shipping-form-grid">
                  <div className="shipping-form-group">
                    <label>
                      سعر الشحن
                      <span>*</span>
                    </label>

                    <div className="shipping-form-input-suffix">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(event) =>
                          updateForm(
                            "price",
                            event.target.value
                          )
                        }
                      />

                      <span>
                        {form.currency || "MAD"}
                      </span>
                    </div>
                  </div>

                  <div className="shipping-form-group">
                    <label>العملة</label>

                    <input
                      type="text"
                      maxLength={10}
                      value={form.currency}
                      onChange={(event) =>
                        updateForm(
                          "currency",
                          event.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>

                  <div className="shipping-form-group">
                    <label>
                      الحد الأدنى للتوصيل
                      <span>*</span>
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.delivery.min}
                      onChange={(event) =>
                        updateDelivery(
                          "min",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="shipping-form-group">
                    <label>
                      الحد الأقصى للتوصيل
                      <span>*</span>
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.delivery.max}
                      onChange={(event) =>
                        updateDelivery(
                          "max",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="shipping-form-group">
                    <label>وحدة الوقت</label>

                    <select
                      value={form.delivery.unit}
                      onChange={(event) =>
                        updateDelivery(
                          "unit",
                          event.target.value
                        )
                      }
                    >
                      <option value="hours">
                        ساعات
                      </option>

                      <option value="days">
                        أيام
                      </option>

                      <option value="weeks">
                        أسابيع
                      </option>
                    </select>
                  </div>

                  <div className="shipping-form-group">
                    <label>ترتيب الظهور</label>

                    <input
                      type="number"
                      min="0"
                      value={form.sortOrder}
                      onChange={(event) =>
                        updateForm(
                          "sortOrder",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="shipping-form-section">
                <div className="shipping-form-section-title">
                  <span>الخيارات</span>
                </div>

                <div className="shipping-options">
                  <label className="shipping-option">
                    <div>
                      <strong>
                        السماح بالشحن المجاني
                      </strong>

                      <span>
                        يمكن استخدام هذه الطريقة عندما يصل
                        الطلب إلى الحد الأدنى للشحن المجاني.
                      </span>
                    </div>

                    <span className="shipping-switch">
                      <input
                        type="checkbox"
                        checked={
                          form.freeShippingEligible
                        }
                        onChange={(event) =>
                          updateForm(
                            "freeShippingEligible",
                            event.target.checked
                          )
                        }
                      />

                      <span />
                    </span>
                  </label>

                  <label className="shipping-option">
                    <div>
                      <strong>
                        تفعيل طريقة الشحن
                      </strong>

                      <span>
                        الطريقة ستكون متاحة للعملاء في Checkout.
                      </span>
                    </div>

                    <span className="shipping-switch">
                      <input
                        type="checkbox"
                        checked={form.enabled}
                        onChange={(event) =>
                          updateForm(
                            "enabled",
                            event.target.checked
                          )
                        }
                      />

                      <span />
                    </span>
                  </label>
                </div>
              </div>

              {/* FOOTER */}

              <div className="shipping-modal-footer">
                <button
                  type="button"
                  className="shipping-modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="shipping-modal-save"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="shipping-btn-spinner" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FiSave />

                      {editingMethod
                        ? "حفظ التعديلات"
                        : "إنشاء طريقة الشحن"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
      
      <style>
{`

/* ============================================================
   BASE
============================================================ */

.admin-shipping,
.admin-shipping *,
.admin-shipping *::before,
.admin-shipping *::after {
  box-sizing: border-box;
}

.admin-shipping {
  width: 100%;
  min-height: 100vh;

  display: flex;

  color: #0f172a;

  background: #f6f8fc;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


/* ============================================================
   PAGE
============================================================ */

.shipping-page {
  width: calc(100% - 270px);
  min-width: 0;
  min-height: 100vh;

  margin-left: 270px;
 



  color: #1f2937;
}

.main {
 padding: 0 34px 34px;
 }


/* ============================================================
   HEADER
============================================================ */

.shipping-header {
  width: 100%;

  padding: 28px 0 24px;

  margin-bottom: 0;
}

.shipping-header-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 24px;
}

.shipping-title-wrapper {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 15px;
}

.shipping-title-icon {
  width: 52px;
  height: 52px;

  flex: 0 0 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: #eef8f1;
  color: #2e7d32;

  font-size: 24px;
}

.shipping-title-wrapper > div {
  min-width: 0;
}

.shipping-title-wrapper h1 {
  margin: 0;

  color: #17251a;

  font-size: 27px;
  line-height: 1.3;
  font-weight: 800;

  letter-spacing: -0.025em;
}

.shipping-title-wrapper p {
  margin: 5px 0 0;

  color: #7b857d;

  font-size: 14px;
  line-height: 1.5;
}

.shipping-primary-btn,
.shipping-secondary-btn,
.shipping-save-settings-btn,
.shipping-modal-save {
  border: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  cursor: pointer;

  font-family: inherit;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.shipping-primary-btn {
  min-height: 44px;

  padding: 0 18px;

  flex-shrink: 0;

  border-radius: 11px;

  background: #2e7d32;
  color: #fff;

  font-size: 14px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(46, 125, 50, 0.16);
}

.shipping-primary-btn:hover {
  background: #256b29;

  transform: translateY(-1px);

  box-shadow: 0 7px 18px rgba(46, 125, 50, 0.2);
}

.shipping-primary-btn:active {
  transform: translateY(0);
}

.shipping-primary-btn:disabled {
  opacity: 0.65;

  cursor: not-allowed;

  transform: none;

  box-shadow: none;
}


/* ============================================================
   SETTINGS CARD
============================================================ */

.shipping-settings-card,
.shipping-methods-card {
  width: 100%;

  background: #fff;

  border: 1px solid #e7ece8;

  border-radius: 17px;

  box-shadow: 0 5px 24px rgba(24, 39, 27, 0.045);
}

.shipping-settings-card {
  margin-bottom: 22px;

  padding: 24px;
}

.shipping-card-heading {
  display: flex;
  align-items: center;

  gap: 13px;

  margin-bottom: 23px;
}

.shipping-card-heading-icon {
  width: 42px;
  height: 42px;

  flex: 0 0 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #f1f7f2;
  color: #2e7d32;

  font-size: 19px;
}

.shipping-card-heading > div {
  min-width: 0;
}

.shipping-card-heading h2,
.shipping-methods-header h2 {
  margin: 0;

  color: #202a22;

  font-size: 18px;
  line-height: 1.35;
  font-weight: 800;
}

.shipping-card-heading p,
.shipping-methods-header p {
  margin: 4px 0 0;

  color: #89918b;

  font-size: 13px;
  line-height: 1.5;
}


/* ============================================================
   SETTINGS GRID
============================================================ */

.shipping-settings-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 14px;
}

.shipping-setting-box {
  min-height: 91px;

  padding: 15px;

  border: 1px solid #e9eeea;

  border-radius: 13px;

  background: #fbfcfb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.shipping-setting-box:hover {
  border-color: #dfe8e1;

  background: #ffffff;

  box-shadow: 0 4px 14px rgba(24, 39, 27, 0.035);
}

.shipping-setting-info {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 11px;
}

.shipping-setting-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eef6ef;
  color: #2e7d32;
}

.shipping-setting-info > div {
  min-width: 0;
}

.shipping-setting-info strong {
  display: block;

  margin-bottom: 4px;

  color: #273229;

  font-size: 13px;
  line-height: 1.3;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shipping-setting-info span {
  display: block;

  color: #89928b;

  font-size: 11px;

  line-height: 1.5;
}


/* ============================================================
   SETTING FIELD
============================================================ */

.shipping-setting-field {
  min-width: 0;

  padding: 15px;

  border: 1px solid #e9eeea;

  border-radius: 13px;

  background: #fbfcfb;
}

.shipping-setting-field label {
  display: block;

  margin-bottom: 9px;

  color: #303b33;

  font-size: 12px;
  font-weight: 700;
}

.shipping-setting-field input {
  width: 100%;
  height: 40px;

  padding: 0 11px;

  border: 1px solid #dfe6e1;

  border-radius: 9px;

  background: #fff;
  color: #273129;

  outline: none;

  font-family: inherit;
  font-size: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.shipping-setting-field input:focus {
  border-color: #5ba360;

  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.09);
}

.shipping-input-with-suffix {
  position: relative;

  display: flex;
  align-items: center;
}

.shipping-input-with-suffix input {
  padding-left: 57px;
}

.shipping-input-with-suffix span {
  position: absolute;

  left: 11px;

  color: #7e897f;

  font-size: 11px;
  font-weight: 700;
}

.shipping-input-with-suffix input:disabled {
  background: #f1f3f2;
  color: #a1a9a3;

  cursor: not-allowed;
}


/* ============================================================
   SWITCH
============================================================ */

.shipping-switch {
  position: relative;

  width: 43px;
  height: 24px;

  flex: 0 0 43px;

  display: inline-flex;

  cursor: pointer;
}

.shipping-switch input {
  position: absolute;

  width: 1px;
  height: 1px;

  opacity: 0;

  pointer-events: none;
}

.shipping-switch > span {
  position: absolute;

  inset: 0;

  border-radius: 999px;

  background: #d8ded9;

  transition: background 0.2s ease;
}

.shipping-switch > span::after {
  content: "";

  position: absolute;

  width: 18px;
  height: 18px;

  top: 3px;
  right: 3px;

  border-radius: 50%;

  background: #fff;

  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.14);

  transition: transform 0.2s ease;
}

.shipping-switch input:checked + span {
  background: #4caf50;
}

.shipping-switch input:checked + span::after {
  transform: translateX(-19px);
}


/* ============================================================
   SETTINGS FOOTER
============================================================ */

.shipping-settings-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-top: 17px;
  padding-top: 17px;

  border-top: 1px solid #edf0ed;
}

.shipping-free-preview {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 8px;

  color: #657068;

  font-size: 12px;
  line-height: 1.5;
}

.shipping-free-preview svg {
  flex-shrink: 0;

  color: #3d9144;
}

.shipping-free-preview strong {
  color: #273229;
}

.shipping-save-settings-btn {
  min-height: 40px;

  flex-shrink: 0;

  padding: 0 15px;

  border-radius: 9px;

  background: #edf7ee;
  color: #2e7d32;

  font-size: 12px;
  font-weight: 700;
}

.shipping-save-settings-btn:hover {
  background: #e0f0e2;
}

.shipping-save-settings-btn:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}


/* ============================================================
   STATS
============================================================ */

.shipping-stats-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 14px;

  margin-bottom: 22px;
}

.shipping-stat-card {
  min-width: 0;

  padding: 17px;

  border: 1px solid #e7ece8;

  border-radius: 14px;

  background: #fff;

  display: flex;
  align-items: center;

  gap: 13px;

  box-shadow:
    0 4px 18px rgba(24, 39, 27, 0.035);
}

.shipping-stat-icon {
  width: 42px;
  height: 42px;

  flex: 0 0 42px;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f0f7f1;
  color: #2e7d32;

  font-size: 18px;
}

.shipping-stat-card > div {
  min-width: 0;
}

.shipping-stat-card span {
  display: block;

  margin-bottom: 4px;

  color: #8a938c;

  font-size: 11px;
}

.shipping-stat-card strong {
  display: block;

  color: #253027;

  font-size: 21px;
  line-height: 1.2;
  font-weight: 800;

  white-space: nowrap;
}


/* ============================================================
   METHODS
============================================================ */

.shipping-methods-card {
  overflow: hidden;
}

.shipping-methods-header {
  min-width: 0;

  padding: 22px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.shipping-methods-header > div {
  min-width: 0;
}

.shipping-secondary-btn {
  min-height: 38px;

  flex-shrink: 0;

  padding: 0 14px;

  border: 1px solid #dce7de;

  border-radius: 9px;

  background: #f7faf7;
  color: #2e7d32;

  font-size: 12px;
  font-weight: 700;
}

.shipping-secondary-btn:hover {
  background: #edf6ee;

  border-color: #cfe0d1;
}


/* ============================================================
   FILTERS
============================================================ */

.shipping-filters {
  display: grid;

  grid-template-columns:
    minmax(260px, 1fr)
    170px
    170px;

  gap: 10px;

  padding: 0 24px 18px;
}

.shipping-search {
  position: relative;

  height: 42px;

  display: flex;
  align-items: center;
}

.shipping-search > svg {
  position: absolute;

  right: 12px;

  color: #9aa39d;

  pointer-events: none;
}

.shipping-search input {
  width: 100%;
  height: 100%;

  padding: 0 38px;

  border: 1px solid #e0e6e1;

  border-radius: 10px;

  outline: none;

  background: #fff;
  color: #29332c;

  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.shipping-search input:focus {
  border-color: #65a969;

  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.08);
}

.shipping-search button {
  position: absolute;

  left: 8px;

  width: 26px;
  height: 26px;

  padding: 0;

  border: none;

  background: transparent;
  color: #8b958e;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.shipping-filters select {
  width: 100%;
  height: 42px;

  padding: 0 11px;

  border: 1px solid #e0e6e1;

  border-radius: 10px;

  background: #fff;
  color: #4c574f;

  outline: none;

  font-family: inherit;
  font-size: 12px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.shipping-filters select:focus {
  border-color: #65a969;

  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.08);
}


/* ============================================================
   TABLE
============================================================ */

.shipping-table-wrapper {
  width: 100%;

  overflow-x: auto;
  overflow-y: hidden;

  border-top: 1px solid #edf0ed;

  scrollbar-width: thin;
}

.shipping-table {
  width: 100%;

  min-width: 940px;

  border-collapse: collapse;
}

.shipping-table thead {
  background: #fafcfb;
}

.shipping-table th {
  padding: 13px 18px;

  text-align: right;

  color: #858f87;

  font-size: 10px;
  font-weight: 800;

  white-space: nowrap;

  border-bottom: 1px solid #edf0ed;
}

.shipping-table td {
  padding: 15px 18px;

  border-bottom: 1px solid #f0f2f0;

  vertical-align: middle;

  color: #465148;

  font-size: 12px;
}

.shipping-table tbody tr {
  transition: background 0.15s ease;
}

.shipping-table tbody tr:hover {
  background: #fcfdfc;
}

.shipping-table tbody tr:last-child td {
  border-bottom: none;
}


/* ============================================================
   METHOD NAME
============================================================ */

.shipping-method-name {
  min-width: 190px;

  display: flex;
  align-items: center;

  gap: 11px;
}

.shipping-method-icon {
  width: 39px;
  height: 39px;

  flex: 0 0 39px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f0f7f1;
  color: #2e7d32;

  font-size: 17px;
}

.shipping-method-name > div {
  min-width: 0;
}

.shipping-method-name strong {
  display: block;

  margin-bottom: 4px;

  color: #263128;

  font-size: 12px;
  font-weight: 800;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shipping-method-name span {
  display: block;

  color: #969f98;

  font-size: 10px;

  direction: ltr;
  text-align: right;

  white-space: nowrap;
}


/* ============================================================
   PRICE
============================================================ */

.shipping-price {
  display: flex;
  align-items: center;

  gap: 5px;

  white-space: nowrap;
}

.shipping-price svg {
  color: #8b968e;

  font-size: 13px;
}

.shipping-price span {
  color: #344037;

  font-weight: 700;
}


/* ============================================================
   DELIVERY
============================================================ */

.shipping-delivery {
  display: flex;
  align-items: center;

  gap: 6px;

  white-space: nowrap;
}

.shipping-delivery svg {
  color: #849088;

  font-size: 13px;
}


/* ============================================================
   BADGES
============================================================ */

.shipping-badge {
  min-height: 26px;

  padding: 0 9px;

  display: inline-flex;
  align-items: center;

  gap: 5px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;

  white-space: nowrap;
}

.shipping-badge-free {
  background: #edf8ee;
  color: #2f8036;
}

.shipping-badge-muted {
  background: #f2f3f2;
  color: #8a928c;
}

.shipping-badge-active {
  background: #edf8ee;
  color: #2f8036;
}

.shipping-badge-disabled {
  background: #f5f3f1;
  color: #8c8179;
}

.shipping-status-dot {
  width: 6px;
  height: 6px;

  flex: 0 0 6px;

  border-radius: 50%;

  background: currentColor;
}

.shipping-sort-order {
  min-width: 28px;
  height: 28px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #f5f7f5;
  color: #657067;

  font-size: 11px;
  font-weight: 700;
}


/* ============================================================
   ACTIONS
============================================================ */

.shipping-actions {
  display: flex;
  align-items: center;

  gap: 6px;
}

.shipping-action-btn {
  width: 31px;
  height: 31px;

  padding: 0;

  border: 1px solid #e5e9e6;

  border-radius: 8px;

  background: #fff;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.shipping-action-btn:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

.shipping-action-edit {
  color: #55715b;
}

.shipping-action-edit:hover {
  background: #f0f6f1;
  border-color: #cfe0d1;
}

.shipping-action-enable {
  color: #2e7d32;
}

.shipping-action-enable:hover {
  background: #edf8ee;
  border-color: #c8e3ca;
}

.shipping-action-disable {
  color: #9a7a3c;
}

.shipping-action-disable:hover {
  background: #fbf6e9;
  border-color: #eadbb7;
}

.shipping-action-delete {
  color: #b45d5d;
}

.shipping-action-delete:hover {
  background: #fff2f2;
  border-color: #eccaca;
}

.shipping-action-restore {
  color: #397b87;
}

.shipping-action-restore:hover {
  background: #edf8fa;
  border-color: #c5e3e7;
}


/* ============================================================
   PAGINATION
============================================================ */

.shipping-pagination {
  min-height: 62px;

  padding: 12px 24px;

  border-top: 1px solid #edf0ed;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  color: #89928c;

  font-size: 11px;
}

.shipping-pagination strong {
  color: #3e4a41;
}

.shipping-pagination-controls {
  display: flex;
  align-items: center;

  gap: 10px;
}

.shipping-pagination-controls button {
  width: 32px;
  height: 32px;

  padding: 0;

  border: 1px solid #e2e7e3;

  border-radius: 8px;

  background: #fff;
  color: #506057;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.shipping-pagination-controls button:hover:not(:disabled) {
  background: #f2f7f3;
  color: #2e7d32;
}

.shipping-pagination-controls button:disabled {
  opacity: 0.4;

  cursor: not-allowed;
}

.shipping-pagination-controls span {
  min-width: 95px;

  text-align: center;
}


/* ============================================================
   EMPTY / LOADING
============================================================ */

.shipping-table-loading,
.shipping-settings-loading {
  min-height: 250px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: 11px;

  color: #89928c;

  font-size: 12px;
}

.shipping-settings-loading {
  min-height: 160px;
}

.shipping-spinner,
.shipping-btn-spinner {
  border: 2px solid #dfe9e1;

  border-top-color: #4caf50;

  border-radius: 50%;

  animation:
    shipping-spin 0.75s linear infinite;
}

.shipping-spinner {
  width: 30px;
  height: 30px;
}

.shipping-btn-spinner {
  width: 14px;
  height: 14px;
}

@keyframes shipping-spin {
  to {
    transform: rotate(360deg);
  }
}

.shipping-empty {
  min-height: 320px;

  padding: 35px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  text-align: center;
}

.shipping-empty-icon {
  width: 65px;
  height: 65px;

  margin-bottom: 14px;

  border-radius: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f0f7f1;
  color: #4b9850;

  font-size: 27px;
}

.shipping-empty h3 {
  margin: 0 0 6px;

  color: #364139;

  font-size: 15px;
}

.shipping-empty p {
  margin: 0 0 17px;

  color: #929b94;

  font-size: 12px;

  line-height: 1.5;
}


/* ============================================================
   ERRORS
============================================================ */

.shipping-inline-error,
.shipping-main-error,
.shipping-form-error {
  display: flex;
  align-items: center;

  gap: 9px;

  border-radius: 10px;

  color: #9b5252;

  background: #fff5f5;

  border: 1px solid #f0d6d6;

  font-size: 12px;
}

.shipping-inline-error {
  padding: 11px 13px;

  margin-bottom: 15px;
}

.shipping-main-error {
  margin: 0 24px 18px;

  padding: 12px 14px;
}

.shipping-main-error > svg {
  flex-shrink: 0;
}

.shipping-main-error div {
  min-width: 0;

  flex: 1;
}

.shipping-main-error strong,
.shipping-main-error span {
  display: block;
}

.shipping-main-error strong {
  margin-bottom: 3px;
}

.shipping-main-error span {
  color: #aa7777;

  font-size: 11px;

  line-height: 1.5;
}

.shipping-main-error button {
  flex-shrink: 0;

  border: none;

  background: #fff;

  color: #9b5252;

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  cursor: pointer;
}


/* ============================================================
   MODAL
============================================================ */

.shipping-modal-overlay {
  position: fixed;

  z-index: 9999;

  inset: 0;

  padding: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(20, 29, 23, 0.46);

  backdrop-filter: blur(4px);
}

.shipping-modal {
  width: min(720px, 100%);

  max-height: calc(100vh - 50px);

  overflow-x: hidden;
  overflow-y: auto;

  border-radius: 17px;

  background: #fff;

  box-shadow:
    0 25px 70px rgba(18, 31, 22, 0.2);

  animation:
    shipping-modal-in 0.2s ease;
}

@keyframes shipping-modal-in {
  from {
    opacity: 0;

    transform:
      translateY(10px)
      scale(0.99);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}

.shipping-modal-header {
  padding: 20px 22px;

  border-bottom: 1px solid #edf0ed;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.shipping-modal-header > div {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 12px;
}

.shipping-modal-icon {
  width: 43px;
  height: 43px;

  flex: 0 0 43px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #edf7ee;
  color: #2e7d32;

  font-size: 19px;
}

.shipping-modal-header h2 {
  margin: 0;

  color: #263129;

  font-size: 17px;
  font-weight: 800;
}

.shipping-modal-header p {
  margin: 4px 0 0;

  color: #8b948e;

  font-size: 11px;
}

.shipping-modal-header > button {
  width: 34px;
  height: 34px;

  flex: 0 0 34px;

  border: none;

  border-radius: 9px;

  background: #f5f6f5;
  color: #6d776f;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: background 0.2s ease;
}

.shipping-modal-header > button:hover {
  background: #ecefed;
}

.shipping-form {
  padding: 22px;
}

.shipping-form-section {
  margin-bottom: 22px;
}

.shipping-form-section:last-of-type {
  margin-bottom: 0;
}

.shipping-form-section-title {
  margin-bottom: 13px;

  color: #3b463e;

  font-size: 12px;
  font-weight: 800;
}

.shipping-form-section-title span {
  position: relative;

  padding-right: 10px;
}

.shipping-form-section-title span::before {
  content: "";

  position: absolute;

  right: 0;
  top: 2px;

  width: 3px;
  height: 13px;

  border-radius: 4px;

  background: #4caf50;
}

.shipping-form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 14px;
}

.shipping-form-group {
  min-width: 0;
}

.shipping-form-full {
  grid-column: 1 / -1;
}

.shipping-form-group label {
  display: block;

  margin-bottom: 7px;

  color: #475149;

  font-size: 11px;
  font-weight: 700;
}

.shipping-form-group label span {
  color: #d05e5e;

  margin-right: 3px;
}

.shipping-form-group input,
.shipping-form-group textarea,
.shipping-form-group select {
  width: 100%;

  border: 1px solid #dfe5e0;

  border-radius: 9px;

  background: #fff;
  color: #303a32;

  outline: none;

  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.shipping-form-group input,
.shipping-form-group select {
  height: 41px;

  padding: 0 11px;
}

.shipping-form-group textarea {
  min-height: 80px;

  padding: 10px 11px;

  resize: vertical;

  line-height: 1.6;
}

.shipping-form-group input:focus,
.shipping-form-group textarea:focus,
.shipping-form-group select:focus {
  border-color: #66a96a;

  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.08);
}

.shipping-form-group input:disabled {
  background: #f2f4f2;

  color: #929a94;

  cursor: not-allowed;
}

.shipping-form-group small {
  display: block;

  margin-top: 5px;

  color: #9ba39d;

  font-size: 9px;

  line-height: 1.5;
}


/* ============================================================
   FORM PRICE
============================================================ */

.shipping-form-input-suffix {
  position: relative;
}

.shipping-form-input-suffix input {
  padding-left: 60px;
}

.shipping-form-input-suffix span {
  position: absolute;

  left: 11px;
  top: 50%;

  transform: translateY(-50%);

  color: #879089;

  font-size: 10px;
  font-weight: 700;
}


/* ============================================================
   OPTIONS
============================================================ */

.shipping-options {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.shipping-option {
  padding: 14px;

  border: 1px solid #e7ece8;

  border-radius: 11px;

  background: #fbfcfb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.shipping-option:hover {
  border-color: #d6e4d8;

  background: #fff;
}

.shipping-option > div {
  min-width: 0;
}

.shipping-option strong {
  display: block;

  margin-bottom: 4px;

  color: #39443c;

  font-size: 11px;
}

.shipping-option div span {
  display: block;

  color: #929b94;

  font-size: 10px;

  line-height: 1.5;
}


/* ============================================================
   MODAL ERROR
============================================================ */

.shipping-form-error {
  margin-bottom: 18px;

  padding: 11px 13px;
}


/* ============================================================
   MODAL FOOTER
============================================================ */

.shipping-modal-footer {
  margin-top: 24px;

  padding-top: 17px;

  border-top: 1px solid #edf0ed;

  display: flex;
  justify-content: flex-start;

  gap: 9px;
}

.shipping-modal-cancel,
.shipping-modal-save {
  min-height: 41px;

  padding: 0 17px;

  border-radius: 9px;

  font-family: inherit;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.shipping-modal-cancel {
  border: 1px solid #e1e6e2;

  background: #fff;
  color: #68736b;
}

.shipping-modal-cancel:hover {
  background: #f7f8f7;
}

.shipping-modal-save {
  border: none;

  background: #2e7d32;
  color: #fff;

  box-shadow:
    0 5px 14px rgba(46, 125, 50, 0.14);
}

.shipping-modal-save:hover {
  background: #276c2b;
}

.shipping-modal-cancel:disabled,
.shipping-modal-save:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ============================================================
   TOAST
============================================================ */

.shipping-toast {
  position: fixed;

  z-index: 10000;

  top: 22px;
  left: 22px;

  min-width: 280px;
  max-width: 420px;

  padding: 12px 14px;

  border-radius: 11px;

  display: flex;
  align-items: center;

  gap: 9px;

  box-shadow:
    0 10px 35px rgba(21, 32, 24, 0.15);

  animation:
    shipping-toast-in 0.25s ease;

  font-size: 12px;
}

@keyframes shipping-toast-in {
  from {
    opacity: 0;

    transform:
      translateY(-8px);
  }

  to {
    opacity: 1;

    transform:
      translateY(0);
  }
}

.shipping-toast-success {
  color: #286c30;

  background: #f0f9f1;

  border: 1px solid #d1e9d3;
}

.shipping-toast-error {
  color: #9a5151;

  background: #fff5f5;

  border: 1px solid #f0d5d5;
}

.shipping-toast > svg {
  flex-shrink: 0;
}

.shipping-toast span {
  min-width: 0;

  flex: 1;

  line-height: 1.5;
}

.shipping-toast button {
  width: 25px;
  height: 25px;

  flex: 0 0 25px;

  padding: 0;

  border: none;

  background: transparent;

  color: inherit;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}


/* ============================================================
   RESPONSIVE — TABLET
============================================================ */

@media (max-width: 1200px) {
  .shipping-settings-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .shipping-stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .shipping-filters {
    grid-template-columns:
      minmax(220px, 1fr)
      150px
      150px;
  }
}


/* ============================================================
   RESPONSIVE — SMALL LAPTOP / TABLET
============================================================ */

@media (max-width: 900px) {
  .shipping-page {
    width: 100%;

    margin-left: 0;

    padding:
      0 24px 28px;
  }

  .shipping-header {
    padding:
      24px 0 20px;
  }

  .shipping-header-content {
    gap: 18px;
  }

  .shipping-title-wrapper h1 {
    font-size: 24px;
  }

  .shipping-title-wrapper p {
    font-size: 13px;
  }

  .shipping-filters {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(140px, 160px);

    padding:
      0 20px 18px;
  }

  .shipping-search {
    grid-column: 1 / -1;
  }
}


/* ============================================================
   RESPONSIVE — MOBILE
============================================================ */

@media (max-width: 650px) {
  .shipping-page {
    padding:
      0 14px 20px;
  }

  .shipping-header {
    padding:
      18px 0 17px;
  }

  .shipping-header-content {
    align-items: stretch;

    flex-direction: column;

    gap: 16px;
  }

  .shipping-title-wrapper {
    align-items: flex-start;

    gap: 11px;
  }

  .shipping-title-icon {
    width: 45px;
    height: 45px;

    flex-basis: 45px;

    border-radius: 12px;

    font-size: 20px;
  }

  .shipping-title-wrapper h1 {
    font-size: 21px;
  }

  .shipping-title-wrapper p {
    margin-top: 4px;

    font-size: 12px;

    line-height: 1.55;
  }

  .shipping-primary-btn {
    width: 100%;

    min-height: 42px;
  }

  .shipping-settings-card {
    padding: 17px;

    border-radius: 15px;
  }

  .shipping-card-heading {
    align-items: flex-start;

    margin-bottom: 18px;
  }

  .shipping-card-heading-icon {
    width: 39px;
    height: 39px;

    flex-basis: 39px;
  }

  .shipping-card-heading h2,
  .shipping-methods-header h2 {
    font-size: 16px;
  }

  .shipping-card-heading p,
  .shipping-methods-header p {
    font-size: 11px;
  }

  .shipping-settings-grid {
    grid-template-columns: 1fr;

    gap: 10px;
  }

  .shipping-setting-box {
    min-height: auto;

    padding: 13px;
  }

  .shipping-setting-field {
    padding: 13px;
  }

  .shipping-settings-footer {
    align-items: stretch;

    flex-direction: column;

    gap: 12px;
  }

  .shipping-free-preview {
    align-items: flex-start;
  }

  .shipping-save-settings-btn {
    width: 100%;
  }

  .shipping-stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 9px;
  }

  .shipping-stat-card {
    padding: 13px;

    gap: 10px;

    border-radius: 12px;
  }

  .shipping-stat-icon {
    width: 36px;
    height: 36px;

    flex-basis: 36px;

    font-size: 16px;
  }

  .shipping-stat-card span {
    font-size: 10px;
  }

  .shipping-stat-card strong {
    font-size: 18px;
  }

  .shipping-methods-header {
    padding: 17px;

    align-items: flex-start;

    flex-direction: column;

    gap: 13px;
  }

  .shipping-secondary-btn {
    width: 100%;
  }

  .shipping-filters {
    grid-template-columns: 1fr;

    gap: 9px;

    padding:
      0 17px 17px;
  }

  .shipping-search {
    grid-column: auto;
  }

  .shipping-main-error {
    margin-right: 17px;
    margin-left: 17px;
  }

  .shipping-pagination {
    min-height: auto;

    align-items: flex-start;

    flex-direction: column;

    padding:
      14px 17px;

    gap: 12px;
  }

  .shipping-pagination-controls {
    width: 100%;

    justify-content: space-between;
  }

  .shipping-pagination-controls span {
    min-width: auto;
  }

  .shipping-modal-overlay {
    padding: 10px;

    align-items: flex-end;
  }

  .shipping-modal {
    width: 100%;

    max-height:
      calc(100vh - 20px);

    border-radius:
      16px 16px 0 0;
  }

  .shipping-modal-header {
    padding: 17px;
  }

  .shipping-form {
    padding: 17px;
  }

  .shipping-form-grid {
    grid-template-columns: 1fr;
  }

  .shipping-form-full {
    grid-column: auto;
  }

  .shipping-modal-footer {
    position: sticky;

    bottom: 0;

    margin-left: -17px;
    margin-right: -17px;
    margin-bottom: -17px;

    padding:
      13px 17px;

    background: #fff;
  }

  .shipping-modal-cancel,
  .shipping-modal-save {
    flex: 1;
  }

  .shipping-toast {
    top: 10px;
    left: 10px;
    right: 10px;

    min-width: 0;
    max-width: none;
  }
}


/* ============================================================
   RESPONSIVE — SMALL MOBILE
============================================================ */

@media (max-width: 420px) {
  .shipping-stats-grid {
    grid-template-columns: 1fr;
  }

  .shipping-setting-box {
    min-height: auto;
  }

  .shipping-title-wrapper {
    gap: 9px;
  }

  .shipping-title-wrapper h1 {
    font-size: 20px;
  }

  .shipping-title-wrapper p {
    font-size: 11px;
  }

  .shipping-primary-btn {
    min-height: 42px;
  }

  .shipping-table th {
    padding:
      12px 14px;
  }

  .shipping-table td {
    padding:
      14px;
  }

  .shipping-modal-header h2 {
    font-size: 16px;
  }
}


/* ============================================================
   VERY SMALL DEVICES
============================================================ */

@media (max-width: 360px) {
  .shipping-page {
    padding:
      0 10px 16px;
  }

  .shipping-title-icon {
    width: 42px;
    height: 42px;

    flex-basis: 42px;
  }

  .shipping-title-wrapper h1 {
    font-size: 18px;
  }

  .shipping-title-wrapper p {
    font-size: 10px;
  }

  .shipping-settings-card {
    padding: 14px;
  }

  .shipping-methods-header {
    padding: 14px;
  }

  .shipping-filters {
    padding:
      0 14px 14px;
  }

  .shipping-main-error {
    margin-right: 14px;
    margin-left: 14px;
  }

  .shipping-stat-card {
    padding: 12px;
  }
}

`}
</style>
      
    </div>

    </div>

    
  );
}