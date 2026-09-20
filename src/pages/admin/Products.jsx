import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiAlertCircle,
  FiArchive,
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit3,
  FiEye,
  FiFilter,
  FiGrid,
  FiImage,
  FiMoreVertical,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTrash2,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
 import API_BASE from "../../config/api";

 

const PAGE_SIZE = 8;

const formatPrice = (value, currency = "MAD") => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
};

const getProductImage = (product) => {
  if (product?.thumbnail) {
    return product.thumbnail;
  }

  const primaryImage = product?.images?.find(
    (image) => image?.isPrimary
  );

  if (primaryImage?.url) {
    return primaryImage.url;
  }

  return product?.images?.[0]?.url || "";
};

const getProductPrice = (product) => {
  const pricing = product?.pricing || {};

  if (
    pricing.salePrice !== null &&
    pricing.salePrice !== undefined &&
    Number(pricing.salePrice) < Number(pricing.regularPrice)
  ) {
    return Number(pricing.salePrice);
  }

  return Number(pricing.regularPrice || 0);
};

const getDiscount = (product) => {
  const pricing = product?.pricing || {};

  if (pricing?.discount?.enabled) {
    const value = Number(pricing.discount.value || 0);

    if (pricing.discount.type === "percentage") {
      return value;
    }

    const regular = Number(pricing.regularPrice || 0);

    if (regular > 0) {
      return Math.round((value / regular) * 100);
    }
  }

  const regular = Number(pricing.regularPrice || 0);
  const sale = Number(pricing.salePrice || 0);

  if (regular > 0 && sale > 0 && sale < regular) {
    return Math.round(((regular - sale) / regular) * 100);
  }

  return 0;
};

const getInventoryStatus = (product) => {
  const inventory = product?.inventory || {};
  const quantity = Number(inventory.quantity || 0);

  if (
    inventory.status === "out_of_stock" ||
    quantity <= 0
  ) {
    return "out_of_stock";
  }

  if (
    inventory.status === "low_stock" ||
    quantity <= Number(inventory.lowStockThreshold || 5)
  ) {
    return "low_stock";
  }

  return "in_stock";
};

const inventoryLabel = {
  in_stock: "متوفر",
  low_stock: "مخزون منخفض",
  out_of_stock: "نفد المخزون",
};

const getCategoryName = (product) => {
  return (
    product?.category?.name ||
    product?.category?.id ||
    "بدون فئة"
  );
};

const getProductStatus = (product) => {
  if (product?.isDeleted) {
    return {
      label: "محذوف",
      type: "deleted",
    };
  }

  if (product?.status?.archived) {
    return {
      label: "مؤرشف",
      type: "archived",
    };
  }

  if (!product?.status?.active) {
    return {
      label: "غير نشط",
      type: "inactive",
    };
  }

  if (!product?.status?.published) {
    return {
      label: "مسودة",
      type: "draft",
    };
  }

  return {
    label: "منشور",
    type: "published",
  };
};

const getBadgeLabel = (product) => {
  if (!product?.badge?.enabled) {
    return null;
  }

  if (product.badge.text) {
    return product.badge.text;
  }

  const labels = {
    new: "جديد",
    sale: "تخفيض",
    bestseller: "الأكثر مبيعاً",
    out_of_stock: "نفد المخزون",
  };

  return labels[product?.badge?.type] || null;
};

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventoryFilter, setInventoryFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showDeleted, setShowDeleted] = useState(false);

  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);

  const [deleteModal, setDeleteModal] = useState(null);
  const [restoreModal, setRestoreModal] = useState(null);

  const [actionLoading, setActionLoading] = useState(null);

  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        /*
         * We fetch normal and soft-deleted products separately.
         * This allows the admin page to display both without
         * changing the public storefront behavior.
         */

        const [activeResponse, deletedResponse] =
          await Promise.all([
            axios.get(`${API_BASE}/api/products`, {
              params: {
                deleted: "false",
                limit: 1000,
              },
              withCredentials: true,
            }),

            axios.get(`${API_BASE}/api/products`, {
              params: {
                deleted: "true",
                limit: 1000,
              },
              withCredentials: true,
            }),
          ]);

        const activeData = activeResponse?.data;
        const deletedData = deletedResponse?.data;

        const activeProducts = Array.isArray(activeData)
          ? activeData
          : activeData?.products || [];

        const deletedProducts = Array.isArray(deletedData)
          ? deletedData
          : deletedData?.products || [];

        const merged = [
          ...activeProducts,
          ...deletedProducts,
        ];

        const uniqueProducts = Array.from(
          new Map(
            merged.map((product) => [
              product?._id,
              product,
            ])
          ).values()
        );

        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Products fetch error:", err);

        setError(
          err?.response?.data?.message ||
            "تعذر تحميل المنتجات. حاول مرة أخرى."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // =========================================================
  // NOTICE
  // =========================================================

  const showNotice = (type, message) => {
    setNotice({
      type,
      message,
    });

    window.setTimeout(() => {
      setNotice({
        type: "",
        message: "",
      });
    }, 3500);
  };

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      const id =
        product?.category?.id ||
        product?.category?.slug ||
        product?.category?.name;

      const name =
        product?.category?.name ||
        product?.category?.id ||
        "بدون فئة";

      if (id) {
        map.set(id, name);
      }
    });

    return Array.from(map.entries()).sort((a, b) =>
      String(a[1]).localeCompare(String(b[1]), "ar")
    );
  }, [products]);

  // =========================================================
  // FILTER + SEARCH + SORT
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((product) => {
        const values = [
          product?.name,
          product?.sku,
          product?.brand,
          product?.slug,
          product?.category?.name,
          product?.category?.id,
          product?.subcategory?.name,
        ];

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (categoryFilter !== "all") {
      result = result.filter((product) => {
        return (
          product?.category?.id === categoryFilter ||
          product?.category?.slug === categoryFilter ||
          product?.category?.name === categoryFilter
        );
      });
    }

    if (inventoryFilter !== "all") {
      result = result.filter(
        (product) =>
          getInventoryStatus(product) ===
          inventoryFilter
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (product) =>
          getProductStatus(product).type ===
          statusFilter
      );
    }

    if (showDeleted) {
      result = result.filter(
        (product) => product?.isDeleted === true
      );
    } else {
      result = result.filter(
        (product) => product?.isDeleted !== true
      );
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a?.createdAt || 0) -
          new Date(b?.createdAt || 0)
        );
      }

      if (sortBy === "price_high") {
        return getProductPrice(b) - getProductPrice(a);
      }

      if (sortBy === "price_low") {
        return getProductPrice(a) - getProductPrice(b);
      }

      if (sortBy === "stock_low") {
        return (
          Number(a?.inventory?.quantity || 0) -
          Number(b?.inventory?.quantity || 0)
        );
      }

      if (sortBy === "stock_high") {
        return (
          Number(b?.inventory?.quantity || 0) -
          Number(a?.inventory?.quantity || 0)
        );
      }

      if (sortBy === "sales") {
        return (
          Number(b?.sales?.unitsSold || 0) -
          Number(a?.sales?.unitsSold || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    products,
    search,
    categoryFilter,
    inventoryFilter,
    statusFilter,
    showDeleted,
    sortBy,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredProducts.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    categoryFilter,
    inventoryFilter,
    statusFilter,
    showDeleted,
    sortBy,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    const active = products.filter(
      (product) => !product?.isDeleted
    );

    const deleted = products.filter(
      (product) => product?.isDeleted
    );

    const published = active.filter(
      (product) =>
        product?.status?.active &&
        product?.status?.published
    );

    const lowStock = active.filter(
      (product) =>
        getInventoryStatus(product) === "low_stock"
    );

    const outOfStock = active.filter(
      (product) =>
        getInventoryStatus(product) === "out_of_stock"
    );

    const featured = active.filter(
      (product) => product?.status?.featured
    );

    const totalUnitsSold = active.reduce(
      (sum, product) =>
        sum + Number(product?.sales?.unitsSold || 0),
      0
    );

    return {
      total: active.length,
      published: published.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      deleted: deleted.length,
      featured: featured.length,
      totalUnitsSold,
    };
  }, [products]);

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setInventoryFilter("all");
    setStatusFilter("all");
    setShowDeleted(false);
    setSortBy("newest");
    setPage(1);
  };

  const hasFilters =
    search ||
    categoryFilter !== "all" ||
    inventoryFilter !== "all" ||
    statusFilter !== "all" ||
    showDeleted ||
    sortBy !== "newest";

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (product) => {
    if (!product?._id) return;

    try {
      setActionLoading(product._id);

      await axios.delete(
        `${API_BASE}/api/products/${product._id}`,
        {
          withCredentials: true,
        }
      );

      setProducts((current) =>
        current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                isDeleted: true,
                status: {
                  ...item.status,
                  active: false,
                  published: false,
                  archived: true,
                },
              }
            : item
        )
      );

      setDeleteModal(null);
      setOpenMenu(null);

      showNotice(
        "success",
        "تم حذف المنتج بنجاح. يمكنك استعادته لاحقًا."
      );
    } catch (err) {
      console.error("Delete product error:", err);

      showNotice(
        "error",
        err?.response?.data?.message ||
          "تعذر حذف المنتج."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // RESTORE
  // =========================================================

  const handleRestore = async (product) => {
    if (!product?._id) return;

    try {
      setActionLoading(product._id);

      const response = await axios.patch(
        `${API_BASE}/api/products/${product._id}/restore`,
        {},
        {
          withCredentials: true,
        }
      );

      const restored =
        response?.data?.product ||
        response?.data ||
        null;

      setProducts((current) =>
        current.map((item) =>
          item._id === product._id
            ? restored && restored._id
              ? restored
              : {
                  ...item,
                  isDeleted: false,
                  status: {
                    ...item.status,
                    archived: false,
                  },
                }
            : item
        )
      );

      setRestoreModal(null);
      setOpenMenu(null);

      showNotice(
        "success",
        "تمت استعادة المنتج بنجاح."
      );
    } catch (err) {
      console.error("Restore product error:", err);

      showNotice(
        "error",
        err?.response?.data?.message ||
          "تعذر استعادة المنتج."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (product) => {
    setOpenMenu(null);

    /*
     * The AddProduct page can use the `edit` query parameter
     * to load the selected product.
     */
    navigate(
      `/admin/products/add?edit=${encodeURIComponent(
        product._id
      )}`
    );
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (product) => {
    setOpenMenu(null);

    /*
     * Public product page.
     * Change this path later if your storefront uses
     * another product URL.
     */
    if (product?.slug) {
      window.open(
        `/products/${product.slug}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    window.open(
      `/products/${product?._id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // CLOSE MENU ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleClick = () => {
      setOpenMenu(null);
    };

    if (openMenu) {
      document.addEventListener(
        "click",
        handleClick
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );
    };
  }, [openMenu]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading">
          <div className="products-loading-spinner" />

          <h3>جاري تحميل المنتجات</h3>

          <p>
            نجهز قائمة المنتجات الخاصة بك...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="products-page"
      dir="rtl"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="products-header">
        <div className="products-header-content">
          <div className="products-title-area">
            <div className="products-eyebrow">
              <FiPackage />
              PRODUCT MANAGEMENT
            </div>

            <h1>المنتجات</h1>

            <p>
              إدارة المنتجات والأسعار والمخزون والحالة
              من مكان واحد.
            </p>
          </div>

          <div className="products-header-actions">
            <button
              type="button"
              className="products-refresh-btn"
              onClick={() => fetchProducts(true)}
              disabled={refreshing}
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "products-spin"
                    : ""
                }
              />

              {refreshing
                ? "جاري التحديث..."
                : "تحديث"}
            </button>

            <button
              type="button"
              className="products-add-btn"
              onClick={() =>
                navigate("/admin/products/add")
              }
            >
              <FiPlus />
              إضافة منتج
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          NOTICE
      ===================================================== */}

      {notice.message && (
        <div
          className={`products-notice ${notice.type}`}
        >
          {notice.type === "success" ? (
            <FiCheck />
          ) : (
            <FiAlertCircle />
          )}

          <span>{notice.message}</span>

          <button
            type="button"
            onClick={() =>
              setNotice({
                type: "",
                message: "",
              })
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="products-error">
          <div className="products-error-icon">
            <FiAlertCircle />
          </div>

          <div>
            <strong>حدث خطأ</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchProducts(true)}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="products-main">
        {/* =================================================
            STATS
        ================================================= */}

        <section className="products-stats">
          <div className="product-stat-card">
            <div className="product-stat-icon purple">
              <FiPackage />
            </div>

            <div className="product-stat-content">
              <span>إجمالي المنتجات</span>
              <strong>{stats.total}</strong>
              <small>منتج نشط في النظام</small>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon green">
              <FiCheck />
            </div>

            <div className="product-stat-content">
              <span>المنتجات المنشورة</span>
              <strong>{stats.published}</strong>
              <small>متاحة في المتجر</small>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon orange">
              <FiClock />
            </div>

            <div className="product-stat-content">
              <span>مخزون منخفض</span>
              <strong>{stats.lowStock}</strong>
              <small>
                تحتاج إلى المتابعة
              </small>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon red">
              <FiArchive />
            </div>

            <div className="product-stat-content">
              <span>نفد المخزون</span>
              <strong>{stats.outOfStock}</strong>
              <small>
                منتجات غير متوفرة
              </small>
            </div>
          </div>

          <div className="product-stat-card">
            <div className="product-stat-icon blue">
              <FiTrendingUp />
            </div>

            <div className="product-stat-content">
              <span>الوحدات المباعة</span>
              <strong>
                {stats.totalUnitsSold}
              </strong>
              <small>
                إجمالي المبيعات
              </small>
            </div>
          </div>
        </section>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <section className="products-toolbar-card">
          <div className="products-toolbar-top">
            <div className="products-search">
              <FiSearch />

              <input
                type="text"
                placeholder="ابحث باسم المنتج، SKU، العلامة التجارية..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="products-search-clear"
                  onClick={() => setSearch("")}
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="products-toolbar-title">
              <FiFilter />
              <span>الفلاتر</span>
            </div>
          </div>

          <div className="products-filters">
            {/* CATEGORY */}

            <div className="products-filter">
              <label>الفئة</label>

              <div className="products-select-wrap">
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    جميع الفئات
                  </option>

                  {categories.map(
                    ([id, name]) => (
                      <option
                        key={id}
                        value={id}
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>

                <FiChevronDown />
              </div>
            </div>

            {/* INVENTORY */}

            <div className="products-filter">
              <label>المخزون</label>

              <div className="products-select-wrap">
                <select
                  value={inventoryFilter}
                  onChange={(event) =>
                    setInventoryFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    كل الحالات
                  </option>

                  <option value="in_stock">
                    متوفر
                  </option>

                  <option value="low_stock">
                    مخزون منخفض
                  </option>

                  <option value="out_of_stock">
                    نفد المخزون
                  </option>
                </select>

                <FiChevronDown />
              </div>
            </div>

            {/* STATUS */}

            <div className="products-filter">
              <label>حالة المنتج</label>

              <div className="products-select-wrap">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    كل الحالات
                  </option>

                  <option value="published">
                    منشور
                  </option>

                  <option value="draft">
                    مسودة
                  </option>

                  <option value="inactive">
                    غير نشط
                  </option>

                  <option value="archived">
                    مؤرشف
                  </option>

                  <option value="deleted">
                    محذوف
                  </option>
                </select>

                <FiChevronDown />
              </div>
            </div>

            {/* SORT */}

            <div className="products-filter">
              <label>ترتيب حسب</label>

              <div className="products-select-wrap">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                >
                  <option value="newest">
                    الأحدث
                  </option>

                  <option value="oldest">
                    الأقدم
                  </option>

                  <option value="price_high">
                    السعر: الأعلى
                  </option>

                  <option value="price_low">
                    السعر: الأقل
                  </option>

                  <option value="stock_low">
                    المخزون: الأقل
                  </option>

                  <option value="stock_high">
                    المخزون: الأعلى
                  </option>

                  <option value="sales">
                    الأكثر مبيعاً
                  </option>
                </select>

                <FiChevronDown />
              </div>
            </div>

            {/* DELETED TOGGLE */}

            <label className="products-deleted-toggle">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(event) =>
                  setShowDeleted(
                    event.target.checked
                  )
                }
              />

              <span className="products-toggle-ui">
                <span />
              </span>

              <span>
                عرض المحذوفة
              </span>
            </label>

            {hasFilters && (
              <button
                type="button"
                className="products-reset-btn"
                onClick={resetFilters}
              >
                <FiRotateCcw />
                إعادة ضبط
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div className="products-results-header">
          <div>
            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              {showDeleted
                ? " منتج محذوف"
                : " منتج"}
            </span>
          </div>

          <div className="products-results-meta">
            عرض{" "}
            {filteredProducts.length === 0
              ? 0
              : (page - 1) * PAGE_SIZE + 1}
            {" - "}
            {Math.min(
              page * PAGE_SIZE,
              filteredProducts.length
            )}{" "}
            من {filteredProducts.length}
          </div>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredProducts.length === 0 ? (
          <section className="products-empty">
            <div className="products-empty-icon">
              <FiShoppingBag />
            </div>

            <h2>
              {showDeleted
                ? "لا توجد منتجات محذوفة"
                : "لا توجد منتجات مطابقة"}
            </h2>

            <p>
              {search ||
              categoryFilter !== "all" ||
              inventoryFilter !== "all" ||
              statusFilter !== "all"
                ? "جرّب تغيير البحث أو الفلاتر للحصول على نتائج أخرى."
                : "ابدأ بإضافة أول منتج إلى متجرك."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
              >
                <FiRotateCcw />
                إزالة الفلاتر
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/products/add"
                  )
                }
              >
                <FiPlus />
                إضافة أول منتج
              </button>
            )}
          </section>
        ) : (
          <>
            {/* =================================================
                PRODUCTS TABLE
            ================================================= */}

            <section className="products-table-card">
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th className="product-column">
                        المنتج
                      </th>

                      <th>SKU</th>

                      <th>الفئة</th>

                      <th>السعر</th>

                      <th>المخزون</th>

                      <th>المبيعات</th>

                      <th>الحالة</th>

                      <th className="actions-column">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleProducts.map(
                      (product) => {
                        const image =
                          getProductImage(
                            product
                          );

                        const price =
                          getProductPrice(
                            product
                          );

                        const regularPrice =
                          Number(
                            product?.pricing
                              ?.regularPrice || 0
                          );

                        const discount =
                          getDiscount(product);

                        const inventoryStatus =
                          getInventoryStatus(
                            product
                          );

                        const productStatus =
                          getProductStatus(
                            product
                          );

                        const badge =
                          getBadgeLabel(
                            product
                          );

                        const quantity =
                          Number(
                            product?.inventory
                              ?.quantity || 0
                          );

                        const unitsSold =
                          Number(
                            product?.sales
                              ?.unitsSold || 0
                          );

                        const isMenuOpen =
                          openMenu ===
                          product._id;

                        const isDeleting =
                          actionLoading ===
                            product._id &&
                          deleteModal?._id ===
                            product._id;

                        const isRestoring =
                          actionLoading ===
                            product._id &&
                          restoreModal?._id ===
                            product._id;

                        return (
                          <tr
                            key={
                              product._id
                            }
                            className={
                              product?.isDeleted
                                ? "is-deleted-row"
                                : ""
                            }
                          >
                            {/* PRODUCT */}

                            <td className="product-main-cell">
                              <div className="product-table-product">
                                <div className="product-table-image">
                                  {image ? (
                                    <img
                                      src={
                                        image
                                      }
                                      alt={
                                        product
                                          ?.name ||
                                        "Product"
                                      }
                                      onError={(
                                        event
                                      ) => {
                                        event.currentTarget.style.display =
                                          "none";
                                      }}
                                    />
                                  ) : (
                                    <FiImage />
                                  )}

                                  {badge && (
                                    <span className="product-mini-badge">
                                      {badge}
                                    </span>
                                  )}
                                </div>

                                <div className="product-table-info">
                                  <strong>
                                    {
                                      product?.name
                                    }
                                  </strong>

                                  <span>
                                    {product?.brand ||
                                      "بدون علامة تجارية"}
                                  </span>

                                  {product
                                    ?.shortDescription && (
                                    <small>
                                      {
                                        product.shortDescription
                                      }
                                    </small>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* SKU */}

                            <td>
                              <span className="product-sku">
                                {product?.sku ||
                                  "—"}
                              </span>
                            </td>

                            {/* CATEGORY */}

                            <td>
                              <div className="product-category-cell">
                                <span>
                                  {
                                    getCategoryName(
                                      product
                                    )
                                  }
                                </span>

                                {product
                                  ?.subcategory
                                  ?.name && (
                                  <small>
                                    {
                                      product
                                        .subcategory
                                        .name
                                    }
                                  </small>
                                )}
                              </div>
                            </td>

                            {/* PRICE */}

                            <td>
                              <div className="product-price-cell">
                                <strong>
                                  {formatPrice(
                                    price,
                                    product
                                      ?.pricing
                                      ?.currency ||
                                      "MAD"
                                  )}
                                </strong>

                                {regularPrice >
                                  price && (
                                  <span>
                                    {formatPrice(
                                      regularPrice,
                                      product
                                        ?.pricing
                                        ?.currency ||
                                        "MAD"
                                    )}
                                  </span>
                                )}

                                {discount > 0 && (
                                  <em>
                                    -{discount}%
                                  </em>
                                )}
                              </div>
                            </td>

                            {/* INVENTORY */}

                            <td>
                              <div className="product-stock-cell">
                                <strong>
                                  {quantity}
                                </strong>

                                <span
                                  className={`stock-status ${inventoryStatus}`}
                                >
                                  {
                                    inventoryLabel[
                                      inventoryStatus
                                    ]
                                  }
                                </span>
                              </div>
                            </td>

                            {/* SALES */}

                            <td>
                              <div className="product-sales-cell">
                                <strong>
                                  {unitsSold}
                                </strong>

                                <span>
                                  وحدة مباعة
                                </span>
                              </div>
                            </td>

                            {/* STATUS */}

                            <td>
                              <div className="product-status-cell">
                                <span
                                  className={`product-status ${productStatus.type}`}
                                >
                                  <i />
                                  {
                                    productStatus.label
                                  }
                                </span>

                                {product
                                  ?.status
                                  ?.featured &&
                                  !product
                                    ?.isDeleted && (
                                    <span className="featured-mini">
                                      <FiStar />
                                      مميز
                                    </span>
                                  )}
                              </div>
                            </td>

                            {/* ACTIONS */}

                            <td>
                              <div
                                className="product-actions"
                                onClick={(
                                  event
                                ) =>
                                  event.stopPropagation()
                                }
                              >
                                <button
                                  type="button"
                                  className="product-action-main"
                                  onClick={() =>
                                    product?.isDeleted
                                      ? setRestoreModal(
                                          product
                                        )
                                      : handleEdit(
                                          product
                                        )
                                  }
                                  title={
                                    product?.isDeleted
                                      ? "استعادة"
                                      : "تعديل"
                                  }
                                >
                                  {product?.isDeleted ? (
                                    <FiRotateCcw />
                                  ) : (
                                    <FiEdit3 />
                                  )}
                                </button>

                                <div className="product-menu-wrap">
                                  <button
                                    type="button"
                                    className={`product-more-btn ${
                                      isMenuOpen
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={(
                                      event
                                    ) => {
                                      event.stopPropagation();

                                      setOpenMenu(
                                        isMenuOpen
                                          ? null
                                          : product._id
                                      );
                                    }}
                                    title="المزيد"
                                  >
                                    <FiMoreVertical />
                                  </button>

                                  {isMenuOpen && (
                                    <div
                                      className="product-dropdown"
                                      onClick={(
                                        event
                                      ) =>
                                        event.stopPropagation()
                                      }
                                    >
                                      {!product?.isDeleted && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleView(
                                                product
                                              )
                                            }
                                          >
                                            <FiEye />
                                            عرض المنتج
                                          </button>
                                          <button
                                       type="button"
  onClick={() =>
    handleEdit(product)
  }
>
  <FiEdit3 />
  تعديل المنتج
</button>
                                         

                                         

                                          <div className="product-dropdown-divider" />

                                          <button
                                            type="button"
                                            className="danger"
                                            onClick={() => {
                                              setOpenMenu(
                                                null
                                              );
                                              setDeleteModal(
                                                product
                                              );
                                            }}
                                          >
                                            <FiTrash2 />
                                            حذف المنتج
                                          </button>
                                        </>
                                      )}

                                      {product?.isDeleted && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenMenu(
                                              null
                                            );
                                            setRestoreModal(
                                              product
                                            );
                                          }}
                                        >
                                          <FiRotateCcw />
                                          استعادة المنتج
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                >
                  <FiChevronRight />
                  السابق
                </button>

                <div className="products-page-numbers">
                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1
                  )
                    .filter((pageNumber) => {
                      if (
                        totalPages <= 7
                      ) {
                        return true;
                      }

                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages
                      ) {
                        return true;
                      }

                      return (
                        pageNumber >=
                          page - 1 &&
                        pageNumber <=
                          page + 1
                      );
                    })
                    .map(
                      (
                        pageNumber,
                        index,
                        array
                      ) => {
                        const previous =
                          array[index - 1];

                        const needsDots =
                          previous &&
                          pageNumber -
                            previous >
                            1;

                        return (
                          <span
                            key={
                              pageNumber
                            }
                            className="pagination-group"
                          >
                            {needsDots && (
                              <span className="pagination-dots">
                                ...
                              </span>
                            )}

                            <button
                              type="button"
                              className={
                                page ===
                                pageNumber
                                  ? "active"
                                  : ""
                              }
                              onClick={() =>
                                setPage(
                                  pageNumber
                                )
                              }
                            >
                              {
                                pageNumber
                              }
                            </button>
                          </span>
                        );
                      }
                    )}
                </div>

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                >
                  التالي
                  <FiChevronLeft />
                </button>
              </div>
            )}
          </>
        )}

        {/* =====================================================
            FOOTER INFO
        ===================================================== */}

        <div className="products-page-footer">
          <div>
            <FiGrid />
            <span>
              {stats.total} منتجات نشطة
            </span>
          </div>

          {stats.featured > 0 && (
            <div>
              <FiStar />
              <span>
                {stats.featured} منتجات مميزة
              </span>
            </div>
          )}

          {stats.deleted > 0 && (
            <div>
              <FiTrash2 />
              <span>
                {stats.deleted} محذوفة
              </span>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteModal && (
        <div
          className="products-modal-overlay"
          onClick={() =>
            !actionLoading &&
            setDeleteModal(null)
          }
        >
          <div
            className="products-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="confirm-modal-icon delete">
              <FiTrash2 />
            </div>

            <h2>حذف المنتج؟</h2>

            <p>
              هل أنت متأكد من حذف{" "}
              <strong>
                {deleteModal.name}
              </strong>
              ؟
            </p>

            <span className="confirm-modal-note">
              سيتم إخفاء المنتج من المتجر، لكن لن يتم
              حذفه نهائيًا من قاعدة البيانات ويمكن
              استعادته لاحقًا.
            </span>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="confirm-cancel"
                disabled={!!actionLoading}
                onClick={() =>
                  setDeleteModal(null)
                }
              >
                إلغاء
              </button>

              <button
                type="button"
                className="confirm-delete"
                disabled={!!actionLoading}
                onClick={() =>
                  handleDelete(deleteModal)
                }
              >
                {isActionLoadingFor(
                  actionLoading,
                  deleteModal._id
                ) ? (
                  <>
                    <span className="button-spinner" />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    حذف المنتج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESTORE MODAL
      ===================================================== */}

      {restoreModal && (
        <div
          className="products-modal-overlay"
          onClick={() =>
            !actionLoading &&
            setRestoreModal(null)
          }
        >
          <div
            className="products-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="confirm-modal-icon restore">
              <FiRotateCcw />
            </div>

            <h2>استعادة المنتج؟</h2>

            <p>
              هل تريد استعادة{" "}
              <strong>
                {restoreModal.name}
              </strong>
              ؟
            </p>

            <span className="confirm-modal-note">
              ستتم إزالة حالة الحذف عن المنتج. يمكنك
              بعد ذلك التحكم في نشره وحالته من صفحة
              التعديل.
            </span>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="confirm-cancel"
                disabled={!!actionLoading}
                onClick={() =>
                  setRestoreModal(null)
                }
              >
                إلغاء
              </button>

              <button
                type="button"
                className="confirm-restore"
                disabled={!!actionLoading}
                onClick={() =>
                  handleRestore(
                    restoreModal
                  )
                }
              >
                {isActionLoadingFor(
                  actionLoading,
                  restoreModal._id
                ) ? (
                  <>
                    <span className="button-spinner" />
                    جاري الاستعادة...
                  </>
                ) : (
                  <>
                    <FiRotateCcw />
                    استعادة المنتج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        /* =========================================================
   PRODUCTS PAGE
========================================================= */

.products-page {
  min-height: 100vh;
  background: #f6f7fb;
  color: #172033;
  font-family:
    Inter,
    "Segoe UI",
    Tahoma,
    Arial,
    sans-serif;
  padding-bottom: 50px;
}

/* =========================================================
   HEADER
========================================================= */

.products-header {
  background: #ffffff;
  border-bottom: 1px solid #e7e9f0;
}

.products-header-content {
  width: min(1500px, calc(100% - 48px));
  margin: 0 auto;
  min-height: 138px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.products-title-area {
  min-width: 0;
}

.products-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #6357df;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.products-eyebrow svg {
  width: 14px;
  height: 14px;
}

.products-title-area h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.products-title-area p {
  margin: 9px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.7;
}

.products-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.products-refresh-btn,
.products-add-btn {
  min-height: 44px;
  border-radius: 11px;
  padding: 0 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.products-refresh-btn {
  color: #4b5563;
  background: #ffffff;
  border: 1px solid #dfe3eb;
}

.products-refresh-btn:hover:not(:disabled) {
  border-color: #c7cbe0;
  background: #fafaff;
  transform: translateY(-1px);
}

.products-refresh-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.products-refresh-btn svg,
.products-add-btn svg {
  width: 17px;
  height: 17px;
}

.products-add-btn {
  color: #ffffff;
  background: #5b4de1;
  border: 1px solid #5b4de1;
  box-shadow:
    0 7px 18px rgba(91, 77, 225, 0.18);
}

.products-add-btn:hover {
  background: #4f43cc;
  border-color: #4f43cc;
  transform: translateY(-1px);
  box-shadow:
    0 9px 22px rgba(91, 77, 225, 0.25);
}

/* =========================================================
   MAIN
========================================================= */

.products-main {
  width: min(1500px, calc(100% - 48px));
  margin: 0 auto;
  padding-top: 26px;
}

/* =========================================================
   STATS
========================================================= */

.products-stats {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.product-stat-card {
  min-height: 126px;
  padding: 19px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #e6e8ef;
  border-radius: 15px;
  box-shadow:
    0 4px 14px rgba(17, 24, 39, 0.035);
}

.product-stat-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-stat-icon svg {
  width: 20px;
  height: 20px;
}

.product-stat-icon.purple {
  color: #5b4de1;
  background: #eeecff;
}

.product-stat-icon.green {
  color: #16865a;
  background: #e6f8f0;
}

.product-stat-icon.orange {
  color: #b76b00;
  background: #fff3df;
}

.product-stat-icon.red {
  color: #c13b4e;
  background: #ffeaee;
}

.product-stat-icon.blue {
  color: #2769b0;
  background: #e7f1ff;
}

.product-stat-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-stat-content > span {
  color: #727989;
  font-size: 12px;
  font-weight: 600;
}

.product-stat-content > strong {
  margin-top: 4px;
  color: #111827;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 800;
}

.product-stat-content > small {
  margin-top: 6px;
  color: #9aa0ad;
  font-size: 11px;
}

/* =========================================================
   TOOLBAR
========================================================= */

.products-toolbar-card {
  margin-bottom: 20px;
  padding: 17px;
  background: #ffffff;
  border: 1px solid #e5e7ef;
  border-radius: 15px;
  box-shadow:
    0 4px 14px rgba(17, 24, 39, 0.03);
}

.products-toolbar-top {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 15px;
}

.products-search {
  height: 46px;
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.products-search > svg {
  position: absolute;
  right: 15px;
  width: 18px;
  height: 18px;
  color: #8d94a3;
  pointer-events: none;
}

.products-search input {
  width: 100%;
  height: 100%;
  padding: 0 45px 0 42px;
  color: #172033;
  background: #fafbfc;
  border: 1px solid #e0e4ec;
  border-radius: 11px;
  outline: none;
  font-size: 13px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.products-search input::placeholder {
  color: #a0a6b2;
}

.products-search input:focus {
  background: #ffffff;
  border-color: #766ae5;
  box-shadow:
    0 0 0 3px rgba(91, 77, 225, 0.09);
}

.products-search-clear {
  position: absolute;
  left: 10px;
  width: 27px;
  height: 27px;
  border: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b92a1;
  background: transparent;
  cursor: pointer;
}

.products-search-clear:hover {
  color: #4b5563;
  background: #eef0f5;
}

.products-search-clear svg {
  width: 15px;
  height: 15px;
}

.products-toolbar-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
}

.products-toolbar-title svg {
  color: #5b4de1;
  width: 17px;
  height: 17px;
}

.products-filters {
  display: flex;
  align-items: flex-end;
  gap: 11px;
  flex-wrap: wrap;
}

.products-filter {
  min-width: 160px;
  flex: 1;
}

.products-filter label {
  display: block;
  margin-bottom: 7px;
  color: #697181;
  font-size: 11px;
  font-weight: 700;
}

.products-select-wrap {
  height: 42px;
  position: relative;
}

.products-select-wrap select {
  width: 100%;
  height: 100%;
  appearance: none;
  padding: 0 13px 0 37px;
  color: #3d4553;
  background: #ffffff;
  border: 1px solid #dfe3eb;
  border-radius: 9px;
  outline: none;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.products-select-wrap select:focus {
  border-color: #7569e2;
  box-shadow:
    0 0 0 3px rgba(91, 77, 225, 0.08);
}

.products-select-wrap > svg {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 15px;
  height: 15px;
  color: #9298a5;
  transform: translateY(-50%);
  pointer-events: none;
}

.products-deleted-toggle {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  color: #626a79;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.products-deleted-toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.products-toggle-ui {
  width: 36px;
  height: 20px;
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  background: #dfe3ea;
  border-radius: 999px;
  transition: background 0.2s ease;
}

.products-toggle-ui span {
  width: 16px;
  height: 16px;
  display: block;
  background: #ffffff;
  border-radius: 50%;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.16);
  transition: transform 0.2s ease;
}

.products-deleted-toggle
  input:checked
  + .products-toggle-ui {
  background: #5b4de1;
}

.products-deleted-toggle
  input:checked
  + .products-toggle-ui
  span {
  transform: translateX(-16px);
}

.products-reset-btn {
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 13px;
  color: #5b4de1;
  background: #f2f0ff;
  border: 1px solid #e5e1ff;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.products-reset-btn:hover {
  background: #eae7ff;
  border-color: #d9d3ff;
}

.products-reset-btn svg {
  width: 14px;
  height: 14px;
}

/* =========================================================
   RESULTS HEADER
========================================================= */

.products-results-header {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.products-results-header > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.products-results-header strong {
  color: #202635;
  font-size: 15px;
  font-weight: 800;
}

.products-results-header span {
  color: #7b8290;
  font-size: 12px;
}

.products-results-meta {
  color: #9399a6;
  font-size: 11px;
}

/* =========================================================
   TABLE
========================================================= */

.products-table-card {
  overflow: visible;
  background: #ffffff;
  border: 1px solid #e4e7ee;
  border-radius: 15px;
  box-shadow:
    0 4px 14px rgba(17, 24, 39, 0.035);
}

.products-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 15px;
}

.products-table {
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;
  text-align: right;
}

.products-table thead {
  background: #fafbfc;
}

.products-table th {
  height: 52px;
  padding: 0 17px;
  color: #777f8e;
  border-bottom: 1px solid #e9ebf0;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.products-table th.product-column {
  width: 29%;
}

.products-table th.actions-column {
  width: 95px;
  text-align: center;
}

.products-table td {
  height: 86px;
  padding: 9px 17px;
  color: #4c5564;
  border-bottom: 1px solid #eef0f4;
  font-size: 12px;
  vertical-align: middle;
}

.products-table tbody tr {
  transition: background 0.18s ease;
}

.products-table tbody tr:hover {
  background: #fcfcff;
}

.products-table tbody tr:last-child td {
  border-bottom: 0;
}

.products-table tbody tr.is-deleted-row {
  background: #fffafb;
}

.products-table tbody tr.is-deleted-row:hover {
  background: #fff6f7;
}

/* =========================================================
   PRODUCT CELL
========================================================= */

.product-table-product {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
}

.product-table-image {
  width: 57px;
  height: 57px;
  flex: 0 0 57px;
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f8;
  border: 1px solid #e7e9ef;
  border-radius: 11px;
}

.product-table-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 10px;
}

.product-table-image > svg {
  width: 21px;
  height: 21px;
  color: #b1b6c1;
}

.product-mini-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  max-width: 74px;
  overflow: hidden;
  padding: 3px 6px;
  color: #ffffff;
  background: #5b4de1;
  border: 2px solid #ffffff;
  border-radius: 6px;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-table-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-table-info strong {
  overflow: hidden;
  color: #202635;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-table-info > span {
  margin-top: 2px;
  color: #8b92a0;
  font-size: 10px;
}

.product-table-info small {
  max-width: 230px;
  overflow: hidden;
  margin-top: 3px;
  color: #a0a5b0;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   SKU
========================================================= */

.product-sku {
  display: inline-flex;
  padding: 6px 8px;
  color: #697181;
  background: #f5f6f9;
  border: 1px solid #eaebf0;
  border-radius: 7px;
  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    monospace;
  font-size: 10px;
  direction: ltr;
}

/* =========================================================
   CATEGORY
========================================================= */

.product-category-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-category-cell span {
  color: #404858;
  font-size: 11px;
  font-weight: 700;
}

.product-category-cell small {
  color: #a0a6b1;
  font-size: 9px;
}

/* =========================================================
   PRICE
========================================================= */

.product-price-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.product-price-cell strong {
  color: #202635;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.product-price-cell > span {
  color: #a2a7b2;
  font-size: 9px;
  text-decoration: line-through;
  white-space: nowrap;
}

.product-price-cell em {
  padding: 2px 5px;
  color: #c13b4e;
  background: #ffedf0;
  border-radius: 4px;
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
}

/* =========================================================
   STOCK
========================================================= */

.product-stock-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.product-stock-cell strong {
  color: #303746;
  font-size: 13px;
  font-weight: 800;
}

.stock-status {
  display: inline-flex;
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 8px;
  font-weight: 800;
  white-space: nowrap;
}

.stock-status.in_stock {
  color: #17754f;
  background: #e8f8f1;
}

.stock-status.low_stock {
  color: #9a5b00;
  background: #fff2dc;
}

.stock-status.out_of_stock {
  color: #b43749;
  background: #ffeaee;
}

/* =========================================================
   SALES
========================================================= */

.product-sales-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-sales-cell strong {
  color: #303746;
  font-size: 13px;
  font-weight: 800;
}

.product-sales-cell span {
  color: #a0a6b1;
  font-size: 9px;
}

/* =========================================================
   STATUS
========================================================= */

.product-status-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.product-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.product-status i {
  width: 5px;
  height: 5px;
  display: block;
  border-radius: 50%;
}

.product-status.published {
  color: #16734d;
  background: #e8f8f1;
}

.product-status.published i {
  background: #20a56f;
}

.product-status.draft {
  color: #8a6200;
  background: #fff5dc;
}

.product-status.draft i {
  background: #e0a51b;
}

.product-status.inactive {
  color: #667080;
  background: #eef0f4;
}

.product-status.inactive i {
  background: #8d95a3;
}

.product-status.archived {
  color: #7457a2;
  background: #f2edfa;
}

.product-status.archived i {
  background: #8c68be;
}

.product-status.deleted {
  color: #b13b4d;
  background: #ffebef;
}

.product-status.deleted i {
  background: #d54f63;
}

.featured-mini {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #a36a00;
  font-size: 8px;
  font-weight: 800;
}

.featured-mini svg {
  width: 11px;
  height: 11px;
}

/* =========================================================
   ACTIONS
========================================================= */

.product-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.product-action-main,
.product-more-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.product-action-main {
  color: #5b4de1;
  background: #f2f0ff;
  border: 1px solid #e5e1ff;
}

.product-action-main:hover {
  color: #4f43ca;
  background: #e9e6ff;
  border-color: #d9d3ff;
  transform: translateY(-1px);
}

.product-more-btn {
  color: #727988;
  background: #ffffff;
  border: 1px solid #e0e3e9;
}

.product-more-btn:hover,
.product-more-btn.active {
  color: #4f5664;
  background: #f4f5f8;
  border-color: #d7dbe3;
}

.product-action-main svg,
.product-more-btn svg {
  width: 16px;
  height: 16px;
}

.product-menu-wrap {
  position: relative;
}

.product-dropdown {
  min-width: 175px;
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  z-index: 100;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #e3e6ed;
  border-radius: 10px;
  box-shadow:
    0 14px 35px rgba(15, 23, 42, 0.12);
  animation: productDropdownIn 0.15s ease;
}

@keyframes productDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-dropdown button {
  width: 100%;
  min-height: 37px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  color: #4c5564;
  background: transparent;
  border: 0;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  text-align: right;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.product-dropdown button:hover {
  color: #4f43ce;
  background: #f4f2ff;
}

.product-dropdown button.danger {
  color: #c13b4e;
}

.product-dropdown button.danger:hover {
  color: #b12f43;
  background: #fff0f2;
}

.product-dropdown button svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.product-dropdown-divider {
  height: 1px;
  margin: 5px 3px;
  background: #eceef2;
}

/* =========================================================
   EMPTY
========================================================= */

.products-empty {
  min-height: 330px;
  padding: 50px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e4e7ee;
  border-radius: 15px;
}

.products-empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6559df;
  background: #f0eeff;
  border-radius: 17px;
}

.products-empty-icon svg {
  width: 27px;
  height: 27px;
}

.products-empty h2 {
  margin: 0;
  color: #222938;
  font-size: 18px;
  font-weight: 800;
}

.products-empty p {
  max-width: 460px;
  margin: 8px 0 20px;
  color: #858c99;
  font-size: 12px;
  line-height: 1.8;
}

.products-empty button {
  min-height: 41px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 15px;
  color: #ffffff;
  background: #5b4de1;
  border: 1px solid #5b4de1;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 6px 15px rgba(91, 77, 225, 0.16);
}

.products-empty button svg {
  width: 15px;
  height: 15px;
}

/* =========================================================
   PAGINATION
========================================================= */

.products-pagination {
  min-height: 60px;
  margin-top: 15px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.products-pagination > button {
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 11px;
  color: #626a78;
  background: #ffffff;
  border: 1px solid #dfe3eb;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.products-pagination > button:hover:not(:disabled) {
  color: #5145ce;
  border-color: #cfcaff;
  background: #f8f7ff;
}

.products-pagination > button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.products-pagination > button svg {
  width: 14px;
  height: 14px;
}

.products-page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.products-page-numbers button {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e1e4ea;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.products-page-numbers button:hover {
  color: #5145ce;
  border-color: #d0cbff;
  background: #f8f7ff;
}

.products-page-numbers button.active {
  color: #ffffff;
  background: #5b4de1;
  border-color: #5b4de1;
  box-shadow:
    0 5px 12px rgba(91, 77, 225, 0.17);
}

.pagination-dots {
  width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa0ab;
  font-size: 11px;
}

/* =========================================================
   FOOTER
========================================================= */

.products-page-footer {
  min-height: 50px;
  margin-top: 12px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  color: #9aa0ab;
  font-size: 10px;
}

.products-page-footer > div {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.products-page-footer svg {
  width: 13px;
  height: 13px;
  color: #7770d9;
}

/* =========================================================
   NOTICE
========================================================= */

.products-notice {
  width: min(1500px, calc(100% - 48px));
  min-height: 46px;
  margin: 16px auto 0;
  padding: 0 13px;
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.products-notice.success {
  color: #176d4b;
  background: #eaf8f2;
  border: 1px solid #d4f0e3;
}

.products-notice.error {
  color: #b0394b;
  background: #fff0f3;
  border: 1px solid #ffdbe1;
}

.products-notice > svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.products-notice > button {
  width: 28px;
  height: 28px;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.products-notice > button:hover {
  background: rgba(0, 0, 0, 0.04);
}

.products-notice > button svg {
  width: 14px;
  height: 14px;
}

/* =========================================================
   ERROR
========================================================= */

.products-error {
  width: min(1500px, calc(100% - 48px));
  margin: 16px auto 0;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #ffd8df;
  border-radius: 12px;
}

.products-error-icon {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c13b4e;
  background: #fff0f3;
  border-radius: 10px;
}

.products-error-icon svg {
  width: 19px;
  height: 19px;
}

.products-error > div:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.products-error strong {
  display: block;
  color: #303746;
  font-size: 12px;
}

.products-error p {
  margin: 3px 0 0;
  color: #888f9b;
  font-size: 10px;
}

.products-error > button {
  min-height: 35px;
  padding: 0 11px;
  color: #5b4de1;
  background: #f2f0ff;
  border: 1px solid #e4e0ff;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* =========================================================
   LOADING
========================================================= */

.products-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.products-loading-spinner {
  width: 42px;
  height: 42px;
  margin-bottom: 17px;
  border: 3px solid #e4e2fa;
  border-top-color: #5b4de1;
  border-radius: 50%;
  animation: productsSpin 0.8s linear infinite;
}

.products-loading h3 {
  margin: 0;
  color: #252b38;
  font-size: 16px;
  font-weight: 800;
}

.products-loading p {
  margin: 6px 0 0;
  color: #9097a4;
  font-size: 11px;
}

.products-spin {
  animation: productsSpin 0.8s linear infinite;
}

@keyframes productsSpin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MODAL
========================================================= */

.products-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
  animation: modalOverlayIn 0.15s ease;
}

@keyframes modalOverlayIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.products-confirm-modal {
  width: min(440px, 100%);
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e5e7ed;
  border-radius: 17px;
  box-shadow:
    0 25px 70px rgba(15, 23, 42, 0.18);
  text-align: center;
  animation: modalIn 0.18s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirm-modal-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.confirm-modal-icon.delete {
  color: #c13b4e;
  background: #ffedf0;
}

.confirm-modal-icon.restore {
  color: #4e43c8;
  background: #efedff;
}

.confirm-modal-icon svg {
  width: 23px;
  height: 23px;
}

.products-confirm-modal h2 {
  margin: 0;
  color: #202635;
  font-size: 19px;
  font-weight: 800;
}

.products-confirm-modal p {
  margin: 9px 0 0;
  color: #697181;
  font-size: 12px;
  line-height: 1.8;
}

.products-confirm-modal p strong {
  color: #303746;
}

.confirm-modal-note {
  display: block;
  margin-top: 11px;
  color: #9298a5;
  font-size: 10px;
  line-height: 1.8;
}

.confirm-modal-actions {
  display: flex;
  gap: 9px;
  margin-top: 23px;
}

.confirm-modal-actions button {
  flex: 1;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.confirm-modal-actions button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.confirm-modal-actions button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.confirm-cancel {
  color: #596170;
  background: #f4f5f7;
  border: 1px solid #e4e6eb;
}

.confirm-delete {
  color: #ffffff;
  background: #c94357;
  border: 1px solid #c94357;
}

.confirm-delete:hover:not(:disabled) {
  background: #b9364b;
}

.confirm-restore {
  color: #ffffff;
  background: #5b4de1;
  border: 1px solid #5b4de1;
}

.confirm-restore:hover:not(:disabled) {
  background: #4e42ca;
}

.confirm-modal-actions svg {
  width: 15px;
  height: 15px;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: productsSpin 0.7s linear infinite;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1250px) {
  .products-stats {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

  .products-filter {
    min-width: 145px;
  }
}

@media (max-width: 900px) {
  .products-header-content {
    min-height: auto;
    padding: 25px 0;
    flex-direction: column;
    align-items: stretch;
  }

  .products-header-actions {
    justify-content: flex-start;
  }

  .products-stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .products-toolbar-top {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .products-toolbar-title {
    justify-content: flex-start;
  }

  .products-filter {
    min-width: calc(50% - 8px);
    flex: 1 1 calc(50% - 8px);
  }

  .products-deleted-toggle,
  .products-reset-btn {
    margin-top: 3px;
  }
}

@media (max-width: 620px) {
  .products-header-content,
  .products-main {
    width: min(
      100% - 28px,
      1500px
    );
  }

  .products-notice,
  .products-error {
    width: calc(100% - 28px);
  }

  .products-title-area h1 {
    font-size: 27px;
  }

  .products-title-area p {
    font-size: 12px;
  }

  .products-header-actions {
    width: 100%;
  }

  .products-refresh-btn,
  .products-add-btn {
    flex: 1;
  }

  .products-stats {
    grid-template-columns: 1fr;
  }

  .product-stat-card {
    min-height: 100px;
  }

  .products-filter {
    min-width: 100%;
    flex-basis: 100%;
  }

  .products-deleted-toggle {
    width: 100%;
  }

  .products-reset-btn {
    width: 100%;
  }

  .products-results-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .products-page-footer {
    flex-wrap: wrap;
    gap: 10px 17px;
  }

  .products-confirm-modal {
    padding: 23px 18px;
  }
}

/* =========================================================
   SCROLLBAR
========================================================= */

.products-table-wrapper::-webkit-scrollbar {
  height: 7px;
}

.products-table-wrapper::-webkit-scrollbar-track {
  background: #f2f3f6;
}

.products-table-wrapper::-webkit-scrollbar-thumb {
  background: #cfd3dc;
  border-radius: 999px;
}

.products-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #b8bdc8;
}`}
      </style>
    </div>
  );
}

// =========================================================
// HELPER
// =========================================================

function isActionLoadingFor(
  actionLoading,
  productId
) {
  return (
    actionLoading &&
    actionLoading === productId
  );
}