
import {
    FiArrowLeft,
    FiStar
} from "react-icons/fi";

export default function HeroSection() {
    return (
        <section className="hero-section">

            {/* الصورة نفسها وليست background */}
            <img
                className="hero-background-image"
                src="/amaroc-baner1.png"
                alt="AMAROC"
            />

            {/* طبقة خفيفة فوق الصورة */}
            <div className="hero-image-overlay"></div>

            {/* المحتوى يطفو فوق الصورة */}
            <div className="hero-content">

                <span className="hero-small-title">
                    أسلوبك..
                </span>

                <h1>
                    في كل مغامرة
                </h1>

                <p>
                    اكتشف مجموعتنا المميزة من حقائب الظهر
                    وحقائب الخصر والإكسسوارات التي تجمع بين
                    الجودة، العملية والأناقة.
                </p>

                <div className="hero-buttons">

                    <a
                        href="/products"
                        className="hero-btn hero-btn-primary"
                    >
                        تسوق الآن
                        <FiArrowLeft />
                    </a>

                    <a
                        href="/categories"
                        className="hero-btn hero-btn-secondary"
                    >
                        استكشف الفئات
                    </a>

                </div>

                <div className="hero-rating">

                    <div className="hero-avatars">

                        <span>👨🏻</span>
                        <span>👩🏻</span>
                        <span>👨🏽</span>
                        <span>👩🏼</span>

                    </div>

                    <span className="hero-customers">
                        +2,500 عميل راضي
                    </span>

                    <div className="hero-stars">

                        <FiStar />
                        <FiStar />
                        <FiStar />
                        <FiStar />
                        <FiStar />

                    </div>

                </div>

            </div>
            <style>
                {`

                /* =========================================================
   HERO
   ========================================================= */

.hero-section {
    position: relative;

    width: 100%;
    height: 540px;
    height: 90vh;

    overflow: hidden;

    background: #f7f3ed;
 
    font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;
}




/* =========================================================
   BACKGROUND
   ========================================================= */

.hero-background-image {
    position: absolute;
margin-top: 40px;
    inset: 0;

    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;

    object-position: center right;

    z-index: 1;
}


/* =========================================================
   OVERLAY
   ========================================================= */

.hero-image-overlay {
    position: absolute;

    inset: 0;

    z-index: 2;

    pointer-events: none;

    background:
        linear-gradient(
            90deg,
            rgba(248, 245, 240, 0.94) 0%,
            rgba(248, 245, 240, 0.84) 18%,
            rgba(248, 245, 240, 0.55) 34%,
            rgba(248, 245, 240, 0.18) 55%,
            rgba(248, 245, 240, 0) 76%
        );
}


/* =========================================================
   CONTENT
   ========================================================= */





/* =========================================================
   HERO CONTENT
========================================================= */
.hero-content {
    position: relative;

    z-index: 3;

    width: min(
        calc(100% - (var(--page-padding) * 2)),
        var(--container-width)
    );

    height: 100%;

    margin: 0 auto;

    padding-top: 114px;

    padding-bottom: 50px;

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: flex-start;

    text-align: right;

    direction: rtl;
}

 .hero-content {
    position: absolute;

    z-index: 3;

    top: 0;
    left: 0;

    width: 52%;
    height: 100%;

    padding-left: 8%;
    padding-right: 30px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    text-align: right;

    direction: rtl;
}


.hero-content > * {
    max-width: 520px;
}


/* =========================================================
   TITLES
   ========================================================= */

.hero-small-title {
    display: block;

    margin-bottom: 2px;

    font-size: 29px;

    line-height: 1.3;

    font-weight: 500;

    color: #191919;
}


.hero-content h1 {
    margin: 0;

    font-size: 50px;

    line-height: 1.12;

    font-weight: 900;

    letter-spacing: -1.5px;

    color: #151515;
}


/* =========================================================
   DESCRIPTION
   ========================================================= */

.hero-content p {
    width: 480px;

    max-width: 100%;

    margin: 14px 0 22px;

    color: #444;

    font-size: 13px;

    line-height: 2;

    font-weight: 500;
}


/* =========================================================
   BUTTONS
   ========================================================= */

.hero-buttons {
    display: flex;

    align-items: center;

    gap: 12px;
}


.hero-btn {
    height: 42px;

    padding: 0 25px;

    border-radius: 5px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    text-decoration: none;

    font-size: 12px;

    font-weight: 800;

    transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;
}


.hero-btn-primary {
    background: #171717;

    color: #fff;
}


.hero-btn-primary:hover {
    background: #000;

    transform: translateY(-2px);
}


.hero-btn-secondary {
    background: rgba(255, 255, 255, 0.35);

    color: #222;

    border: 1px solid #d6ad5c;
}


.hero-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.65);

    transform: translateY(-2px);
}


.hero-btn svg {
    width: 14px;
    height: 14px;
}


/* =========================================================
   RATING
   ========================================================= */

.hero-rating {
    margin-top: 20px;

    display: flex;

    align-items: center;

    gap: 9px;
}


.hero-avatars {
    display: flex;

    direction: ltr;
}


.hero-avatars span {
    width: 27px;
    height: 27px;

    margin-left: -5px;

    border: 2px solid #fff;

    border-radius: 50%;

    background: #ddd;

    display: flex;

    align-items: center;
    justify-content: center;

    font-size: 12px;
}


.hero-customers {
    white-space: nowrap;

    color: #333;

    font-size: 11px;

    font-weight: 700;
}


.hero-stars {
    display: flex;

    align-items: center;

    gap: 2px;

    direction: ltr;

    color: #e9a628;
}


.hero-stars svg {
    width: 13px;
    height: 13px;

    fill: currentColor;

    stroke-width: 2.5;
}


/* =========================================================
   LARGE DESKTOP
   ========================================================= */

@media (min-width: 1600px) {

    .hero-section {
        height: 570px;
    }

    .hero-content h1 {
        font-size: 54px;
    }
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 900px) {

    .hero-section {
        height: 570px;
    }

    .hero-background-image {
        object-position: center right;

        opacity: 0.85;
    }

    .hero-image-overlay {
        background:
            linear-gradient(
                90deg,
                rgba(248, 245, 240, 0.95) 0%,
                rgba(248, 245, 240, 0.78) 38%,
                rgba(248, 245, 240, 0.32) 65%,
                rgba(248, 245, 240, 0) 100%
            );
    }

    .hero-content {
        width: 100%;

        padding-left: 20px;
        padding-right: 20px;
    }

    .hero-content h1 {
        font-size: 43px;
    }
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {

    .hero-section {
        height: 570px;
    }

    .hero-background-image {
        object-position: 65% center;
    }

    .hero-image-overlay {
        background:
            linear-gradient(
                90deg,
                rgba(248, 245, 240, 0.96) 0%,
                rgba(248, 245, 240, 0.84) 45%,
                rgba(248, 245, 240, 0.40) 75%,
                rgba(248, 245, 240, 0.08) 100%
            );
    }

    .hero-content {
        width: calc(100% - 30px);

        padding: 100px 0 0;

        align-items: flex-start;

        justify-content: center;
    }

    .hero-content > * {
        max-width: 100%;
    }

    .hero-small-title {
        font-size: 23px;
    }

    .hero-content h1 {
        font-size: 37px;
    }

    .hero-content p {
        width: 100%;

        font-size: 11px;

        line-height: 1.9;

        margin: 12px 0 18px;
    }

    .hero-buttons {
        flex-wrap: wrap;
    }

    .hero-btn {
        height: 40px;

        padding: 0 19px;

        font-size: 10px;
    }

    .hero-rating {
        flex-wrap: wrap;

        gap: 7px;

        margin-top: 17px;
    }
}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 390px) {

    .hero-content h1 {
        font-size: 33px;
    }

    .hero-small-title {
        font-size: 21px;
    }

    .hero-content p {
        font-size: 10px;
    }

    .hero-btn {
        padding: 0 15px;
    }
}
                `}
            </style>

        </section>
    );
}


