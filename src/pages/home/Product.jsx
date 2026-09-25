 
import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
 //import products from "../../components/landing/components/products";
 
import ProductCard from "../../components/landing/components/ProductCard";

export default function Product() {
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
  // =========================================================
  // URL PARAMS
  // =========================================================
 
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";
  const sortFromUrl = searchParams.get("sort") || "default";

  // =========================================================
  // STATE
  // =========================================================

  const [category, setCategory] = useState(categoryFromUrl);
  const [sort, setSort] = useState(sortFromUrl);

  // =========================================================
  // SYNC STATE WITH URL
  // =========================================================

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    setSort(sortFromUrl);
  }, [sortFromUrl]);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    return [
      ...new Map(
        products.map((product) => [
          product.category.slug,
          product.category,
        ])
      ).values(),
    ];
  }, []);

  // =========================================================
  // VISIBLE PRODUCTS
  // =========================================================

  const visibleProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.status.active &&
        product.status.published &&
        !product.status.archived
    );

    // FILTER BY CATEGORY
    if (category !== "all") {
      result = result.filter(
        (product) =>
          product.category.slug === category
      );
    }

    // SORT
    switch (sort) {
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

      case "rating":
        result.sort(
          (a, b) =>
            b.rating.average -
            a.rating.average
        );
        break;

      case "best-selling":
        result.sort(
          (a, b) =>
            b.sales.totalSold -
            a.sales.totalSold
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      default:
        break;
    }

    return result;
  }, [category, sort]);

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setSearchParams(params);
  };

  // =========================================================
  // SORT CHANGE
  // =========================================================

  const handleSortChange = (event) => {
    const value = event.target.value;

    setSort(value);

    const params = new URLSearchParams(searchParams);

    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSearchParams(params);
  };

  // =========================================================
  // CURRENT CATEGORY NAME
  // =========================================================

  const currentCategoryName = useMemo(() => {
    if (category === "all") {
      return "جميع المنتجات";
    }

    const foundCategory = categories.find(
      (item) => item.slug === category
    );

    return foundCategory?.name || "جميع المنتجات";
  }, [category, categories]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="products-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="products-page-header">
        <div>
          <span className="products-eyebrow">
            AMAROC
          </span>

          <h1>
            {currentCategoryName}
          </h1>

          <p>
            {category === "all"
              ? "اكتشف مجموعتنا الكاملة من المنتجات المختارة بعناية."
              : `اكتشف منتجات ${currentCategoryName} المختارة بعناية.`}
          </p>
        </div>
      </section>

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <section className="products-toolbar">

        <div className="products-result-count">
          {visibleProducts.length} منتجات
        </div>

        <div className="products-filters">

          {/* CATEGORY */}

          <select
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="all">
              جميع الفئات
            </option>

            {categories.map((item) => (
              <option
                key={item.slug}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* SORT */}

          <select
            value={sort}
            onChange={handleSortChange}
          >
            <option value="default">
              الترتيب الافتراضي
            </option>

            <option value="newest">
              الأحدث
            </option>

            <option value="best-selling">
              الأكثر مبيعاً
            </option>

            <option value="price-low">
              السعر: من الأقل للأعلى
            </option>

            <option value="price-high">
              السعر: من الأعلى للأعلى
            </option>

            <option value="rating">
              الأعلى تقييماً
            </option>
          </select>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS LIST
          ===================================================== */}

      <section className="products-list">

        {visibleProducts.length > 0 ? (

          <div className="products-grid">

            {visibleProducts.map((product) => (

              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="product-link"
              >
                <ProductCard product={product} />
              </Link>

            ))}

          </div>

        ) : (

          <div className="products-empty">

            <h2>
              لا توجد منتجات
            </h2>

            <p>
              لم نجد منتجات تطابق الاختيارات الحالية.
            </p>

          </div>

        )}

      </section>

      {/* =====================================================
          STYLES
          ===================================================== */}

      <style>
        {`

        /* =========================================================
           PRODUCTS PAGE
           ========================================================= */

        .products-page {
          width: 100%;
          direction: rtl;
          background: #fff;
          color: #171717;
        }


        /* =========================================================
           PAGE HEADER
           ========================================================= */

        .products-page-header {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding: 90px 0 42px;
          text-align: center;
        }

        .products-page-header > div {
          max-width: 700px;
          margin: 0 auto;
        }

        .products-eyebrow {
          display: inline-block;
          margin-bottom: 14px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #777;
          text-transform: uppercase;
        }

        .products-page-header h1 {
          margin: 0;
          font-size: clamp(34px, 4vw, 52px);
          line-height: 1.15;
          font-weight: 700;
          color: #111;
        }

        .products-page-header p {
          margin: 18px auto 0;
          max-width: 560px;
          font-size: 15px;
          line-height: 1.9;
          color: #777;
        }


        /* =========================================================
           TOOLBAR
           ========================================================= */

        .products-toolbar {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto 38px;
          min-height: 64px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 24px;
          padding: 14px 0;

          border-top: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
        }

        .products-result-count {
          font-size: 14px;
          color: #666;
          white-space: nowrap;
        }

        .products-filters {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .products-filters select {
          min-width: 190px;
          height: 44px;

          padding: 0 42px 0 14px;

          border: 1px solid #dedede;
          border-radius: 4px;

          background-color: #fff;
          color: #222;

          font-family: inherit;
          font-size: 13px;

          cursor: pointer;
          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .products-filters select:hover {
          border-color: #aaa;
        }

        .products-filters select:focus {
          border-color: #222;

          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.05);
        }


        /* =========================================================
           PRODUCTS LIST
           ========================================================= */

        .products-list {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
          padding-bottom: 90px;
        }


        /* =========================================================
           PRODUCTS GRID
           ========================================================= */

        .products-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 34px 20px;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }


        /* =========================================================
           EMPTY STATE
           ========================================================= */

        .products-empty {
          min-height: 320px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          border: 1px solid #ededed;
          background: #fafafa;
        }

        .products-empty h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
        }

        .products-empty p {
          margin: 10px 0 0;
          color: #777;
          font-size: 14px;
        }


        /* =========================================================
           TABLET
           ========================================================= */

        @media (max-width: 1000px) {

          .products-page-header {
            padding-top: 55px;
          }

          .products-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 28px 16px;
          }

        }


        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 700px) {

          .products-page-header {
            width: min(100% - 32px, 1200px);
            padding: 42px 0 30px;
          }

          .products-page-header h1 {
            font-size: 34px;
          }

          .products-page-header p {
            font-size: 14px;
          }


          .products-toolbar {
            width: calc(100% - 32px);

            align-items: stretch;
            flex-direction: column;

            gap: 14px;
            padding: 16px 0;
          }

          .products-result-count {
            text-align: right;
          }

          .products-filters {
            width: 100%;

            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 8px;
          }

          .products-filters select {
            width: 100%;
            min-width: 0;
          }


          .products-list {
            width: calc(100% - 32px);
            padding-bottom: 60px;
          }

          .products-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 28px 10px;
             
          }

        }


        /* =========================================================
           SMALL MOBILE
           ========================================================= */

        @media (max-width: 420px) {

          .products-grid {
            gap: 24px 8px;
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
  const discount = product.pricing.discount;

  const hasDiscount =
    discount?.enabled &&
    product.pricing.salePrice !== null &&
    product.pricing.salePrice <
      product.pricing.regularPrice;

  return hasDiscount
    ? product.pricing.salePrice
    : product.pricing.regularPrice;
}
 

