 
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiChevronDown,
  FiClock,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import products from "../../components/landing/components/products";
import ProductCard from "../../components/landing/components/ProductCard";

export default function NewArrivals() {
  const [sort, setSort] = useState("newest");

  // =========================================================
  // NEW ARRIVALS
  // =========================================================

  const newProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product?.status?.active &&
        product?.status?.published &&
        !product?.status?.archived &&
        product?.status?.newProduct === true
    );
  }, []);

  // =========================================================
  // SORTED PRODUCTS
  // =========================================================

  const visibleProducts = useMemo(() => {
    const result = [...newProducts];

    switch (sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b?.createdAt || 0) -
            new Date(a?.createdAt || 0)
        );
        break;

      case "best-selling":
        result.sort(
          (a, b) =>
            (b?.sales?.totalSold || 0) -
            (a?.sales?.totalSold || 0)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            (b?.rating?.average || 0) -
            (a?.rating?.average || 0)
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            getCurrentPrice(a) -
            getCurrentPrice(b)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            getCurrentPrice(b) -
            getCurrentPrice(a)
        );
        break;

      default:
        break;
    }

    return result;
  }, [newProducts, sort]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="new-arrivals-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="new-arrivals-hero">

        <div className="new-arrivals-hero-content">

          <div className="new-arrivals-eyebrow">
            <FiClock size={14} />
            <span>NEW ARRIVALS</span>
          </div>

          <h1>
            وصل حديثًا
          </h1>

          <p>
            اكتشف أحدث المنتجات التي أضفناها إلى
            مجموعتنا. تصاميم جديدة مختارة بعناية
            لتناسب أسلوبك.
          </p>

          <Link
            to="/products"
            className="new-arrivals-hero-button"
          >
            اكتشف جميع المنتجات
            <FiArrowLeft size={17} />
          </Link>

        </div>

      </section>


      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="new-arrivals-intro">

        <div className="new-arrivals-intro-text">

          <span>
            AMAROC / LATEST
          </span>

          <h2>
            أحدث اختياراتنا
          </h2>

          <p>
            كن أول من يكتشف القطع الجديدة في
            AMAROC.
          </p>

        </div>

        <div className="new-arrivals-intro-stats">

          <div>
            <strong>
              {newProducts.length}
            </strong>

            <span>
              منتجات جديدة
            </span>
          </div>

          <div>
            <FiShoppingBag size={20} />

            <span>
              تشكيلة مختارة
            </span>
          </div>

        </div>

      </section>


      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <section className="new-arrivals-toolbar">

        <div className="new-arrivals-result">

          <strong>
            {visibleProducts.length}
          </strong>

          <span>
            منتج جديد
          </span>

        </div>

        <div className="new-arrivals-sort">

          <label htmlFor="new-arrivals-sort">
            ترتيب حسب
          </label>

          <div className="new-arrivals-select-wrapper">

            <select
              id="new-arrivals-sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="newest">
                الأحدث
              </option>

              <option value="best-selling">
                الأكثر مبيعًا
              </option>

              <option value="rating">
                الأعلى تقييمًا
              </option>

              <option value="price-low">
                السعر: من الأقل للأعلى
              </option>

              <option value="price-high">
                السعر: من الأعلى للأعلى
              </option>
            </select>

            <FiChevronDown
              size={15}
              className="new-arrivals-select-icon"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
          ===================================================== */}

      <section className="new-arrivals-products">

        {visibleProducts.length > 0 ? (

          <div className="new-arrivals-grid">

            {visibleProducts.map((product) => (

              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="new-arrivals-product-link"
              >
                <ProductCard product={product} />
              </Link>

            ))}

          </div>

        ) : (

          <div className="new-arrivals-empty">

            <div className="new-arrivals-empty-icon">
              <FiShoppingBag size={24} />
            </div>

            <h3>
              لا توجد منتجات جديدة حاليًا
            </h3>

            <p>
              سنضيف منتجات جديدة قريبًا.
              يمكنك استكشاف مجموعتنا الحالية.
            </p>

            <Link
              to="/products"
              className="new-arrivals-empty-button"
            >
              عرض جميع المنتجات
              <FiArrowLeft size={16} />
            </Link>

          </div>

        )}

      </section>


      {/* =====================================================
          BOTTOM CTA
          ===================================================== */}

      <section className="new-arrivals-cta">

        <div>

          <span>
            AMAROC
          </span>

          <h2>
            لا تفوّت الجديد
          </h2>

          <p>
            تابع أحدث الإضافات إلى مجموعتنا
            واكتشف المنتجات قبل الجميع.
          </p>

        </div>

        <Link
          to="/products"
          className="new-arrivals-cta-button"
        >
          تسوق الآن
          <FiArrowLeft size={17} />
        </Link>

      </section>


      {/* =====================================================
          STYLES
          ===================================================== */}

      <style>
        {`

        /* =====================================================
           PAGE
           ===================================================== */

        .new-arrivals-page {
          width: 100%;
          direction: rtl;
          background: #fff;
          color: #171717;
        }


        /* =====================================================
           HERO
           ===================================================== */

        .new-arrivals-hero {
          width: 100%;
          padding: 115px 24px 42px;

          background:
            linear-gradient(
              to bottom,
              #fafafa,
              #ffffff
            );

          border-bottom: 1px solid #eeeeee;

          text-align: center;
        }

        .new-arrivals-hero-content {
          width: min(760px, 100%);
          margin: 0 auto;
        }

        .new-arrivals-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 20px;

          color: #777;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .new-arrivals-hero h1 {
          margin: 0;

          color: #111;

          font-size: clamp(
            42px,
            6vw,
            72px
          );

          line-height: 1.05;
          font-weight: 700;

          letter-spacing: -2px;
        }

        .new-arrivals-hero p {
          max-width: 620px;

          margin: 24px auto 0;

          color: #707070;

          font-size: 16px;
          line-height: 2;
        }

        .new-arrivals-hero-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          margin-top: 30px;

          min-height: 48px;

          padding: 0 24px;

          background: #171717;
          color: #fff;

          border-radius: 4px;

          text-decoration: none;

          font-size: 13px;
          font-weight: 600;

          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .new-arrivals-hero-button:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }


        /* =====================================================
           INTRO
           ===================================================== */

        .new-arrivals-intro {
          width: min(1200px, calc(100% - 48px));

          margin: 0 auto;

          padding: 70px 0 42px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 40px;

          border-bottom: 1px solid #eeeeee;
        }

        .new-arrivals-intro-text > span {
          display: block;

          margin-bottom: 12px;

          color: #888;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 0.14em;
        }

        .new-arrivals-intro h2 {
          margin: 0;

          color: #111;

          font-size: 32px;
          font-weight: 700;
        }

        .new-arrivals-intro p {
          margin: 10px 0 0;

          color: #777;

          font-size: 14px;
        }

        .new-arrivals-intro-stats {
          display: flex;
          align-items: center;

          gap: 28px;
        }

        .new-arrivals-intro-stats > div {
          display: flex;
          align-items: center;
          gap: 9px;

          color: #555;

          font-size: 13px;
        }

        .new-arrivals-intro-stats strong {
          color: #111;
          font-size: 20px;
        }


        /* =====================================================
           TOOLBAR
           ===================================================== */

        .new-arrivals-toolbar {
          width: min(1200px, calc(100% - 48px));

          margin: 0 auto;

          padding: 25px 0;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .new-arrivals-result {
          display: flex;
          align-items: baseline;
          gap: 6px;

          color: #777;

          font-size: 13px;
        }

        .new-arrivals-result strong {
          color: #111;

          font-size: 15px;
          font-weight: 700;
        }

        .new-arrivals-sort {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .new-arrivals-sort label {
          color: #777;

          font-size: 12px;
          white-space: nowrap;
        }

        .new-arrivals-select-wrapper {
          position: relative;
        }

        .new-arrivals-select-wrapper select {
          width: 210px;
          height: 44px;

          padding: 0 38px 0 14px;

          border: 1px solid #dedede;
          border-radius: 4px;

          background: #fff;
          color: #222;

          font-family: inherit;
          font-size: 13px;

          cursor: pointer;
          outline: none;

          appearance: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .new-arrivals-select-wrapper select:hover {
          border-color: #aaa;
        }

        .new-arrivals-select-wrapper select:focus {
          border-color: #222;

          box-shadow:
            0 0 0 2px rgba(
              0,
              0,
              0,
              0.05
            );
        }

        .new-arrivals-select-icon {
          position: absolute;

          top: 50%;
          right: 13px;

          transform: translateY(-50%);

          pointer-events: none;

          color: #555;
        }


        /* =====================================================
           PRODUCTS
           ===================================================== */

        .new-arrivals-products {
          width: min(1200px, calc(100% - 48px));

          margin: 0 auto;

          padding-bottom: 90px;
        }

        .new-arrivals-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 34px 20px;
        }

        .new-arrivals-product-link {
          display: block;

          color: inherit;
          text-decoration: none;
        }


        /* =====================================================
           EMPTY
           ===================================================== */

        .new-arrivals-empty {
          min-height: 360px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          padding: 40px;

          border: 1px solid #ededed;

          background: #fafafa;

          text-align: center;
        }

        .new-arrivals-empty-icon {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 18px;

          border: 1px solid #ddd;
          border-radius: 50%;

          color: #444;

          background: #fff;
        }

        .new-arrivals-empty h3 {
          margin: 0;

          color: #222;

          font-size: 21px;
          font-weight: 600;
        }

        .new-arrivals-empty p {
          max-width: 430px;

          margin: 10px 0 24px;

          color: #777;

          font-size: 14px;
          line-height: 1.8;
        }

        .new-arrivals-empty-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          min-height: 44px;

          padding: 0 20px;

          background: #171717;
          color: #fff;

          border-radius: 4px;

          text-decoration: none;

          font-size: 13px;
          font-weight: 600;
        }


        /* =====================================================
           CTA
           ===================================================== */

        .new-arrivals-cta {
          width: min(1200px, calc(100% - 48px));

          margin: 0 auto 80px;

          padding: 55px 60px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 35px;

          background: #171717;
          color: #fff;
        }

        .new-arrivals-cta span {
          display: block;

          margin-bottom: 12px;

          color: #aaa;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 0.18em;
        }

        .new-arrivals-cta h2 {
          margin: 0;

          font-size: 31px;
          font-weight: 700;
        }

        .new-arrivals-cta p {
          max-width: 500px;

          margin: 10px 0 0;

          color: #aaa;

          font-size: 14px;
          line-height: 1.8;
        }

        .new-arrivals-cta-button {
          flex-shrink: 0;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          min-height: 48px;

          padding: 0 24px;

          background: #fff;
          color: #171717;

          border-radius: 4px;

          text-decoration: none;

          font-size: 13px;
          font-weight: 700;

          transition:
            transform 0.2s ease;
        }

        .new-arrivals-cta-button:hover {
          transform: translateY(-2px);
        }


        /* =====================================================
           TABLET
           ===================================================== */

        @media (max-width: 1000px) {

          .new-arrivals-hero {
            padding:
              80px 24px
              75px;
          }

          .new-arrivals-intro {
            padding-top: 55px;
          }

          .new-arrivals-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 28px 16px;
          }

          .new-arrivals-cta {
            padding: 45px;
          }

        }


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 700px) {

          .new-arrivals-hero {
            padding:
              62px 18px
              60px;
          }

          .new-arrivals-hero h1 {
            font-size: 43px;
            letter-spacing: -1.2px;
          }

          .new-arrivals-hero p {
            font-size: 14px;
          }


          .new-arrivals-intro {
            width: calc(100% - 32px);

            padding:
              45px 0
              28px;

            align-items: flex-start;

            flex-direction: column;

            gap: 25px;
          }

          .new-arrivals-intro h2 {
            font-size: 27px;
          }

          .new-arrivals-intro-stats {
            width: 100%;

            justify-content: flex-start;
          }


          .new-arrivals-toolbar {
            width: calc(100% - 32px);

            padding: 20px 0;

            align-items: stretch;

            flex-direction: column;

            gap: 14px;
          }

          .new-arrivals-sort {
            width: 100%;

            align-items: stretch;

            flex-direction: column;

            gap: 8px;
          }

          .new-arrivals-select-wrapper {
            width: 100%;
          }

          .new-arrivals-select-wrapper select {
            width: 100%;
          }


          .new-arrivals-products {
            width: calc(100% - 32px);

            padding-bottom: 60px;
          }

          .new-arrivals-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 28px 10px;
          }


          .new-arrivals-cta {
            width: calc(100% - 32px);

            margin-bottom: 50px;

            padding: 35px 25px;

            align-items: flex-start;

            flex-direction: column;
          }

          .new-arrivals-cta h2 {
            font-size: 27px;
          }

          .new-arrivals-cta-button {
            width: 100%;
          }

        }


        /* =====================================================
           SMALL MOBILE
           ===================================================== */

        @media (max-width: 420px) {

          .new-arrivals-grid {
            gap: 24px 8px;
          }

          .new-arrivals-hero h1 {
            font-size: 38px;
          }

        }

        `}
      </style>

    </main>
  );
}


// =============================================================
// CURRENT PRODUCT PRICE
// =============================================================

function getCurrentPrice(product) {
  const discount = product?.pricing?.discount;

  const hasDiscount =
    discount?.enabled &&
    product?.pricing?.salePrice !== null &&
    product?.pricing?.salePrice !== undefined &&
    product?.pricing?.salePrice <
      product?.pricing?.regularPrice;

  return hasDiscount
    ? product.pricing.salePrice
    : product.pricing.regularPrice;
}
 
