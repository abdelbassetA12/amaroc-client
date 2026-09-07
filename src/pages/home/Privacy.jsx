import { Link } from "react-router-dom";
import {
FiArrowLeft,
FiCheck,
FiLock,
FiShield,
FiUser,
} from "react-icons/fi";

export default function Privacy() {
return ( <main className="privacy-page"> <section className="privacy-hero"> <div className="privacy-container"> <span>AMAROC / الخصوصية</span>

 
      <h1>سياسة الخصوصية</h1>

      <p>
        نحرص على التعامل مع معلوماتك بطريقة مسؤولة وواضحة أثناء استخدامك
        لمتجر AMAROC وخدماته.
      </p>
    </div>
  </section>

  <section className="privacy-main">
    <div className="privacy-container">
      <div className="privacy-intro">
        <div className="privacy-intro-icon">
          <FiLock />
        </div>

        <div>
          <h2>خصوصيتك مهمة بالنسبة لنا</h2>

          <p>
            توضح هذه السياسة نوع المعلومات التي قد يتم جمعها أثناء
            استخدام المتجر، وكيف يتم استخدامها لحسن تنفيذ الطلبات وتحسين
            تجربة التسوق.
          </p>
        </div>
      </div>

      <article className="privacy-section">
        <div className="privacy-section-icon">
          <FiUser />
        </div>

        <div>
          <h2>المعلومات التي قد نجمعها</h2>

          <p>
            عند إتمام عملية الشراء، قد نحتاج إلى بعض المعلومات الضرورية
            مثل الاسم، رقم الهاتف، البريد الإلكتروني عند تقديمه، والمدينة
            وعنوان التوصيل.
          </p>
        </div>
      </article>

      <article className="privacy-section">
        <div className="privacy-section-icon">
          <FiShield />
        </div>

        <div>
          <h2>كيف نستخدم معلوماتك؟</h2>

          <ul>
            <li>
              <FiCheck />
              <span>معالجة وتنفيذ طلبات الشراء.</span>
            </li>

            <li>
              <FiCheck />
              <span>التواصل معك بخصوص طلبك عند الحاجة.</span>
            </li>

            <li>
              <FiCheck />
              <span>تنسيق عملية الشحن والتوصيل.</span>
            </li>

            <li>
              <FiCheck />
              <span>تحسين أداء وتجربة المتجر.</span>
            </li>
          </ul>
        </div>
      </article>

      <article className="privacy-section">
        <div>
          <h2>حماية المعلومات</h2>

          <p>
            نعمل على اتخاذ إجراءات مناسبة للمساعدة في حماية المعلومات
            المقدمة من العملاء ومنع استخدامها بطريقة غير مصرح بها.
          </p>
        </div>
      </article>

      <article className="privacy-section">
        <div>
          <h2>مشاركة المعلومات</h2>

          <p>
            قد تتم مشاركة المعلومات الضرورية مع الجهات التي تساعد في
            تنفيذ الطلب، مثل خدمات الشحن والتوصيل، وذلك بالقدر اللازم
            لإتمام الخدمة.
          </p>
        </div>
      </article>

      <article className="privacy-section">
        <div>
          <h2>ملفات تعريف الارتباط</h2>

          <p>
            قد يستخدم المتجر تقنيات مثل التخزين المحلي للمتصفح للمساعدة
            في حفظ بعض بيانات تجربة التسوق، مثل محتويات سلة المشتريات.
          </p>
        </div>
      </article>

      <article className="privacy-section">
        <div>
          <h2>حقوقك</h2>

          <p>
            يمكنك التواصل معنا للاستفسار عن المعلومات المرتبطة بطلباتك أو
            للحصول على توضيحات حول طريقة استخدامها.
          </p>
        </div>
      </article>

      <div className="privacy-bottom">
        <div>
          <strong>هل لديك سؤال؟</strong>
          <p>يمكنك العودة إلى المتجر ومتابعة تجربة التسوق.</p>
        </div>

        <Link to="/">
          العودة للرئيسية
          <FiArrowLeft />
        </Link>
      </div>
    </div>
  </section>

  <style>{`
    .privacy-page {
      direction: rtl;
      background: #ffffff;
      color: #171717;
      font-family: inherit;
    }

    .privacy-container {
      width: min(950px, calc(100% - 40px));
      margin: 0 auto;
    }

    .privacy-hero {
      padding: 80px 0;
      background: #f7f3ed;
      border-bottom: 1px solid #e7dfd5;
    }

    .privacy-hero span {
      color: #8a6f52;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .privacy-hero h1 {
      margin: 18px 0 15px;
      font-size: clamp(40px, 6vw, 65px);
      line-height: 1.1;
      font-weight: 900;
    }

    .privacy-hero p {
      max-width: 700px;
      margin: 0;
      color: #6d6d6d;
      font-size: 18px;
      line-height: 1.9;
    }

    .privacy-main {
      padding: 70px 0 100px;
    }

    .privacy-intro {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 30px;
      margin-bottom: 55px;
      background: #171717;
      color: #ffffff;
      border-radius: 24px;
    }

    .privacy-intro-icon,
    .privacy-section-icon {
      width: 52px;
      height: 52px;
      flex: 0 0 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      background: #f7f3ed;
      color: #8a6f52;
    }

    .privacy-intro h2 {
      margin: 0 0 10px;
      font-size: 21px;
    }

    .privacy-intro p {
      margin: 0;
      color: #c3c3c3;
      line-height: 1.9;
    }

    .privacy-section {
      display: grid;
      grid-template-columns: 52px 1fr;
      gap: 20px;
      padding: 35px 0;
      border-bottom: 1px solid #ece9e5;
    }

    .privacy-section h2 {
      margin: 0 0 14px;
      font-size: 23px;
    }

    .privacy-section p {
      margin: 0;
      color: #686868;
      line-height: 2;
      font-size: 15px;
    }

    .privacy-section ul {
      display: grid;
      gap: 14px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .privacy-section li {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #555;
    }

    .privacy-section li svg {
      color: #8a6f52;
      flex: 0 0 auto;
    }

    .privacy-bottom {
      margin-top: 45px;
      padding: 30px;
      background: #faf9f7;
      border: 1px solid #e8e3dc;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 25px;
    }

    .privacy-bottom strong {
      font-size: 19px;
    }

    .privacy-bottom p {
      margin: 8px 0 0;
      color: #777;
    }

    .privacy-bottom a {
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

    @media (max-width: 650px) {
      .privacy-container {
        width: min(100% - 28px, 950px);
      }

      .privacy-hero {
        padding: 55px 0;
      }

      .privacy-main {
        padding: 50px 0 70px;
      }

      .privacy-intro {
        padding: 23px;
      }

      .privacy-section {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .privacy-section-icon {
        width: 46px;
        height: 46px;
        flex-basis: 46px;
      }

      .privacy-bottom {
        align-items: stretch;
        flex-direction: column;
      }

      .privacy-bottom a {
        justify-content: center;
      }
    }
  `}</style>
</main>
 

);
}
