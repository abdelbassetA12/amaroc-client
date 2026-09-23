 
import { useState } from "react";

import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownRight,
  FiMoreHorizontal,
  FiPlus,
  FiActivity,
} from "react-icons/fi";

import { useAdminAuth } from "../../context/AdminAuthContext";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const { admin } = useAdminAuth();

  const adminName =
    admin?.name || "Administrator";

  const firstName =
    adminName.split(" ")[0] ||
    "Administrator";


  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580",
      change: "+12.8%",
      positive: true,
      icon: FiDollarSign,
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8.4%",
      positive: true,
      icon: FiShoppingBag,
    },
    {
      title: "Products",
      value: "386",
      change: "+5.2%",
      positive: true,
      icon: FiPackage,
    },
    {
      title: "Customers",
      value: "8,642",
      change: "+14.6%",
      positive: true,
      icon: FiUsers,
    },
  ];


  const recentOrders = [
    {
      id: "#ORD-1048",
      customer: "Ahmed Karim",
      product: "Premium Sneakers",
      amount: "$129.00",
      status: "Completed",
    },
    {
      id: "#ORD-1047",
      customer: "Sara Amrani",
      product: "Classic Leather Bag",
      amount: "$185.00",
      status: "Processing",
    },
    {
      id: "#ORD-1046",
      customer: "Youssef Ali",
      product: "Oversized Hoodie",
      amount: "$74.00",
      status: "Completed",
    },
    {
      id: "#ORD-1045",
      customer: "Nadia El Fassi",
      product: "Minimal Watch",
      amount: "$210.00",
      status: "Pending",
    },
    {
      id: "#ORD-1044",
      customer: "Omar Haddad",
      product: "Cotton T-Shirt",
      amount: "$45.00",
      status: "Completed",
    },
  ];


  return (
    <div className="admin-dashboard">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="admin-dashboard__main">


        {/* =================================================
            HEADER
        ================================================= */}

        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="admin-dashboard__content">


          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="admin-dashboard__welcome">

            <div>

              <div className="admin-dashboard__welcome-label">
                OVERVIEW
              </div>

              <h2>
                Good afternoon, {firstName}.
              </h2>

              <p>
                Here is what's happening
                with your store today.
              </p>

            </div>


            <button
              type="button"
              className="admin-dashboard__primary-button"
            >
              <FiPlus />
              Add product
            </button>

          </section>


          {/* =================================================
              STATS
          ================================================= */}

          <section className="admin-dashboard__stats">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  className="admin-dashboard__stat-card"
                  key={stat.title}
                >

                  <div className="admin-dashboard__stat-top">

                    <div className="admin-dashboard__stat-icon">
                      <Icon />
                    </div>

                    <button
                      type="button"
                      className="admin-dashboard__stat-more"
                      aria-label={`More options for ${stat.title}`}
                    >
                      <FiMoreHorizontal />
                    </button>

                  </div>


                  <div className="admin-dashboard__stat-title">
                    {stat.title}
                  </div>


                  <div className="admin-dashboard__stat-value">
                    {stat.value}
                  </div>


                  <div className="admin-dashboard__stat-change">

                    {stat.positive ? (
                      <FiArrowUpRight />
                    ) : (
                      <FiArrowDownRight />
                    )}

                    <span>
                      {stat.change}
                    </span>

                    <small>
                      vs last month
                    </small>

                  </div>

                </article>
              );
            })}

          </section>


          {/* =================================================
              GRID
          ================================================= */}

          <section className="admin-dashboard__grid">


            {/* ===============================================
                SALES OVERVIEW
            =============================================== */}

            <article className="admin-dashboard__card admin-dashboard__sales-card">

              <div className="admin-dashboard__card-header">

                <div>

                  <span className="admin-dashboard__card-eyebrow">
                    PERFORMANCE
                  </span>

                  <h3>
                    Sales overview
                  </h3>

                </div>


                <select
                  className="admin-dashboard__select"
                  defaultValue="7"
                  aria-label="Sales period"
                >

                  <option value="7">
                    Last 7 days
                  </option>

                  <option value="30">
                    Last 30 days
                  </option>

                  <option value="90">
                    Last 90 days
                  </option>

                </select>

              </div>


              <div className="admin-dashboard__chart">

                <div className="admin-dashboard__chart-values">

                  <span>$8k</span>
                  <span>$6k</span>
                  <span>$4k</span>
                  <span>$2k</span>
                  <span>$0</span>

                </div>


                <div className="admin-dashboard__chart-area">


                  <div className="admin-dashboard__chart-lines">

                    <span />
                    <span />
                    <span />
                    <span />
                    <span />

                  </div>


                  <div className="admin-dashboard__chart-bars">

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "35%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "48%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "42%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "65%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "58%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "78%",
                      }}
                    />

                    <div
                      className="admin-dashboard__bar"
                      style={{
                        height: "92%",
                      }}
                    />

                  </div>


                  <div className="admin-dashboard__chart-labels">

                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>

                  </div>

                </div>

              </div>

            </article>


            {/* ===============================================
                STORE ACTIVITY
            =============================================== */}

            <article className="admin-dashboard__card admin-dashboard__activity-card">

              <div className="admin-dashboard__card-header">

                <div>

                  <span className="admin-dashboard__card-eyebrow">
                    ACTIVITY
                  </span>

                  <h3>
                    Store activity
                  </h3>

                </div>


                <div className="admin-dashboard__activity-icon">
                  <FiActivity />
                </div>

              </div>


              <div className="admin-dashboard__activity-list">


                <div className="admin-dashboard__activity-item">

                  <div className="admin-dashboard__activity-dot admin-dashboard__activity-dot--blue" />

                  <div>

                    <strong>
                      24 new orders
                    </strong>

                    <span>
                      Received today
                    </span>

                  </div>

                  <b>
                    +24
                  </b>

                </div>


                <div className="admin-dashboard__activity-item">

                  <div className="admin-dashboard__activity-dot admin-dashboard__activity-dot--green" />

                  <div>

                    <strong>
                      18 products sold
                    </strong>

                    <span>
                      In the last 24 hours
                    </span>

                  </div>

                  <b>
                    +18
                  </b>

                </div>


                <div className="admin-dashboard__activity-item">

                  <div className="admin-dashboard__activity-dot admin-dashboard__activity-dot--orange" />

                  <div>

                    <strong>
                      7 pending orders
                    </strong>

                    <span>
                      Need your attention
                    </span>

                  </div>

                  <b>
                    7
                  </b>

                </div>


                <div className="admin-dashboard__activity-item">

                  <div className="admin-dashboard__activity-dot admin-dashboard__activity-dot--purple" />

                  <div>

                    <strong>
                      42 new customers
                    </strong>

                    <span>
                      This week
                    </span>

                  </div>

                  <b>
                    +42
                  </b>

                </div>


              </div>

            </article>

          </section>


          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <section className="admin-dashboard__card admin-dashboard__orders-card">


            <div className="admin-dashboard__card-header">

              <div>

                <span className="admin-dashboard__card-eyebrow">
                  ORDERS
                </span>

                <h3>
                  Recent orders
                </h3>

              </div>


              <button
                type="button"
                className="admin-dashboard__view-button"
              >
                View all
                <FiArrowUpRight />
              </button>

            </div>


            <div className="admin-dashboard__table-wrapper">

              <table className="admin-dashboard__table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentOrders.map(
                    (order) => (
                      <tr key={order.id}>

                        <td>

                          <strong className="admin-dashboard__order-id">
                            {order.id}
                          </strong>

                        </td>


                        <td>

                          <span className="admin-dashboard__customer">
                            {order.customer}
                          </span>

                        </td>


                        <td>

                          <span className="admin-dashboard__product">
                            {order.product}
                          </span>

                        </td>


                        <td>

                          <strong>
                            {order.amount}
                          </strong>

                        </td>


                        <td>

                          <span
                            className={`admin-dashboard__status admin-dashboard__status--${order.status.toLowerCase()}`}
                          >

                            <span />

                            {order.status}

                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>


        </main>

      </div>


      <style>
        {`

/* =========================================================
   RESET
========================================================= */

.admin-dashboard,
.admin-dashboard *,
.admin-dashboard *::before,
.admin-dashboard *::after {
  box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.admin-dashboard {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  color: #0f172a;

  background: #f6f8fc;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


/* =========================================================
   MAIN
========================================================= */

.admin-dashboard__main {
  width: calc(100% - 270px);

  min-width: 0;
  min-height: 100vh;

  margin-left: 270px;
}


/* =========================================================
   CONTENT
========================================================= */

.admin-dashboard__content {
  width: 100%;
  max-width: 1500px;

  margin: 0 auto;

  padding: 32px 34px 50px;
}


/* =========================================================
   WELCOME
========================================================= */

.admin-dashboard__welcome {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 25px;

  margin-bottom: 26px;
}

.admin-dashboard__welcome-label {
  margin-bottom: 7px;

  color: #2563eb;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 0.14em;
}

.admin-dashboard__welcome h2 {
  margin: 0;

  color: #0f172a;

  font-size: 25px;
  font-weight: 800;

  line-height: 1.2;

  letter-spacing: -0.035em;
}

.admin-dashboard__welcome p {
  margin: 7px 0 0;

  color: #64748b;

  font-size: 11px;
}

.admin-dashboard__primary-button {
  height: 40px;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 0 15px;

  border: 0;

  border-radius: 9px;

  color: #ffffff;

  background: #2563eb;

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 6px 16px
    rgba(37, 99, 235, 0.2);

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.admin-dashboard__primary-button:hover {
  background: #1d4ed8;

  transform: translateY(-1px);
}

.admin-dashboard__primary-button svg {
  font-size: 14px;
}


/* =========================================================
   STATS
========================================================= */

.admin-dashboard__stats {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 16px;

  margin-bottom: 18px;
}

.admin-dashboard__stat-card {
  min-width: 0;

  padding: 18px;

  border:
    1px solid
    #e8edf3;

  border-radius: 13px;

  background: #ffffff;

  box-shadow:
    0 4px 15px
    rgba(15, 23, 42, 0.025);
}

.admin-dashboard__stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
}

.admin-dashboard__stat-icon {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  color: #2563eb;

  background: #eff6ff;

  font-size: 16px;
}

.admin-dashboard__stat-more {
  display: flex;

  padding: 3px;

  border: 0;

  color: #c0c8d4;

  background: transparent;

  cursor: pointer;
}

.admin-dashboard__stat-title {
  margin-bottom: 5px;

  color: #64748b;

  font-size: 9px;
  font-weight: 600;
}

.admin-dashboard__stat-value {
  color: #0f172a;

  font-size: 23px;
  font-weight: 800;

  line-height: 1.2;

  letter-spacing: -0.035em;
}

.admin-dashboard__stat-change {
  display: flex;
  align-items: center;

  gap: 3px;

  margin-top: 9px;

  color: #16a34a;

  font-size: 9px;
  font-weight: 700;
}

.admin-dashboard__stat-change svg {
  font-size: 12px;
}

.admin-dashboard__stat-change small {
  margin-left: 3px;

  color: #a0aec0;

  font-size: 8px;
  font-weight: 500;
}


/* =========================================================
   GRID
========================================================= */

.admin-dashboard__grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.55fr)
    minmax(300px, 0.85fr);

  gap: 18px;

  margin-bottom: 18px;
}


/* =========================================================
   CARDS
========================================================= */

.admin-dashboard__card {
  min-width: 0;

  border:
    1px solid
    #e8edf3;

  border-radius: 13px;

  background: #ffffff;

  box-shadow:
    0 4px 15px
    rgba(15, 23, 42, 0.025);
}

.admin-dashboard__sales-card {
  padding: 21px;
}

.admin-dashboard__activity-card {
  padding: 21px;
}

.admin-dashboard__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 20px;
}

.admin-dashboard__card-eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #94a3b8;

  font-size: 7px;
  font-weight: 800;

  letter-spacing: 0.14em;
}

.admin-dashboard__card-header h3 {
  margin: 0;

  color: #0f172a;

  font-size: 14px;
  font-weight: 800;
}

.admin-dashboard__select {
  height: 30px;

  padding: 0 8px;

  border:
    1px solid
    #e2e8f0;

  border-radius: 7px;

  outline: none;

  color: #64748b;

  background: #ffffff;

  font-family: inherit;

  font-size: 8px;
}


/* =========================================================
   CHART
========================================================= */

.admin-dashboard__chart {
  display: flex;

  height: 220px;

  padding-top: 5px;
}

.admin-dashboard__chart-values {
  width: 32px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding:
    0
    0
    28px;

  color: #a0aec0;

  font-size: 8px;

  text-align: right;
}

.admin-dashboard__chart-area {
  position: relative;

  flex: 1;

  min-width: 0;

  padding-left: 14px;
  padding-bottom: 28px;
}

.admin-dashboard__chart-lines {
  position: absolute;

  inset: 0 0 28px 14px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.admin-dashboard__chart-lines span {
  width: 100%;

  border-top:
    1px dashed
    #e8edf3;
}

.admin-dashboard__chart-bars {
  position: absolute;

  left: 25px;
  right: 10px;
  bottom: 28px;

  height: calc(100% - 28px);

  display: flex;
  align-items: flex-end;
  justify-content: space-around;

  gap: 10px;
}

.admin-dashboard__bar {
  width: min(32px, 9%);

  min-height: 8px;

  border-radius: 6px 6px 2px 2px;

  background:
    linear-gradient(
      180deg,
      #60a5fa,
      #2563eb
    );

  opacity: 0.9;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.admin-dashboard__bar:hover {
  opacity: 1;

  transform: translateY(-3px);
}

.admin-dashboard__chart-labels {
  position: absolute;

  left: 25px;
  right: 10px;
  bottom: 0;

  display: flex;
  justify-content: space-around;

  color: #a0aec0;

  font-size: 8px;
}


/* =========================================================
   ACTIVITY
========================================================= */

.admin-dashboard__activity-icon {
  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  color: #2563eb;

  background: #eff6ff;

  font-size: 14px;
}

.admin-dashboard__activity-list {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.admin-dashboard__activity-item {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 11px 0;

  border-bottom:
    1px solid
    #f0f3f7;
}

.admin-dashboard__activity-item:last-child {
  border-bottom: 0;
}

.admin-dashboard__activity-dot {
  width: 7px;
  height: 7px;

  flex: 0 0 7px;

  border-radius: 50%;
}

.admin-dashboard__activity-dot--blue {
  background: #3b82f6;
}

.admin-dashboard__activity-dot--green {
  background: #22c55e;
}

.admin-dashboard__activity-dot--orange {
  background: #f59e0b;
}

.admin-dashboard__activity-dot--purple {
  background: #8b5cf6;
}

.admin-dashboard__activity-item div:nth-child(2) {
  min-width: 0;

  flex: 1;
}

.admin-dashboard__activity-item strong {
  display: block;

  color: #334155;

  font-size: 10px;
  font-weight: 700;
}

.admin-dashboard__activity-item span {
  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 8px;
}

.admin-dashboard__activity-item b {
  color: #64748b;

  font-size: 9px;
}


/* =========================================================
   ORDERS
========================================================= */

.admin-dashboard__orders-card {
  padding: 21px;
}

.admin-dashboard__view-button {
  display: flex;
  align-items: center;

  gap: 5px;

  padding: 5px 0;

  border: 0;

  color: #2563eb;

  background: transparent;

  font-family: inherit;

  font-size: 9px;
  font-weight: 700;

  cursor: pointer;
}

.admin-dashboard__view-button svg {
  font-size: 12px;
}

.admin-dashboard__table-wrapper {
  width: 100%;

  overflow-x: auto;
}

.admin-dashboard__table {
  width: 100%;

  border-collapse: collapse;

  min-width: 650px;
}

.admin-dashboard__table th {
  padding:
    0
    12px
    11px;

  border-bottom:
    1px solid
    #edf1f5;

  color: #94a3b8;

  font-size: 8px;
  font-weight: 700;

  text-align: left;
}

.admin-dashboard__table td {
  padding:
    13px
    12px;

  border-bottom:
    1px solid
    #f1f4f7;

  color: #475569;

  font-size: 9px;
}

.admin-dashboard__table tbody tr:last-child td {
  border-bottom: 0;
}

.admin-dashboard__order-id {
  color: #2563eb;

  font-size: 9px;
}

.admin-dashboard__customer {
  color: #334155;

  font-weight: 600;
}

.admin-dashboard__product {
  color: #64748b;
}

.admin-dashboard__status {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding:
    5px
    8px;

  border-radius: 20px;

  font-size: 7px;
  font-weight: 700;
}

.admin-dashboard__status > span {
  width: 5px;
  height: 5px;

  border-radius: 50%;
}

.admin-dashboard__status--completed {
  color: #15803d;

  background: #f0fdf4;
}

.admin-dashboard__status--completed > span {
  background: #22c55e;
}

.admin-dashboard__status--processing {
  color: #2563eb;

  background: #eff6ff;
}

.admin-dashboard__status--processing > span {
  background: #3b82f6;
}

.admin-dashboard__status--pending {
  color: #b45309;

  background: #fffbeb;
}

.admin-dashboard__status--pending > span {
  background: #f59e0b;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

  .admin-dashboard__stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .admin-dashboard__grid {
    grid-template-columns:
      minmax(0, 1fr);
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 900px) {

  .admin-dashboard__main {
    width: 100%;

    margin-left: 0;
  }

  .admin-dashboard__content {
    padding:
      25px
      18px
      40px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 600px) {

  .admin-dashboard__welcome {
    align-items: flex-start;

    flex-direction: column;

    margin-bottom: 22px;
  }

  .admin-dashboard__welcome h2 {
    font-size: 22px;
  }

  .admin-dashboard__primary-button {
    width: 100%;

    justify-content: center;
  }

  .admin-dashboard__stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;
  }

  .admin-dashboard__stat-card {
    padding: 14px;
  }

  .admin-dashboard__stat-value {
    font-size: 19px;
  }

  .admin-dashboard__stat-change small {
    display: none;
  }

  .admin-dashboard__sales-card,
  .admin-dashboard__activity-card,
  .admin-dashboard__orders-card {
    padding: 16px;
  }

  .admin-dashboard__chart {
    height: 190px;
  }

  .admin-dashboard__card-header {
    margin-bottom: 16px;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .admin-dashboard__content {
    padding:
      22px
      14px
      35px;
  }

  .admin-dashboard__stats {
    gap: 8px;
  }

  .admin-dashboard__stat-card {
    padding: 12px;
  }

  .admin-dashboard__stat-icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .admin-dashboard__stat-value {
    font-size: 17px;
  }

  .admin-dashboard__stat-title {
    font-size: 8px;
  }

}

`}
      </style>

    </div>
  );
}
 


