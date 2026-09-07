import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiCheck,
} from "react-icons/fi";
 
import products from "../../components/landing/components/products";
import ProductCard from "../../components/landing/components/ProductCard";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";


export default function ProductDetails() {
  const { slug } = useParams();
  const { addToCart, openCart } = useCart();

  const product = useMemo(
    () =>
      products.find(
        (item) =>
          item.slug === slug &&
          item.status.active &&
          item.status.published &&
          !item.status.archived
      ),
    [slug]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const images = product.images?.length
    ? product.images
    : [
        {
          url: product.thumbnail,
          alt: product.name,
        },
      ];

  const colors = product.variants?.colors || [];
  const sizes = product.variants?.sizes || [];

  const hasDiscount =
    product.pricing.discount?.enabled &&
    product.pricing.salePrice !== null &&
    product.pricing.salePrice <
      product.pricing.regularPrice;

  const currentPrice = hasDiscount
    ? product.pricing.salePrice
    : product.pricing.regularPrice;

  const isOutOfStock =
    product.inventory.status === "out_of_stock" ||
    product.inventory.quantity <= 0;

  const isLowStock =
    product.inventory.status === "low_stock" &&
    product.inventory.quantity > 0;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.pricing.regularPrice -
          product.pricing.salePrice) /
          product.pricing.regularPrice) *
          100
      )
    : 0;

  const increaseQuantity = () => {
    if (
      product.inventory.trackQuantity &&
      quantity >= product.inventory.quantity
    ) {
      return;
    }

    setQuantity((value) => value + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((value) =>
      Math.max(1, value - 1)
    );
  };

  const handleAddToCart = () => {
  const result = addToCart(product, quantity, {
    color: selectedColor,
    size: selectedSize,
  });

  if (result.success) {
    toast.success(result.message);
    openCart();
  } else {
    toast.error(result.message);
  }
};

  const relatedProducts = products
    .filter(
      (item) =>
        item._id !== product._id &&
        item.status.active &&
        item.status.published &&
        !item.status.archived &&
        item.category.slug === product.category.slug
    )
    .slice(0, 4);

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
          to={`/products?category=${product.category.slug}`}
        >
          {product.category.name}
        </Link>

        <span>/</span>

        <strong>
          {product.name}
        </strong>

      </div>


      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="product-main">

        {/* ================= IMAGE GALLERY ================= */}

        <div className="product-gallery">

          <div className="product-thumbnails">

            {images.map((image, index) => (

              <button
                key={index}
                type="button"
                className={
                  selectedImage === index
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() =>
                  setSelectedImage(index)
                }
              >
                <img
                  src={image.url}
                  alt={image.alt || product.name}
                />
              </button>

            ))}

          </div>


          <div className="product-main-image">

            {hasDiscount && (
              <span className="details-sale-badge">
                -{discountPercentage}%
              </span>
            )}

            {product.status.newProduct &&
              !hasDiscount && (
                <span className="details-new-badge">
                  جديد
                </span>
              )}

            <button
              type="button"
              className={
                isFavorite
                  ? "details-wishlist active"
                  : "details-wishlist"
              }
              onClick={() =>
                setIsFavorite(!isFavorite)
              }
              aria-label="إضافة إلى المفضلة"
            >
              <FiHeart />
            </button>

            <img
              src={images[selectedImage]?.url}
              alt={
                images[selectedImage]?.alt ||
                product.name
              }
            />

            {isOutOfStock && (
              <div className="details-stock-overlay">
                نفد المخزون
              </div>
            )}

          </div>

        </div>


        {/* ================= PRODUCT INFO ================= */}

        <div className="product-details-info">

          <div className="details-category">
            {product.category.name}
          </div>

          <h1>
            {product.name}
          </h1>

          <div className="details-rating">

            <div className="details-stars">

              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <FiStar key={index} />
                )
              )}

            </div>

            <span>
              {product.rating.average}
            </span>

            <span className="rating-count">
              ({product.rating.count} تقييم)
            </span>

          </div>


          {/* ================= PRICE ================= */}

          <div className="details-price">

            <strong>
              {currentPrice.toFixed(2)}
              {" "}
              {product.pricing.currency}
            </strong>

            {hasDiscount && (
              <>
                <del>
                  {product.pricing.regularPrice.toFixed(2)}
                  {" "}
                  {product.pricing.currency}
                </del>

                <span className="discount-text">
                  وفر{" "}
                  {(
                    product.pricing.regularPrice -
                    product.pricing.salePrice
                  ).toFixed(2)}
                  {" "}
                  {product.pricing.currency}
                </span>
              </>
            )}

          </div>


          {/* ================= SHORT DESCRIPTION ================= */}

          <p className="details-short-description">
            {product.shortDescription}
          </p>


          {/* ================= COLORS ================= */}

          {colors.length > 0 && (

            <div className="option-section">

              <div className="option-heading">

                <strong>
                  اللون
                </strong>

                {selectedColor && (
                  <span>
                    {selectedColor.name}
                  </span>
                )}

              </div>

              <div className="color-options">

                {colors.map((color) => (

                  <button
                    key={color.name}
                    type="button"
                    className={
                      selectedColor?.name ===
                      color.name
                        ? "color-option active"
                        : "color-option"
                    }
                    title={color.name}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                  >
                    <span
                      style={{
                        backgroundColor:
                          color.value,
                      }}
                    />

                    {selectedColor?.name ===
                      color.name && (
                      <FiCheck />
                    )}

                  </button>

                ))}

              </div>

            </div>

          )}


          {/* ================= SIZES ================= */}

          {sizes.length > 0 && (

            <div className="option-section">

              <div className="option-heading">
                <strong>
                  المقاس
                </strong>

                {selectedSize && (
                  <span>
                    {selectedSize.name}
                  </span>
                )}
              </div>

              <div className="size-options">

                {sizes.map((size) => (

                  <button
                    key={size.value}
                    type="button"
                    className={
                      selectedSize?.value ===
                      size.value
                        ? "size-option active"
                        : "size-option"
                    }
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size.name}
                  </button>

                ))}

              </div>

            </div>

          )}


          {/* ================= STOCK ================= */}

          <div className="availability">

            {isOutOfStock ? (
              <span className="out-stock">
                غير متوفر حالياً
              </span>
            ) : isLowStock ? (
              <span className="low-stock">
                متبقي {product.inventory.quantity} فقط
              </span>
            ) : (
              <span className="in-stock">
                <FiCheck />
                متوفر في المخزون
              </span>
            )}

          </div>


          {/* ================= PURCHASE ================= */}

          {!isOutOfStock && (

            <div className="purchase-row">

              <div className="quantity-selector">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="تقليل الكمية"
                >
                  <FiMinus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="زيادة الكمية"
                >
                  <FiPlus />
                </button>

              </div>

              
              <button
  type="button"
  className="add-to-cart"
  onClick={handleAddToCart}
>
  <FiShoppingBag />
  إضافة إلى السلة
</button>

            </div>

          )}


          {/* ================= SERVICE FEATURES ================= */}

          <div className="product-services">

            <div className="service-item">

              <FiTruck />

              <div>
                <strong>
                  توصيل سريع
                </strong>

                <span>
                  {product.shipping.estimatedDelivery}
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
          PRODUCT DESCRIPTION
      ===================================================== */}

      <section className="product-information">

        <div className="information-content">

          <div className="information-column">

            <span className="information-eyebrow">
              PRODUCT DETAILS
            </span>

            <h2>
              تفاصيل المنتج
            </h2>

            <p>
              {product.description}
            </p>

          </div>


          <div className="specifications">

            <h3>
              المواصفات
            </h3>

            <div className="specification-row">
              <span>العلامة التجارية</span>
              <strong>{product.brand}</strong>
            </div>

            <div className="specification-row">
              <span>المادة</span>
              <strong>{product.details.material}</strong>
            </div>

            <div className="specification-row">
              <span>الجنس</span>
              <strong>
                {product.details.gender === "unisex"
                  ? "للجميع"
                  : product.details.gender}
              </strong>
            </div>

            <div className="specification-row">
              <span>النمط</span>
              <strong>{product.details.style}</strong>
            </div>

            <div className="specification-row">
              <span>الموسم</span>
              <strong>{product.details.season}</strong>
            </div>

            <div className="specification-row">
              <span>بلد المنشأ</span>
              <strong>
                {product.details.countryOfOrigin}
              </strong>
            </div>

            {product.variants?.dimensions && (
              <div className="specification-row">
                <span>الأبعاد</span>

                <strong>
                  {
                    product.variants.dimensions.length
                  }
                  {" × "}
                  {
                    product.variants.dimensions.width
                  }
                  {" × "}
                  {
                    product.variants.dimensions.height
                  }
                  {" "}
                  {product.variants.dimensions.unit}
                </strong>
              </div>
            )}

            {product.variants?.weight && (
              <div className="specification-row">
                <span>الوزن</span>

                <strong>
                  {product.variants.weight.value}
                  {" "}
                  {product.variants.weight.unit}
                </strong>
              </div>
            )}

          </div>

        </div>

      </section>


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
              {product.shipping.available
                ? product.shipping.freeShipping
                  ? "الشحن مجاني لهذا المنتج."
                  : `تكلفة الشحن ${product.shipping.shippingPrice} ${product.pricing.currency}.`
                : "الشحن غير متوفر لهذا المنتج حالياً."}
            </p>
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

            {relatedProducts.map((item) => (

              <Link
                key={item._id}
                to={`/products/${item.slug}`}
                className="related-card-link"
              >
                <ProductCard product={item} />
              </Link>

            ))}

          </div>

        </section>

      )}


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
        }


        /* =====================================================
           MAIN PRODUCT
           ===================================================== */

        .product-main {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 20px 0 90px;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(380px, .92fr);
          gap: 70px;
          align-items: start;
        }


        /* =====================================================
           GALLERY
           ===================================================== */

        .product-gallery {
          display: grid;
          grid-template-columns: 82px minmax(0, 1fr);
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

        .details-sale-badge,
        .details-new-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 4;
          min-height: 30px;
          padding: 6px 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #b42318;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
        }

        .details-new-badge {
          background: #111;
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
          filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));
        }

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


        /* =====================================================
           AVAILABILITY
           ===================================================== */

        .availability {
          padding-top: 18px;
        }

        .in-stock,
        .low-stock,
        .out-stock {
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

        .in-stock svg {
          width: 14px;
          height: 14px;
        }


        /* =====================================================
           PURCHASE
           ===================================================== */

        .purchase-row {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 115px minmax(0,1fr);
          gap: 10px;
        }

        .quantity-selector {
          height: 52px;
          display: grid;
          grid-template-columns: 34px 1fr 34px;
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
          transition: background .2s ease;
        }

        .add-to-cart:hover {
          background: #292929;
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
            grid-template-columns: 60px minmax(0,1fr);
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
            grid-template-columns: 100px minmax(0,1fr);
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
            grid-template-columns: 52px minmax(0,1fr);
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
          .details-new-badge {
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