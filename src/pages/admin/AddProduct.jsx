import { useEffect, useMemo, useState } from "react";
//import { useMemo, useState } from "react";
 
import axios from "axios";
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiTrash2,
  FiImage,
  FiPackage,
  FiDollarSign,
  FiTruck,
  FiSearch,
  FiSettings,
  FiTag,
  FiLayers,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
 
import API_BASE from "../../config/api";
 
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
 

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emptyVariant = () => ({
  id: createId(),
  color: "",
  colorValue: "#000000",
  size: "",
  sizeValue: "",
  sku: "",
  price: "",
  quantity: 0,
  image: "",
});

const emptyPerfumeVariant = () => ({
  id: createId(),
  volume: "",
  volumeUnit: "ml",
  sku: "",
  price: "",
  quantity: 0,
  image: "",
});

const initialForm = {
  _id: "",
  sku: "",
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  brand: "AMAROC",

  category: {
    id: "",
    name: "",
    slug: "",
  },

  subcategory: {
    id: "",
    name: "",
    slug: "",
  },

  tags: [],
  features: [],

  images: [
    {
      url: "",
      alt: "",
      isPrimary: true,
    },
  ],

  thumbnail: "",

  pricing: {
    regularPrice: "",
    salePrice: "",
    currency: "MAD",

    discount: {
      enabled: false,
      type: "percentage",
      value: "",
      startDate: "",
      endDate: "",
    },
  },

  inventory: {
    quantity: 0,
    trackQuantity: true,
    lowStockThreshold: 5,
    status: "in_stock",
  },

  variants: [],

  dimensions: {
    length: "",
    width: "",
    height: "",
    unit: "cm",
  },

  weight: {
    value: "",
    unit: "kg",
  },

  status: {
    active: true,
    published: false,
    featured: false,
    bestseller: false,
    newProduct: false,
    archived: false,
  },

  badge: {
    enabled: false,
    type: "new",
    text: "",
  },

  rating: {
    average: 0,
    count: 0,
  },

  sales: {
    orders: 0,
    unitsSold: 0,
    views: 0,
  },

  details: {
    material: "",
    gender: "",
    style: "",
    season: "",
    countryOfOrigin: "",
    warranty: "",
  },

  shipping: {
    available: true,
    freeShipping: false,
    defaultPrice: "",
    estimatedDelivery: "",
  },

  relatedProducts: [],

  careInstructions: [],

  seo: {
    title: "",
    description: "",
    keywords: [],
  },

  perfume: {
    gender: "men",
    concentration: "EDP",
    fragranceFamily: "woody",
    topNotes: [],
    middleNotes: [],
    baseNotes: [],
    longevity: "",
    sillage: "moderate",
    season: [],
    occasion: [],
  },
};

function splitList(value) {
  if (Array.isArray(value)) return value;

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06ffa-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numberOrZero(value) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isNaN(number) ? 0 : number;
}

function isPerfumeProduct(form) {
  return (
    form.category.slug === "perfumes" ||
    form.category.id === "perfumes" ||
    form.category.name === "العطور" ||
    form.subcategory.slug === "men-perfumes" ||
    form.subcategory.id === "men-perfumes"
  );
}

export default function AddProduct() {
  const navigate = useNavigate();

    const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");

  const isEditMode = Boolean(editId);

  const [form, setForm] = useState(initialForm);
  const [activeSection, setActiveSection] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const perfumeMode = useMemo(
    () => isPerfumeProduct(form),
    [form]
  );

  const totalVariantQuantity = useMemo(() => {
    return form.variants.reduce(
      (total, variant) => total + numberOrZero(variant.quantity),
      0
    );
  }, [form.variants]);

  const calculatedInventoryStatus = useMemo(() => {
    const quantity =
      form.variants.length > 0
        ? totalVariantQuantity
        : numberOrZero(form.inventory.quantity);

    if (quantity <= 0) return "out_of_stock";

    if (quantity <= numberOrZero(form.inventory.lowStockThreshold)) {
      return "low_stock";
    }

    return "in_stock";
  }, [
    form.variants,
    form.inventory.quantity,
    form.inventory.lowStockThreshold,
    totalVariantQuantity,
  ]);

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };

      let current = next;

      for (let i = 0; i < path.length - 1; i += 1) {
        current[path[i]] = {
          ...current[path[i]],
        };

        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;

      return next;
    });
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      seo: {
        ...prev.seo,
        title: prev.seo.title || value,
      },
    }));
  };

  const generateSlug = () => {
    updateField(["slug"], slugify(form.name));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: {
        ...prev.category,
        id: value,
        slug: value,
      },
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        perfumeMode ? emptyPerfumeVariant() : emptyVariant(),
      ],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      ),
    }));
  };

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: "",
          alt: "",
          isPrimary: false,
        },
      ],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);

      if (images.length > 0 && !images.some((image) => image.isPrimary)) {
        images[0] = {
          ...images[0],
          isPrimary: true,
        };
      }

      return {
        ...prev,
        images,
      };
    });
  };

  const updateImage = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, i) =>
        i === index
          ? {
              ...image,
              [field]: value,
            }
          : field === "isPrimary" && value
          ? {
              ...image,
              isPrimary: false,
            }
          : image
      ),
    }));
  };

  const validateForm = () => {
    if (!form.sku.trim()) {
      return "SKU المنتج مطلوب.";
    }

    if (!form.name.trim()) {
      return "اسم المنتج مطلوب.";
    }

    if (!form.slug.trim()) {
      return "Slug المنتج مطلوب.";
    }

    if (!form.category.id.trim()) {
      return "معرّف التصنيف Category ID مطلوب.";
    }

    if (!form.category.name.trim()) {
      return "اسم التصنيف مطلوب.";
    }

    if (!form.category.slug.trim()) {
      return "Slug التصنيف مطلوب.";
    }

    if (form.pricing.regularPrice === "") {
      return "السعر العادي مطلوب.";
    }

    if (
      form.pricing.salePrice !== "" &&
      numberOrZero(form.pricing.salePrice) >
        numberOrZero(form.pricing.regularPrice)
    ) {
      return "سعر التخفيض لا يمكن أن يكون أكبر من السعر العادي.";
    }

    for (let i = 0; i < form.variants.length; i += 1) {
      const variant = form.variants[i];

      if (!variant.id) {
        return `Variant رقم ${i + 1} يحتاج إلى ID.`;
      }

      if (!variant.sku) {
        return `SKU الخاص بالـ Variant رقم ${i + 1} مطلوب.`;
      }

      if (variant.price === "") {
        return `السعر الخاص بالـ Variant رقم ${i + 1} مطلوب.`;
      }

      if (perfumeMode) {
        if (!variant.volume) {
          return `حجم العطر في Variant رقم ${i + 1} مطلوب.`;
        }
      }
    }

    return null;
  };

  const buildPayload = (publish = false) => {
    const inventoryQuantity =
      form.variants.length > 0
        ? totalVariantQuantity
        : numberOrZero(form.inventory.quantity);

    const payload = {
      ...form,

      _id: form._id.trim() || undefined,

      tags: splitList(form.tags),
      features: splitList(form.features),

      images: form.images
        .filter((image) => image.url.trim())
        .map((image) => ({
          ...image,
          url: image.url.trim(),
          alt: image.alt.trim(),
        })),

      thumbnail:
        form.thumbnail.trim() ||
        form.images.find((image) => image.isPrimary && image.url)?.url ||
        form.images.find((image) => image.url)?.url ||
        "",

      pricing: {
        ...form.pricing,
        regularPrice: numberOrZero(form.pricing.regularPrice),
        salePrice:
          form.pricing.salePrice === ""
            ? null
            : numberOrZero(form.pricing.salePrice),
        discount: {
          ...form.pricing.discount,
          value: numberOrZero(form.pricing.discount.value),
        },
      },

      inventory: {
        ...form.inventory,
        quantity: inventoryQuantity,
        lowStockThreshold: numberOrZero(
          form.inventory.lowStockThreshold
        ),
        status: calculatedInventoryStatus,
      },

      dimensions: {
        ...form.dimensions,
        length: numberOrZero(form.dimensions.length),
        width: numberOrZero(form.dimensions.width),
        height: numberOrZero(form.dimensions.height),
      },

      weight: {
        ...form.weight,
        value: numberOrZero(form.weight.value),
      },

      status: {
        ...form.status,
        published: publish ? true : form.status.published,
      },

      badge: {
        ...form.badge,
        enabled: Boolean(form.badge.enabled),
      },

      rating: {
        average: numberOrZero(form.rating.average),
        count: numberOrZero(form.rating.count),
      },

      sales: {
        orders: numberOrZero(form.sales.orders),
        unitsSold: numberOrZero(form.sales.unitsSold),
        views: numberOrZero(form.sales.views),
      },

      shipping: {
        ...form.shipping,
        defaultPrice: numberOrZero(form.shipping.defaultPrice),
      },

      relatedProducts: splitList(form.relatedProducts),
      careInstructions: splitList(form.careInstructions),

      seo: {
        ...form.seo,
        keywords: splitList(form.seo.keywords),
      },

      variants: form.variants.map((variant) => {
        if (perfumeMode) {
          return {
            id: variant.id,
            volume: numberOrZero(variant.volume),
            volumeUnit: variant.volumeUnit || "ml",
            sku: variant.sku.trim(),
            price: numberOrZero(variant.price),
            quantity: numberOrZero(variant.quantity),
            image: variant.image?.trim() || "",
          };
        }

        return {
          id: variant.id,
          color: variant.color?.trim() || "",
          colorValue: variant.colorValue || "#000000",
          size: variant.size?.trim() || "",
          sizeValue: variant.sizeValue?.trim() || "",
          sku: variant.sku.trim(),
          price: numberOrZero(variant.price),
          quantity: numberOrZero(variant.quantity),
          image: variant.image?.trim() || "",
        };
      }),
    };

    if (perfumeMode) {
      payload.perfume = {
        ...form.perfume,
        topNotes: splitList(form.perfume.topNotes),
        middleNotes: splitList(form.perfume.middleNotes),
        baseNotes: splitList(form.perfume.baseNotes),
        season: splitList(form.perfume.season),
        occasion: splitList(form.perfume.occasion),
      };
    } else {
      delete payload.perfume;
    }

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.createdBy;
    delete payload.updatedBy;
    delete payload.isDeleted;

    return payload;
  };


    const loadProduct = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/api/products/${encodeURIComponent(id)}`
      );

      const product = response.data?.product || response.data?.data;

      if (!product) {
        throw new Error("لم يتم العثور على بيانات المنتج.");
      }

      setForm({
        ...initialForm,
        ...product,

        category: {
          ...initialForm.category,
          ...(product.category || {}),
        },

        subcategory: {
          ...initialForm.subcategory,
          ...(product.subcategory || {}),
        },

        pricing: {
          ...initialForm.pricing,
          ...(product.pricing || {}),
          discount: {
            ...initialForm.pricing.discount,
            ...(product.pricing?.discount || {}),
          },
        },

        inventory: {
          ...initialForm.inventory,
          ...(product.inventory || {}),
        },

        dimensions: {
          ...initialForm.dimensions,
          ...(product.dimensions || {}),
        },

        weight: {
          ...initialForm.weight,
          ...(product.weight || {}),
        },

        status: {
          ...initialForm.status,
          ...(product.status || {}),
        },

        badge: {
          ...initialForm.badge,
          ...(product.badge || {}),
        },

        rating: {
          ...initialForm.rating,
          ...(product.rating || {}),
        },

        sales: {
          ...initialForm.sales,
          ...(product.sales || {}),
        },

        details: {
          ...initialForm.details,
          ...(product.details || {}),
        },

        shipping: {
          ...initialForm.shipping,
          ...(product.shipping || {}),
        },

        seo: {
          ...initialForm.seo,
          ...(product.seo || {}),
        },

        perfume: {
          ...initialForm.perfume,
          ...(product.perfume || {}),
        },

        tags: Array.isArray(product.tags)
          ? product.tags
          : splitList(product.tags),

        features: Array.isArray(product.features)
          ? product.features
          : splitList(product.features),

        images:
          Array.isArray(product.images) && product.images.length
            ? product.images
            : initialForm.images,

        variants: Array.isArray(product.variants)
          ? product.variants.map((variant) => ({
              ...variant,
              id: variant.id || createId(),
            }))
          : [],

        relatedProducts: Array.isArray(product.relatedProducts)
          ? product.relatedProducts
          : [],

        careInstructions: Array.isArray(product.careInstructions)
          ? product.careInstructions
          : [],
      });

      setSuccess("تم تحميل بيانات المنتج للتعديل.");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "حدث خطأ أثناء تحميل المنتج.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (!editId) return;

    loadProduct(editId);
  }, [editId]);

  const handleSubmit = async (publish = false) => {
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setLoading(true);

      const payload = buildPayload(publish);

            let response;

      if (isEditMode) {
        response = await axios.put(
          `${API_BASE}/api/products/${encodeURIComponent(editId)}`,
          payload,
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE}/api/products`,
          payload,
          {
            withCredentials: true,
          }
        );
      }
      /*
      const response = await axios.post(
        `${API_BASE}/api/products`,
        payload,
        {
          withCredentials: true,
        }
      );*/

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "فشل إنشاء المنتج."
        );
      }

      //setSuccess("تم إنشاء المنتج بنجاح.");
      setSuccess(
  isEditMode
    ? "تم تحديث المنتج بنجاح."
    : "تم إنشاء المنتج بنجاح."
);

      setTimeout(() => {
        navigate("/admin/products");
      }, 900);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "حدث خطأ أثناء إنشاء المنتج.";

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: "basic",
      label: "المعلومات الأساسية",
      icon: FiPackage,
    },
    {
      id: "pricing",
      label: "السعر والمخزون",
      icon: FiDollarSign,
    },
    {
      id: "variants",
      label: "الخيارات Variants",
      icon: FiLayers,
    },
    {
      id: "images",
      label: "الصور",
      icon: FiImage,
    },
    {
      id: "details",
      label: "تفاصيل المنتج",
      icon: FiSettings,
    },
    {
      id: "shipping",
      label: "الشحن",
      icon: FiTruck,
    },
    {
      id: "seo",
      label: "SEO",
      icon: FiSearch,
    },
  ];

  return (
    <div className="add-product-page" dir="rtl">
      <div className="add-product-container">

        {/* HEADER */}
        <header className="product-page-header">
          <div className="header-main">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft />
              <span>رجوع</span>
            </button>

            <div>
              <div className="page-eyebrow">
                إدارة المنتجات
              </div>
              <h1>
  {isEditMode ? "تعديل المنتج" : "إضافة منتج جديد"}
</h1>

<p>
  {isEditMode
    ? "عدّل بيانات المنتج واحفظ التغييرات مباشرة في قاعدة البيانات."
    : "أنشئ منتجًا كاملًا واربطه مباشرة بقاعدة البيانات."}
</p>
            {/*<h1>إضافة منتج جديد</h1>

              <p>
                أنشئ منتجًا كاملًا واربطه مباشرة بقاعدة البيانات.
              </p>
            */}
              
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate("/admin/products")}
              disabled={loading}
            >
              إلغاء
            </button>

            <button
              type="button"
              className="primary-action"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              {/*<FiSave />
              {loading ? "جاري الحفظ..." : "حفظ المنتج"}
              */}
              
              <FiSave />
{loading
  ? isEditMode
    ? "جاري التحديث..."
    : "جاري الحفظ..."
  : isEditMode
  ? "حفظ التعديلات"
  : "حفظ المنتج"}
            </button>
          </div>
        </header>

        {/* ALERTS */}
        {error && (
          <div className="alert alert-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FiCheck />
            <span>{success}</span>
          </div>
        )}

        <div className="product-layout">

          {/* MAIN CONTENT */}
          <main className="product-main">

            {/* BASIC */}
            {activeSection === "basic" && (
              <section className="form-card">
                <div className="card-header">
                  <div>
                    <span className="section-number">01</span>
                    <h2>المعلومات الأساسية</h2>
                    <p>
                      المعلومات الرئيسية التي ستظهر في المتجر.
                    </p>
                  </div>
                </div>

                <div className="form-grid two-columns">

                  <div className="field">
                    <label>
                      اسم المنتج <span>*</span>
                    </label>

                    <input
                      value={form.name}
                      onChange={(e) =>
                        handleNameChange(e.target.value)
                      }
                      placeholder="مثال: حقيبة ظهر كلاسيك"
                    />
                  </div>

                  <div className="field">
                    <label>
                      SKU <span>*</span>
                    </label>

                    <input
                      value={form.sku}
                      onChange={(e) =>
                        updateField(
                          ["sku"],
                          e.target.value
                        )
                      }
                      placeholder="AMR-BP-002"
                      dir="ltr"
                    />
                  </div>

                  <div className="field field-full">
                    <label>
                      Slug <span>*</span>
                    </label>

                    <div className="input-with-button">
                      <input
                        value={form.slug}
                        onChange={(e) =>
                          updateField(
                            ["slug"],
                            e.target.value
                          )
                        }
                        placeholder="classic-backpack"
                        dir="ltr"
                      />

                      <button
                        type="button"
                        onClick={generateSlug}
                      >
                        توليد
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label>Brand</label>

                    <input
                      value={form.brand}
                      onChange={(e) =>
                        updateField(
                          ["brand"],
                          e.target.value
                        )
                      }
                      placeholder="AMAROC"
                    />
                  </div>

                  <div className="field">
                    <label>معرّف التصنيف</label>

                    <input
                      value={form.category.id}
                      onChange={(e) =>
                        handleCategoryChange(
                          e.target.value
                        )
                      }
                      placeholder="bags"
                      dir="ltr"
                    />
                  </div>

                  <div className="field">
                    <label>اسم التصنيف</label>

                    <input
                      value={form.category.name}
                      onChange={(e) =>
                        updateField(
                          ["category", "name"],
                          e.target.value
                        )
                      }
                      placeholder="الحقائب"
                    />
                  </div>

                  <div className="field">
                    <label>Slug التصنيف</label>

                    <input
                      value={form.category.slug}
                      onChange={(e) =>
                        updateField(
                          ["category", "slug"],
                          e.target.value
                        )
                      }
                      placeholder="bags"
                      dir="ltr"
                    />
                  </div>

                  <div className="field">
                    <label>معرّف التصنيف الفرعي</label>

                    <input
                      value={form.subcategory.id}
                      onChange={(e) =>
                        updateField(
                          ["subcategory", "id"],
                          e.target.value
                        )
                      }
                      placeholder="backpacks"
                      dir="ltr"
                    />
                  </div>

                  <div className="field">
                    <label>اسم التصنيف الفرعي</label>

                    <input
                      value={form.subcategory.name}
                      onChange={(e) =>
                        updateField(
                          ["subcategory", "name"],
                          e.target.value
                        )
                      }
                      placeholder="حقائب ظهر"
                    />
                  </div>

                  <div className="field">
                    <label>Slug التصنيف الفرعي</label>

                    <input
                      value={form.subcategory.slug}
                      onChange={(e) =>
                        updateField(
                          ["subcategory", "slug"],
                          e.target.value
                        )
                      }
                      placeholder="backpacks"
                      dir="ltr"
                    />
                  </div>

                  <div className="field field-full">
                    <label>الوصف المختصر</label>

                    <input
                      value={form.shortDescription}
                      onChange={(e) =>
                        updateField(
                          ["shortDescription"],
                          e.target.value
                        )
                      }
                      placeholder="وصف قصير يظهر في بطاقة المنتج"
                    />
                  </div>

                  <div className="field field-full">
                    <label>الوصف الكامل</label>

                    <textarea
                      rows="6"
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          ["description"],
                          e.target.value
                        )
                      }
                      placeholder="اكتب وصف المنتج بالتفصيل..."
                    />
                  </div>

                  <div className="field field-full">
                    <label>Tags</label>

                    <input
                      value={joinList(form.tags)}
                      onChange={(e) =>
                        updateField(
                          ["tags"],
                          e.target.value
                        )
                      }
                      placeholder="bags, fashion, amaroc"
                    />

                    <small>
                      افصل بين الكلمات باستخدام فاصلة.
                    </small>
                  </div>

                  <div className="field field-full">
                    <label>Features</label>

                    <textarea
                      rows="4"
                      value={joinList(form.features)}
                      onChange={(e) =>
                        updateField(
                          ["features"],
                          e.target.value
                        )
                      }
                      placeholder="مقاومة للماء, جيوب متعددة, تصميم خفيف"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* PRICING */}
            {activeSection === "pricing" && (
              <section className="form-card">
                <div className="card-header">
                  <div>
                    <span className="section-number">02</span>
                    <h2>السعر والمخزون</h2>
                    <p>
                      حدد الأسعار والمخزون وسيتم حساب كمية
                      الـ variants تلقائيًا.
                    </p>
                  </div>
                </div>

                <div className="form-grid three-columns">

                  <div className="field">
                    <label>
                      السعر العادي <span>*</span>
                    </label>

                    <div className="money-input">
                      <input
                        type="number"
                        min="0"
                        value={form.pricing.regularPrice}
                        onChange={(e) =>
                          updateField(
                            [
                              "pricing",
                              "regularPrice",
                            ],
                            e.target.value
                          )
                        }
                        placeholder="349"
                      />
                      <span>MAD</span>
                    </div>
                  </div>

                  <div className="field">
                    <label>سعر التخفيض</label>

                    <div className="money-input">
                      <input
                        type="number"
                        min="0"
                        value={form.pricing.salePrice}
                        onChange={(e) =>
                          updateField(
                            ["pricing", "salePrice"],
                            e.target.value
                          )
                        }
                        placeholder="299"
                      />
                      <span>MAD</span>
                    </div>
                  </div>

                  <div className="field">
                    <label>العملة</label>

                    <select
                      value={form.pricing.currency}
                      onChange={(e) =>
                        updateField(
                          ["pricing", "currency"],
                          e.target.value
                        )
                      }
                    >
                      <option value="MAD">MAD - درهم</option>
                      <option value="EUR">EUR - يورو</option>
                      <option value="USD">USD - دولار</option>
                    </select>
                  </div>

                  <div className="field field-full">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={
                          form.pricing.discount.enabled
                        }
                        onChange={(e) =>
                          updateField(
                            [
                              "pricing",
                              "discount",
                              "enabled",
                            ],
                            e.target.checked
                          )
                        }
                      />
                      <span>
                        تفعيل نظام الخصم
                      </span>
                    </label>
                  </div>

                  {form.pricing.discount.enabled && (
                    <>
                      <div className="field">
                        <label>نوع الخصم</label>

                        <select
                          value={
                            form.pricing.discount.type
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "pricing",
                                "discount",
                                "type",
                              ],
                              e.target.value
                            )
                          }
                        >
                          <option value="percentage">
                            نسبة مئوية
                          </option>
                          <option value="fixed">
                            مبلغ ثابت
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>قيمة الخصم</label>

                        <input
                          type="number"
                          min="0"
                          value={
                            form.pricing.discount.value
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "pricing",
                                "discount",
                                "value",
                              ],
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="field">
                        <label>تاريخ البداية</label>

                        <input
                          type="datetime-local"
                          value={
                            form.pricing.discount.startDate
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "pricing",
                                "discount",
                                "startDate",
                              ],
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="field">
                        <label>تاريخ النهاية</label>

                        <input
                          type="datetime-local"
                          value={
                            form.pricing.discount.endDate
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "pricing",
                                "discount",
                                "endDate",
                              ],
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="field">
                    <label>المخزون اليدوي</label>

                    <input
                      type="number"
                      min="0"
                      value={form.inventory.quantity}
                      disabled={form.variants.length > 0}
                      onChange={(e) =>
                        updateField(
                          ["inventory", "quantity"],
                          e.target.value
                        )
                      }
                    />

                    {form.variants.length > 0 && (
                      <small>
                        يتم حساب المخزون من الـ Variants.
                      </small>
                    )}
                  </div>

                  <div className="field">
                    <label>حد المخزون المنخفض</label>

                    <input
                      type="number"
                      min="0"
                      value={
                        form.inventory.lowStockThreshold
                      }
                      onChange={(e) =>
                        updateField(
                          [
                            "inventory",
                            "lowStockThreshold",
                          ],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>حالة المخزون</label>

                    <div className="inventory-status-box">
                      <span
                        className={`status-dot ${calculatedInventoryStatus}`}
                      />

                      {calculatedInventoryStatus ===
                        "in_stock" && "متوفر"}

                      {calculatedInventoryStatus ===
                        "low_stock" && "مخزون منخفض"}

                      {calculatedInventoryStatus ===
                        "out_of_stock" && "غير متوفر"}
                    </div>
                  </div>
                </div>

                <div className="inventory-summary">
                  <div>
                    <span>إجمالي المخزون</span>
                    <strong>
                      {form.variants.length > 0
                        ? totalVariantQuantity
                        : numberOrZero(
                            form.inventory.quantity
                          )}
                    </strong>
                  </div>

                  <div>
                    <span>عدد الـ Variants</span>
                    <strong>
                      {form.variants.length}
                    </strong>
                  </div>
                </div>
              </section>
            )}

            {/* VARIANTS */}
            {activeSection === "variants" && (
              <section className="form-card">
                <div className="card-header card-header-row">
                  <div>
                    <span className="section-number">03</span>
                    <h2>خيارات المنتج</h2>
                    <p>
                      أضف الألوان والمقاسات أو أحجام العطر.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="add-button"
                    onClick={addVariant}
                  >
                    <FiPlus />
                    إضافة Variant
                  </button>
                </div>

                {perfumeMode && (
                  <div className="info-banner">
                    <FiTag />
                    <div>
                      <strong>وضع العطور مفعل</strong>
                      <span>
                        سيتم استخدام الحجم Volume بدل اللون
                        والمقاس.
                      </span>
                    </div>
                  </div>
                )}

                {form.variants.length === 0 ? (
                  <div className="empty-state">
                    <FiLayers />
                    <h3>لا توجد Variants</h3>
                    <p>
                      يمكنك إضافة خيارات للمنتج أو تركه بدون
                      خيارات.
                    </p>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="primary-action"
                    >
                      <FiPlus />
                      إضافة أول Variant
                    </button>
                  </div>
                ) : (
                  <div className="variants-list">
                    {form.variants.map((variant, index) => (
                      <div
                        className="variant-card"
                        key={variant.id}
                      >
                        <div className="variant-header">
                          <div>
                            <span>
                              Variant {index + 1}
                            </span>

                            <strong>
                              {perfumeMode
                                ? variant.volume
                                  ? `${variant.volume} ${variant.volumeUnit}`
                                  : "حجم جديد"
                                : variant.color ||
                                  variant.size ||
                                  "خيار جديد"}
                            </strong>
                          </div>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              removeVariant(index)
                            }
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        {perfumeMode ? (
                          <div className="form-grid three-columns">
                            <div className="field">
                              <label>الحجم</label>

                              <input
                                type="number"
                                min="1"
                                value={variant.volume}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "volume",
                                    e.target.value
                                  )
                                }
                                placeholder="50"
                              />
                            </div>

                            <div className="field">
                              <label>الوحدة</label>

                              <select
                                value={
                                  variant.volumeUnit
                                }
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "volumeUnit",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="ml">
                                  ml
                                </option>
                                <option value="L">
                                  L
                                </option>
                              </select>
                            </div>

                            <div className="field">
                              <label>SKU</label>

                              <input
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "sku",
                                    e.target.value
                                  )
                                }
                                placeholder="AMR-PER-001-50"
                                dir="ltr"
                              />
                            </div>

                            <div className="field">
                              <label>السعر</label>

                              <input
                                type="number"
                                min="0"
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="field">
                              <label>الكمية</label>

                              <input
                                type="number"
                                min="0"
                                value={variant.quantity}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="field field-full">
                              <label>
                                صورة الـ Variant
                              </label>

                              <input
                                value={variant.image}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "image",
                                    e.target.value
                                  )
                                }
                                placeholder="https://..."
                                dir="ltr"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="form-grid three-columns">
                            <div className="field">
                              <label>اللون</label>

                              <input
                                value={variant.color}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "color",
                                    e.target.value
                                  )
                                }
                                placeholder="Black"
                              />
                            </div>

                            <div className="field">
                              <label>قيمة اللون</label>

                              <div className="color-input">
                                <input
                                  type="color"
                                  value={
                                    variant.colorValue ||
                                    "#000000"
                                  }
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "colorValue",
                                      e.target.value
                                    )
                                  }
                                />

                                <input
                                  value={
                                    variant.colorValue ||
                                    "#000000"
                                  }
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "colorValue",
                                      e.target.value
                                    )
                                  }
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            <div className="field">
                              <label>المقاس</label>

                              <input
                                value={variant.size}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "size",
                                    e.target.value
                                  )
                                }
                                placeholder="M"
                              />
                            </div>

                            <div className="field">
                              <label>قيمة المقاس</label>

                              <input
                                value={variant.sizeValue}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "sizeValue",
                                    e.target.value
                                  )
                                }
                                placeholder="M"
                              />
                            </div>

                            <div className="field">
                              <label>SKU</label>

                              <input
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "sku",
                                    e.target.value
                                  )
                                }
                                placeholder="AMR-001-BLK-M"
                                dir="ltr"
                              />
                            </div>

                            <div className="field">
                              <label>السعر</label>

                              <input
                                type="number"
                                min="0"
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="field">
                              <label>الكمية</label>

                              <input
                                type="number"
                                min="0"
                                value={variant.quantity}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="field field-full">
                              <label>
                                صورة الـ Variant
                              </label>

                              <input
                                value={variant.image}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "image",
                                    e.target.value
                                  )
                                }
                                placeholder="https://..."
                                dir="ltr"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {perfumeMode && (
                  <div className="perfume-section">
                    <div className="subsection-title">
                      <h3>معلومات العطر</h3>
                      <p>
                        معلومات إضافية خاصة بالعطور.
                      </p>
                    </div>

                    <div className="form-grid three-columns">
                      <div className="field">
                        <label>الجنس</label>

                        <select
                          value={form.perfume.gender}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "gender",
                              ],
                              e.target.value
                            )
                          }
                        >
                          <option value="men">
                            رجال
                          </option>
                          <option value="women">
                            نساء
                          </option>
                          <option value="unisex">
                            للجنسين
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>التركيز</label>

                        <select
                          value={
                            form.perfume.concentration
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "concentration",
                              ],
                              e.target.value
                            )
                          }
                        >
                          <option value="EDP">
                            EDP
                          </option>
                          <option value="EDT">
                            EDT
                          </option>
                          <option value="Parfum">
                            Parfum
                          </option>
                          <option value="EDC">
                            EDC
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>عائلة العطر</label>

                        <input
                          value={
                            form.perfume
                              .fragranceFamily
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "fragranceFamily",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="woody"
                        />
                      </div>

                      <div className="field field-full">
                        <label>Top Notes</label>

                        <input
                          value={joinList(
                            form.perfume.topNotes
                          )}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "topNotes",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="Bergamot, Lemon"
                        />
                      </div>

                      <div className="field field-full">
                        <label>Middle Notes</label>

                        <input
                          value={joinList(
                            form.perfume.middleNotes
                          )}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "middleNotes",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="Lavender, Rose"
                        />
                      </div>

                      <div className="field field-full">
                        <label>Base Notes</label>

                        <input
                          value={joinList(
                            form.perfume.baseNotes
                          )}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "baseNotes",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="Musk, Amber, Sandalwood"
                        />
                      </div>

                      <div className="field">
                        <label>مدة الثبات</label>

                        <input
                          value={
                            form.perfume.longevity
                          }
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "longevity",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="6-8 hours"
                        />
                      </div>

                      <div className="field">
                        <label>الفوحان</label>

                        <select
                          value={form.perfume.sillage}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "sillage",
                              ],
                              e.target.value
                            )
                          }
                        >
                          <option value="light">
                            Light
                          </option>
                          <option value="moderate">
                            Moderate
                          </option>
                          <option value="strong">
                            Strong
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>المواسم</label>

                        <input
                          value={joinList(
                            form.perfume.season
                          )}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "season",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="autumn, winter"
                        />
                      </div>

                      <div className="field field-full">
                        <label>المناسبات</label>

                        <input
                          value={joinList(
                            form.perfume.occasion
                          )}
                          onChange={(e) =>
                            updateField(
                              [
                                "perfume",
                                "occasion",
                              ],
                              e.target.value
                            )
                          }
                          placeholder="evening, formal"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* IMAGES */}
            {activeSection === "images" && (
              <section className="form-card">
                <div className="card-header card-header-row">
                  <div>
                    <span className="section-number">04</span>
                    <h2>صور المنتج</h2>
                    <p>
                      استخدم روابط الصور الموجودة في التخزين
                      أو CDN.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="add-button"
                    onClick={addImage}
                  >
                    <FiPlus />
                    إضافة صورة
                  </button>
                </div>

                <div className="images-list">
                  {form.images.map((image, index) => (
                    <div
                      className="image-form-row"
                      key={index}
                    >
                      <div className="image-preview">
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.alt || "Product"}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <FiImage />
                        )}
                      </div>

                      <div className="image-fields">
                        <div className="field">
                          <label>رابط الصورة</label>

                          <input
                            value={image.url}
                            onChange={(e) =>
                              updateImage(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                            dir="ltr"
                          />
                        </div>

                        <div className="field">
                          <label>Alt</label>

                          <input
                            value={image.alt}
                            onChange={(e) =>
                              updateImage(
                                index,
                                "alt",
                                e.target.value
                              )
                            }
                            placeholder="وصف الصورة"
                          />
                        </div>

                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={image.isPrimary}
                            onChange={(e) =>
                              updateImage(
                                index,
                                "isPrimary",
                                e.target.checked
                              )
                            }
                          />
                          <span>
                            الصورة الرئيسية
                          </span>
                        </label>
                      </div>

                      {form.images.length > 1 && (
                        <button
                          type="button"
                          className="delete-button image-delete"
                          onClick={() =>
                            removeImage(index)
                          }
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="field">
                  <label>Thumbnail</label>

                  <input
                    value={form.thumbnail}
                    onChange={(e) =>
                      updateField(
                        ["thumbnail"],
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    dir="ltr"
                  />

                  <small>
                    إذا تركته فارغًا سيتم استخدام الصورة
                    الرئيسية تلقائيًا.
                  </small>
                </div>
              </section>
            )}

            {/* DETAILS */}
            {activeSection === "details" && (
              <section className="form-card">
                <div className="card-header">
                  <div>
                    <span className="section-number">05</span>
                    <h2>تفاصيل المنتج</h2>
                    <p>
                      معلومات إضافية تستخدم في صفحة المنتج.
                    </p>
                  </div>
                </div>

                <div className="subsection-title">
                  <h3>الحالة والظهور</h3>
                </div>

                <div className="toggle-grid">
                  {[
                    ["active", "المنتج نشط"],
                    ["published", "منشور في المتجر"],
                    ["featured", "منتج مميز"],
                    ["bestseller", "الأكثر مبيعًا"],
                    ["newProduct", "منتج جديد"],
                    ["archived", "مؤرشف"],
                  ].map(([key, label]) => (
                    <label
                      className="toggle-card"
                      key={key}
                    >
                      <input
                        type="checkbox"
                        checked={form.status[key]}
                        onChange={(e) =>
                          updateField(
                            ["status", key],
                            e.target.checked
                          )
                        }
                      />

                      <span className="toggle-switch" />

                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="subsection-title">
                  <h3>Badge</h3>
                </div>

                <div className="form-grid three-columns">
                  <label className="checkbox-row field-full">
                    <input
                      type="checkbox"
                      checked={form.badge.enabled}
                      onChange={(e) =>
                        updateField(
                          ["badge", "enabled"],
                          e.target.checked
                        )
                      }
                    />
                    <span>
                      تفعيل Badge
                    </span>
                  </label>

                  {form.badge.enabled && (
                    <>
                      <div className="field">
                        <label>نوع Badge</label>

                        <select
                          value={form.badge.type}
                          onChange={(e) =>
                            updateField(
                              ["badge", "type"],
                              e.target.value
                            )
                          }
                        >
                          <option value="new">
                            New
                          </option>
                          <option value="sale">
                            Sale
                          </option>
                          <option value="featured">
                            Featured
                          </option>
                          <option value="bestseller">
                            Bestseller
                          </option>
                          <option value="out_of_stock">
                            Out of Stock
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>النص</label>

                        <input
                          value={form.badge.text}
                          onChange={(e) =>
                            updateField(
                              ["badge", "text"],
                              e.target.value
                            )
                          }
                          placeholder="جديد"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="subsection-title">
                  <h3>المعلومات الإضافية</h3>
                </div>

                <div className="form-grid three-columns">
                  <div className="field">
                    <label>الخامة</label>

                    <input
                      value={form.details.material}
                      onChange={(e) =>
                        updateField(
                          ["details", "material"],
                          e.target.value
                        )
                      }
                      placeholder="Leather"
                    />
                  </div>

                  <div className="field">
                    <label>الجنس</label>

                    <input
                      value={form.details.gender}
                      onChange={(e) =>
                        updateField(
                          ["details", "gender"],
                          e.target.value
                        )
                      }
                      placeholder="men"
                    />
                  </div>

                  <div className="field">
                    <label>Style</label>

                    <input
                      value={form.details.style}
                      onChange={(e) =>
                        updateField(
                          ["details", "style"],
                          e.target.value
                        )
                      }
                      placeholder="casual"
                    />
                  </div>

                  <div className="field">
                    <label>Season</label>

                    <input
                      value={form.details.season}
                      onChange={(e) =>
                        updateField(
                          ["details", "season"],
                          e.target.value
                        )
                      }
                      placeholder="summer"
                    />
                  </div>

                  <div className="field">
                    <label>بلد المنشأ</label>

                    <input
                      value={
                        form.details.countryOfOrigin
                      }
                      onChange={(e) =>
                        updateField(
                          [
                            "details",
                            "countryOfOrigin",
                          ],
                          e.target.value
                        )
                      }
                      placeholder="Morocco"
                    />
                  </div>

                  <div className="field">
                    <label>الضمان</label>

                    <input
                      value={form.details.warranty}
                      onChange={(e) =>
                        updateField(
                          ["details", "warranty"],
                          e.target.value
                        )
                      }
                      placeholder="1 year"
                    />
                  </div>
                </div>

                <div className="subsection-title">
                  <h3>الأبعاد والوزن</h3>
                </div>

                <div className="form-grid four-columns">
                  <div className="field">
                    <label>الطول</label>

                    <input
                      type="number"
                      min="0"
                      value={form.dimensions.length}
                      onChange={(e) =>
                        updateField(
                          ["dimensions", "length"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>العرض</label>

                    <input
                      type="number"
                      min="0"
                      value={form.dimensions.width}
                      onChange={(e) =>
                        updateField(
                          ["dimensions", "width"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>الارتفاع</label>

                    <input
                      type="number"
                      min="0"
                      value={form.dimensions.height}
                      onChange={(e) =>
                        updateField(
                          ["dimensions", "height"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>الوحدة</label>

                    <select
                      value={form.dimensions.unit}
                      onChange={(e) =>
                        updateField(
                          ["dimensions", "unit"],
                          e.target.value
                        )
                      }
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>الوزن</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.weight.value}
                      onChange={(e) =>
                        updateField(
                          ["weight", "value"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>وحدة الوزن</label>

                    <select
                      value={form.weight.unit}
                      onChange={(e) =>
                        updateField(
                          ["weight", "unit"],
                          e.target.value
                        )
                      }
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>

                <div className="subsection-title">
                  <h3>التقييم والمبيعات</h3>
                </div>

                <div className="form-grid three-columns">
                  <div className="field">
                    <label>متوسط التقييم</label>

                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={form.rating.average}
                      onChange={(e) =>
                        updateField(
                          ["rating", "average"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>عدد التقييمات</label>

                    <input
                      type="number"
                      min="0"
                      value={form.rating.count}
                      onChange={(e) =>
                        updateField(
                          ["rating", "count"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>عدد الطلبات</label>

                    <input
                      type="number"
                      min="0"
                      value={form.sales.orders}
                      onChange={(e) =>
                        updateField(
                          ["sales", "orders"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>الوحدات المباعة</label>

                    <input
                      type="number"
                      min="0"
                      value={form.sales.unitsSold}
                      onChange={(e) =>
                        updateField(
                          ["sales", "unitsSold"],
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>المشاهدات</label>

                    <input
                      type="number"
                      min="0"
                      value={form.sales.views}
                      onChange={(e) =>
                        updateField(
                          ["sales", "views"],
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="subsection-title">
                  <h3>منتجات مرتبطة وتعليمات العناية</h3>
                </div>

                <div className="form-grid two-columns">
                  <div className="field">
                    <label>Related Products</label>

                    <textarea
                      rows="4"
                      value={joinList(
                        form.relatedProducts
                      )}
                      onChange={(e) =>
                        updateField(
                          ["relatedProducts"],
                          e.target.value
                        )
                      }
                      placeholder="product-001, product-002"
                    />
                  </div>

                  <div className="field">
                    <label>Care Instructions</label>

                    <textarea
                      rows="4"
                      value={joinList(
                        form.careInstructions
                      )}
                      onChange={(e) =>
                        updateField(
                          ["careInstructions"],
                          e.target.value
                        )
                      }
                      placeholder="Keep away from water, Clean with soft cloth"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SHIPPING */}
            {activeSection === "shipping" && (
              <section className="form-card">
                <div className="card-header">
                  <div>
                    <span className="section-number">06</span>
                    <h2>الشحن</h2>
                    <p>
                      حدد قواعد الشحن لهذا المنتج.
                    </p>
                  </div>
                </div>

                <div className="toggle-grid">
                  <label className="toggle-card">
                    <input
                      type="checkbox"
                      checked={form.shipping.available}
                      onChange={(e) =>
                        updateField(
                          ["shipping", "available"],
                          e.target.checked
                        )
                      }
                    />

                    <span className="toggle-switch" />

                    <span>
                      الشحن متاح
                    </span>
                  </label>

                  <label className="toggle-card">
                    <input
                      type="checkbox"
                      checked={form.shipping.freeShipping}
                      onChange={(e) =>
                        updateField(
                          ["shipping", "freeShipping"],
                          e.target.checked
                        )
                      }
                    />

                    <span className="toggle-switch" />

                    <span>
                      شحن مجاني
                    </span>
                  </label>
                </div>

                <div className="form-grid three-columns">
                  <div className="field">
                    <label>سعر الشحن</label>

                    <div className="money-input">
                      <input
                        type="number"
                        min="0"
                        value={
                          form.shipping.defaultPrice
                        }
                        disabled={
                          form.shipping.freeShipping
                        }
                        onChange={(e) =>
                          updateField(
                            [
                              "shipping",
                              "defaultPrice",
                            ],
                            e.target.value
                          )
                        }
                      />

                      <span>MAD</span>
                    </div>
                  </div>

                  <div className="field">
                    <label>مدة التوصيل</label>

                    <input
                      value={
                        form.shipping.estimatedDelivery
                      }
                      onChange={(e) =>
                        updateField(
                          [
                            "shipping",
                            "estimatedDelivery",
                          ],
                          e.target.value
                        )
                      }
                      placeholder="2-4 أيام"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SEO */}
            {activeSection === "seo" && (
              <section className="form-card">
                <div className="card-header">
                  <div>
                    <span className="section-number">07</span>
                    <h2>تحسين محركات البحث SEO</h2>
                    <p>
                      المعلومات التي تستخدم لمحركات البحث.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>SEO Title</label>

                    <input
                      value={form.seo.title}
                      onChange={(e) =>
                        updateField(
                          ["seo", "title"],
                          e.target.value
                        )
                      }
                      placeholder="حقيبة ظهر كلاسيك | AMAROC"
                    />
                  </div>

                  <div className="field">
                    <label>SEO Description</label>

                    <textarea
                      rows="5"
                      value={form.seo.description}
                      onChange={(e) =>
                        updateField(
                          ["seo", "description"],
                          e.target.value
                        )
                      }
                      placeholder="وصف المنتج لمحركات البحث..."
                    />
                  </div>

                  <div className="field">
                    <label>SEO Keywords</label>

                    <input
                      value={joinList(
                        form.seo.keywords
                      )}
                      onChange={(e) =>
                        updateField(
                          ["seo", "keywords"],
                          e.target.value
                        )
                      }
                      placeholder="backpack, bag, amaroc"
                    />
                  </div>
                </div>

                <div className="seo-preview">
                  <span>معاينة</span>

                  <h3>
                    {form.seo.title ||
                      form.name ||
                      "عنوان المنتج"}
                  </h3>

                  <p>
                    {form.seo.description ||
                      form.shortDescription ||
                      "وصف المنتج سيظهر هنا..."}
                  </p>

                  <small>
                    amaroc.com/products/
                    {form.slug || "product-slug"}
                  </small>
                </div>
              </section>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="product-sidebar">

            <div className="sidebar-card navigation-card">
              <div className="sidebar-title">
                <span>أقسام المنتج</span>
                <FiChevronDown />
              </div>

              <nav>
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      type="button"
                      key={section.id}
                      className={
                        activeSection === section.id
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSection(section.id)
                      }
                    >
                      <Icon />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="sidebar-card summary-card">
              <div className="sidebar-title">
                <span>ملخص المنتج</span>
              </div>

              <div className="summary-product">
                <div className="summary-image">
                  {form.images[0]?.url ? (
                    <img
                      src={form.images[0].url}
                      alt=""
                    />
                  ) : (
                    <FiPackage />
                  )}
                </div>

                <div>
                  <strong>
                    {form.name || "منتج جديد"}
                  </strong>

                  <span>
                    {form.sku || "SKU غير محدد"}
                  </span>
                </div>
              </div>

              <div className="summary-list">
                <div>
                  <span>السعر</span>
                  <strong>
                    {form.pricing.salePrice !== ""
                      ? form.pricing.salePrice
                      : form.pricing.regularPrice ||
                        "0"}{" "}
                    {form.pricing.currency}
                  </strong>
                </div>

                <div>
                  <span>المخزون</span>
                  <strong>
                    {form.variants.length > 0
                      ? totalVariantQuantity
                      : numberOrZero(
                          form.inventory.quantity
                        )}
                  </strong>
                </div>

                <div>
                  <span>Variants</span>
                  <strong>
                    {form.variants.length}
                  </strong>
                </div>

                <div>
                  <span>النوع</span>
                  <strong>
                    {perfumeMode
                      ? "عطر"
                      : "منتج عادي"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="sidebar-card publish-card">
              <div className="publish-title">
                <div className="publish-icon">
                  <FiCheck />
                </div>

                <div>
                  <strong>جاهز للنشر؟</strong>

                  <span>
                    يمكنك حفظ المنتج كمسودة أو نشره مباشرة.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="publish-button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                <FiCheck />
{loading
  ? isEditMode
    ? "جاري التحديث..."
    : "جاري الحفظ..."
  : isEditMode
  ? "تحديث ونشر المنتج"
  : "حفظ ونشر المنتج"}
                  {/* <FiCheck />
                {loading
                  ? "جاري الحفظ..."
                  : "حفظ ونشر المنتج"}
                  */}
               
              </button>

              <button
                type="button"
                className="draft-button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                <FiSave />
                حفظ كمسودة
              </button>
            </div>

          </aside>
        </div>
      </div>

      <style>
        {`
        .add-product-page {
  min-height: 100vh;
  background: #f7f8fc;
  color: #172033;
  font-family:
    Inter,
    "Tajawal",
    "Segoe UI",
    Arial,
    sans-serif;
  padding: 32px;
}

.add-product-container {
  max-width: 1500px;
  margin: 0 auto;
}

.product-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 28px;
}

.header-main {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.back-button {
  width: 46px;
  height: 46px;
  border: 1px solid #e4e7ef;
  background: #fff;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #4b5567;
  cursor: pointer;
  transition: 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  border-color: #5138df;
  color: #5138df;
  transform: translateY(-1px);
}

.page-eyebrow {
  color: #6857e9;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 7px;
}

.product-page-header h1 {
  margin: 0;
  font-size: 31px;
  line-height: 1.2;
  letter-spacing: -0.7px;
  color: #121827;
}

.product-page-header p {
  margin: 8px 0 0;
  color: #7a8294;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.primary-action,
.secondary-action,
.publish-button,
.draft-button,
.add-button {
  border: 0;
  border-radius: 11px;
  min-height: 45px;
  padding: 0 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-action {
  color: #fff;
  background: #5138df;
  box-shadow: 0 7px 18px rgba(81, 56, 223, 0.2);
}

.primary-action:hover,
.publish-button:hover {
  background: #4430c2;
  transform: translateY(-1px);
}

.secondary-action {
  color: #41495a;
  background: #fff;
  border: 1px solid #e1e4ec;
}

.secondary-action:hover {
  border-color: #cfd3de;
}

.primary-action:disabled,
.secondary-action:disabled,
.publish-button:disabled,
.draft-button:disabled,
.add-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.alert {
  min-height: 52px;
  padding: 13px 17px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
}

.alert-error {
  color: #b42318;
  background: #fff1f0;
  border: 1px solid #ffd6d2;
}

.alert-success {
  color: #18794e;
  background: #effaf4;
  border: 1px solid #c9efd9;
}

.product-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
  align-items: start;
}

.product-main {
  min-width: 0;
}

.form-card,
.sidebar-card {
  background: #fff;
  border: 1px solid #e7e9ef;
  border-radius: 18px;
  box-shadow: 0 5px 25px rgba(25, 35, 55, 0.035);
}

.form-card {
  padding: 30px;
}

.card-header {
  padding-bottom: 25px;
  margin-bottom: 27px;
  border-bottom: 1px solid #eef0f4;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.section-number {
  color: #6b5be8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.card-header h2 {
  margin: 5px 0 5px;
  font-size: 22px;
  color: #161c2a;
}

.card-header p {
  margin: 0;
  color: #858c9d;
  font-size: 14px;
}

.form-grid {
  display: grid;
  gap: 20px;
}

.two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.three-columns {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.four-columns {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.field-full {
  grid-column: 1 / -1;
}

.field {
  min-width: 0;
}

.field label {
  display: block;
  margin-bottom: 8px;
  color: #343c4d;
  font-size: 13px;
  font-weight: 700;
}

.field label span {
  color: #e04747;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #dfe3eb;
  background: #fff;
  color: #1c2433;
  border-radius: 10px;
  outline: none;
  font: inherit;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-sizing: border-box;
}

.field input,
.field select {
  height: 45px;
  padding: 0 13px;
}

.field textarea {
  padding: 12px 13px;
  resize: vertical;
  line-height: 1.65;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #7665e9;
  box-shadow: 0 0 0 3px rgba(81, 56, 223, 0.09);
}

.field input:disabled {
  background: #f3f4f7;
  color: #9097a5;
  cursor: not-allowed;
}

.field small {
  display: block;
  margin-top: 7px;
  color: #9097a5;
  font-size: 11px;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button input {
  flex: 1;
}

.input-with-button button {
  border: 1px solid #dcdfea;
  background: #f8f9fc;
  color: #5141d8;
  border-radius: 10px;
  padding: 0 15px;
  font-weight: 700;
  cursor: pointer;
}

.input-with-button button:hover {
  background: #f0efff;
}

.money-input {
  display: flex;
  height: 45px;
  border: 1px solid #dfe3eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.money-input:focus-within {
  border-color: #7665e9;
  box-shadow: 0 0 0 3px rgba(81, 56, 223, 0.09);
}

.money-input input {
  height: 100%;
  border: 0;
  border-radius: 0;
  box-shadow: none !important;
  flex: 1;
  min-width: 0;
}

.money-input span {
  min-width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7fa;
  border-right: 1px solid #e4e6ec;
  color: #737b8d;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-row {
  display: inline-flex !important;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  margin: 0 !important;
}

.checkbox-row input {
  width: 17px;
  height: 17px;
  accent-color: #5138df;
}

.inventory-status-box {
  height: 45px;
  padding: 0 14px;
  border: 1px solid #dfe3eb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.in_stock {
  background: #21a366;
}

.status-dot.low_stock {
  background: #e99b20;
}

.status-dot.out_of_stock {
  background: #dc4d5d;
}

.inventory-summary {
  margin-top: 28px;
  padding: 18px;
  background: #f8f8fc;
  border: 1px solid #ececf4;
  border-radius: 13px;
  display: flex;
  gap: 50px;
}

.inventory-summary div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.inventory-summary span {
  color: #858c9d;
  font-size: 12px;
}

.inventory-summary strong {
  color: #1b2230;
  font-size: 20px;
}

.add-button {
  color: #5138df;
  background: #f1efff;
  min-height: 42px;
}

.add-button:hover {
  background: #e7e3ff;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f4f1ff;
  color: #5543cf;
  margin-bottom: 22px;
}

.info-banner > svg {
  font-size: 21px;
}

.info-banner div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-banner strong {
  font-size: 13px;
}

.info-banner span {
  font-size: 12px;
  color: #776eab;
}

.empty-state {
  padding: 55px 20px;
  text-align: center;
  border: 1px dashed #d8dbe5;
  border-radius: 15px;
  background: #fbfbfd;
}

.empty-state > svg {
  width: 42px;
  height: 42px;
  color: #8578e8;
  margin-bottom: 13px;
}

.empty-state h3 {
  margin: 0 0 7px;
  font-size: 17px;
}

.empty-state p {
  margin: 0 0 20px;
  color: #8a91a1;
  font-size: 13px;
}

.variants-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.variant-card {
  border: 1px solid #e6e8ee;
  border-radius: 14px;
  padding: 20px;
  background: #fcfcfd;
}

.variant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.variant-header div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.variant-header span {
  color: #8b92a2;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.variant-header strong {
  color: #252c3b;
  font-size: 15px;
}

.delete-button {
  width: 37px;
  height: 37px;
  border: 1px solid #f0d7d7;
  background: #fff7f7;
  color: #d04a4a;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.delete-button:hover {
  background: #ffeaea;
  border-color: #eabbbb;
}

.color-input {
  display: flex;
  gap: 8px;
}

.color-input input[type="color"] {
  width: 45px;
  padding: 4px;
  cursor: pointer;
}

.color-input input[type="text"] {
  flex: 1;
}

.perfume-section {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid #eef0f4;
}

.subsection-title {
  margin: 30px 0 17px;
}

.subsection-title:first-child {
  margin-top: 0;
}

.subsection-title h3 {
  margin: 0 0 4px;
  color: #252c3a;
  font-size: 16px;
}

.subsection-title p {
  margin: 0;
  color: #8a91a1;
  font-size: 12px;
}

.images-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 22px;
}

.image-form-row {
  position: relative;
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) 37px;
  gap: 16px;
  padding: 15px;
  border: 1px solid #e7e9ef;
  border-radius: 13px;
  background: #fcfcfd;
  align-items: center;
}

.image-preview {
  width: 90px;
  height: 90px;
  border-radius: 11px;
  background: #f2f3f7;
  border: 1px solid #e3e5eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #9aa1af;
  font-size: 24px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.image-fields .checkbox-row {
  grid-column: 1 / -1;
}

.image-delete {
  align-self: center;
}

.toggle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.toggle-card {
  min-height: 55px;
  padding: 0 13px;
  border: 1px solid #e5e7ed;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #414858;
  font-size: 13px;
  font-weight: 600;
}

.toggle-card input {
  display: none;
}

.toggle-switch {
  width: 34px;
  height: 19px;
  border-radius: 30px;
  background: #d9dce4;
  position: relative;
  flex-shrink: 0;
  transition: 0.2s ease;
}

.toggle-switch::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  background: #fff;
  border-radius: 50%;
  left: 2px;
  top: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: 0.2s ease;
}

.toggle-card input:checked + .toggle-switch {
  background: #5138df;
}

.toggle-card input:checked + .toggle-switch::after {
  transform: translateX(15px);
}

.seo-preview {
  margin-top: 28px;
  padding: 20px;
  border: 1px solid #e4e7ee;
  border-radius: 13px;
  background: #fbfbfc;
}

.seo-preview > span {
  color: #8c93a2;
  font-size: 11px;
  font-weight: 700;
}

.seo-preview h3 {
  margin: 8px 0 5px;
  color: #1d63bd;
  font-size: 18px;
}

.seo-preview p {
  margin: 0 0 7px;
  color: #515a69;
  font-size: 13px;
  line-height: 1.6;
}

.seo-preview small {
  color: #31864d;
  font-size: 11px;
}

/* SIDEBAR */

.product-sidebar {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  padding: 18px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 3px 14px;
  color: #222938;
  font-size: 14px;
  font-weight: 800;
}

.sidebar-title svg {
  color: #9298a6;
}

.navigation-card nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.navigation-card nav button {
  width: 100%;
  min-height: 44px;
  border: 0;
  background: transparent;
  color: #687080;
  border-radius: 9px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: right;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s ease;
}

.navigation-card nav button svg {
  font-size: 17px;
  flex-shrink: 0;
}

.navigation-card nav button:hover {
  background: #f6f5fd;
  color: #5138df;
}

.navigation-card nav button.active {
  background: #efedff;
  color: #5138df;
  font-weight: 800;
}

.summary-card {
  padding-bottom: 20px;
}

.summary-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0 17px;
  border-bottom: 1px solid #eef0f4;
}

.summary-image {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  background: #f1f2f6;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9299a7;
  flex-shrink: 0;
}

.summary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-product div:last-child {
  min-width: 0;
}

.summary-product strong {
  display: block;
  color: #202735;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.summary-product span {
  display: block;
  margin-top: 4px;
  color: #9299a8;
  font-size: 11px;
  direction: ltr;
  text-align: right;
}

.summary-list {
  padding-top: 13px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.summary-list span {
  color: #838a9a;
  font-size: 12px;
}

.summary-list strong {
  color: #282f3e;
  font-size: 13px;
}

.publish-card {
  background: linear-gradient(
    145deg,
    #fbfaff 0%,
    #f5f3ff 100%
  );
  border-color: #e3defe;
}

.publish-title {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 17px;
}

.publish-icon {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background: #e8e5ff;
  color: #5138df;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.publish-title strong {
  display: block;
  color: #28213f;
  font-size: 13px;
  margin-bottom: 4px;
}

.publish-title span {
  display: block;
  color: #817b99;
  font-size: 11px;
  line-height: 1.5;
}

.publish-button,
.draft-button {
  width: 100%;
}

.publish-button {
  background: #5138df;
  color: #fff;
  margin-bottom: 8px;
}

.draft-button {
  color: #5147a8;
  background: #fff;
  border: 1px solid #ddd8fa;
}

/* RESPONSIVE */

@media (max-width: 1200px) {
  .product-layout {
    grid-template-columns: minmax(0, 1fr) 285px;
  }

  .toggle-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .four-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 950px) {
  .add-product-page {
    padding: 22px;
  }

  .product-layout {
    grid-template-columns: 1fr;
  }

  .product-sidebar {
    position: static;
    order: -1;
  }

  .navigation-card nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-card,
  .publish-card {
    display: none;
  }

  .product-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }
}

@media (max-width: 700px) {
  .add-product-page {
    padding: 14px;
  }

  .product-page-header {
    margin-bottom: 18px;
  }

  .header-main {
    gap: 12px;
  }

  .product-page-header h1 {
    font-size: 24px;
  }

  .product-page-header p {
    font-size: 13px;
  }

  .form-card {
    padding: 20px 16px;
    border-radius: 14px;
  }

  .two-columns,
  .three-columns,
  .four-columns {
    grid-template-columns: 1fr;
  }

  .field-full {
    grid-column: auto;
  }

  .card-header-row {
    flex-direction: column;
  }

  .card-header-row .add-button {
    width: 100%;
  }

  .toggle-grid {
    grid-template-columns: 1fr;
  }

  .image-form-row {
    grid-template-columns: 70px minmax(0, 1fr);
  }

  .image-preview {
    width: 70px;
    height: 70px;
  }

  .image-fields {
    grid-column: 1 / -1;
    grid-template-columns: 1fr;
    order: 3;
  }

  .image-delete {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }

  .navigation-card nav {
    grid-template-columns: 1fr;
  }

  .inventory-summary {
    gap: 25px;
  }
}`}
      </style>

    </div>
  );
}