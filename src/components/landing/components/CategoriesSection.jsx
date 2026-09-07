 
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import products from "./products";

export default function CategoriesSection() {

    /* ============================================================
       استخراج الفئات من المنتجات
       نفس منطق صفحة Categories.jsx
       ============================================================ */

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

            const category = product?.category;

            if (!category?.slug) {
                return;
            }

            if (!map.has(category.slug)) {

                map.set(category.slug, {
                    ...category,
                    products: [],
                });

            }

            map
                .get(category.slug)
                .products
                .push(product);

        });

        return Array.from(map.values()).map((category) => {

            /* ========================================================
               البحث عن المنتج الأساسي للفئة
               ======================================================== */

            const featuredProduct =
                category.products.find((product) =>
                    product?.images?.some(
                        (image) => image?.isPrimary
                    )
                ) || category.products[0];

            const primaryImage =
                featuredProduct?.images?.find(
                    (image) => image?.isPrimary
                )?.url ||
                featuredProduct?.images?.[0]?.url ||
                featuredProduct?.thumbnail ||
                "";

            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                image: primaryImage,
            };

        });

    }, []);


    return (

        <section className="categories-section">

            <div className="categories-container">

                {categories.map((category, index) => (

                    <Link
                        key={category.slug || index}
                        to={`/products?category=${category.slug}`}
                        className="category-card"
                    >

                        <div className="category-image">

                            {category.image ? (

                                <img
                                    src={category.image}
                                    alt={category.name}
                                />

                            ) : (

                                <FiPackage />

                            )}

                        </div>

                        <h3>
                            {category.name}
                        </h3>

                        <span>
                            تسوق الآن
                            <FiArrowLeft />
                        </span>

                    </Link>

                ))}

            </div>


            <style>{`

                /* =========================================================
                   CATEGORIES
                ========================================================= */

                .categories-section {

                    width: 100%;

                    padding: 30px 0 22px;

                    background: #fff;

                    border-bottom: 1px solid #ebe7e1;

                    font-family:
                        "Cairo",
                        "Tajawal",
                        Arial,
                        sans-serif;
                }



                .categories-container {

                    width: min(
                        calc(100% - 64px),
                        1380px
                    );

                    margin: 0 auto;

                    display: grid;

                    grid-template-columns:
                        repeat(6, minmax(0, 1fr));

                    gap: 18px;
                }



                /* =========================================================
                   CARD
                ========================================================= */

                .category-card {

                    min-width: 0;

                    min-height: 158px;

                    padding: 12px 10px 14px;

                    border-radius: 10px;

                    background: #f7f3ed;

                    display: flex;

                    flex-direction: column;

                    align-items: center;

                    justify-content: flex-end;

                    overflow: hidden;

                    color: #171717;

                    text-decoration: none;

                    transition:
                        transform 0.25s ease,

                        box-shadow 0.25s ease;
                }



                .category-card:hover {

                    transform: translateY(-4px);

                    box-shadow:
                        0 12px 30px rgba(0, 0, 0, 0.07);
                }



                /* =========================================================
                   IMAGE
                ========================================================= */

                .category-image {

                    width: 100%;

                    height: 94px;

                    display: flex;

                    align-items: center;

                    justify-content: center;
                }



                .category-image img {

                    width: 100%;

                    height: 100%;

                    object-fit: contain;

                    mix-blend-mode: multiply;
                }



                .category-image > svg {

                    width: 38px;

                    height: 38px;

                    color: #aaa;
                }



                .category-card h3 {

                    margin: 7px 0 2px;

                    font-size: 12px;

                    line-height: 1.5;

                    font-weight: 800;
                }



                .category-card span {

                    display: flex;

                    align-items: center;

                    gap: 5px;

                    color: #333;

                    font-size: 9px;
                }



                .category-card span svg {

                    width: 11px;

                    height: 11px;
                }



                /* =========================================================
                   LAPTOP
                ========================================================= */

                @media (max-width: 1200px) {

                    .categories-container {

                        width: calc(100% - 52px);

                        gap: 13px;
                    }

                }



                /* =========================================================
                   TABLET
                ========================================================= */

                @media (max-width: 900px) {

                    .categories-container {

                        width: calc(100% - 40px);

                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));

                        gap: 13px;
                    }

                }



                /* =========================================================
                   MOBILE
                ========================================================= */

                @media (max-width: 600px) {

                    .categories-section {

                        padding: 22px 0;
                    }

                    .categories-container {

                        width: calc(100% - 30px);

                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));

                        gap: 10px;
                    }

                    .category-card {

                        min-height: 140px;
                    }

                    .category-image {

                        height: 82px;
                    }

                }

            `}</style>

        </section>

    );
}
 