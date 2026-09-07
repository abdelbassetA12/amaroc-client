 
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import {
    FiShoppingBag,
    FiHeart,
    FiUser,
    FiMenu,
    FiX
} from "react-icons/fi";

export default function MainNavbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const {
        cartCount,
        openCart,
    } = useCart();


    /* =====================================================
       NAVBAR SCROLL
    ===================================================== */

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 10) {
                setShowNavbar(true);
                lastScrollY = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY) {
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY) {
                setShowNavbar(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    /* =====================================================
       LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
    ===================================================== */

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);


    /* =====================================================
       CLOSE MENU WITH ESC
    ===================================================== */

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    /* =====================================================
       MOBILE NAV LINKS
    ===================================================== */

    const mobileLinks = [
        {
            path: "/",
            label: "الرئيسية",
            end: true
        },
        {
            path: "/products",
            label: "المنتجات"
        },
        {
            path: "/categories",
            label: "الفئات"
        },
        {
            path: "/new-arrivals",
            label: "وصل حديثاً"
        },
        {
            path: "/offers",
            label: "العروض"
        },
        {
            path: "/track-order",
            label: "تتبع الطلب"
        }
    ];


    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (
        <>
            {/* =================================================
                NAVBAR
            ================================================= */}

            <header
                className={`main-navbar ${
                    showNavbar
                        ? "navbar-visible"
                        : "navbar-hidden"
                }`}
            >

                <div className="navbar-container">

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <NavLink
                        to="/"
                        className="brand"
                        onClick={closeMenu}
                    >
                        <img
                            src="/amaroc-logo1.png"
                            alt="AMAROC"
                            className="brand-logo"
                        />
                    </NavLink>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav className="main-nav">

                        {mobileLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.end}
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                    </nav>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="navbar-actions">

                        {/* CART */}

                        <button
                            type="button"
                            className="nav-action"
                            onClick={openCart}
                            aria-label="فتح سلة التسوق"
                        >
                            <FiShoppingBag />

                            {cartCount > 0 && (
                                <span className="cart-count">
                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount}
                                </span>
                            )}
                        </button>


                        {/* FAVORITES */}

                        <button
                            type="button"
                            className="nav-action desktop-action"
                            aria-label="المفضلة"
                        >
                            <FiHeart />
                        </button>


                        {/* USER */}

                        <button
                            type="button"
                            className="nav-action desktop-action"
                            aria-label="الحساب"
                        >
                            <FiUser />
                        </button>


                        {/* =================================================
                            MOBILE MENU BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            className={`mobile-menu-button ${
                                menuOpen ? "open" : ""
                            }`}
                            onClick={() =>
                                setMenuOpen(!menuOpen)
                            }
                            aria-label={
                                menuOpen
                                    ? "إغلاق القائمة"
                                    : "فتح القائمة"
                            }
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? (
                                <FiX />
                            ) : (
                                <FiMenu />
                            )}
                        </button>

                    </div>

                </div>

            </header>


            {/* =========================================================
                MOBILE MENU OVERLAY
            ========================================================= */}

            <div
                className={`mobile-menu-overlay ${
                    menuOpen ? "show" : ""
                }`}
                onClick={closeMenu}
            />


            {/* =========================================================
                MOBILE MENU
            ========================================================= */}

            <aside
                className={`mobile-menu ${
                    menuOpen ? "show" : ""
                }`}
                dir="rtl"
            >

                {/* =================================================
                    MENU HEADER
                ================================================= */}

                <div className="mobile-menu-header">

                    <img
                        src="/amaroc-logo1.png"
                        alt="AMAROC"
                        className="mobile-menu-logo"
                    />

                    <button
                        type="button"
                        className="mobile-close"
                        onClick={closeMenu}
                        aria-label="إغلاق القائمة"
                    >
                        <FiX />
                    </button>

                </div>


                {/* =================================================
                    MENU NAVIGATION
                ================================================= */}

                <nav className="mobile-nav">

                    {mobileLinks.map((link, index) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `mobile-nav-link ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                            style={{
                                transitionDelay: menuOpen
                                    ? `${index * 45}ms`
                                    : "0ms"
                            }}
                        >
                            <span className="mobile-link-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span>
                                {link.label}
                            </span>

                            <span className="mobile-link-arrow">
                                ←
                            </span>
                        </NavLink>
                    ))}

                </nav>


                {/* =================================================
                    MENU FOOTER
                ================================================= */}

                <div className="mobile-menu-footer">

                    <button
                        type="button"
                        className="mobile-footer-action"
                    >
                        <FiHeart />
                        <span>المفضلة</span>
                    </button>

                    <button
                        type="button"
                        className="mobile-footer-action"
                    >
                        <FiUser />
                        <span>حسابي</span>
                    </button>

                </div>

            </aside>


            {/* =====================================================
                STYLE
            ===================================================== */}

            <style>
                {`

/* =========================================================
   MAIN NAVBAR
========================================================= */

.main-navbar {
    position: fixed;

    top: 38px;
    left: 0;

    width: 100%;
    height: 82px;

    z-index: 9999;

    background: transparent;

    border-bottom: 1px solid rgba(255, 255, 255, 0.20);

    font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;

    transition:
        transform 0.4s cubic-bezier(.22,.61,.36,1),
        opacity 0.25s ease;

    will-change: transform;
}


/* =========================================================
   NAVBAR VISIBILITY
========================================================= */

.main-navbar.navbar-visible {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
}

.main-navbar.navbar-hidden {
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
}


/* =========================================================
   CONTAINER
========================================================= */

.navbar-container {
    width: min(100% - 70px, 1440px);

    height: 100%;

    margin: 0 auto;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 45px;
}


/* =========================================================
   LOGO
========================================================= */

.brand {
    flex: 0 0 auto;

    display: flex;

    align-items: center;

    text-decoration: none;

    line-height: 0;
}

.brand-logo {
    width: 145px;

    height: auto;

    max-height: 60px;

    object-fit: contain;

    display: block;

    transition:
        transform .3s ease,
        opacity .3s ease;
}

.brand:hover .brand-logo {
    transform: scale(1.025);
}


/* =========================================================
   DESKTOP NAV
========================================================= */

.main-nav {
    flex: 1;

    height: 100%;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: clamp(24px, 3vw, 48px);

    direction: rtl;
}

.nav-link {
    position: relative;

    height: 100%;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 0 2px;

    color: #292929;

    text-decoration: none;

    white-space: nowrap;

    font-size: clamp(14px, 1.05vw, 16px);

    font-weight: 600;

    letter-spacing: -0.15px;

    transition:
        color .25s ease,
        transform .25s ease;
}

.nav-link:hover {
    color: #000;

    transform: translateY(-1px);
}


/* =========================================================
   ACTIVE
========================================================= */

.nav-link::after {
    content: "";

    position: absolute;

    right: 0;
    left: 0;

    bottom: 17px;

    height: 2px;

    border-radius: 10px;

    background: #d6ad5c;

    transform: scaleX(0);

    transform-origin: center;

    opacity: 0;

    transition:
        transform .3s cubic-bezier(.22,.61,.36,1),
        opacity .25s ease;
}

.nav-link.active {
    color: #111;

    font-weight: 700;
}

.nav-link.active::after {
    transform: scaleX(1);

    opacity: 1;
}


/* =========================================================
   ACTIONS
========================================================= */

.navbar-actions {
    flex: 0 0 auto;

    display: flex;

    align-items: center;

    gap: clamp(8px, 1vw, 16px);

    direction: ltr;
}

.nav-action {
    position: relative;

    width: 38px;
    height: 40px;

    padding: 0;

    border: 0;

    outline: none;

    background: transparent;

    color: #171717;

    cursor: pointer;

    display: flex;

    align-items: center;

    justify-content: center;

    transition:
        transform .25s ease,
        color .25s ease;
}

.nav-action:hover {
    color: #000;

    transform: translateY(-2px);
}

.nav-action svg {
    width: 23px;

    height: 23px;

    stroke-width: 1.65;
}


/* =========================================================
   CART BADGE
========================================================= */

.cart-count {
    position: absolute;

    top: 1px;
    right: -2px;

    min-width: 16px;
    height: 16px;

    padding: 0 4px;

    border-radius: 20px;

    background: #d6ad5c;

    color: #111;

    display: flex;

    align-items: center;

    justify-content: center;

    font-family: Arial, sans-serif;

    font-size: 8px;

    font-weight: 800;

    line-height: 1;
}


/* =========================================================
   MOBILE MENU BUTTON
========================================================= */

.mobile-menu-button {
    display: none;

    width: 38px;
    height: 40px;

    padding: 0;

    border: 0;

    background: transparent;

    color: #171717;

    cursor: pointer;

    align-items: center;
    justify-content: center;

    transition:
        transform .25s ease,
        color .25s ease;
}

.mobile-menu-button svg {
    width: 24px;
    height: 24px;

    stroke-width: 1.6;
}

.mobile-menu-button:hover {
    transform: translateY(-1px);
}


/* =========================================================
   MOBILE OVERLAY
========================================================= */

.mobile-menu-overlay {
    position: fixed;

    inset: 0;

    z-index: 10000;

    background: rgba(0, 0, 0, .35);

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    opacity: 0;

    visibility: hidden;

    pointer-events: none;

    transition:
        opacity .35s ease,
        visibility .35s ease;
}

.mobile-menu-overlay.show {
    opacity: 1;

    visibility: visible;

    pointer-events: auto;
}


/* =========================================================
   MOBILE SIDE MENU
========================================================= */

.mobile-menu {
    position: fixed;

    top: 0;
    right: 0;

    width: min(88vw, 390px);

    height: 100dvh;

    z-index: 10001;

    background: #fff;

    box-shadow:
        -15px 0 50px rgba(0,0,0,.12);

    transform: translateX(105%);

    transition:
        transform .45s cubic-bezier(.22,.61,.36,1);

    display: flex;

    flex-direction: column;

    overflow-y: auto;
}

.mobile-menu.show {
    transform: translateX(0);
}


/* =========================================================
   MOBILE MENU HEADER
========================================================= */

.mobile-menu-header {
    min-height: 95px;

    padding:
        22px 24px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border-bottom: 1px solid #eee8df;
}

.mobile-menu-logo {
    width: 125px;

    height: auto;

    max-height: 50px;

    object-fit: contain;
}

.mobile-close {
    width: 40px;
    height: 40px;

    border: 1px solid #e8e3dc;

    background: #faf9f7;

    color: #171717;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    cursor: pointer;

    transition:
        background .25s ease,
        transform .25s ease;
}

.mobile-close svg {
    width: 20px;
    height: 20px;
}

.mobile-close:hover {
    background: #f1ede7;

    transform: rotate(90deg);
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

.mobile-nav {
    display: flex;

    flex-direction: column;

    padding: 22px 24px;

    flex: 1;
}

.mobile-nav-link {
    position: relative;

    min-height: 66px;

    display: grid;

    grid-template-columns: 42px 1fr 25px;

    align-items: center;

    gap: 12px;

    color: #202020;

    text-decoration: none;

    font-size: 17px;

    font-weight: 600;

    border-bottom: 1px solid #eeeae4;

    opacity: 0;

    transform: translateX(25px);

    transition:
        color .25s ease,
        background .25s ease,
        opacity .45s ease,
        transform .45s ease;
}

.mobile-menu.show .mobile-nav-link {
    opacity: 1;

    transform: translateX(0);
}

.mobile-nav-link:hover {
    color: #000;
}

.mobile-nav-link.active {
    color: #111;

    font-weight: 700;
}

.mobile-link-number {
    color: #b4aea5;

    font-family: Arial, sans-serif;

    font-size: 11px;

    font-weight: 600;

    letter-spacing: 1px;
}

.mobile-nav-link.active .mobile-link-number {
    color: #d6ad5c;
}

.mobile-link-arrow {
    color: #b6b0a8;

    font-size: 17px;

    transition:
        transform .25s ease,
        color .25s ease;
}

.mobile-nav-link:hover .mobile-link-arrow,
.mobile-nav-link.active .mobile-link-arrow {
    color: #d6ad5c;

    transform: translateX(-4px);
}


/* =========================================================
   MOBILE FOOTER
========================================================= */

.mobile-menu-footer {
    padding: 18px 24px 28px;

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 10px;

    border-top: 1px solid #eee8df;
}

.mobile-footer-action {
    height: 52px;

    border: 1px solid #e8e3dc;

    background: #faf9f7;

    border-radius: 3px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 9px;

    color: #222;

    font-family: inherit;

    font-size: 13px;

    font-weight: 600;

    cursor: pointer;

    transition:
        background .25s ease,
        transform .25s ease;
}

.mobile-footer-action:hover {
    background: #f2eee8;

    transform: translateY(-2px);
}

.mobile-footer-action svg {
    width: 18px;
    height: 18px;

    stroke-width: 1.6;
}


/* =========================================================
   LARGE LAPTOP
========================================================= */

@media (max-width: 1250px) {

    .navbar-container {
        width: calc(100% - 50px);

        gap: 30px;
    }

    .brand-logo {
        width: 130px;
    }

    .main-nav {
        gap: clamp(18px, 2.2vw, 32px);
    }

    .nav-link {
        font-size: 14px;
    }
}


/* =========================================================
   LAPTOP
========================================================= */

@media (max-width: 1050px) {

    .navbar-container {
        width: calc(100% - 36px);

        gap: 22px;
    }

    .brand-logo {
        width: 115px;
    }

    .main-nav {
        gap: 17px;
    }

    .nav-link {
        font-size: 13px;
    }

    .navbar-actions {
        gap: 4px;
    }

    .nav-action {
        width: 34px;
    }

    .nav-action svg {
        width: 21px;
        height: 21px;
    }
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {

    .main-nav {
        display: none;
    }

    .navbar-container {
        width: calc(100% - 32px);
    }

    .brand-logo {
        width: 125px;
    }

    .desktop-action {
        display: none;
    }

    .mobile-menu-button {
        display: flex;
    }

    .navbar-actions {
        gap: 5px;
    }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

    .main-navbar {
        top: 29px;

        height: 65px;
    }

    .navbar-container {
        width: calc(100% - 24px);
    }

    .brand-logo {
        width: 105px;

        max-height: 45px;
    }

    .nav-action {
        width: 32px;

        height: 34px;
    }

    .nav-action svg {
        width: 19px;

        height: 19px;
    }

    .mobile-menu-button {
        width: 32px;

        height: 34px;
    }

    .mobile-menu-button svg {
        width: 21px;

        height: 21px;
    }

    .cart-count {
        top: -1px;

        right: -3px;

        min-width: 13px;

        height: 13px;

        font-size: 7px;
    }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

    .navbar-container {
        width: calc(100% - 18px);
    }

    .brand-logo {
        width: 92px;
    }

    .nav-action,
    .mobile-menu-button {
        width: 29px;

        height: 32px;
    }

    .nav-action svg,
    .mobile-menu-button svg {
        width: 18px;

        height: 18px;
    }

    .mobile-menu {
        width: 92vw;
    }

}

                `}
            </style>
        </>
    );
}
 
