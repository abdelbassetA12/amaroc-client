import { useEffect, useState } from "react";

import {
    FiTruck,
    FiCreditCard,
    FiPercent
} from "react-icons/fi";


export default function TopBar() {

    const [showTopBar, setShowTopBar] = useState(true);

    useEffect(() => {

        let lastScrollY = window.scrollY;

        const handleScroll = () => {

            const currentScrollY = window.scrollY;

            // في أعلى الصفحة
            if (currentScrollY <= 10) {
                setShowTopBar(true);
            }

            // نزول
            else if (currentScrollY > lastScrollY) {
                setShowTopBar(false);
            }

            // صعود
            else if (currentScrollY < lastScrollY) {
                setShowTopBar(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    return (
        <div
            className={`top-bar ${
                showTopBar
                    ? "top-bar-visible"
                    : "top-bar-hidden"
            }`}
        >

            <div className="top-bar-item">

                <FiTruck />

                <span>
                    توصيل مجاني لجميع الطلبات
                </span>

            </div>


            <div className="top-bar-item top-bar-center">

                <FiPercent />

                <span>
                    خصومات تصل إلى 30% على مجموعة مختارة
                </span>

            </div>


            <div className="top-bar-item">

                <FiCreditCard />

                <span>
                    الدفع عند الاستلام متاح
                </span>

            </div>
            <style>
                {`
                /* =========================================================
   TOP BAR
   ========================================================= */

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    width: 100%;
    height: 32px;

    padding: 0 32px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #171717;
    color: #fff;

    font-family: "Cairo", "Tajawal", Arial, sans-serif;
    font-size: 11px;

    z-index: 9999;

    transition:
        transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.25s ease;

    will-change: transform, opacity;
}


/* Visible */

.top-bar.top-bar-visible {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}


/* Hidden */

.top-bar.top-bar-hidden {
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}


/* Item */

.top-bar-item {
    display: flex;
    align-items: center;

    gap: 7px;

    white-space: nowrap;
}


.top-bar-item svg {
    width: 14px;
    height: 14px;

    color: #d6ad5c;

    flex-shrink: 0;
}


/* Center */

.top-bar-center {
    position: absolute;

    left: 50%;

    transform: translateX(-50%);
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 900px) {

    .top-bar {
        padding: 0 15px;
        font-size: 9px;
    }

    .top-bar-center {
        display: none;
    }
}


@media (max-width: 600px) {

    .top-bar {
        height: 29px;

        padding: 0 10px;

        font-size: 8px;
    }
}
                `}
            </style>

        </div>
    );
}
 