
import {
    FiInstagram,
    FiFacebook,
    FiMapPin,
    FiPhone,
    FiMail,
} from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span>M</span>
                        <strong>AMAROC</strong>
                    </div>

                    <p>
                        أسلوبك في كل تفاصيلك.
                    </p>

                    <p>
                        جودة، ثقة، تميز.
                    </p>
                </div>

                {/* Contact */}
                <div className="footer-column">
                    <h3>
                        تواصل معنا
                    </h3>

                    <div>
                        <FiPhone />
                        <span>+212 600 000 000</span>
                    </div>

                    <div>
                        <FiMail />
                        <span>info@amaroc.com</span>
                    </div>

                    <div>
                        <FiMapPin />
                        <span>الدار البيضاء، المغرب</span>
                    </div>
                </div>

                {/* Links */}
                <div className="footer-column">
                    <h3>
                        روابط سريعة
                    </h3>

                    <a href="/about">
                        من نحن
                    </a>

                    <a href="/shipping">
                        سياسة الشحن
                    </a>

                    <a href="/returns">
                        سياسة الإرجاع
                    </a>

                    <a href="/privacy">
                        سياسة الخصوصية
                    </a>
                </div>

                {/* App */}
                <div className="footer-column app-column">
                    <h3>
                        حمل التطبيق
                    </h3>

                    <p>
                        تسوق بسهولة من تطبيقنا
                    </p>

                    <div className="app-buttons">
                        <div>
                            Google Play
                        </div>

                        <div>
                            App Store
                        </div>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">

                <span>
                    © 2026 AMAROC. جميع الحقوق محفوظة.
                </span>

                <div className="social-icons">
                    <FiInstagram />
                    <FiFacebook />
                </div>

            </div>

            <style>
                {`
                /* =========================================================
                   FOOTER
                   ========================================================= */

                .footer {
                    width: 100%;
                    padding-top: 55px;
                    background: #f8f5f0;
                    font-family:
                        "Cairo",
                        "Tajawal",
                        Arial,
                        sans-serif;
                }

                .footer-container {
                    width: min(
                        calc(100% - 80px),
                        1380px
                    );

                    margin: 0 auto;

                    padding-bottom: 50px;

                    display: grid;

                    grid-template-columns:
                        1.3fr
                        1fr
                        1fr
                        1fr;

                    gap: 70px;
                }


                /* =========================================================
                   BRAND
                   ========================================================= */

                .footer-brand {
                    text-align: right;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    direction: ltr;
                    margin-bottom: 18px;
                }

                .footer-logo span {
                    font-size: 52px;
                    line-height: 1;
                    font-weight: 900;
                    transform: skew(-12deg);
                }

                .footer-logo strong {
                    font-size: 26px;
                    font-weight: 800;
                    letter-spacing: 0.02em;
                }

                .footer-brand p {
                    margin: 6px 0;
                    color: #777;
                    font-size: 13px;
                    line-height: 1.8;
                }


                /* =========================================================
                   COLUMNS
                   ========================================================= */

                .footer-column {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 13px;
                }

                .footer-column h3 {
                    margin: 0 0 8px;
                    color: #171717;
                    font-size: 16px;
                    font-weight: 800;
                }

                .footer-column a,
                .footer-column > div {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    color: #666;

                    text-decoration: none;

                    font-size: 13px;

                    line-height: 1.8;

                    transition:
                        color 0.2s ease,
                        transform 0.2s ease;
                }

                .footer-column a:hover {
                    color: #111;
                    transform: translateX(-3px);
                }

                .footer-column svg {
                    width: 17px;
                    height: 17px;
                    flex-shrink: 0;
                }


                /* =========================================================
                   APP
                   ========================================================= */

                .footer-column p {
                    margin: 0;
                    color: #777;
                    font-size: 13px;
                    line-height: 1.8;
                }

                .app-buttons {
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 10px;

                    margin-top: 8px;
                }

                .app-buttons div {
                    min-width: 105px;

                    padding: 11px 14px;

                    border-radius: 7px;

                    background: #111;

                    color: #fff !important;

                    text-align: center;

                    font-size: 11px !important;
                    font-weight: 600;

                    transition:
                        transform 0.2s ease,
                        opacity 0.2s ease;
                }

                .app-buttons div:hover {
                    transform: translateY(-2px);
                    opacity: 0.9;
                }


                /* =========================================================
                   BOTTOM
                   ========================================================= */

                .footer-bottom {
                    width: min(
                        calc(100% - 80px),
                        1380px
                    );

                    margin: 0 auto;

                    min-height: 70px;

                    border-top: 1px solid #e3ded5;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    color: #888;

                    font-size: 12px;
                }

                .social-icons {
                    display: flex;
                    align-items: center;
                    gap: 17px;
                }

                .social-icons svg {
                    width: 19px;
                    height: 19px;

                    cursor: pointer;

                    transition:
                        color 0.2s ease,
                        transform 0.2s ease;
                }

                .social-icons svg:hover {
                    color: #111;
                    transform: translateY(-2px);
                }


                /* =========================================================
                   LARGE TABLET
                   ========================================================= */

                @media (max-width: 1200px) {

                    .footer-container,
                    .footer-bottom {
                        width: calc(100% - 60px);
                    }

                    .footer-container {
                        gap: 45px;
                    }

                    .footer-logo span {
                        font-size: 46px;
                    }

                    .footer-logo strong {
                        font-size: 23px;
                    }
                }


                /* =========================================================
                   TABLET
                   ========================================================= */

                @media (max-width: 900px) {

                    .footer {
                        padding-top: 45px;
                    }

                    .footer-container,
                    .footer-bottom {
                        width: calc(100% - 48px);
                    }

                    .footer-container {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));

                        gap: 45px 40px;

                        padding-bottom: 40px;
                    }

                    .footer-logo span {
                        font-size: 42px;
                    }

                    .footer-logo strong {
                        font-size: 22px;
                    }

                    .footer-column h3 {
                        font-size: 15px;
                    }

                    .footer-column a,
                    .footer-column > div {
                        font-size: 12px;
                    }

                    .footer-brand p,
                    .footer-column p {
                        font-size: 12px;
                    }

                    .footer-bottom {
                        min-height: 65px;
                        font-size: 11px;
                    }
                }


                /* =========================================================
                   MOBILE
                   ========================================================= */

                @media (max-width: 600px) {

                    .footer {
                        padding-top: 40px;
                    }

                    .footer-container,
                    .footer-bottom {
                        width: calc(100% - 32px);
                    }

                    .footer-container {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));

                        gap: 38px 24px;

                        padding-bottom: 38px;
                    }

                    .footer-logo {
                        gap: 8px;
                        margin-bottom: 14px;
                    }

                    .footer-logo span {
                        font-size: 36px;
                    }

                    .footer-logo strong {
                        font-size: 19px;
                    }

                    .footer-brand p {
                        font-size: 11px;
                    }

                    .footer-column {
                        gap: 10px;
                    }

                    .footer-column h3 {
                        margin-bottom: 6px;
                        font-size: 14px;
                    }

                    .footer-column a,
                    .footer-column > div {
                        gap: 8px;
                        font-size: 11px;
                    }

                    .footer-column svg {
                        width: 15px;
                        height: 15px;
                    }

                    .footer-column p {
                        font-size: 11px;
                    }

                    .app-buttons {
                        gap: 7px;
                        flex-wrap: wrap;
                    }

                    .app-buttons div {
                        min-width: 88px;
                        padding: 9px 10px;
                        font-size: 9px !important;
                    }

                    .footer-bottom {
                        min-height: 60px;
                        font-size: 9px;
                        gap: 15px;
                    }

                    .social-icons {
                        gap: 13px;
                    }

                    .social-icons svg {
                        width: 17px;
                        height: 17px;
                    }
                }


                /* =========================================================
                   SMALL MOBILE
                   ========================================================= */

                @media (max-width: 390px) {

                    .footer-container,
                    .footer-bottom {
                        width: calc(100% - 24px);
                    }

                    .footer-container {
                        gap: 32px 15px;
                    }

                    .footer-logo span {
                        font-size: 32px;
                    }

                    .footer-logo strong {
                        font-size: 17px;
                    }

                    .footer-brand p {
                        font-size: 10px;
                    }

                    .footer-column h3 {
                        font-size: 13px;
                    }

                    .footer-column a,
                    .footer-column > div {
                        font-size: 10px;
                    }

                    .footer-column p {
                        font-size: 10px;
                    }

                    .app-buttons {
                        flex-direction: column !important;
                        align-items: flex-start;
                    }

                    .app-buttons div {
                        min-width: 82px;
                    }

                    .footer-bottom {
                        font-size: 8px;
                    }

                    .social-icons svg {
                        width: 16px;
                        height: 16px;
                    }
                }
                `}
            </style>
        </footer>
    );
}
 


