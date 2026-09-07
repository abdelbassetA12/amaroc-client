import {
    FiRotateCcw,
    FiTruck,
    FiShield,
    FiHeadphones
} from "react-icons/fi";

const features = [

    {
        icon: <FiRotateCcw />,
        title: "إرجاع سهل",
        text: "إرجاع مجاني خلال 7 أيام"
    },

    {
        icon: <FiTruck />,
        title: "شحن سريع وآمن",
        text: "توصيل مجاني للطلبات +300 درهم"
    },

    {
        icon: <FiShield />,
        title: "ضمان الجودة",
        text: "منتجات أصلية 100%"
    },

    {
        icon: <FiHeadphones />,
        title: "خدمة عملاء 24/7",
        text: "نحن هنا لمساعدتك دائماً"
    }

];

export default function StoreFeatures() {

    return (
        <section className="store-features">

            <div className="features-container">

                {features.map((feature, index) => (

                    <div
                        className="feature-item"
                        key={index}
                    >

                        <div className="feature-icon">
                            {feature.icon}
                        </div>

                        <div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.text}
                            </p>

                        </div>

                    </div>

                ))}

            </div>
            <style>
                {`
                /* =========================================================
   STORE FEATURES
   ========================================================= */

.store-features {
    width: 100%;

    padding: 0 0 28px;

    font-family:
        "Cairo",
        "Tajawal",
        Arial,
        sans-serif;
}


.features-container {
    width: min(
        calc(100% - 64px),
        1380px
    );

    margin: 0 auto;

    padding: 24px 30px;

    border-radius: 11px;

    background: #f7f3ed;

    display: grid;

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

    gap: 20px;
}


.feature-item {
    min-width: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 12px;

    text-align: right;
}


.feature-icon {
    width: 40px;
    height: 40px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;
}


.feature-icon svg {
    width: 27px;
    height: 27px;

    stroke-width: 1.7;
}


.feature-item h3 {
    margin: 0 0 2px;

    font-size: 11px;

    font-weight: 900;
}


.feature-item p {
    margin: 0;

    color: #777;

    font-size: 8px;

    line-height: 1.7;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1200px) {

    .features-container {
        width: calc(100% - 52px);
    }
}


@media (max-width: 900px) {

    .features-container {
        width: calc(100% - 40px);

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 20px;
    }
}


@media (max-width: 600px) {

    .store-features {
        padding-bottom: 20px;
    }

    .features-container {
        width: calc(100% - 30px);

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        padding: 18px 10px;

        gap: 20px 8px;
    }

    .feature-item {
        flex-direction: column;

        text-align: center;

        gap: 4px;
    }

    .feature-icon {
        width: 32px;
        height: 32px;
    }

    .feature-icon svg {
        width: 23px;
        height: 23px;
    }

    .feature-item h3 {
        font-size: 9px;
    }

    .feature-item p {
        font-size: 7px;
    }
}
                `}
            </style>

        </section>
    );
}