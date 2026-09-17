 
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import { useProducts } from "../../context/ProductContext";

//import products from "../../components/landing/components/products";
import ProductCard from "../../components/landing/components/ProductCard";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";

export default function ProductDetails() {
 const {
    products,
    loading,
    error,
  } = useProducts();
   if (loading) {
    return <div>جاري تحميل المنتجات...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const { slug } = useParams();
  const { addToCart, openCart } = useCart();


  // ============================================================
  // PRODUCT
  // ============================================================

  const product = useMemo(
    () =>
      products.find(
        (item) =>
          item?.slug === slug &&
          item?.status?.active &&
          item?.status?.published &&
          !item?.status?.archived &&
          !item?.isDeleted
      ),
    [slug]
  );

  // ============================================================
  // STATE
  // ============================================================

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // ============================================================
  // PRODUCT NOT FOUND
  // ============================================================

  if (!product) {
    return (
      <main className="product-not-found">
        <div>
          <span>AMAROC</span>

          <h1>المنتج غير موجود</h1>

          <p>
            عذراً، هذا المنتج غير متوفر أو لم يعد
            منشوراً في المتجر.
          </p>

          <Link to="/products">
            العودة إلى المنتجات
          </Link>
        </div>

        <style>{`
          .product-not-found {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            direction: rtl;
            text-align: center;
            padding: 60px 24px;
          }

          .product-not-found span {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .15em;
            color: #777;
          }

          .product-not-found h1 {
            margin: 15px 0 10px;
            font-size: 34px;
          }

          .product-not-found p {
            margin: 0 0 25px;
            color: #777;
          }

          .product-not-found a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 46px;
            padding: 0 25px;
            background: #111;
            color: #fff;
            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  // ============================================================
  // PRODUCT TYPE
  // ============================================================

  const isPerfume =
    product?.category?.slug === "perfumes" ||
    !!product?.perfume;

  // ============================================================
  // VARIANTS
  // ============================================================

  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  // ============================================================
  // IMAGES
  // ============================================================

  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
    ? [
        {
          url: product.thumbnail,
          alt: product.name,
          isPrimary: true,
        },
      ]
    : [];

  // ============================================================
  // COLORS
  // Only for normal products
  // ============================================================

  const colors = useMemo(() => {
    if (isPerfume) {
      return [];
    }

    return [
      ...new Map(
        variants
          .filter((variant) => variant?.color)
          .map((variant) => [
            variant.color,
            {
              name: variant.color,
              value:
                variant.colorValue ||
                "#111111",
            },
          ])
      ).values(),
    ];
  }, [variants, isPerfume]);

  // ============================================================
  // SIZES
  // Only for normal products
  // ============================================================

  const sizes = useMemo(() => {
    if (isPerfume) {
      return [];
    }

    return [
      ...new Map(
        variants
          .filter((variant) => variant?.size)
          .map((variant) => [
            variant?.sizeValue ||
              variant?.size,
            {
              name: variant?.size,
              value:
                variant?.sizeValue ||
                variant?.size,
            },
          ])
      ).values(),
    ];
  }, [variants, isPerfume]);

  // ============================================================
  // PERFUME VOLUMES
  // ============================================================

  const volumes = useMemo(() => {
    if (!isPerfume) {
      return [];
    }

    return [
      ...new Map(
        variants
          .filter(
            (variant) =>
              variant?.volume !== undefined &&
              variant?.volume !== null
          )
          .map((variant) => {
            const volume = Number(
              variant.volume
            );

            const volumeUnit =
              variant?.volumeUnit || "ml";

            return [
              `${volume}-${volumeUnit}`,
              {
                volume,
                volumeUnit,
              },
            ];
          })
      ).values(),
    ].sort(
      (a, b) => a.volume - b.volume
    );
  }, [variants, isPerfume]);

  // ============================================================
  // ONE SIZE
  // ============================================================

  const isOneSize =
    !isPerfume &&
    sizes.length === 1 &&
    sizes[0]?.value === "ONE_SIZE";

  // ============================================================
  // EFFECTIVE SELECTED VOLUME
  // ============================================================

  const effectiveVolume = useMemo(() => {
    if (!isPerfume || !volumes.length) {
      return null;
    }

    if (selectedVolume !== null) {
      const exists = volumes.some(
        (item) =>
          item.volume ===
            Number(selectedVolume.volume) &&
          item.volumeUnit ===
            (selectedVolume.volumeUnit ||
              "ml")
      );

      if (exists) {
        return selectedVolume;
      }
    }

    // Automatically select if there is
    // only one perfume volume.
    if (volumes.length === 1) {
      return volumes[0];
    }

    return null;
  }, [
    isPerfume,
    volumes,
    selectedVolume,
  ]);

  // ============================================================
  // SELECTED VARIANT
  // ============================================================

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    // ----------------------------------------------------------
    // PERFUME
    // ----------------------------------------------------------

    if (isPerfume) {
      if (!effectiveVolume) {
        return null;
      }

      return (
        variants.find((variant) => {
          const variantVolume =
            Number(variant?.volume);

          const variantUnit =
            variant?.volumeUnit || "ml";

          return (
            variantVolume ===
              Number(
                effectiveVolume.volume
              ) &&
            variantUnit ===
              effectiveVolume.volumeUnit
          );
        }) || null
      );
    }

    // ----------------------------------------------------------
    // NORMAL PRODUCT
    // ----------------------------------------------------------

    return (
      variants.find((variant) => {
        const colorMatches =
          !selectedColor ||
          variant?.color ===
            selectedColor?.name;

        const sizeMatches =
          !selectedSize ||
          variant?.sizeValue ===
            selectedSize?.value ||
          variant?.size ===
            selectedSize?.name;

        return (
          colorMatches &&
          sizeMatches
        );
      }) || null
    );
  }, [
    variants,
    isPerfume,
    effectiveVolume,
    selectedColor,
    selectedSize,
  ]);

  // ============================================================
  // EFFECTIVE VARIANT
  // For ONE_SIZE and automatic single volume
  // ============================================================

  const effectiveVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    if (selectedVariant) {
      return selectedVariant;
    }

    // ----------------------------------------------------------
    // PERFUME
    // ----------------------------------------------------------

    if (isPerfume) {
      return null;
    }

    // ----------------------------------------------------------
    // ONE SIZE
    // ----------------------------------------------------------

    if (isOneSize) {
      return (
        variants.find((variant) => {
          return (
            !selectedColor ||
            variant?.color ===
              selectedColor?.name
          );
        }) || null
      );
    }

    return null;
  }, [
    variants,
    selectedVariant,
    isOneSize,
    selectedColor,
    isPerfume,
  ]);

  // ============================================================
  // PRICING
  // ============================================================

  const regularPrice = Number(
    product?.pricing?.regularPrice || 0
  );

  const salePrice =
    product?.pricing?.salePrice !== null &&
    product?.pricing?.salePrice !== undefined
      ? Number(
          product.pricing.salePrice
        )
      : null;

  const hasDiscount =
    product?.pricing?.discount?.enabled ===
      true &&
    salePrice !== null &&
    salePrice < regularPrice;

  const productCurrentPrice =
    hasDiscount
      ? salePrice
      : regularPrice;

  const currentPrice =
    effectiveVariant?.price !== undefined
      ? Number(effectiveVariant.price)
      : productCurrentPrice;

  const currency =
    product?.pricing?.currency || "MAD";

  // ============================================================
  // DISCOUNT
  // ============================================================

  const discountPercentage =
    hasDiscount && regularPrice > 0
      ? Math.round(
          ((regularPrice - salePrice) /
            regularPrice) *
            100
        )
      : 0;

  // ============================================================
  // STOCK
  // ============================================================

  const productStock = Number(
    product?.inventory?.quantity || 0
  );

  const variantStock = effectiveVariant
    ? Number(
        effectiveVariant?.quantity || 0
      )
    : 0;

  const stockQuantity =
    variants.length > 0
      ? effectiveVariant
        ? variantStock
        : isPerfume
        ? 0
        : productStock
      : productStock;

  // ============================================================
  // REQUIRED VARIANT SELECTION
  // ============================================================

  const isVariantSelectionRequired =
    isPerfume
      ? variants.length > 0 &&
        volumes.length > 1 &&
        !effectiveVolume
      : variants.length > 0 &&
        (
          (colors.length > 0 &&
            !selectedColor) ||
          (
            sizes.length > 1 &&
            !isOneSize &&
            !selectedSize
          )
        );

  // ============================================================
  // OUT OF STOCK
  // ============================================================

  const isOutOfStock =
    isVariantSelectionRequired
      ? false
      : product?.inventory?.status ===
          "out_of_stock" ||
        stockQuantity <= 0;

  // ============================================================
  // LOW STOCK
  // ============================================================

  const isLowStock =
    !isOutOfStock &&
    !isVariantSelectionRequired &&
    stockQuantity <=
      Number(
        product?.inventory
          ?.lowStockThreshold || 0
      );

  // ============================================================
  // CURRENT MAIN IMAGE
  // ============================================================

  const currentImage =
    effectiveVariant?.image ||
    images[selectedImage]?.url ||
    product?.thumbnail ||
    "";

  // ============================================================
  // SELECT COLOR
  // ============================================================

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setQuantity(1);

    // ----------------------------------------------------------
    // Keep selected size only if it exists
    // for the new color.
    // ----------------------------------------------------------

    if (selectedSize) {
      const exists = variants.some(
        (variant) =>
          variant?.color ===
            color?.name &&
          (
            variant?.sizeValue ===
              selectedSize?.value ||
            variant?.size ===
              selectedSize?.name
          )
      );

      if (!exists) {
        setSelectedSize(null);
      }
    }

    // ----------------------------------------------------------
    // Move gallery to variant image
    // ----------------------------------------------------------

    const variant = variants.find(
      (item) =>
        item?.color === color?.name
    );

    if (variant?.image) {
      const imageIndex =
        images.findIndex(
          (image) =>
            image?.url === variant.image
        );

      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  // ============================================================
  // SELECT SIZE
  // ============================================================

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);

    const variant = variants.find(
      (item) => {
        const colorMatches =
          !selectedColor ||
          item?.color ===
            selectedColor?.name;

        const sizeMatches =
          item?.sizeValue ===
            size?.value ||
          item?.size ===
            size?.name;

        return (
          colorMatches &&
          sizeMatches
        );
      }
    );

    if (variant?.image) {
      const imageIndex =
        images.findIndex(
          (image) =>
            image?.url === variant.image
        );

      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  // ============================================================
  // SELECT PERFUME VOLUME
  // ============================================================

  const handleVolumeSelect = (volume) => {
    setSelectedVolume(volume);
    setQuantity(1);

    const variant = variants.find(
      (item) =>
        Number(item?.volume) ===
          Number(volume?.volume) &&
        (item?.volumeUnit || "ml") ===
          (volume?.volumeUnit || "ml")
    );

    if (variant?.image) {
      const imageIndex =
        images.findIndex(
          (image) =>
            image?.url === variant.image
        );

      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  // ============================================================
  // QUANTITY
  // ============================================================

  const increaseQuantity = () => {
    if (
      product?.inventory?.trackQuantity &&
      quantity >= stockQuantity
    ) {
      return;
    }

    if (
      variants.length > 0 &&
      !effectiveVariant
    ) {
      return;
    }

    setQuantity((value) =>
      Math.min(
        value + 1,
        stockQuantity
      )
    );
  };

  const decreaseQuantity = () => {
    setQuantity((value) =>
      Math.max(1, value - 1)
    );
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = () => {
    // ----------------------------------------------------------
    // PERFUME
    // ----------------------------------------------------------

    if (isPerfume) {
      if (
        variants.length > 0 &&
        volumes.length > 1 &&
        !effectiveVolume
      ) {
        toast.error(
          "يرجى اختيار الحجم."
        );
        return;
      }

      if (
        variants.length > 0 &&
        !effectiveVariant
      ) {
        toast.error(
          "الحجم المختار غير متوفر."
        );
        return;
      }

      if (stockQuantity <= 0) {
        toast.error(
          "هذا الحجم غير متوفر حالياً."
        );
        return;
      }

      const result = addToCart(
        product,
        quantity,
        {
          volume:
            effectiveVolume?.volume ??
            null,

          volumeUnit:
            effectiveVolume?.volumeUnit ||
            "ml",
        }
      );

      if (result?.success) {
        toast.success(
          result.message
        );

        openCart();
      } else {
        toast.error(
          result?.message ||
            "تعذر إضافة المنتج إلى السلة."
        );
      }

      return;
    }

    // ----------------------------------------------------------
    // NORMAL PRODUCTS
    // ----------------------------------------------------------

    if (
      variants.length > 0 &&
      colors.length > 0 &&
      !selectedColor
    ) {
      toast.error(
        "يرجى اختيار اللون."
      );
      return;
    }

    if (
      variants.length > 0 &&
      sizes.length > 1 &&
      !isOneSize &&
      !selectedSize
    ) {
      toast.error(
        "يرجى اختيار المقاس."
      );
      return;
    }

    if (
      variants.length > 0 &&
      !effectiveVariant
    ) {
      toast.error(
        "التركيبة المختارة غير متوفرة."
      );
      return;
    }

    if (stockQuantity <= 0) {
      toast.error(
        "هذا الخيار غير متوفر حالياً."
      );
      return;
    }

    const result = addToCart(
      product,
      quantity,
      {
        color: selectedColor,

        size:
          selectedSize ||
          (isOneSize
            ? sizes[0]
            : null),
      }
    );

    if (result?.success) {
      toast.success(
        result.message
      );

      openCart();
    } else {
      toast.error(
        result?.message ||
          "تعذر إضافة المنتج إلى السلة."
      );
    }
  };

  // ============================================================
  // RELATED PRODUCTS
  // ============================================================

  const relatedProducts = useMemo(() => {
    const relatedIds =
      Array.isArray(
        product?.relatedProducts
      )
        ? product.relatedProducts
        : [];

    // ----------------------------------------------------------
    // Explicit related products
    // ----------------------------------------------------------

    const explicitRelated =
      relatedIds
        .map((id) =>
          products.find(
            (item) =>
              item?._id === id &&
              item?.status?.active &&
              item?.status?.published &&
              !item?.status?.archived &&
              !item?.isDeleted
          )
        )
        .filter(Boolean);

    // ----------------------------------------------------------
    // Same category
    // ----------------------------------------------------------

    const sameCategory =
      products.filter(
        (item) =>
          item?._id !== product?._id &&
          item?.status?.active &&
          item?.status?.published &&
          !item?.status?.archived &&
          !item?.isDeleted &&
          item?.category?.slug ===
            product?.category?.slug &&
          !explicitRelated.some(
            (related) =>
              related?._id ===
              item?._id
          )
      );

    return [
      ...explicitRelated,
      ...sameCategory,
    ].slice(0, 4);
  }, [product]);

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const selectedColorName =
    selectedColor?.name || "";

  const selectedSizeName =
    selectedSize?.name ||
    (isOneSize
      ? sizes[0]?.name
      : "");

  const selectedVolumeLabel =
    effectiveVolume
      ? `${effectiveVolume.volume} ${effectiveVolume.volumeUnit}`
      : "";

  const genderLabel = {
    men: "رجالي",
    women: "نسائي",
    unisex: "للجميع",
  };

  const styleLabel = {
    sport: "رياضي",
    classic: "كلاسيكي",
    elegant: "أنيق",
    casual: "كاجوال",
    travel: "سفر",
  };

  const seasonLabel = {
    summer: "الصيف",
    winter: "الشتاء",
    autumn: "الخريف",
    spring: "الربيع",
    all: "جميع المواسم",
  };

  const concentrationLabel = {
    parfum: "Parfum",
    edp: "Eau de Parfum",
    edt: "Eau de Toilette",
    edc: "Eau de Cologne",
  };

  const fragranceFamilyLabel = {
    woody: "خشبية",
    floral: "زهرية",
    citrus: "حمضية",
    oriental: "شرقية",
    fresh: "منعشة",
    aromatic: "عطرية",
    fruity: "فاكهية",
    gourmand: "غورماند",
  };

  const sillageLabel = {
    light: "خفيف",
    moderate: "متوسط",
    strong: "قوي",
    heavy: "قوي جداً",
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="product-details-page">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="product-breadcrumb">
        <Link to="/">
          الرئيسية
        </Link>

        <span>/</span>

        <Link to="/products">
          المنتجات
        </Link>

        <span>/</span>

        <Link
          to={`/products?category=${product?.category?.slug}`}
        >
          {product?.category?.name}
        </Link>

        <span>/</span>

        <strong>
          {product?.name}
        </strong>
      </div>

      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="product-main">
        {/* ================= IMAGE GALLERY ================= */}

        <div className="product-gallery">
          <div className="product-thumbnails">
            {images.map(
              (image, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    selectedImage ===
                    index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => {
                    setSelectedImage(
                      index
                    );
                  }}
                >
                  <img
                    src={image?.url}
                    alt={
                      image?.alt ||
                      product?.name
                    }
                  />
                </button>
              )
            )}
          </div>

          <div className="product-main-image">
            {/* ================= BADGES ================= */}

            {product?.badge?.enabled &&
              product?.badge?.type ===
                "sale" && (
                <span className="details-sale-badge">
                  {product?.badge?.text ||
                    `-${discountPercentage}%`}
                </span>
              )}

            {product?.badge?.enabled &&
              product?.badge?.type ===
                "new" && (
                <span className="details-new-badge">
                  {product?.badge?.text ||
                    "جديد"}
                </span>
              )}

            {product?.badge?.enabled &&
              product?.badge?.type ===
                "bestseller" && (
                <span className="details-bestseller-badge">
                  {product?.badge?.text ||
                    "الأكثر مبيعاً"}
                </span>
              )}

            {isOutOfStock && (
              <span className="details-out-badge">
                نفد المخزون
              </span>
            )}

            {/* ================= WISHLIST ================= */}

            <button
              type="button"
              className={
                isFavorite
                  ? "details-wishlist active"
                  : "details-wishlist"
              }
              onClick={() =>
                setIsFavorite(
                  (value) => !value
                )
              }
              aria-label="إضافة إلى المفضلة"
            >
              <FiHeart />
            </button>

            {/* ================= IMAGE ================= */}

            <img
              src={currentImage}
              alt={
                images[selectedImage]
                  ?.alt ||
                product?.name
              }
            />

            {/* ================= STOCK ================= */}

            {isOutOfStock && (
              <div className="details-stock-overlay">
                نفد المخزون
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            PRODUCT INFO
        ================================================= */}

        <div className="product-details-info">
          {/* CATEGORY */}

          <div className="details-category">
            {product?.category?.name}
          </div>

          {/* NAME */}

          <h1>
            {product?.name}
          </h1>

          {/* SKU */}

          <div className="details-sku">
            SKU:{" "}
            {effectiveVariant?.sku ||
              product?.sku}
          </div>

          {/* RATING */}

          <div className="details-rating">
            <div className="details-stars">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <FiStar
                  key={index}
                />
              ))}
            </div>

            <span>
              {product?.rating?.average ||
                0}
            </span>

            <span className="rating-count">
              (
              {product?.rating?.count ||
                0}{" "}
              تقييم)
            </span>
          </div>

          {/* =================================================
              PRICE
          ================================================= */}

          <div className="details-price">
            <strong>
              {currentPrice.toFixed(2)}{" "}
              {currency}
            </strong>

            {hasDiscount && (
              <>
                <del>
                  {regularPrice.toFixed(
                    2
                  )}{" "}
                  {currency}
                </del>

                <span className="discount-text">
                  وفر{" "}
                  {(
                    regularPrice -
                    salePrice
                  ).toFixed(2)}{" "}
                  {currency}
                </span>
              </>
            )}
          </div>

          {/* SHORT DESCRIPTION */}

          <p className="details-short-description">
            {product?.shortDescription}
          </p>

          {/* =================================================
              PERFUME VOLUME
          ================================================= */}

          {isPerfume &&
            volumes.length > 0 && (
              <div className="option-section">
                <div className="option-heading">
                  <strong>
                    الحجم
                  </strong>

                  {effectiveVolume && (
                    <span>
                      {
                        selectedVolumeLabel
                      }
                    </span>
                  )}
                </div>

                <div className="size-options">
                  {volumes.map(
                    (volume) => {
                      const variant =
                        variants.find(
                          (item) =>
                            Number(
                              item?.volume
                            ) ===
                              Number(
                                volume.volume
                              ) &&
                            (item?.volumeUnit ||
                              "ml") ===
                              (volume.volumeUnit ||
                                "ml")
                        );

                      const volumeHasStock =
                        Number(
                          variant?.quantity ||
                            0
                        ) > 0;

                      const isSelected =
                        effectiveVolume
                          ?.volume ===
                            volume.volume &&
                        effectiveVolume
                          ?.volumeUnit ===
                            volume.volumeUnit;

                      return (
                        <button
                          key={`${volume.volume}-${volume.volumeUnit}`}
                          type="button"
                          disabled={
                            !volumeHasStock
                          }
                          className={
                            isSelected
                              ? "size-option active"
                              : !volumeHasStock
                              ? "size-option disabled"
                              : "size-option"
                          }
                          onClick={() =>
                            handleVolumeSelect(
                              volume
                            )
                          }
                        >
                          {volume.volume}{" "}
                          {volume.volumeUnit}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

          {/* =================================================
              COLORS
          ================================================= */}

          {!isPerfume &&
            colors.length > 0 && (
              <div className="option-section">
                <div className="option-heading">
                  <strong>
                    اللون
                  </strong>

                  {selectedColor && (
                    <span>
                      {selectedColorName}
                    </span>
                  )}
                </div>

                <div className="color-options">
                  {colors.map(
                    (color) => {
                      const colorHasStock =
                        variants.some(
                          (variant) =>
                            variant?.color ===
                              color?.name &&
                            Number(
                              variant?.quantity ||
                                0
                            ) > 0
                        );

                      return (
                        <button
                          key={
                            color?.name
                          }
                          type="button"
                          className={
                            selectedColor?.name ===
                            color?.name
                              ? "color-option active"
                              : "color-option"
                          }
                          title={
                            colorHasStock
                              ? color?.name
                              : `${color?.name} - غير متوفر`
                          }
                          onClick={() =>
                            handleColorSelect(
                              color
                            )
                          }
                        >
                          <span
                            style={{
                              backgroundColor:
                                color?.value,
                            }}
                          />

                          {!colorHasStock && (
                            <i />
                          )}

                          {selectedColor?.name ===
                            color?.name && (
                            <FiCheck />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

          {/* =================================================
              SIZES
          ================================================= */}

          {!isPerfume &&
            sizes.length > 0 &&
            !isOneSize && (
              <div className="option-section">
                <div className="option-heading">
                  <strong>
                    المقاس
                  </strong>

                  {selectedSize && (
                    <span>
                      {selectedSizeName}
                    </span>
                  )}
                </div>

                <div className="size-options">
                  {sizes.map((size) => {
                    const sizeHasStock =
                      variants.some(
                        (variant) => {
                          const colorMatches =
                            !selectedColor ||
                            variant?.color ===
                              selectedColor?.name;

                          const sizeMatches =
                            variant?.sizeValue ===
                              size?.value ||
                            variant?.size ===
                              size?.name;

                          return (
                            colorMatches &&
                            sizeMatches &&
                            Number(
                              variant?.quantity ||
                                0
                            ) > 0
                          );
                        }
                      );

                    return (
                      <button
                        key={size?.value}
                        type="button"
                        disabled={
                          !sizeHasStock
                        }
                        className={
                          selectedSize?.value ===
                          size?.value
                            ? "size-option active"
                            : !sizeHasStock
                            ? "size-option disabled"
                            : "size-option"
                        }
                        onClick={() =>
                          handleSizeSelect(
                            size
                          )
                        }
                      >
                        {size?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* =================================================
              ONE SIZE
          ================================================= */}

          {!isPerfume &&
            isOneSize && (
              <div className="option-section">
                <div className="option-heading">
                  <strong>
                    المقاس
                  </strong>

                  <span>
                    موحد
                  </span>
                </div>

                <div className="one-size-label">
                  مقاس موحد
                </div>
              </div>
            )}

          {/* =================================================
              SELECTED VARIANT
          ================================================= */}

          {effectiveVariant && (
            <div className="selected-variant-info">
              {effectiveVariant?.sku && (
                <span>
                  {effectiveVariant.sku}
                </span>
              )}

              {isPerfume &&
                effectiveVariant?.volume && (
                  <span>
                    {effectiveVariant.volume}{" "}
                    {effectiveVariant.volumeUnit ||
                      "ml"}
                  </span>
                )}

              {!isPerfume &&
                effectiveVariant?.color && (
                  <span>
                    {
                      effectiveVariant.color
                    }
                  </span>
                )}

              {!isPerfume &&
                effectiveVariant?.size && (
                  <span>
                    {
                      effectiveVariant.size
                    }
                  </span>
                )}
            </div>
          )}

          {/* =================================================
              PERFUME INFO SUMMARY
          ================================================= */}

          {isPerfume &&
            product?.perfume && (
              <div className="selected-variant-info">
                {product.perfume
                  ?.concentration && (
                  <span>
                    {
                      concentrationLabel[
                        product.perfume
                          .concentration
                      ]
                    }
                  </span>
                )}

                {product.perfume
                  ?.fragranceFamily && (
                  <span>
                    {
                      fragranceFamilyLabel[
                        product.perfume
                          .fragranceFamily
                      ] ||
                        product.perfume
                          .fragranceFamily
                    }
                  </span>
                )}

                {product.perfume
                  ?.longevity && (
                  <span>
                    ثبات{" "}
                    {
                      product.perfume
                        .longevity
                    }
                  </span>
                )}
              </div>
            )}

          {/* =================================================
              STOCK
          ================================================= */}

          <div className="availability">
            {isVariantSelectionRequired ? (
              <span className="select-option-stock">
                <FiCheck />
                اختر الخيارات لمعرفة التوفر
              </span>
            ) : isOutOfStock ? (
              <span className="out-stock">
                غير متوفر حالياً
              </span>
            ) : isLowStock ? (
              <span className="low-stock">
                متبقي{" "}
                {stockQuantity} فقط
              </span>
            ) : (
              <span className="in-stock">
                <FiCheck />
                متوفر في المخزون
              </span>
            )}
          </div>

          {/* =================================================
              PURCHASE
          ================================================= */}

          {!isOutOfStock && (
            <div className="purchase-row">
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  aria-label="تقليل الكمية"
                >
                  <FiMinus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  aria-label="زيادة الكمية"
                  disabled={
                    isVariantSelectionRequired ||
                    quantity >=
                      stockQuantity
                  }
                >
                  <FiPlus />
                </button>
              </div>

              <button
                type="button"
                className="add-to-cart"
                onClick={
                  handleAddToCart
                }
                disabled={
                  isVariantSelectionRequired
                }
              >
                <FiShoppingBag />

                {isVariantSelectionRequired
                  ? isPerfume
                    ? "اختر الحجم أولاً"
                    : "اختر الخيارات أولاً"
                  : "إضافة إلى السلة"}
              </button>
            </div>
          )}

          {/* =================================================
              SERVICES
          ================================================= */}

          <div className="product-services">
            <div className="service-item">
              <FiTruck />

              <div>
                <strong>
                  توصيل سريع
                </strong>

                <span>
                  {product?.shipping
                    ?.estimatedDelivery ||
                    "2-4 أيام"}
                </span>
              </div>
            </div>

            <div className="service-item">
              <FiShield />

              <div>
                <strong>
                  دفع آمن
                </strong>

                <span>
                  معاملات آمنة وموثوقة
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <section className="product-information">
        <div className="information-content">
          {/* ================= DESCRIPTION ================= */}

          <div className="information-column">
            <span className="information-eyebrow">
              PRODUCT DETAILS
            </span>

            <h2>
              تفاصيل المنتج
            </h2>

            <p>
              {product?.description}
            </p>

            {/* FEATURES */}

            {product?.features?.length >
              0 && (
              <div className="features-block">
                <h3>
                  المميزات
                </h3>

                <div className="features-list">
                  {product.features.map(
                    (
                      feature,
                      index
                    ) => (
                      <div
                        className="feature-item"
                        key={index}
                      >
                        <FiCheck />

                        <span>
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= SPECIFICATIONS ================= */}

          <div className="specifications">
            <h3>
              المواصفات
            </h3>

            {/* BRAND */}

            <div className="specification-row">
              <span>
                العلامة التجارية
              </span>

              <strong>
                {product?.brand}
              </strong>
            </div>

            {/* SKU */}

            <div className="specification-row">
              <span>
                SKU
              </span>

              <strong>
                {effectiveVariant?.sku ||
                  product?.sku}
              </strong>
            </div>

            {/* =================================================
                PERFUME SPECIFICATIONS
            ================================================= */}

            {isPerfume &&
              product?.perfume && (
                <>
                  {product.perfume
                    ?.gender && (
                    <div className="specification-row">
                      <span>
                        الجنس
                      </span>

                      <strong>
                        {genderLabel[
                          product
                            .perfume
                            .gender
                        ] ||
                          product
                            .perfume
                            .gender}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.concentration && (
                    <div className="specification-row">
                      <span>
                        التركيز
                      </span>

                      <strong>
                        {concentrationLabel[
                          product
                            .perfume
                            .concentration
                        ] ||
                          product
                            .perfume
                            .concentration}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.fragranceFamily && (
                    <div className="specification-row">
                      <span>
                        العائلة العطرية
                      </span>

                      <strong>
                        {fragranceFamilyLabel[
                          product
                            .perfume
                            .fragranceFamily
                        ] ||
                          product
                            .perfume
                            .fragranceFamily}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.longevity && (
                    <div className="specification-row">
                      <span>
                        مدة الثبات
                      </span>

                      <strong>
                        {
                          product
                            .perfume
                            .longevity
                        }
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.sillage && (
                    <div className="specification-row">
                      <span>
                        الفوحان
                      </span>

                      <strong>
                        {sillageLabel[
                          product
                            .perfume
                            .sillage
                        ] ||
                          product
                            .perfume
                            .sillage}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.season?.length >
                    0 && (
                    <div className="specification-row">
                      <span>
                        الموسم
                      </span>

                      <strong>
                        {product.perfume.season
                          .map(
                            (season) =>
                              seasonLabel[
                                season
                              ] ||
                              season
                          )
                          .join("، ")}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.occasion?.length >
                    0 && (
                    <div className="specification-row">
                      <span>
                        المناسبة
                      </span>

                      <strong>
                        {product.perfume.occasion.join(
                          "، "
                        )}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.topNotes?.length >
                    0 && (
                    <div className="specification-row">
                      <span>
                        النوتات العليا
                      </span>

                      <strong>
                        {product.perfume.topNotes.join(
                          "، "
                        )}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.middleNotes?.length >
                    0 && (
                    <div className="specification-row">
                      <span>
                        النوتات الوسطى
                      </span>

                      <strong>
                        {product.perfume.middleNotes.join(
                          "، "
                        )}
                      </strong>
                    </div>
                  )}

                  {product.perfume
                    ?.baseNotes?.length >
                    0 && (
                    <div className="specification-row">
                      <span>
                        النوتات الأساسية
                      </span>

                      <strong>
                        {product.perfume.baseNotes.join(
                          "، "
                        )}
                      </strong>
                    </div>
                  )}
                </>
              )}

            {/* =================================================
                NORMAL PRODUCT SPECIFICATIONS
            ================================================= */}

            {product?.details
              ?.material && (
              <div className="specification-row">
                <span>
                  المادة
                </span>

                <strong>
                  {
                    product.details
                      .material
                  }
                </strong>
              </div>
            )}

            {!isPerfume &&
              product?.details
                ?.gender && (
                <div className="specification-row">
                  <span>
                    الجنس
                  </span>

                  <strong>
                    {genderLabel[
                      product.details
                        .gender
                    ] ||
                      product.details
                        .gender}
                  </strong>
                </div>
              )}

            {!isPerfume &&
              product?.details
                ?.style && (
                <div className="specification-row">
                  <span>
                    النمط
                  </span>

                  <strong>
                    {styleLabel[
                      product.details
                        .style
                    ] ||
                      product.details
                        .style}
                  </strong>
                </div>
              )}

            {!isPerfume &&
              product?.details
                ?.season && (
                <div className="specification-row">
                  <span>
                    الموسم
                  </span>

                  <strong>
                    {seasonLabel[
                      product.details
                        .season
                    ] ||
                      product.details
                        .season}
                  </strong>
                </div>
              )}

            {product?.details
              ?.countryOfOrigin && (
              <div className="specification-row">
                <span>
                  بلد المنشأ
                </span>

                <strong>
                  {
                    product.details
                      .countryOfOrigin
                  }
                </strong>
              </div>
            )}

            {product?.details
              ?.warranty && (
              <div className="specification-row">
                <span>
                  الضمان
                </span>

                <strong>
                  {
                    product.details
                      .warranty
                  }
                </strong>
              </div>
            )}

            {/* DIMENSIONS */}

            {product?.dimensions && (
              <div className="specification-row">
                <span>
                  الأبعاد
                </span>

                <strong>
                  {
                    product.dimensions
                      .length
                  }
                  {" × "}
                  {
                    product.dimensions
                      .width
                  }
                  {" × "}
                  {
                    product.dimensions
                      .height
                  }
                  {" "}
                  {
                    product.dimensions
                      .unit
                  }
                </strong>
              </div>
            )}

            {/* WEIGHT */}

            {product?.weight && (
              <div className="specification-row">
                <span>
                  الوزن
                </span>

                <strong>
                  {
                    product.weight
                      .value
                  }{" "}
                  {
                    product.weight
                      .unit
                  }
                </strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CARE INSTRUCTIONS
      ===================================================== */}

      {product?.careInstructions
        ?.length > 0 && (
        <section className="care-section">
          <div className="care-content">
            <div>
              <span className="information-eyebrow">
                CARE INSTRUCTIONS
              </span>

              <h2>
                تعليمات العناية
              </h2>
            </div>

            <div className="care-list">
              {product.careInstructions.map(
                (
                  instruction,
                  index
                ) => (
                  <div
                    className="care-item"
                    key={index}
                  >
                    <FiCheck />

                    <span>
                      {instruction}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SHIPPING
      ===================================================== */}

      <section className="shipping-section">
        <div className="shipping-box">
          <FiTruck />

          <div>
            <strong>
              معلومات الشحن
            </strong>

            <p>
              {product?.shipping
                ?.available
                ? product.shipping
                    ?.freeShipping
                  ? "الشحن مجاني لهذا المنتج."
                  : `تكلفة الشحن ${Number(
                      product.shipping
                        ?.defaultPrice ||
                        0
                    ).toFixed(2)} ${currency}.`
                : "الشحن غير متوفر لهذا المنتج حالياً."}
            </p>

            {product?.shipping
              ?.estimatedDelivery && (
              <span className="shipping-delivery">
                مدة التوصيل المتوقعة:{" "}
                {
                  product.shipping
                    .estimatedDelivery
                }
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-header">
            <div>
              <span>
                AMAROC
              </span>

              <h2>
                قد يعجبك أيضاً
              </h2>
            </div>

            <Link to="/products">
              عرض جميع المنتجات
            </Link>
          </div>

          <div className="related-grid">
            {relatedProducts.map(
              (item) => (
                <Link
                  key={item?._id}
                  to={`/products/${item?.slug}`}
                  className="related-card-link"
                >
                  <ProductCard
                    product={item}
                  />
                </Link>
              )
            )}
          </div>
        </section>
      )}



      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PRODUCT DETAILS PAGE
        ===================================================== */

        .product-details-page {
          width: 100%;
          direction: rtl;
          background: #fff;
          color: #171717;
        }


        /* =====================================================
           BREADCRUMB
        ===================================================== */

        .product-breadcrumb {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 115px 0 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #999;
          font-size: 12px;
        }

        .product-breadcrumb a {
          color: #777;
          text-decoration: none;
          transition: color .2s ease;
        }

        .product-breadcrumb a:hover {
          color: #111;
        }

        .product-breadcrumb strong {
          color: #222;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        /* =====================================================
           MAIN PRODUCT
        ===================================================== */

        .product-main {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 20px 0 90px;
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(380px, .92fr);
          gap: 70px;
          align-items: start;
        }


        /* =====================================================
           GALLERY
        ===================================================== */

        .product-gallery {
          display: grid;
          grid-template-columns:
            82px minmax(0, 1fr);
          direction: ltr;
          gap: 14px;
        }

        .product-thumbnails {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .thumbnail {
          width: 82px;
          height: 92px;
          padding: 0;
          border: 1px solid #e7e7e7;
          background: #f7f7f7;
          cursor: pointer;
          overflow: hidden;
          transition:
            border-color .2s ease,
            opacity .2s ease;
        }

        .thumbnail:hover {
          border-color: #aaa;
        }

        .thumbnail.active {
          border-color: #111;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }


        /* =====================================================
           MAIN IMAGE
        ===================================================== */

        .product-main-image {
          position: relative;
          aspect-ratio: 1 / 1.12;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-main-image > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }


        /* =====================================================
           BADGES
        ===================================================== */

        .details-sale-badge,
        .details-new-badge,
        .details-bestseller-badge,
        .details-out-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 4;
          min-height: 30px;
          padding: 6px 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
        }

        .details-sale-badge {
          background: #b42318;
        }

        .details-new-badge {
          background: #111;
        }

        .details-bestseller-badge {
          background: #111;
        }

        .details-out-badge {
          background: #555;
        }


        /* =====================================================
           WISHLIST
        ===================================================== */

        .details-wishlist {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #222;
          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .details-wishlist:hover,
        .details-wishlist.active {
          background: #111;
          color: #fff;
          transform: scale(1.04);
        }

        .details-wishlist svg {
          width: 19px;
          height: 19px;
        }


        /* =====================================================
           STOCK OVERLAY
        ===================================================== */

        .details-stock-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.6);
          backdrop-filter: blur(2px);
          font-size: 15px;
          font-weight: 600;
        }


        /* =====================================================
           DETAILS INFO
        ===================================================== */

        .product-details-info {
          padding-top: 5px;
        }

        .details-category {
          margin-bottom: 13px;
          color: #777;
          font-size: 12px;
        }

        .product-details-info h1 {
          margin: 0;
          color: #111;
          font-size: clamp(30px, 3vw, 42px);
          line-height: 1.3;
          font-weight: 650;
        }

        .details-sku {
          margin-top: 9px;
          color: #999;
          font-size: 10px;
          direction: ltr;
          text-align: right;
        }


        /* =====================================================
           RATING
        ===================================================== */

        .details-rating {
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .details-stars {
          display: flex;
          direction: ltr;
          gap: 2px;
        }

        .details-stars svg {
          width: 14px;
          height: 14px;
          fill: #111;
          stroke: #111;
        }

        .rating-count {
          color: #888;
        }


        /* =====================================================
           PRICE
        ===================================================== */

        .details-price {
          margin-top: 25px;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 12px;
        }

        .details-price strong {
          font-size: 25px;
          font-weight: 700;
          color: #111;
        }

        .details-price del {
          font-size: 14px;
          color: #999;
        }

        .discount-text {
          color: #b42318;
          font-size: 12px;
          font-weight: 600;
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .details-short-description {
          margin: 22px 0 0;
          padding-bottom: 24px;
          border-bottom: 1px solid #e9e9e9;
          color: #777;
          font-size: 14px;
          line-height: 2;
        }


        /* =====================================================
           OPTIONS
        ===================================================== */

        .option-section {
          padding: 22px 0;
          border-bottom: 1px solid #e9e9e9;
        }

        .option-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
          font-size: 13px;
        }

        .option-heading span {
          color: #777;
          font-weight: 400;
        }


        /* =====================================================
           COLORS
        ===================================================== */

        .color-options {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .color-option {
          position: relative;
          width: 35px;
          height: 35px;
          padding: 3px;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
        }

        .color-option > span {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,.15);
        }

        .color-option.active {
          border-color: #111;
        }

        .color-option svg {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 14px;
          height: 14px;
          color: #fff;
          filter: drop-shadow(
            0 1px 2px rgba(0,0,0,.5)
          );
          z-index: 2;
        }

        .color-option i {
          position: absolute;
          width: 2px;
          height: 36px;
          background: #b42318;
          top: 0;
          left: 50%;
          transform: rotate(45deg);
          z-index: 2;
        }


        /* =====================================================
           SIZES
        ===================================================== */

        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size-option {
          min-width: 62px;
          height: 42px;
          padding: 0 15px;
          border: 1px solid #ddd;
          background: #fff;
          color: #222;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          transition: all .2s ease;
        }

        .size-option:hover,
        .size-option.active {
          border-color: #111;
          background: #111;
          color: #fff;
        }

        .size-option.disabled,
        .size-option:disabled {
          color: #aaa;
          background: #f7f7f7;
          border-color: #e5e5e5;
          text-decoration: line-through;
          cursor: not-allowed;
        }

        .one-size-label {
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          padding: 0 18px;
          border: 1px solid #111;
          background: #111;
          color: #fff;
          font-size: 12px;
        }


        /* =====================================================
           SELECTED VARIANT
        ===================================================== */

        .selected-variant-info {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .selected-variant-info span {
          display: inline-flex;
          align-items: center;
          min-height: 27px;
          padding: 0 9px;
          background: #f5f5f5;
          color: #666;
          font-size: 10px;
        }


        /* =====================================================
           AVAILABILITY
        ===================================================== */

        .availability {
          padding-top: 18px;
        }

        .in-stock,
        .low-stock,
        .out-stock,
        .select-option-stock {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .in-stock {
          color: #267a3d;
        }

        .low-stock,
        .out-stock {
          color: #b42318;
        }

        .select-option-stock {
          color: #777;
        }

        .in-stock svg,
        .select-option-stock svg {
          width: 14px;
          height: 14px;
        }


        /* =====================================================
           PURCHASE
        ===================================================== */

        .purchase-row {
          margin-top: 16px;
          display: grid;
          grid-template-columns:
            115px minmax(0,1fr);
          gap: 10px;
        }

        .quantity-selector {
          height: 52px;
          display: grid;
          grid-template-columns:
            34px 1fr 34px;
          align-items: center;
          border: 1px solid #ddd;
        }

        .quantity-selector button {
          height: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
        }

        .quantity-selector button:hover {
          background: #f5f5f5;
        }

        .quantity-selector button:disabled {
          color: #bbb;
          cursor: not-allowed;
        }

        .quantity-selector svg {
          width: 14px;
          height: 14px;
        }

        .quantity-selector span {
          text-align: center;
          font-size: 13px;
        }

        .add-to-cart {
          height: 52px;
          border: none;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background .2s ease,
            opacity .2s ease;
        }

        .add-to-cart:hover {
          background: #292929;
        }

        .add-to-cart:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .add-to-cart svg {
          width: 18px;
          height: 18px;
        }


        /* =====================================================
           SERVICES
        ===================================================== */

        .product-services {
          margin-top: 28px;
          border-top: 1px solid #e9e9e9;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .service-item {
          padding: 20px 0;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .service-item + .service-item {
          border-right: 1px solid #e9e9e9;
          padding-right: 20px;
        }

        .service-item > svg {
          width: 20px;
          height: 20px;
          color: #333;
        }

        .service-item div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .service-item strong {
          font-size: 12px;
        }

        .service-item span {
          color: #888;
          font-size: 11px;
        }


        /* =====================================================
           INFORMATION
        ===================================================== */

        .product-information {
          border-top: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          background: #fafafa;
        }

        .information-content {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 80px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
        }

        .information-eyebrow {
          color: #777;
          font-size: 11px;
          letter-spacing: .14em;
          font-weight: 700;
        }

        .information-column h2 {
          margin: 12px 0 18px;
          font-size: 30px;
          font-weight: 650;
        }

        .information-column p {
          max-width: 540px;
          margin: 0;
          color: #777;
          font-size: 14px;
          line-height: 2.1;
        }


        /* =====================================================
           FEATURES
        ===================================================== */

        .features-block {
          margin-top: 35px;
        }

        .features-block h3 {
          margin: 0 0 18px;
          font-size: 17px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #555;
          font-size: 13px;
        }

        .feature-item svg {
          width: 15px;
          height: 15px;
          color: #267a3d;
          flex-shrink: 0;
        }


        /* =====================================================
           SPECIFICATIONS
        ===================================================== */

        .specifications h3 {
          margin: 0 0 18px;
          font-size: 17px;
        }

        .specification-row {
          min-height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #e4e4e4;
          font-size: 12px;
        }

        .specification-row span {
          color: #888;
        }

        .specification-row strong {
          color: #222;
          font-weight: 500;
          text-align: left;
        }


        /* =====================================================
           CARE
        ===================================================== */

        .care-section {
          border-bottom: 1px solid #e9e9e9;
          background: #fff;
        }

        .care-content {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 60px 0;
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 100px;
        }

        .care-content h2 {
          margin: 10px 0 0;
          font-size: 27px;
          font-weight: 650;
        }

        .care-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 25px;
        }

        .care-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #666;
          font-size: 13px;
          line-height: 1.8;
        }

        .care-item svg {
          width: 15px;
          height: 15px;
          margin-top: 4px;
          color: #267a3d;
          flex-shrink: 0;
        }


        /* =====================================================
           SHIPPING
        ===================================================== */

        .shipping-section {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 55px 0;
        }

        .shipping-box {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 24px;
          border: 1px solid #e7e7e7;
          background: #fff;
        }

        .shipping-box > svg {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
        }

        .shipping-box strong {
          font-size: 13px;
        }

        .shipping-box p {
          margin: 6px 0 0;
          color: #777;
          font-size: 12px;
        }

        .shipping-delivery {
          display: block;
          margin-top: 6px;
          color: #999;
          font-size: 11px;
        }


        /* =====================================================
           RELATED PRODUCTS
        ===================================================== */

        .related-products {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 20px 0 100px;
        }

        .related-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .related-header span {
          color: #777;
          font-size: 10px;
          letter-spacing: .14em;
          font-weight: 700;
        }

        .related-header h2 {
          margin: 8px 0 0;
          font-size: 27px;
        }

        .related-header a {
          color: #222;
          font-size: 12px;
          text-decoration: none;
          border-bottom: 1px solid #222;
          padding-bottom: 4px;
        }

        .related-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .related-card-link {
          color: inherit;
          text-decoration: none;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1000px) {

          .product-main {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .product-details-info {
            max-width: 700px;
          }

          .information-content {
            gap: 50px;
          }

          .care-content {
            gap: 50px;
          }

          .related-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .product-breadcrumb {
            width: calc(100% - 32px);
            padding: 115px 0 20px;
            overflow: hidden;
            white-space: nowrap;
          }

          .product-main {
            width: calc(100% - 32px);
            padding: 5px 0 55px;
            gap: 35px;
          }

          .product-gallery {
            grid-template-columns:
              60px minmax(0,1fr);
            gap: 8px;
          }

          .thumbnail {
            width: 60px;
            height: 68px;
          }

          .product-details-info h1 {
            font-size: 29px;
          }

          .details-price strong {
            font-size: 22px;
          }

          .purchase-row {
            grid-template-columns:
              100px minmax(0,1fr);
          }

          .product-services {
            grid-template-columns: 1fr;
          }

          .service-item + .service-item {
            border-right: none;
            border-top: 1px solid #e9e9e9;
            padding-right: 0;
          }

          .product-information {
            width: 100%;
          }

          .information-content {
            width: calc(100% - 32px);
            padding: 55px 0;
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .care-content {
            width: calc(100% - 32px);
            padding: 50px 0;
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .care-list {
            grid-template-columns: 1fr;
          }

          .shipping-section {
            width: calc(100% - 32px);
            padding: 35px 0;
          }

          .related-products {
            width: calc(100% - 32px);
            padding-bottom: 60px;
          }

          .related-header {
            align-items: flex-start;
            gap: 20px;
          }

          .related-header h2 {
            font-size: 23px;
          }

          .related-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 28px 10px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .product-gallery {
            grid-template-columns:
              52px minmax(0,1fr);
          }

          .thumbnail {
            width: 52px;
            height: 60px;
          }

          .details-wishlist {
            width: 36px;
            height: 36px;
            top: 9px;
            left: 9px;
          }

          .details-wishlist svg {
            width: 16px;
            height: 16px;
          }

          .details-sale-badge,
          .details-new-badge,
          .details-bestseller-badge,
          .details-out-badge {
            top: 10px;
            right: 10px;
            min-height: 26px;
            padding: 4px 8px;
          }

          .related-grid {
            gap: 24px 8px;
          }

        }

      `}</style>
    </main>
  );
}
 









