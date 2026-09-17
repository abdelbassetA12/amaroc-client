 
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiGrid,
  FiPackage,
} from "react-icons/fi";
import { useProducts } from "../../context/ProductContext";
//import products from "../../components/landing/components/products";

export default function Categories() {
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
  /*
  ============================================================
  استخراج الفئات من المنتجات
  ============================================================
  */

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (
        !product?.status?.active ||
        !product?.status?.published ||
        product?.status?.archived
      ) {
        return;
      }

      const category = product.category;

      if (!category?.slug) {
        return;
      }

      if (!map.has(category.slug)) {
        map.set(category.slug, {
          ...category,
          products: [],
        });
      }

      map.get(category.slug).products.push(product);
    });

    return Array.from(map.values()).map((category) => {
      /*
      البحث عن الصورة الأساسية للفئة
      */

      const featuredProduct =
        category.products.find(
          (product) =>
            product.images?.some(
              (image) => image.isPrimary
            )
        ) || category.products[0];

      const primaryImage =
        featuredProduct?.images?.find(
          (image) => image.isPrimary
        )?.url ||
        featuredProduct?.images?.[0]?.url ||
        featuredProduct?.thumbnail ||
        "";

      /*
      عدد المنتجات
      */

      const productCount = category.products.length;

      /*
      بعض الإحصائيات البسيطة
      */

      const saleProducts = category.products.filter(
        (product) => {
          const pricing = product.pricing;

          return (
            pricing?.discount?.enabled &&
            pricing?.salePrice !== null &&
            pricing?.salePrice <
              pricing?.regularPrice
          );
        }
      ).length;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: primaryImage,
        productCount,
        saleProducts,
      };
    });
  }, []);

  return (
    <main className="categories-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="categories-hero">

        <div className="categories-hero-inner">

          <div className="categories-hero-content">

            <span className="categories-eyebrow">
              AMAROC COLLECTION
            </span>

            <h1>
              اكتشف فئاتنا
            </h1>

            <p>
              استكشف مجموعتنا المختارة من المنتجات
              واكتشف الفئة التي تناسب أسلوبك واحتياجاتك.
            </p>

          </div>

          <div className="categories-hero-decoration">

            <div className="hero-decoration-circle">
              <FiGrid />
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORY INTRO
      ===================================================== */}

      <section className="categories-intro">

        <div className="categories-intro-inner">

          <div className="intro-left">

            <span>
              OUR CATEGORIES
            </span>

            <h2>
              تسوق حسب الفئة
            </h2>

          </div>

          <p>
            اختر إحدى الفئات لاستكشاف المنتجات المتوفرة
            لدينا.
          </p>

        </div>

      </section>


      {/* =====================================================
          CATEGORIES GRID
      ===================================================== */}

      <section className="categories-list">

        {categories.length > 0 ? (

          <div className="categories-grid">

            {categories.map((category, index) => (

              <Link
                key={category.slug}
                to={`/product?category=${category.name}`}
                className="category-card"
              >

                {/* IMAGE */}

                <div className="category-image">

                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                  ) : (
                    <div className="category-image-placeholder">
                      <FiPackage />
                    </div>
                  )}

                  <div className="category-image-overlay" />

                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="category-arrow">
                    <FiArrowLeft />
                  </span>

                </div>


                {/* CONTENT */}

                <div className="category-card-content">

                  <div>

                    <h3>
                      {category.name}
                    </h3>

                    <span className="category-count">
                      {category.productCount}{" "}
                      {category.productCount === 1
                        ? "منتج"
                        : "منتجات"}
                    </span>

                  </div>

                  <div className="category-card-meta">

                    {category.saleProducts > 0 && (
                      <span>
                        عروض متاحة
                      </span>
                    )}

                  </div>

                </div>

              </Link>

            ))}

          </div>

        ) : (

          <div className="categories-empty">

            <FiPackage />

            <h2>
              لا توجد فئات حالياً
            </h2>

            <p>
              لم يتم العثور على أي فئات متاحة في المتجر.
            </p>

            <Link to="/products">
              العودة إلى المنتجات
            </Link>

          </div>

        )}

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="categories-cta">

        <div className="categories-cta-inner">

          <div>

            <span>
              AMAROC
            </span>

            <h2>
              لم تجد ما تبحث عنه؟
            </h2>

            <p>
              استكشف جميع المنتجات المتوفرة في متجرنا.
            </p>

          </div>

          <Link
            to="/products"
            className="categories-cta-button"
          >
            <span>
              عرض جميع المنتجات
            </span>

            <FiArrowLeft />
          </Link>

        </div>

      </section>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           BASE
        ===================================================== */

        .categories-page {
          width: 100%;
          min-height: 100vh;
          background: #fff;
          color: #171717;
          direction: rtl;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .categories-hero {
          width: 100%;
          background: #f7f7f5;
          border-bottom: 1px solid #e8e8e8;
        }

        .categories-hero-inner {
          width: min(1200px, calc(100% - 48px));
          min-height: 360px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          position: relative;
          overflow: hidden;
        }

        .categories-hero-content {
          max-width: 680px;
          position: relative;
          z-index: 2;
        }

        .categories-eyebrow {
          display: inline-block;
          margin-bottom: 18px;
          color: #777;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
        }

        .categories-hero h1 {
          margin: 0;
          color: #111;
          font-size: clamp(42px, 5vw, 66px);
          line-height: 1.08;
          font-weight: 700;
        }

        .categories-hero p {
          max-width: 570px;
          margin: 22px 0 0;
          color: #777;
          font-size: 15px;
          line-height: 2;
        }


        /* =====================================================
           HERO DECORATION
        ===================================================== */

        .categories-hero-decoration {
          width: 250px;
          height: 250px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .categories-hero-decoration::before {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          border: 1px solid #dedede;
          border-radius: 50%;
        }

        .categories-hero-decoration::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid #e5e5e5;
          border-radius: 50%;
        }

        .hero-decoration-circle {
          position: relative;
          z-index: 2;
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #111;
          color: #fff;
        }

        .hero-decoration-circle svg {
          width: 30px;
          height: 30px;
        }


        /* =====================================================
           INTRO
        ===================================================== */

        .categories-intro {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
        }

        .categories-intro-inner {
          min-height: 130px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          border-bottom: 1px solid #e9e9e9;
        }

        .intro-left span {
          display: block;
          margin-bottom: 8px;
          color: #888;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
        }

        .intro-left h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 650;
          color: #111;
        }

        .categories-intro-inner > p {
          max-width: 400px;
          margin: 0;
          color: #777;
          font-size: 13px;
          line-height: 1.9;
        }


        /* =====================================================
           LIST
        ===================================================== */

        .categories-list {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 55px 0 100px;
        }


        /* =====================================================
           GRID
        ===================================================== */

        .categories-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 28px 20px;
        }


        /* =====================================================
           CARD
        ===================================================== */

        .category-card {
          display: block;
          color: inherit;
          text-decoration: none;
          min-width: 0;
        }


        /* =====================================================
           IMAGE
        ===================================================== */

        .category-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.12;
          overflow: hidden;
          background: #f1f1f1;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition:
            transform .55s cubic-bezier(.2,.65,.25,1);
        }

        .category-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.05),
              rgba(0,0,0,.25)
            );
          opacity: .7;
          transition: opacity .3s ease;
        }

        .category-card:hover
        .category-image img {
          transform: scale(1.045);
        }

        .category-card:hover
        .category-image-overlay {
          opacity: .85;
        }


        /* =====================================================
           NUMBER
        ===================================================== */

        .category-number {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 2;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.94);
          color: #111;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
        }


        /* =====================================================
           ARROW
        ===================================================== */

        .category-arrow {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 2;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #111;
          transition:
            background .25s ease,
            color .25s ease,
            transform .25s ease;
        }

        .category-arrow svg {
          width: 17px;
          height: 17px;
        }

        .category-card:hover
        .category-arrow {
          background: #111;
          color: #fff;
          transform: translateX(-4px);
        }


        /* =====================================================
           CARD CONTENT
        ===================================================== */

        .category-card-content {
          min-height: 82px;
          padding: 17px 0 4px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid #e5e5e5;
        }

        .category-card-content h3 {
          margin: 0;
          color: #111;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.5;
        }

        .category-count {
          display: block;
          margin-top: 5px;
          color: #999;
          font-size: 11px;
        }

        .category-card-meta {
          padding-top: 5px;
          color: #777;
          font-size: 10px;
          white-space: nowrap;
        }

        .category-card-meta span {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border: 1px solid #e1e1e1;
        }


        /* =====================================================
           PLACEHOLDER
        ===================================================== */

        .category-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f3f3;
          color: #aaa;
        }

        .category-image-placeholder svg {
          width: 45px;
          height: 45px;
        }


        /* =====================================================
           EMPTY
        ===================================================== */

        .categories-empty {
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid #e7e7e7;
          background: #fafafa;
        }

        .categories-empty > svg {
          width: 38px;
          height: 38px;
          margin-bottom: 18px;
          color: #555;
        }

        .categories-empty h2 {
          margin: 0;
          font-size: 23px;
          font-weight: 600;
        }

        .categories-empty p {
          margin: 10px 0 24px;
          color: #777;
          font-size: 13px;
        }

        .categories-empty a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 45px;
          padding: 0 24px;
          background: #111;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
        }


        /* =====================================================
           CTA
        ===================================================== */

        .categories-cta {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto 100px;
          background: #111;
          color: #fff;
        }

        .categories-cta-inner {
          min-height: 190px;
          padding: 35px 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .categories-cta-inner > div span {
          display: block;
          margin-bottom: 10px;
          color: #aaa;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
        }

        .categories-cta-inner h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .categories-cta-inner p {
          margin: 9px 0 0;
          color: #aaa;
          font-size: 12px;
        }

        .categories-cta-button {
          min-width: 190px;
          height: 52px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #fff;
          color: #111;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition:
            background .2s ease,
            color .2s ease;
        }

        .categories-cta-button:hover {
          background: #e8e8e8;
        }

        .categories-cta-button svg {
          width: 16px;
          height: 16px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1000px) {

          .categories-hero-inner {
            min-height: 320px;
          }

          .categories-hero-decoration {
            width: 190px;
            height: 190px;
          }

          .categories-hero-decoration::before {
            width: 190px;
            height: 190px;
          }

          .categories-hero-decoration::after {
            width: 135px;
            height: 135px;
          }

          .categories-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 30px 16px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .categories-hero-inner {
            width: calc(100% - 32px);
            min-height: 300px;
          }

          .categories-hero-content {
            max-width: 100%;
          }

          .categories-hero h1 {
            font-size: 42px;
          }

          .categories-hero p {
            margin-top: 18px;
            font-size: 14px;
            line-height: 1.9;
          }

          .categories-hero-decoration {
            display: none;
          }


          .categories-intro {
            width: calc(100% - 32px);
          }

          .categories-intro-inner {
            min-height: 115px;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
          }

          .intro-left h2 {
            font-size: 24px;
          }

          .categories-intro-inner > p {
            font-size: 12px;
          }


          .categories-list {
            width: calc(100% - 32px);
            padding: 40px 0 65px;
          }


          .categories-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .category-image {
            aspect-ratio: 1 / 1.05;
          }

          .category-card-content {
            min-height: 75px;
          }


          .categories-cta {
            width: calc(100% - 32px);
            margin-bottom: 60px;
          }

          .categories-cta-inner {
            padding: 30px 24px;
            min-height: auto;
            flex-direction: column;
            align-items: stretch;
            gap: 25px;
          }

          .categories-cta-inner h2 {
            font-size: 23px;
          }

          .categories-cta-button {
            width: 100%;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .categories-hero-inner {
            width: calc(100% - 24px);
          }

          .categories-hero h1 {
            font-size: 37px;
          }

          .categories-hero p {
            font-size: 13px;
          }

          .categories-intro,
          .categories-list,
          .categories-cta {
            width: calc(100% - 24px);
          }

          .category-image {
            aspect-ratio: 1 / 1.08;
          }

          .category-number {
            top: 12px;
            right: 12px;
          }

          .category-arrow {
            left: 12px;
            bottom: 12px;
          }

        }

      `}</style>

    </main>
  );
}
 
