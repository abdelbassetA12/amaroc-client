 
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiPercent,
  FiShoppingBag,
  FiTag,
  FiZap,
} from "react-icons/fi";
import products from "../../components/landing/components/products";
import ProductCard from "../../components/landing/components/ProductCard";

export default function Offers() {
  const [sort, setSort] = useState("discount");

  // =========================================================
  // PRODUCTS WITH ACTIVE OFFERS
  // =========================================================
  const offerProducts = useMemo(() => {
    return products.filter((product) => {
      const discount = product?.pricing?.discount;

      const regularPrice = Number(
        product?.pricing?.regularPrice || 0
      );

      const salePrice =
        product?.pricing?.salePrice !== null &&
        product?.pricing?.salePrice !== undefined
          ? Number(product.pricing.salePrice)
          : null;

      const hasDiscount =
        discount?.enabled === true &&
        salePrice !== null &&
        salePrice > 0 &&
        regularPrice > 0 &&
        salePrice < regularPrice;

      return (
        hasDiscount &&
        product?.status?.active === true &&
        product?.status?.published === true &&
        !product?.status?.archived
      );
    });
  }, []);

  // =========================================================
  // SORT OFFERS
  // =========================================================
  const visibleProducts = useMemo(() => {
    const result = [...offerProducts];

    switch (sort) {
      // -----------------------------------------
      // HIGHEST DISCOUNT
      // -----------------------------------------
      case "discount":
        result.sort(
          (a, b) =>
            getDiscountPercent(b) -
            getDiscountPercent(a)
        );
        break;

      // -----------------------------------------
      // BEST SELLING
      // -----------------------------------------
      case "best-selling":
        result.sort(
          (a, b) =>
            getTotalSold(b) -
            getTotalSold(a)
        );
        break;

      // -----------------------------------------
      // HIGHEST RATING
      // -----------------------------------------
      case "rating":
        result.sort(
          (a, b) =>
            getRating(b) -
            getRating(a)
        );
        break;

      // -----------------------------------------
      // PRICE LOW → HIGH
      // -----------------------------------------
      case "price-low":
        result.sort(
          (a, b) =>
            getCurrentPrice(a) -
            getCurrentPrice(b)
        );
        break;

      // -----------------------------------------
      // PRICE HIGH → LOW
      // -----------------------------------------
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
  }, [offerProducts, sort]);

  // =========================================================
  // STATS
  // =========================================================
  const maxDiscount = useMemo(() => {
    if (!offerProducts.length) return 0;

    return Math.max(
      ...offerProducts.map((product) =>
        getDiscountPercent(product)
      )
    );
  }, [offerProducts]);

  const totalSaving = useMemo(() => {
    return offerProducts.reduce(
      (total, product) =>
        total + getSaving(product),
      0
    );
  }, [offerProducts]);

  return (
    <main className="offers-page">

      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="offers-hero">

        <div className="offers-hero-shape offers-shape-one" />
        <div className="offers-hero-shape offers-shape-two" />

        <div className="offers-hero-content">

          <div className="offers-hero-badge">
            <FiZap size={15} />
            <span>عروض خاصة</span>
          </div>

          <h1>
            عروض لا
            <br />
            <span>تُفوّت</span>
          </h1>

          <p>
            اغتنم الفرصة واستفد من عروضنا الحالية
            على مجموعة مختارة من المنتجات.
          </p>

          <div className="offers-hero-actions">

            <a
              href="#offers-products"
              className="offers-primary-button"
            >
              اكتشف العروض
              <FiArrowLeft size={17} />
            </a>

            <Link
              to="/products"
              className="offers-secondary-button"
            >
              جميع المنتجات
            </Link>

          </div>
        </div>

        {/* OFFER CIRCLE */}
        <div className="offers-hero-offer">
          <div className="offers-offer-circle">

            <span>
              خصم حتى
            </span>

            <strong>
              {maxDiscount}%
            </strong>

            <small>
              OFF
            </small>

          </div>
        </div>
      </section>

      {/* =====================================================
          OFFER STRIP
          ===================================================== */}
      <section className="offers-strip">

        <div className="offers-strip-item">
          <div className="offers-strip-icon">
            <FiPercent size={20} />
          </div>

          <div>
            <strong>
              خصومات مميزة
            </strong>

            <span>
              على منتجات مختارة
            </span>
          </div>
        </div>

        <div className="offers-strip-divider" />

        <div className="offers-strip-item">
          <div className="offers-strip-icon">
            <FiTag size={20} />
          </div>

          <div>
            <strong>
              أسعار أقل
            </strong>

            <span>
              استفد من السعر الجديد
            </span>
          </div>
        </div>

        <div className="offers-strip-divider" />

        <div className="offers-strip-item">
          <div className="offers-strip-icon">
            <FiClock size={20} />
          </div>

          <div>
            <strong>
              لفترة محدودة
            </strong>

            <span>
              لا تفوّت العرض
            </span>
          </div>
        </div>

      </section>

      {/* =====================================================
          INTRO
          ===================================================== */}
      <section className="offers-intro">

        <div>

          <span className="offers-section-label">
            AMAROC / OFFERS
          </span>

          <h2>
            اختياراتنا
            <span> المخفّضة</span>
          </h2>

          <p>
            أفضل الأسعار الحالية على المنتجات
            التي اخترناها لك بعناية.
          </p>

        </div>

        <div className="offers-summary">

          <div>
            <strong>
              {offerProducts.length}
            </strong>

            <span>
              عرض متاح
            </span>
          </div>

          <div>
            <strong>
              {maxDiscount}%
            </strong>

            <span>
              أكبر خصم
            </span>
          </div>

          <div>
            <strong>
              {totalSaving}
            </strong>

            <span>
              MAD توفير
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          TOOLBAR
          ===================================================== */}
      <section
        className="offers-toolbar"
        id="offers-products"
      >

        <div className="offers-result">
          <FiTag size={16} />

          <span>
            {visibleProducts.length} عروض
          </span>
        </div>

        <div className="offers-sort">

          <label htmlFor="offers-sort">
            ترتيب العروض
          </label>

          <select
            id="offers-sort"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
            }}
          >

            <option value="discount">
              أعلى خصم
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
              السعر: من الأعلى للأقل
            </option>

          </select>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS
          ===================================================== */}
      <section className="offers-products">

        {visibleProducts.length > 0 ? (

          <div className="offers-grid">

            {visibleProducts.map((product) => (

              <div
                key={product._id || product.id}
                className="offer-card-wrapper"
              >

                {/* DISCOUNT BADGE */}
                <div className="offer-discount-badge">

                  <span>
                    خصم
                  </span>

                  <strong>
                    {getDiscountPercent(product)}%
                  </strong>

                </div>

                {/* SAVING */}
                <div className="offer-saving">
                  وفر{" "}
                  {getSaving(product)} MAD
                </div>

                <Link
                  to={`/products/${product.slug}`}
                  className="offer-product-link"
                >
                  <ProductCard product={product} />
                </Link>

              </div>
            ))}

          </div>

        ) : (

          <div className="offers-empty">

            <div className="offers-empty-icon">
              <FiTag size={25} />
            </div>

            <h3>
              لا توجد عروض حاليًا
            </h3>

            <p>
              لا توجد منتجات مخفّضة في الوقت الحالي،
              لكننا نضيف عروضًا جديدة باستمرار.
            </p>

            <Link
              to="/products"
              className="offers-empty-button"
            >
              اكتشف المنتجات
              <FiArrowLeft size={16} />
            </Link>

          </div>
        )}

      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}
      <section className="offers-final">

        <div className="offers-final-decoration">
          %
        </div>

        <div className="offers-final-content">

          <span>
            LIMITED OFFERS
          </span>

          <h2>
            السعر الحالي
            <br />
            قد لا يستمر طويلًا.
          </h2>

          <p>
            استفد من الأسعار المخفضة قبل انتهاء
            العروض.
          </p>

          <a
            href="#offers-products"
            className="offers-final-button"
          >
            تسوق العروض
            <FiArrowLeft size={17} />
          </a>

        </div>

      </section>

      {/* =====================================================
          STYLES
          ===================================================== */}
      <style>
        {`
        .offers-page {
          width: 100%;
          min-height: 100vh;
          direction: rtl;
          background: #fff;
          color: #171717;
        }

        .offers-hero {
          position: relative;
          min-height: 570px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding:100px 30px 70px;
          background:
            linear-gradient(
              135deg,
              #fff3f0 0%,
              #ffe5df 48%,
              #fff8e8 100%
            );
        }

        .offers-hero-content {
          position: relative;
          z-index: 3;
          width: min(650px, 100%);
          text-align: center;
        }

        .offers-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 999px;
          background: #fff;
          color: #e34b2f;
          font-size: 12px;
          font-weight: 700;
          box-shadow:
            0 8px 30px rgba(
              190,
              70,
              40,
              0.08
            );
        }

        .offers-hero h1 {
          margin: 22px 0 0;
          color: #171717;
          font-size: clamp(
            58px,
            8vw,
            92px
          );
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -3px;
        }

        .offers-hero h1 span {
          color: #e34b2f;
        }

        .offers-hero p {
          max-width: 560px;
          margin: 25px auto 0;
          color: #6d5b57;
          font-size: 16px;
          line-height: 1.9;
        }

        .offers-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
        }

        .offers-primary-button,
        .offers-secondary-button {
          min-height: 50px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .offers-primary-button {
          background: #e34b2f;
          color: #fff;
          box-shadow:
            0 10px 25px rgba(
              227,
              75,
              47,
              0.22
            );
        }

        .offers-primary-button:hover {
          transform: translateY(-2px);
        }

        .offers-secondary-button {
          background: #fff;
          color: #222;
          border: 1px solid rgba(
            0,
            0,
            0,
            0.08
          );
        }

        .offers-secondary-button:hover {
          opacity: 0.8;
        }

        .offers-hero-offer {
          position: absolute;
          left: 8%;
          top: 50%;
          z-index: 2;
          transform:
            translateY(-50%)
            rotate(-10deg);
        }

        .offers-offer-circle {
          width: 205px;
          height: 205px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e34b2f;
          color: #fff;
          box-shadow:
            0 25px 60px rgba(
              180,
              60,
              35,
              0.25
            );
          transform: rotate(10deg);
        }

        .offers-offer-circle span {
          font-size: 14px;
          font-weight: 600;
        }

        .offers-offer-circle strong {
          margin: 3px 0;
          font-size: 58px;
          line-height: 1;
          font-weight: 800;
        }

        .offers-offer-circle small {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .offers-hero-shape {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .offers-shape-one {
          width: 420px;
          height: 420px;
          right: -150px;
          top: -170px;
          background: rgba(
            255,
            255,
            255,
            0.5
          );
        }

        .offers-shape-two {
          width: 300px;
          height: 300px;
          left: -130px;
          bottom: -140px;
          border: 50px solid rgba(
            255,
            255,
            255,
            0.35
          );
        }

        .offers-strip {
          width: min(1100px, calc(100% - 48px));
          margin: -35px auto 0;
          position: relative;
          z-index: 5;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 20px 30px;
          border-radius: 8px;
          background: #fff;
          box-shadow:
            0 15px 45px rgba(
              0,
              0,
              0,
              0.08
            );
        }

        .offers-strip-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .offers-strip-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff0ec;
          color: #e34b2f;
        }

        .offers-strip-item strong {
          display: block;
          margin-bottom: 3px;
          color: #222;
          font-size: 13px;
        }

        .offers-strip-item span {
          color: #888;
          font-size: 11px;
        }

        .offers-strip-divider {
          width: 1px;
          height: 40px;
          background: #eee;
        }

        .offers-intro {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 85px 0 38px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }

        .offers-section-label {
          display: block;
          margin-bottom: 12px;
          color: #999;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .offers-intro h2 {
          margin: 0;
          color: #111;
          font-size: 35px;
          font-weight: 750;
        }

        .offers-intro h2 span {
          color: #e34b2f;
        }

        .offers-intro p {
          margin: 10px 0 0;
          color: #777;
          font-size: 14px;
        }

        .offers-summary {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .offers-summary > div {
          min-width: 75px;
          text-align: center;
        }

        .offers-summary strong {
          display: block;
          color: #e34b2f;
          font-size: 22px;
          font-weight: 800;
        }

        .offers-summary span {
          display: block;
          margin-top: 4px;
          color: #888;
          font-size: 10px;
        }

        .offers-toolbar {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          min-height: 65px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .offers-result {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e34b2f;
          font-size: 13px;
          font-weight: 700;
        }

        .offers-sort {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .offers-sort label {
          color: #888;
          font-size: 12px;
        }

        .offers-sort select {
          width: 210px;
          height: 43px;
          padding: 0 13px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          color: #222;
          font-family: inherit;
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }

        .offers-sort select:focus {
          border-color: #e34b2f;
        }

        .offers-products {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 32px 0 95px;
        }

        .offers-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 42px 20px;
        }

        .offer-card-wrapper {
          position: relative;
        }

        .offer-product-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .offer-discount-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          min-width: 57px;
          min-height: 57px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e34b2f;
          color: #fff;
          box-shadow:
            0 7px 18px rgba(
              0,
              0,
              0,
              0.13
            );
          transform: rotate(8deg);
          pointer-events: none;
        }

        .offer-discount-badge span {
          font-size: 9px;
          font-weight: 600;
        }

        .offer-discount-badge strong {
          margin-top: 1px;
          font-size: 18px;
          line-height: 1;
          font-weight: 800;
        }

        .offer-saving {
          position: absolute;
          left: 10px;
          top: 12px;
          z-index: 10;
          padding: 5px 8px;
          border-radius: 3px;
          background: #fff7d8;
          color: #9a7200;
          font-size: 9px;
          font-weight: 700;
          pointer-events: none;
        }

        .offers-empty {
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border: 1px solid #eee;
          background: #fffaf8;
          text-align: center;
        }

        .offers-empty-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 50%;
          background: #fff0ec;
          color: #e34b2f;
        }

        .offers-empty h3 {
          margin: 0;
          font-size: 21px;
          font-weight: 700;
        }

        .offers-empty p {
          max-width: 440px;
          margin: 10px 0 24px;
          color: #777;
          font-size: 14px;
          line-height: 1.8;
        }

        .offers-empty-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 45px;
          padding: 0 21px;
          border-radius: 4px;
          background: #e34b2f;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .offers-final {
          position: relative;
          width: min(1200px, calc(100% - 48px));
          min-height: 310px;
          overflow: hidden;
          margin: 0 auto 80px;
          display: flex;
          align-items: center;
          padding: 45px 65px;
          border-radius: 8px;
          background:
            linear-gradient(
              120deg,
              #e34b2f,
              #f36b4e
            );
          color: #fff;
        }

        .offers-final-content {
          position: relative;
          z-index: 2;
        }

        .offers-final-content > span {
          display: block;
          margin-bottom: 10px;
          color: rgba(
            255,
            255,
            255,
            0.72
          );
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .offers-final h2 {
          margin: 0;
          font-size: 38px;
          line-height: 1.15;
          font-weight: 800;
        }

        .offers-final p {
          margin: 13px 0 23px;
          color: rgba(
            255,
            255,
            255,
            0.82
          );
          font-size: 14px;
        }

        .offers-final-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 22px;
          background: #fff;
          color: #e34b2f;
          border-radius: 4px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .offers-final-decoration {
          position: absolute;
          left: 7%;
          top: 50%;
          transform:
            translateY(-50%)
            rotate(-12deg);
          font-size: 260px;
          line-height: 1;
          font-weight: 900;
          color: rgba(
            255,
            255,
            255,
            0.12
          );
          user-select: none;
        }

        @media (max-width: 1000px) {

          .offers-hero {
            min-height: 520px;
          }

          .offers-hero-offer {
            left: 3%;
          }

          .offers-offer-circle {
            width: 155px;
            height: 155px;
          }

          .offers-offer-circle strong {
            font-size: 45px;
          }

          .offers-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 32px 16px;
          }

          .offers-intro {
            padding-top: 65px;
          }
        }

        @media (max-width: 700px) {

          .offers-hero {
            min-height: auto;
            padding:
              75px 18px
              70px;
          }

          .offers-hero h1 {
            font-size: 58px;
            letter-spacing: -2px;
          }

          .offers-hero p {
            font-size: 14px;
          }

          .offers-hero-actions {
            flex-direction: column;
          }

          .offers-primary-button,
          .offers-secondary-button {
            width: 100%;
          }

          .offers-hero-offer {
            left: -20px;
            top: 35px;
            transform: rotate(-10deg);
          }

          .offers-offer-circle {
            width: 105px;
            height: 105px;
            opacity: 0.95;
          }

          .offers-offer-circle span {
            font-size: 9px;
          }

          .offers-offer-circle strong {
            font-size: 30px;
          }

          .offers-offer-circle small {
            font-size: 7px;
            letter-spacing: 2px;
          }

          .offers-strip {
            width: calc(100% - 32px);
            margin-top: -25px;
            padding: 15px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .offers-strip-divider {
            display: none;
          }

          .offers-strip-item {
            gap: 9px;
          }

          .offers-intro {
            width: calc(100% - 32px);
            padding: 55px 0 30px;
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
          }

          .offers-intro h2 {
            font-size: 29px;
          }

          .offers-summary {
            width: 100%;
            justify-content: space-between;
            gap: 10px;
          }

          .offers-toolbar {
            width: calc(100% - 32px);
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
            padding: 18px 0;
          }

          .offers-sort {
            align-items: stretch;
            flex-direction: column;
            gap: 7px;
          }

          .offers-sort select {
            width: 100%;
          }

          .offers-products {
            width: calc(100% - 32px);
            padding-bottom: 65px;
          }

          .offers-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 30px 10px;
          }

          .offer-discount-badge {
            top: 8px;
            right: 8px;
            min-width: 48px;
            min-height: 48px;
          }

          .offer-discount-badge strong {
            font-size: 15px;
          }

          .offer-discount-badge span {
            font-size: 8px;
          }

          .offer-saving {
            left: 6px;
            top: 8px;
            font-size: 8px;
          }

          .offers-final {
            width: calc(100% - 32px);
            min-height: 340px;
            margin-bottom: 50px;
            padding: 38px 25px;
          }

          .offers-final h2 {
            font-size: 31px;
          }

          .offers-final-decoration {
            left: -20px;
            font-size: 190px;
          }
        }

        @media (max-width: 420px) {

          .offers-hero h1 {
            font-size: 51px;
          }

          .offers-strip {
            grid-template-columns: 1fr;
          }

          .offers-summary strong {
            font-size: 19px;
          }

          .offers-grid {
            gap: 25px 8px;
          }
        }
        `}
      </style>
    </main>
  );
}

// =============================================================
// CURRENT PRICE
// =============================================================
function getCurrentPrice(product) {
  const regularPrice = Number(
    product?.pricing?.regularPrice || 0
  );

  const salePrice =
    product?.pricing?.salePrice !== null &&
    product?.pricing?.salePrice !== undefined
      ? Number(product.pricing.salePrice)
      : null;

  if (
    salePrice !== null &&
    salePrice > 0 &&
    salePrice < regularPrice
  ) {
    return salePrice;
  }

  return regularPrice;
}

// =============================================================
// DISCOUNT PERCENTAGE
// =============================================================
function getDiscountPercent(product) {
  const regularPrice = Number(
    product?.pricing?.regularPrice || 0
  );

  const salePrice =
    product?.pricing?.salePrice !== null &&
    product?.pricing?.salePrice !== undefined
      ? Number(product.pricing.salePrice)
      : 0;

  if (
    regularPrice <= 0 ||
    salePrice <= 0 ||
    salePrice >= regularPrice
  ) {
    return 0;
  }

  return Math.round(
    ((regularPrice - salePrice) /
      regularPrice) *
      100
  );
}

// =============================================================
// SAVING
// =============================================================
function getSaving(product) {
  const regularPrice = Number(
    product?.pricing?.regularPrice || 0
  );

  const salePrice =
    product?.pricing?.salePrice !== null &&
    product?.pricing?.salePrice !== undefined
      ? Number(product.pricing.salePrice)
      : 0;

  return Math.max(
    0,
    regularPrice - salePrice
  );
}

// =============================================================
// TOTAL SOLD
// Supports both possible data structures
// =============================================================
function getTotalSold(product) {
  return Number(
    product?.totalSold ??
      product?.sales?.totalSold ??
      product?.status?.totalSold ??
      0
  );
}

// =============================================================
// RATING
// Supports both possible data structures
// =============================================================
function getRating(product) {
  return Number(
    product?.rating?.average ??
      product?.rating ??
      0
  );
}
 
 
