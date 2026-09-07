export default function PromoBanner() {

    return (
        <section className="promo-section">

            <div className="promo-banner">

                <div className="promo-background"></div>

                <div className="promo-content">

                    <span>
                        خصم خاص لأول طلب
                    </span>

                    <p>
                        احصل على خصم 10% على طلبك الأول
                    </p>

                    <button>
                        استخدم الكود: AMAROC10
                    </button>

                </div>


                <div className="promo-percent">

                    <strong>
                        10
                    </strong>

                    <span>
                        %
                    </span>

                    <small>
                        OFF
                    </small>

                </div>

            </div>
            <style>
                {`
                /* =========================================================
   PROMO BANNER
   ========================================================= */

.promo-section {
    width: 100%;

    padding: 0 0 30px;

    font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;
}


.promo-banner {
    position: relative;

    width: min(
        calc(100% - 64px),
        1380px
    );

    min-height: 135px;

    margin: 0 auto;

    overflow: hidden;

    border-radius: 12px;

    background: #1b1b1b;

    display: flex;

    align-items: center;
}


/* =========================================================
   BACKGROUND
   ========================================================= */

.promo-background {
    position: absolute;

    inset: 0;

    background:
        linear-gradient(
            90deg,
            rgba(20, 20, 20, 0.94),
            rgba(20, 20, 20, 0.55)
        ),
        url("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1500&q=70")
        center / cover;

    opacity: 0.8;
}


/* =========================================================
   CONTENT
   ========================================================= */

.promo-content {
    position: relative;

    z-index: 2;

    flex: 1;

    padding: 20px;

    color: #fff;

    text-align: center;
}


.promo-content span {
    display: block;

    font-size: 22px;

    line-height: 1.3;

    font-weight: 900;
}


.promo-content p {
    margin: 4px 0 9px;

    font-size: 11px;
}


.promo-content button {
    height: 34px;

    padding: 0 24px;

    border: 0;

    border-radius: 4px;

    background: #d6ad5c;

    color: #171717;

    font-size: 10px;

    font-weight: 900;

    cursor: pointer;
}


/* =========================================================
   PERCENTAGE
   ========================================================= */

.promo-percent {
    position: relative;

    z-index: 2;

    width: 220px;

    min-height: 135px;

    border-right: 1px dashed rgba(255, 255, 255, 0.25);

    display: flex;

    align-items: center;
    justify-content: center;

    direction: ltr;

    color: #d6ad5c;
}


.promo-percent strong {
    font-size: 70px;

    line-height: 1;

    font-weight: 900;
}


.promo-percent span {
    align-self: flex-start;

    margin-top: 23px;

    font-size: 38px;

    font-weight: 900;
}


.promo-percent small {
    position: absolute;

    left: 82px;

    bottom: 27px;

    font-size: 14px;

    font-weight: 900;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1200px) {

    .promo-banner {
        width: calc(100% - 52px);
    }
}


@media (max-width: 900px) {

    .promo-banner {
        width: calc(100% - 40px);
    }
}


@media (max-width: 600px) {

    .promo-section {
        padding-bottom: 20px;
    }

    .promo-banner {
        width: calc(100% - 30px);

        min-height: 150px;
    }

    .promo-content {
        padding: 15px 8px;
    }

    .promo-content span {
        font-size: 16px;
    }

    .promo-content p {
        font-size: 8px;
    }

    .promo-content button {
        height: 30px;

        padding: 0 13px;

        font-size: 8px;
    }

    .promo-percent {
        width: 95px;

        min-height: 150px;
    }

    .promo-percent strong {
        font-size: 42px;
    }

    .promo-percent span {
        margin-top: 29px;

        font-size: 23px;
    }

    .promo-percent small {
        left: 34px;

        bottom: 38px;

        font-size: 8px;
    }
}


@media (max-width: 390px) {

    .promo-banner {
        width: calc(100% - 24px);
    }

    .promo-percent {
        width: 80px;
    }

    .promo-percent strong {
        font-size: 35px;
    }

    .promo-percent span {
        font-size: 20px;
    }
}
                `}
            </style>

        </section>
    );
}