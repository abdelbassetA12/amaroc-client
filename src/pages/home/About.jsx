import { Link } from "react-router-dom";
import {
FiArrowLeft,
FiAward,
FiHeart,
FiShield,
FiTruck,
FiUsers,
} from "react-icons/fi";

export default function About() {
const values = [
{
icon: FiHeart,
title: "نهتم بتجربتك",
text: "نضع رضا عملائنا في مقدمة أولوياتنا، ونسعى لتقديم تجربة شراء سهلة ومريحة من البداية حتى استلام الطلب.",
},
{
icon: FiShield,
title: "ثقة وأمان",
text: "نحرص على تقديم معلومات واضحة حول المنتجات والأسعار وسياسات الطلب والشحن والإرجاع.",
},
{
icon: FiAward,
title: "جودة مختارة",
text: "نختار منتجاتنا بعناية لنقدم لك تشكيلة عملية وأنيقة تناسب احتياجاتك اليومية.",
},
{
icon: FiTruck,
title: "توصيل موثوق",
text: "نسعى لتوفير خيارات شحن مناسبة وسريعة مع متابعة طلبك حتى يصل إليك.",
},
];

return ( <main className="about-page"> <section className="about-hero"> <div className="about-container"> <div className="about-hero-content"> <span className="about-eyebrow">AMAROC</span>

 
        <h1>من نحن</h1>

        <p>
          مرحباً بك في AMAROC، متجرك الإلكتروني الذي يجمع بين البساطة،
          الجودة، والأسلوب العصري لتقديم تجربة تسوق مميزة.
        </p>

        <div className="about-actions">
          <Link to="/products" className="about-primary-btn">
            اكتشف منتجاتنا
            <FiArrowLeft />
          </Link>

          <Link to="/categories" className="about-secondary-btn">
            تصفح التصنيفات
          </Link>
        </div>
      </div>

      <div className="about-hero-card">
        <div className="about-card-icon">
          <FiUsers />
        </div>

        <strong>تجربة تسوق مصممة لك</strong>

        <p>
          نعمل على جعل التسوق عبر الإنترنت أكثر وضوحاً وسهولة ومتعة.
        </p>
      </div>
    </div>
  </section>

  <section className="about-story">
    <div className="about-container about-story-grid">
      <div>
        <span className="about-section-label">قصتنا</span>

        <h2>أكثر من مجرد متجر إلكتروني</h2>
      </div>

      <div className="about-story-text">
        <p>
          تأسس AMAROC بهدف إنشاء تجربة تسوق إلكترونية بسيطة واحترافية،
          تمنح العميل إمكانية اكتشاف المنتجات والاطلاع على تفاصيلها
          واتخاذ قرار الشراء بسهولة.
        </p>

        <p>
          نؤمن أن المتجر الجيد لا يعتمد فقط على المنتجات، بل على كل
          التفاصيل المحيطة بتجربة العميل، بداية من عرض المنتج ووصولاً إلى
          الشحن وخدمة ما بعد البيع.
        </p>
      </div>
    </div>
  </section>

  <section className="about-values">
    <div className="about-container">
      <div className="about-section-heading">
        <span className="about-section-label">لماذا AMAROC؟</span>
        <h2>قيم نحرص عليها</h2>
        <p>
          نبني تجربتنا حول مجموعة من المبادئ التي تساعدنا على تقديم خدمة
          أفضل لعملائنا.
        </p>
      </div>

      <div className="about-values-grid">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article className="about-value-card" key={value.title}>
              <div className="about-value-icon">
                <Icon />
              </div>

              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>

  <section className="about-cta">
    <div className="about-container">
      <div>
        <span className="about-section-label">ابدأ الآن</span>
        <h2>اكتشف تشكيلتنا</h2>
        <p>
          تصفح منتجات AMAROC واختر ما يناسبك.
        </p>
      </div>

      <Link to="/products" className="about-primary-btn">
        تسوق الآن
        <FiArrowLeft />
      </Link>
    </div>
  </section>

  <style>{`
    .about-page {
      direction: rtl;
      background: #ffffff;
      color: #171717;
      font-family: inherit;
    }

    .about-container {
      width: min(1380px, calc(100% - 40px));
      margin: 0 auto;
    }

    .about-hero {
      background: #f7f3ed;
      border-bottom: 1px solid #e8e1d8;
      padding: 90px 0;
    }

    .about-hero-content {
      max-width: 760px;
    }

    .about-eyebrow,
    .about-section-label {
      display: inline-block;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #8a6f52;
      margin-bottom: 14px;
    }

    .about-hero h1 {
      margin: 0 0 22px;
      font-size: clamp(42px, 6vw, 76px);
      line-height: 1.05;
      font-weight: 900;
    }

    .about-hero-content > p {
      max-width: 680px;
      margin: 0;
      color: #686868;
      font-size: 19px;
      line-height: 2;
    }

    .about-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 32px;
    }

    .about-primary-btn,
    .about-secondary-btn {
      min-height: 52px;
      padding: 0 24px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 800;
      transition: 0.25s ease;
    }

    .about-primary-btn {
      color: #ffffff;
      background: #171717;
    }

    .about-primary-btn:hover {
      transform: translateY(-2px);
      background: #2c2c2c;
    }

    .about-secondary-btn {
      color: #171717;
      background: #ffffff;
      border: 1px solid #ddd5ca;
    }

    .about-secondary-btn:hover {
      border-color: #b9aa99;
      transform: translateY(-2px);
    }

    .about-hero-card {
      max-width: 430px;
      margin-top: 55px;
      padding: 30px;
      background: #ffffff;
      border: 1px solid #e8e1d8;
      border-radius: 24px;
      box-shadow: 0 15px 45px rgba(35, 29, 22, 0.07);
    }

    .about-card-icon,
    .about-value-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: #f7f3ed;
      color: #8a6f52;
      margin-bottom: 20px;
    }

    .about-card-icon svg,
    .about-value-icon svg {
      width: 23px;
      height: 23px;
    }

    .about-hero-card strong {
      display: block;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .about-hero-card p {
      margin: 0;
      color: #777;
      line-height: 1.9;
    }

    .about-story {
      padding: 95px 0;
      border-bottom: 1px solid #eeeeee;
    }

    .about-story-grid {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 80px;
      align-items: start;
    }

    .about-story h2,
    .about-section-heading h2,
    .about-cta h2 {
      margin: 0;
      font-size: clamp(30px, 4vw, 48px);
      line-height: 1.25;
      font-weight: 900;
    }

    .about-story-text {
      color: #666;
      font-size: 17px;
      line-height: 2;
    }

    .about-story-text p {
      margin: 0 0 22px;
    }

    .about-values {
      padding: 95px 0;
      background: #faf9f7;
    }

    .about-section-heading {
      max-width: 680px;
      margin-bottom: 45px;
    }

    .about-section-heading p {
      margin: 18px 0 0;
      color: #777;
      line-height: 1.9;
    }

    .about-values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .about-value-card {
      padding: 30px;
      background: #ffffff;
      border: 1px solid #e9e4dd;
      border-radius: 22px;
    }

    .about-value-card h3 {
      margin: 0 0 12px;
      font-size: 19px;
    }

    .about-value-card p {
      margin: 0;
      color: #707070;
      line-height: 1.9;
      font-size: 14px;
    }

    .about-cta {
      padding: 65px 0;
      background: #171717;
      color: #ffffff;
    }

    .about-cta .about-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
    }

    .about-cta .about-section-label {
      color: #c7ad91;
    }

    .about-cta p {
      margin: 12px 0 0;
      color: #bdbdbd;
    }

    .about-cta .about-primary-btn {
      background: #ffffff;
      color: #171717;
      flex-shrink: 0;
    }

    @media (max-width: 900px) {
      .about-hero {
        padding: 70px 0;
      }

      .about-story-grid {
        grid-template-columns: 1fr;
        gap: 35px;
      }

      .about-values-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .about-cta .about-container {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    @media (max-width: 600px) {
      .about-container {
        width: min(100% - 28px, 1380px);
      }

      .about-hero {
        padding: 55px 0;
      }

      .about-hero-content > p {
        font-size: 16px;
      }

      .about-actions {
        flex-direction: column;
      }

      .about-primary-btn,
      .about-secondary-btn {
        width: 100%;
      }

      .about-hero-card {
        margin-top: 35px;
      }

      .about-story,
      .about-values {
        padding: 65px 0;
      }

      .about-values-grid {
        grid-template-columns: 1fr;
      }

      .about-value-card {
        padding: 24px;
      }

      .about-cta {
        padding: 50px 0;
      }
    }
  `}</style>
</main>
 

);
}
