import { useState } from "react";
import {
  FiActivity,
  FiBell,
  FiChevronLeft,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiPlus,
  FiSettings,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import "./AdminDashboard.css";

const menu = [
  ["dashboard", "لوحة التحكم", FiGrid],
  ["orders", "الطلبات", FiShoppingBag],
  ["products", "المنتجات", FiPackage],
  ["customers", "العملاء", FiUsers],
  ["shipping", "الشحن والتوصيل", FiTruck],
  ["analytics", "التحليلات", FiActivity],
  ["settings", "الإعدادات", FiSettings],
];

const orders = [
  ["#AMR-1048", "سارة العلوي", "749 MAD", "قيد التجهيز", "processing"],
  ["#AMR-1047", "ياسين بنعمر", "329 MAD", "تم الشحن", "shipped"],
  ["#AMR-1046", "مريم الإدريسي", "459 MAD", "تم التسليم", "delivered"],
  ["#AMR-1045", "أمين الكتاني", "249 MAD", "قيد الانتظار", "pending"],
];

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  return (
    <div className="admin-layout" dir="rtl">
      {open && <button className="admin-overlay" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-logo">
          <span>A</span>
          <div><strong>AMAROC</strong><small>لوحة الإدارة</small></div>
          <button className="admin-close" onClick={() => setOpen(false)}><FiX /></button>
        </div>

        <div className="admin-user">
          <div className="admin-avatar">A</div>
          <div><strong>Admin</strong><small>مدير المتجر</small></div>
          <i />
        </div>

        <p className="admin-section-label">القائمة الرئيسية</p>
        <nav>
          {menu.map(([id, label, Icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => { setActive(id); setOpen(false); }}
            >
              <Icon /><span>{label}</span>
              {id === "orders" && <b>12</b>}
              {active === id && <FiChevronLeft className="admin-arrow" />}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-tip">
            <FiActivity />
            <strong>كل شيء تحت السيطرة</strong>
            <p>تابع متجرك وطلبات عملائك من مكان واحد.</p>
          </div>
          <button className="admin-logout"><FiLogOut /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-heading">
            <button className="admin-menu" onClick={() => setOpen(true)}><FiMenu /></button>
            <div><small>AMAROC / لوحة التحكم</small><h1>مرحباً بك، Admin 👋</h1></div>
          </div>
          <div className="admin-header-actions">
            <button className="admin-bell"><FiBell /><i /></button>
            <div className="admin-header-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-intro">
            <div><span>نظرة عامة</span><h2>ملخص أداء المتجر</h2><p>إليك آخر مستجدات متجرك اليوم.</p></div>
            <button className="admin-primary"><FiPlus /> إضافة منتج</button>
          </section>

          <section className="admin-stats">
            <Stat icon="د.م" title="إجمالي المبيعات" value="24,860" note="+12.8% مقارنة بالشهر الماضي" />
            <Stat icon="↗" title="إجمالي الطلبات" value="186" note="+8.4% مقارنة بالشهر الماضي" />
            <Stat icon="◉" title="العملاء المسجلون" value="1,248" note="+5.2% هذا الشهر" />
            <Stat icon="□" title="المنتجات المتوفرة" value="324" note="7 منتجات تحتاج إلى متابعة" warning />
          </section>

          <section className="admin-grid">
            <article className="admin-card admin-orders">
              <CardTitle eyebrow="المبيعات" title="آخر الطلبات" />
              <div className="admin-table-scroll">
                <table>
                  <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المبلغ</th><th>الحالة</th></tr></thead>
                  <tbody>{orders.map((order) => <tr key={order[0]}>
                    <td className="order-id">{order[0]}</td><td>{order[1]}</td><td>{order[2]}</td>
                    <td><span className={`status ${order[4]}`}>{order[3]}</span></td>
                  </tr>)}</tbody>
                </table>
              </div>
              <button className="admin-more">عرض جميع الطلبات <FiChevronLeft /></button>
            </article>

            <article className="admin-card">
              <CardTitle eyebrow="الأداء" title="المبيعات الأسبوعية" />
              <div className="admin-chart">
                {[42, 58, 48, 78, 61, 94, 70].map((height, index) => (
                  <div className="chart-column" key={index}>
                    <div className="chart-track"><span style={{ height: `${height}%` }} /></div>
                    <small>{["س", "ح", "ن", "ث", "ر", "خ", "ج"][index]}</small>
                  </div>
                ))}
              </div>
              <div className="chart-footer"><span>متوسط المبيعات</span><strong>3,551 MAD</strong></div>
            </article>
          </section>

          <section className="admin-grid bottom">
            <article className="admin-card">
              <CardTitle eyebrow="المخزون" title="منتجات منخفضة المخزون" />
              {["حقيبة Urban Black", "محفظة Classic Brown", "حزام Premium Leather"].map((name, index) => (
                <div className="stock-row" key={name}>
                  <div className="stock-icon"><FiPackage /></div>
                  <div><strong>{name}</strong><small>AMR-00{index + 8}</small></div>
                  <b>{[3, 4, 2][index]} قطع</b>
                </div>
              ))}
              <button className="admin-outline">إدارة المخزون <FiChevronLeft /></button>
            </article>

            <article className="admin-card">
              <CardTitle eyebrow="اختصارات" title="إجراءات سريعة" />
              {["إضافة منتج جديد", "مراجعة الطلبات", "إعدادات الشحن", "سجل النشاطات"].map((item) => (
                <button className="quick-row" key={item}><FiPackage /><span>{item}</span><FiChevronLeft /></button>
              ))}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, title, value, note, warning }) {
  return <article className="stat-card">
    <div className="stat-icon">{icon}</div><small>{title}</small><h3>{value}</h3>
    <p className={warning ? "warning" : ""}>{note}</p>
  </article>;
}

function CardTitle({ eyebrow, title }) {
  return <div className="card-title"><div><span>{eyebrow}</span><h3>{title}</h3></div><FiActivity /></div>;
}
