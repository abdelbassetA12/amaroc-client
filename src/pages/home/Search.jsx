 
import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiChevronDown,
  FiStar,
  FiShoppingBag,
} from "react-icons/fi";

import ProductCard from "../../components/landing/components/ProductCard";
import products from "../../components/landing/components/products";

 

const normalizeArabic = (value = "") => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ");
};

const getProductPrice = (product) => {
  const regular = Number(product?.pricing?.regularPrice || 0);
  const sale = Number(product?.pricing?.salePrice || 0);
  const enabled = product?.pricing?.discount?.enabled;

  if (enabled && sale > 0 && sale < regular) {
    return sale;
  }

  return regular;
};

const hasDiscount = (product) => {
  const regular = Number(product?.pricing?.regularPrice || 0);
  const sale = Number(product?.pricing?.salePrice || 0);

  return (
    product?.pricing?.discount?.enabled &&
    sale > 0 &&
    sale < regular
  );
};

const isAvailable = (product) => {
  return (
    product?.inventory?.status !== "out_of_stock" &&
    Number(product?.inventory?.quantity || 0) > 0
  );
};

const getSearchText = (product) => {
  const values = [
    product?.name,
    product?.slug,
    product?.description,
    product?.shortDescription,
    product?.brand,
    product?.category?.name,
    product?.category?.slug,
    product?.subcategory?.name,
    product?.subcategory?.slug,
    product?.details?.gender,
    product?.details?.style,
    product?.details?.season,
    product?.details?.material,
    ...(product?.seo?.keywords || []),
    ...(product?.variants?.colors || []).map((color) => color?.name),
  ];

  return normalizeArabic(values.filter(Boolean).join(" "));
};

const calculateRelevance = (product, query) => {
  if (!query) return 0;

  const q = normalizeArabic(query);

  const name = normalizeArabic(product?.name);
  const category = normalizeArabic(product?.category?.name);
  const subcategory = normalizeArabic(product?.subcategory?.name);
  const description = normalizeArabic(product?.description);
  const keywords = normalizeArabic(
    (product?.seo?.keywords || []).join(" ")
  );

  let score = 0;

  if (name === q) score += 1000;
  if (name.startsWith(q)) score += 700;
  if (name.includes(q)) score += 500;

  if (category.includes(q)) score += 350;
  if (subcategory.includes(q)) score += 300;

  if (keywords.includes(q)) score += 250;
  if (description.includes(q)) score += 100;

  const words = q.split(" ").filter(Boolean);

  words.forEach((word) => {
    if (name.includes(word)) score += 120;
    if (category.includes(word)) score += 80;
    if (subcategory.includes(word)) score += 70;
    if (keywords.includes(word)) score += 60;
  });

  return score;
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [gender, setGender] = useState(
    searchParams.get("gender") || "all"
  );
  const [availability, setAvailability] = useState(
    searchParams.get("availability") || "all"
  );
  const [offers, setOffers] = useState(
    searchParams.get("offers") || "all"
  );
  const [rating, setRating] = useState(
    searchParams.get("rating") || "all"
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") || "relevance"
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (product?.category?.name) {
        map.set(
          product.category.name,
          product.category.name
        );
      }
    });

    return Array.from(map.values());
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeArabic(query);

    let result = products
      .filter((product) => {
        if (product?.status?.active === false) return false;
        if (product?.status?.published === false) return false;
        if (product?.status?.archived === true) return false;

        if (normalizedQuery) {
          const searchText = getSearchText(product);

          const words = normalizedQuery
            .split(" ")
            .filter(Boolean);

          const matches = words.every((word) =>
            searchText.includes(word)
          );

          if (!matches) return false;
        }

        if (
          category !== "all" &&
          product?.category?.name !== category
        ) {
          return false;
        }

        if (
          gender !== "all" &&
          product?.details?.gender !== gender
        ) {
          return false;
        }

        if (availability === "available" && !isAvailable(product)) {
          return false;
        }

        if (
          availability === "out" &&
          isAvailable(product)
        ) {
          return false;
        }

        if (offers === "sale" && !hasDiscount(product)) {
          return false;
        }

        if (
          rating !== "all" &&
          Number(product?.rating?.average || 0) <
            Number(rating)
        ) {
          return false;
        }

        const price = getProductPrice(product);

        if (minPrice !== "" && price < Number(minPrice)) {
          return false;
        }

        if (maxPrice !== "" && price > Number(maxPrice)) {
          return false;
        }

        return true;
      })
      .map((product) => ({
        product,
        relevance: calculateRelevance(product, query),
      }));

    result.sort((a, b) => {
      const productA = a.product;
      const productB = b.product;

      if (sort === "newest") {
        return (
          new Date(productB?.createdAt || 0) -
          new Date(productA?.createdAt || 0)
        );
      }

      if (sort === "best-selling") {
        return (
          Number(productB?.sales?.totalSold || 0) -
          Number(productA?.sales?.totalSold || 0)
        );
      }

      if (sort === "rating") {
        return (
          Number(productB?.rating?.average || 0) -
          Number(productA?.rating?.average || 0)
        );
      }

      if (sort === "price-low") {
        return (
          getProductPrice(productA) -
          getProductPrice(productB)
        );
      }

      if (sort === "price-high") {
        return (
          getProductPrice(productB) -
          getProductPrice(productA)
        );
      }

      if (sort === "discount") {
        const discountA =
          Number(productA?.pricing?.regularPrice || 0) -
          Number(productA?.pricing?.salePrice || 0);

        const discountB =
          Number(productB?.pricing?.regularPrice || 0) -
          Number(productB?.pricing?.salePrice || 0);

        return discountB - discountA;
      }

      return b.relevance - a.relevance;
    });

    return result.map((item) => item.product);
  }, [
    query,
    category,
    gender,
    availability,
    offers,
    rating,
    sort,
    minPrice,
    maxPrice,
  ]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    return products
      .filter((product) => {
        const text = getSearchText(product);
        const q = normalizeArabic(query);

        return text.includes(q);
      })
      .sort(
        (a, b) =>
          calculateRelevance(b, query) -
          calculateRelevance(a, query)
      )
      .slice(0, 5);
  }, [query]);

  const updateUrl = (newQuery = query) => {
    const params = new URLSearchParams();

    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    }

    if (category !== "all") params.set("category", category);
    if (gender !== "all") params.set("gender", gender);
    if (availability !== "all") {
      params.set("availability", availability);
    }
    if (offers !== "all") params.set("offers", offers);
    if (rating !== "all") params.set("rating", rating);
    if (sort !== "relevance") params.set("sort", sort);
    if (minPrice !== "") params.set("minPrice", minPrice);
    if (maxPrice !== "") params.set("maxPrice", maxPrice);

    setSearchParams(params);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateUrl(query);
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    navigate(`/products/${product.slug}`);
  };

  const clearFilters = () => {
    setCategory("all");
    setGender("all");
    setAvailability("all");
    setOffers("all");
    setRating("all");
    setSort("relevance");
    setMinPrice("");
    setMaxPrice("");

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    setSearchParams(params);
  };

  return (
    <main className="search-page" dir="rtl">
      <div className="search-container">
        <div className="search-heading">
          <span>البحث</span>
          <h1>
            {query.trim()
              ? `نتائج البحث عن "${query}"`
              : "اكتشف منتجات AMAROC"}
          </h1>
        </div>

        <form
          className="search-main-form"
          onSubmit={handleSearch}
        >
          <FiSearch />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن حقيبة، محفظة، إكسسوارات..."
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery("");
                navigate("/search");
              }}
              aria-label="مسح البحث"
            >
              <FiX />
            </button>
          )}

          <button type="submit" className="search-submit">
            بحث
          </button>
        </form>

        {query.trim() && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() =>
                  handleSuggestionClick(product)
                }
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                />

                <span>
                  <strong>{product.name}</strong>
                  <small>
                    {product.category?.name}
                  </small>
                </span>

                <FiChevronDown />
              </button>
            ))}
          </div>
        )}

        <div className="search-toolbar">
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <FiSliders />
            الفلاتر
          </button>

          <div className="results-count">
            {filteredProducts.length} منتج
          </div>

          <div className="sort-box">
            <label htmlFor="sort">ترتيب:</label>

            <select
              id="sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setTimeout(updateUrl, 0);
              }}
            >
              <option value="relevance">الأكثر صلة</option>
              <option value="newest">الأحدث</option>
              <option value="best-selling">
                الأكثر مبيعاً
              </option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price-low">
                السعر: من الأقل للأعلى
              </option>
              <option value="price-high">
                السعر: من الأعلى للأقل
              </option>
              <option value="discount">
                أكبر تخفيض
              </option>
            </select>
          </div>
        </div>

        <div
          className={`search-content ${
            filtersOpen ? "filters-visible" : ""
          }`}
        >
          <aside className="search-filters">
            <div className="filters-header">
              <h2>تصفية النتائج</h2>

              <button
                type="button"
                onClick={clearFilters}
              >
                مسح الكل
              </button>
            </div>

            <div className="filter-group">
              <label>الفئة</label>

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setTimeout(updateUrl, 0);
                }}
              >
                <option value="all">كل الفئات</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>الجنس</label>

              <select
                value={gender}
                onChange={(event) => {
                  setGender(event.target.value);
                  setTimeout(updateUrl, 0);
                }}
              >
                <option value="all">الكل</option>
                <option value="men">رجالي</option>
                <option value="women">نسائي</option>
                <option value="unisex">للجميع</option>
              </select>
            </div>

            <div className="filter-group">
              <label>التوفر</label>

              <select
                value={availability}
                onChange={(event) => {
                  setAvailability(event.target.value);
                  setTimeout(updateUrl, 0);
                }}
              >
                <option value="all">الكل</option>
                <option value="available">متوفر</option>
                <option value="out">غير متوفر</option>
              </select>
            </div>

            <div className="filter-group">
              <label>العروض</label>

              <select
                value={offers}
                onChange={(event) => {
                  setOffers(event.target.value);
                  setTimeout(updateUrl, 0);
                }}
              >
                <option value="all">كل المنتجات</option>
                <option value="sale">المنتجات المخفضة</option>
              </select>
            </div>

            <div className="filter-group">
              <label>التقييم</label>

              <select
                value={rating}
                onChange={(event) => {
                  setRating(event.target.value);
                  setTimeout(updateUrl, 0);
                }}
              >
                <option value="all">كل التقييمات</option>
                <option value="4">4 نجوم فأكثر</option>
                <option value="4.5">4.5 نجوم فأكثر</option>
              </select>
            </div>

            <div className="filter-group">
              <label>السعر</label>

              <div className="price-inputs">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(event.target.value)
                  }
                  placeholder="من"
                />

                <span>-</span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                  placeholder="إلى"
                />
              </div>

              <button
                type="button"
                className="apply-price"
                onClick={updateUrl}
              >
                تطبيق
              </button>
            </div>
          </aside>

          <section className="search-results">
            {filteredProducts.length > 0 ? (
              <div className="search-products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="search-empty">
                <div className="empty-icon">
                  <FiShoppingBag />
                </div>

                <h2>لم نجد ما تبحث عنه</h2>

                <p>
                  جرب كلمة أخرى أو قم بإزالة بعض الفلاتر
                  للحصول على نتائج أكثر.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    clearFilters();
                  }}
                >
                  عرض جميع المنتجات
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        .search-page {
          min-height: 100vh;
          background: #f7f3ed;
          padding: 155px 20px 80px;
          color: #171717;
        }

        .search-container {
          width: min(1280px, 100%);
          margin: 0 auto;
          position: relative;
        }

        .search-heading {
          text-align: right;
          margin-bottom: 25px;
        }

        .search-heading span {
          color: #d6ad5c;
          font-size: 13px;
          font-weight: 700;
        }

        .search-heading h1 {
          margin: 6px 0 0;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
        }

        .search-main-form {
          width: 100%;
          min-height: 62px;
          background: #fff;
          border: 1px solid #e6e0d7;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 7px 8px 7px 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,.04);
        }

        .search-main-form > svg {
          width: 23px;
          height: 23px;
          color: #777;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .search-main-form input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: inherit;
          font-size: 15px;
          color: #171717;
          min-width: 0;
        }

        .search-main-form input::placeholder {
          color: #aaa;
        }

        .search-clear {
          width: 35px;
          height: 35px;
          border: 0;
          background: transparent;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .search-submit {
          border: 0;
          background: #171717;
          color: #fff;
          min-width: 90px;
          height: 48px;
          border-radius: 10px;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .search-submit:hover {
          background: #d6ad5c;
          color: #171717;
        }

        .search-suggestions {
          position: absolute;
          z-index: 20;
          top: 168px;
          right: 0;
          left: 0;
          background: #fff;
          border: 1px solid #e8e2d9;
          border-radius: 0 0 14px 14px;
          box-shadow: 0 18px 35px rgba(0,0,0,.1);
          overflow: hidden;
        }

        .search-suggestions button {
          width: 100%;
          border: 0;
          border-bottom: 1px solid #eee;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 15px;
          text-align: right;
          cursor: pointer;
          font-family: inherit;
        }

        .search-suggestions button:last-child {
          border-bottom: 0;
        }

        .search-suggestions button:hover {
          background: #faf8f4;
        }

        .search-suggestions img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .search-suggestions span {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .search-suggestions strong {
          font-size: 14px;
          color: #171717;
        }

        .search-suggestions small {
          font-size: 11px;
          color: #888;
        }

        .search-suggestions button > svg {
          transform: rotate(90deg);
          color: #999;
        }

        .search-toolbar {
          margin: 28px 0 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .filter-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          padding: 0 15px;
          border: 1px solid #ddd5ca;
          border-radius: 9px;
          background: #fff;
          font-family: inherit;
          cursor: pointer;
        }

        .results-count {
          color: #777;
          font-size: 13px;
          margin-left: auto;
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
        }

        .sort-box select,
        .filter-group select {
          height: 40px;
          border: 1px solid #ddd5ca;
          border-radius: 8px;
          background: #fff;
          padding: 0 12px;
          font-family: inherit;
          color: #333;
          outline: 0;
        }

        .search-content {
          display: grid;
          grid-template-columns: 235px 1fr;
          gap: 28px;
          align-items: start;
        }

        .search-filters {
          background: #fff;
          border: 1px solid #e7e0d7;
          border-radius: 14px;
          padding: 20px;
          position: sticky;
          top: 130px;
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .filters-header h2 {
          font-size: 16px;
          margin: 0;
        }

        .filters-header button {
          border: 0;
          background: transparent;
          color: #b28b3e;
          font-family: inherit;
          font-size: 11px;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 20px;
        }

        .filter-group > label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .filter-group select {
          width: 100%;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .price-inputs input {
          width: 100%;
          height: 38px;
          border: 1px solid #ddd5ca;
          border-radius: 8px;
          padding: 0 8px;
          outline: 0;
          font-family: inherit;
          font-size: 12px;
        }

        .apply-price {
          width: 100%;
          margin-top: 8px;
          height: 36px;
          border: 0;
          border-radius: 8px;
          background: #171717;
          color: #fff;
          font-family: inherit;
          cursor: pointer;
        }

        .search-products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .search-empty {
          min-height: 400px;
          background: #fff;
          border: 1px solid #e7e0d7;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #f5f0e8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d6ad5c;
          margin-bottom: 18px;
        }

        .empty-icon svg {
          width: 28px;
          height: 28px;
        }

        .search-empty h2 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .search-empty p {
          max-width: 400px;
          color: #777;
          font-size: 13px;
          line-height: 1.8;
          margin: 0 0 20px;
        }

        .search-empty button {
          border: 0;
          background: #171717;
          color: #fff;
          padding: 12px 22px;
          border-radius: 9px;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 1000px) {
          .search-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .search-page {
            padding-top: 125px;
          }

          .filter-toggle {
            display: flex;
          }

          .search-content {
            display: block;
          }

          .search-filters {
            display: none;
            position: static;
            margin-bottom: 20px;
          }

          .search-content.filters-visible .search-filters {
            display: block;
          }
        }

        @media (max-width: 600px) {
          .search-page {
            padding: 110px 12px 60px;
          }

          .search-heading h1 {
            font-size: 24px;
          }

          .search-main-form {
            min-height: 54px;
          }

          .search-submit {
            min-width: 62px;
            height: 42px;
            font-size: 12px;
          }

          .search-suggestions {
            top: 147px;
          }

          .search-toolbar {
            flex-wrap: wrap;
          }

          .results-count {
            margin-left: 0;
            margin-right: auto;
          }

          .sort-box {
            width: 100%;
          }

          .sort-box select {
            flex: 1;
          }

          .search-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
 
