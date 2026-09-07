import { Link } from "react-router-dom";
import {
FiArrowLeft,
FiCheckCircle,
FiClock,
FiRefreshCw,
FiShield,
} from "react-icons/fi";

export default function Returns() {
const steps = [
{
number: "01",
title: "تواصل معنا",
text: "أرسل لنا طلب الإرجاع مع رقم الطلب وسبب الإرجاع.",
},
{
number: "02",
title: "مراجعة الطلب",
text: "نراجع الطلب ونتأكد من توافق المنتج مع شروط الإرجاع.",
},
{
number: "03",
title: "إرجاع المنتج",
text: "بعد الموافقة، يتم توجيهك إلى خطوات إعادة المنتج.",
},
{
number: "04",
title: "معالجة الإرجاع",
text: "بعد استلام المنتج وفحصه، تتم معالجة الإرجاع وفقاً للسياسة.",
},
];

return ( <main className="returns-page"> <section className="returns-hero"> <div className="returns-container"> <span>AMAROC / الإرجاع</span> <h1>سياسة الإرجاع</h1> <p>
نريد أن تكون عملية الشراء واضحة ومريحة، لذلك وضعنا سياسة إرجاع
بسيطة ومنظمة. </p> </div> </section>

 
  <section className="returns-main">
    <div className="returns-container">
      <div className="returns-notice">
        <div className="returns-notice-icon">
          <FiRefreshCw />
        </div>

        <div>
          <h2>الإرجاع خلال 7 أيام</h2>
          <p>
            يمكنك طلب إرجاع المنتج خلال 7 أيام من تاريخ استلامه، بشرط
            استيفاء شروط الإرجاع الموضحة أدناه.
          </p>
        </div>
      </div>

      <section className="returns-section">
        <div className="returns-heading">
          <span>كيف تتم العملية؟</span>
          <h2>خطوات الإرجاع</h2>
        </div>

        <div className="returns-steps">
          {steps.map((step) => (
            <article className="returns-step" key={step.number}>
              <div className="returns-number">{step.number}</div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="returns-section">
        <div className="returns-heading">
          <span>الشروط</span>
          <h2>متى يمكن إرجاع المنتج؟</h2>
        </div>

        <div className="returns-rules">
          <div>
            <FiCheckCircle />
            <p>يجب أن يكون المنتج في حالته الأصلية وغير مستخدم.</p>
          </div>

          <div>
            <FiCheckCircle />
            <p>يجب الاحتفاظ بالتغليف والملحقات الأصلية إن وجدت.</p>
          </div>

          <div>
            <FiCheckCircle />
            <p>يجب تقديم رقم الطلب عند التواصل معنا.</p>
          </div>

          <div>
            <FiCheckCircle />
            <p>قد لا تقبل بعض المنتجات للإرجاع لأسباب تتعلق بطبيعتها.</p>
          </div>
        </div>
      </section>

      <section className="returns-info-grid">
        <article>
          <FiShield />
          <h3>المنتجات التالفة</h3>
          <p>
            إذا وصل المنتج إليك تالفاً أو مختلفاً عن طلبك، تواصل معنا في
            أقرب وقت ممكن مع توضيح المشكلة.
          </p>
        </article>

        <article>
          <FiClock />
          <h3>مدة المعالجة</h3>
          <p>
            تتم مراجعة طلبات الإرجاع بعد استلام المنتج والتحقق من حالته.
          </p>
        </article>
      </section>

      <div className="returns-footer">
        <div>
          <strong>هل تريد تصفح المنتجات؟</strong>
          <p>ارجع إلى المتجر واكتشف تشكيلتنا.</p>
        </div>

        <Link to="/products">
          العودة للمتجر
          <FiArrowLeft />
        </Link>
      </div>
    </div>
  </section>

  <style>{`
    .returns-page {
      direction: rtl;
      background: #ffffff;
      color: #171717;
      font-family: inherit;
    }

    .returns-container {
      width: min(1000px, calc(100% - 40px));
      margin: 0 auto;
    }

    .returns-hero {
      padding: 80px 0;
      background: #f7f3ed;
      border-bottom: 1px solid #e7dfd5;
    }

    .returns-hero span,
    .returns-heading span {
      color: #8a6f52;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .returns-hero h1 {
      margin: 18px 0 15px;
      font-size: clamp(40px, 6vw, 65px);
      line-height: 1.1;
      font-weight: 900;
    }

    .returns-hero p {
      max-width: 720px;
      margin: 0;
      color: #6d6d6d;
      font-size: 18px;
      line-height: 1.9;
    }

    .returns-main {
      padding: 70px 0 100px;
    }

    .returns-notice {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 28px;
      border: 1px solid #ded5c9;
      border-radius: 22px;
      background: #faf7f2;
      margin-bottom: 75px;
    }

    .returns-notice-icon {
      width: 52px;
      height: 52px;
      flex: 0 0 52px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      color: #8a6f52;
    }

    .returns-notice h2 {
      margin: 0 0 8px;
      font-size: 21px;
    }

    .returns-notice p {
      margin: 0;
      color: #6c6c6c;
      line-height: 1.9;
    }

    .returns-section {
      margin-bottom: 75px;
    }

    .returns-heading {
      margin-bottom: 30px;
    }

    .returns-heading h2 {
      margin: 10px 0 0;
      font-size: 34px;
      font-weight: 900;
    }

    .returns-steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }

    .returns-step {
      padding: 25px;
      border: 1px solid #e8e3dc;
      border-radius: 20px;
    }

    .returns-number {
      font-size: 13px;
      color: #8a6f52;
      font-weight: 900;
      margin-bottom: 28px;
    }

    .returns-step h3 {
      margin: 0 0 10px;
      font-size: 18px;
    }

    .returns-step p {
      margin: 0;
      color: #707070;
      font-size: 14px;
      line-height: 1.9;
    }

    .returns-rules {
      display: grid;
      gap: 15px;
    }

    .returns-rules div {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 20px;
      background: #fafafa;
      border-radius: 14px;
    }

    .returns-rules svg {
      color: #8a6f52;
      flex: 0 0 auto;
    }

    .returns-rules p {
      margin: 0;
      color: #555;
      line-height: 1.7;
    }

    .returns-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 65px;
    }

    .returns-info-grid article {
      padding: 30px;
      background: #171717;
      color: #ffffff;
      border-radius: 22px;
    }

    .returns-info-grid svg {
      width: 24px;
      height: 24px;
      color: #c8ac8e;
      margin-bottom: 20px;
    }

    .returns-info-grid h3 {
      margin: 0 0 10px;
    }

    .returns-info-grid p {
      margin: 0;
      color: #bdbdbd;
      line-height: 1.9;
    }

    .returns-footer {
      padding: 30px;
      border-top: 1px solid #e9e5df;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 25px;
    }

    .returns-footer strong {
      font-size: 19px;
    }

    .returns-footer p {
      margin: 8px 0 0;
      color: #777;
    }

    .returns-footer a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 21px;
      border-radius: 13px;
      background: #171717;
      color: #ffffff;
      text-decoration: none;
      font-weight: 800;
      white-space: nowrap;
    }

    @media (max-width: 900px) {
      .returns-steps {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 650px) {
      .returns-container {
        width: min(100% - 28px, 1000px);
      }

      .returns-hero {
        padding: 55px 0;
      }

      .returns-main {
        padding: 50px 0 70px;
      }

      .returns-notice {
        padding: 22px;
      }

      .returns-steps,
      .returns-info-grid {
        grid-template-columns: 1fr;
      }

      .returns-heading h2 {
        font-size: 28px;
      }

      .returns-footer {
        align-items: stretch;
        flex-direction: column;
      }

      .returns-footer a {
        justify-content: center;
      }
    }
  `}</style>
</main>
 

);
}
