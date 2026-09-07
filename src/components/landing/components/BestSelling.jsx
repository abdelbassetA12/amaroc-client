import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import products from "./products";
import ProductCard from "./ProductCard";

export default function BestSelling() {
  const bestSellingProducts = products
    .filter(
      (product) =>
        product.status.active &&
        product.status.published &&
        product.status.bestseller
    )
    .sort(
      (a, b) =>
        b.sales.totalSold -
        a.sales.totalSold
    );

  return (
    <section className="best-selling">

      <div className="section-header">

        <div className="section-heading">
          <h2>
            الأكثر مبيعاً
          </h2>

          <p>
            منتجاتنا المفضلة لدى عملائنا
          </p>
        </div>

        <a
          href="/products"
          className="view-all"
        >
          عرض جميع المنتجات
        </a>
      </div>


      <div className="products-navigation">

        <button
          type="button"
          aria-label="المنتجات السابقة"
        >
          <FiChevronRight />
        </button>

        <button
          type="button"
          aria-label="المنتجات التالية"
        >
          <FiChevronLeft />
        </button>

      </div>


      <div className="products-grid">

        {bestSellingProducts.map(
          (product) => (
             <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="product-link"
              >
            <ProductCard
              key={product._id}
              product={product}
            />
            </Link>
          )
        )}

      </div>



      <style>
        {`
        /* =========================================================
   BEST SELLING
   ========================================================= */

.best-selling {
    position: relative;
    width: min(
        calc(100% - 64px),
        1380px
    );

    margin: 0 auto;
    padding: 38px 0 32px;

    font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;
}


/* =========================================================
   HEADER
   ========================================================= */

.section-header {
    position: relative;

    min-height: 55px;
    margin-bottom: 25px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.section-heading {
    text-align: center;
}

.section-heading h2 {
    margin: 0;

    color: #171717;

    font-size: 27px;
    line-height: 1.3;
    font-weight: 900;
}

.section-heading p {
    margin: 5px 0 0;

    color: #858585;

    font-size: 11px;
}


/* =========================================================
   VIEW ALL
   ========================================================= */

.view-all {
    position: absolute;

    left: 0;
    top: 50%;

    transform: translateY(-50%);

    padding: 8px 15px;

    border-radius: 5px;

    background: #f1eee9;
    color: #333;

    text-decoration: none;

    font-size: 10px;
    font-weight: 700;

    transition: 0.2s ease;
}

.view-all:hover {
    background: #e9e4dc;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

.products-navigation {
    position: absolute;

    right: 0;
    top: 49px;

    display: flex;
    align-items: center;

    gap: 7px;

    direction: ltr;
}

.products-navigation button {
    width: 30px;
    height: 30px;

    padding: 0;

    border: 1px solid #ebe7e1;
    border-radius: 50%;

    background: #fff;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    transition: 0.2s ease;
}

.products-navigation button:hover {
    background: #f6f3ef;
}

.products-navigation svg {
    width: 14px;
    height: 14px;
}


/* =========================================================
   PRODUCTS GRID
   ========================================================= */

.products-grid {
    width: 100%;

    display: grid;

    grid-template-columns:
        repeat(5, minmax(0, 1fr));

    gap: 18px;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (min-width: 1600px) {

    .best-selling {
        width: min(
            calc(100% - 80px),
            1440px
        );
    }

    .products-grid {
        gap: 20px;
    }
}


@media (max-width: 1200px) {

    .best-selling {
        width: calc(100% - 52px);
    }

    .products-grid {
        gap: 13px;
    }
}


@media (max-width: 900px) {

    .best-selling {
        width: calc(100% - 40px);
    }

    .products-grid {
        grid-template-columns:
            repeat(3, minmax(0, 1fr));

        gap: 14px;
    }

    .products-grid
    .product-card:nth-child(n + 4) {
        display: none;
    }
}


@media (max-width: 600px) {

    .best-selling {
        width: calc(100% - 30px);

        padding: 30px 0;
    }

    .section-header {
        min-height: auto;

        margin-bottom: 20px;
    }

    .section-heading h2 {
        font-size: 23px;
    }

    .section-heading p {
        font-size: 9px;
    }

    .view-all,
    .products-navigation {
        display: none;
    }

    .products-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 10px;
    }

    .products-grid
    .product-card:nth-child(n + 5) {
        display: none;
    }
}


@media (max-width: 390px) {

    .best-selling {
        width: calc(100% - 24px);
    }

    .products-grid {
        gap: 8px;
    }
}
        `}
      </style>

    </section>
  );
}


