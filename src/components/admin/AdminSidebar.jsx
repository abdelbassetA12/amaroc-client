import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiShield,
  FiX,
  FiChevronRight,
  FiTruck
} from "react-icons/fi";

import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSidebar({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const {
    admin,
    logout,
  } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/auth", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: FiGrid,
      end: true,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      label: "addProduct",
      path: "/admin/products/add",
      icon: FiPackage,
    },
    {
      label: "shipping",
      path: "/admin/shipping",
      icon: FiTruck,
    },
    {
      label: "Orders",
      path: "/admin/OrdersPage",
      icon: FiShoppingBag,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: FiUsers,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: FiSettings,
    },
  ];

  const getInitials = () => {
    const name =
      admin?.name ||
      admin?.email ||
      "Admin";

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return name
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${
          isOpen
            ? "admin-sidebar--open"
            : ""
        }`}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-sidebar__header">

          <div className="admin-sidebar__brand">

            <div className="admin-sidebar__brand-icon">
              <FiShield />
            </div>

            <div className="admin-sidebar__brand-info">
              <strong>
                STORE ADMIN
              </strong>

              <span>
                Management Console
              </span>
            </div>

          </div>

          <button
            type="button"
            className="admin-sidebar__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <FiX />
          </button>

        </div>


        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="admin-sidebar__profile">

          <div className="admin-sidebar__avatar">
            {getInitials()}
          </div>

          <div className="admin-sidebar__profile-info">

            <strong>
              {admin?.name ||
                "Administrator"}
            </strong>

            <span>
              {admin?.email ||
                "Administrator account"}
            </span>

          </div>

          <span className="admin-sidebar__online">
            <span />
          </span>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="admin-sidebar__section-title">
          MAIN MENU
        </div>

        <nav className="admin-sidebar__nav">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `admin-sidebar__link ${
                    isActive
                      ? "admin-sidebar__link--active"
                      : ""
                  }`
                }
              >

                <span className="admin-sidebar__link-icon">
                  <Icon />
                </span>

                <span className="admin-sidebar__link-label">
                  {item.label}
                </span>

                <FiChevronRight className="admin-sidebar__link-arrow" />

              </NavLink>
            );
          })}

        </nav>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="admin-sidebar__bottom">

          <div className="admin-sidebar__security">

            <div className="admin-sidebar__security-icon">
              <FiShield />
            </div>

            <div>
              <strong>
                Secure session
              </strong>

              <span>
                Your account is protected
              </span>
            </div>

          </div>


          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={handleLogout}
          >

            <FiLogOut />

            <span>
              Sign out
            </span>

          </button>

        </div>

        <style>
            {`
            /* =========================================================
   ADMIN SIDEBAR
========================================================= */

.admin-sidebar,
.admin-sidebar *,
.admin-sidebar *::before,
.admin-sidebar *::after {
  box-sizing: border-box;
}


/* =========================================================
   SIDEBAR
========================================================= */

.admin-sidebar {
  position: fixed;

  top: 0;
  left: 0;
  bottom: 0;

  z-index: 1000;

  width: 270px;

  display: flex;
  flex-direction: column;

  padding: 22px 16px;

  color: #e2e8f0;

  background:
    linear-gradient(
      180deg,
      #0f172a 0%,
      #111827 100%
    );

  border-right:
    1px solid
    rgba(255, 255, 255, 0.06);

  box-shadow:
    10px 0 35px
    rgba(15, 23, 42, 0.08);

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: thin;
  scrollbar-color:
    rgba(255, 255, 255, 0.12)
    transparent;
}

.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.12);
}


/* =========================================================
   HEADER
========================================================= */

.admin-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 48px;

  margin-bottom: 24px;
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;

  gap: 11px;

  min-width: 0;
}

.admin-sidebar__brand-icon {
  width: 40px;
  height: 40px;

  flex: 0 0 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(96, 165, 250, 0.18);

  border-radius: 11px;

  color: #60a5fa;

  background:
    rgba(59, 130, 246, 0.1);

  font-size: 18px;
}

.admin-sidebar__brand-info {
  min-width: 0;
}

.admin-sidebar__brand-info strong {
  display: block;

  color: #ffffff;

  font-size: 11px;
  font-weight: 800;

  line-height: 1.2;

  letter-spacing: 0.1em;
}

.admin-sidebar__brand-info span {
  display: block;

  margin-top: 3px;

  color:
    rgba(255, 255, 255, 0.4);

  font-size: 9px;

  line-height: 1.2;
}

.admin-sidebar__close {
  display: none;

  width: 34px;
  height: 34px;

  align-items: center;
  justify-content: center;

  padding: 0;

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 9px;

  color: #94a3b8;

  background:
    rgba(255, 255, 255, 0.04);

  cursor: pointer;
}


/* =========================================================
   PROFILE
========================================================= */

.admin-sidebar__profile {
  display: flex;
  align-items: center;

  gap: 11px;

  margin-bottom: 27px;
  padding: 12px;

  border:
    1px solid
    rgba(255, 255, 255, 0.06);

  border-radius: 13px;

  background:
    rgba(255, 255, 255, 0.035);
}

.admin-sidebar__avatar {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  color: #dbeafe;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #3b82f6
    );

  font-size: 11px;
  font-weight: 800;

  box-shadow:
    0 5px 14px
    rgba(37, 99, 235, 0.25);
}

.admin-sidebar__profile-info {
  min-width: 0;

  flex: 1;
}

.admin-sidebar__profile-info strong {
  display: block;

  max-width: 145px;

  overflow: hidden;

  color: #f8fafc;

  font-size: 11px;
  font-weight: 700;

  line-height: 1.3;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-sidebar__profile-info span {
  display: block;

  max-width: 145px;

  margin-top: 3px;

  overflow: hidden;

  color:
    rgba(255, 255, 255, 0.38);

  font-size: 9px;

  line-height: 1.3;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-sidebar__online {
  width: 8px;
  height: 8px;

  flex: 0 0 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(34, 197, 94, 0.15);
}

.admin-sidebar__online span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #22c55e;
}


/* =========================================================
   SECTION TITLE
========================================================= */

.admin-sidebar__section-title {
  margin: 0 10px 9px;

  color:
    rgba(255, 255, 255, 0.28);

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.13em;
}


/* =========================================================
   NAV
========================================================= */

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.admin-sidebar__link {
  position: relative;

  width: 100%;
  min-height: 46px;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 0 11px;

  border:
    1px solid
    transparent;

  border-radius: 10px;

  color:
    rgba(255, 255, 255, 0.52);

  text-decoration: none;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.admin-sidebar__link:hover {
  color: #f8fafc;

  background:
    rgba(255, 255, 255, 0.045);
}

.admin-sidebar__link--active {
  color: #ffffff;

  border-color:
    rgba(59, 130, 246, 0.14);

  background:
    linear-gradient(
      90deg,
      rgba(37, 99, 235, 0.2),
      rgba(37, 99, 235, 0.08)
    );
}

.admin-sidebar__link--active::before {
  content: "";

  position: absolute;

  left: -1px;
  top: 10px;
  bottom: 10px;

  width: 3px;

  border-radius: 0 4px 4px 0;

  background: #3b82f6;
}

.admin-sidebar__link-icon {
  width: 34px;
  height: 34px;

  flex: 0 0 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  font-size: 16px;
}

.admin-sidebar__link--active
.admin-sidebar__link-icon {
  color: #60a5fa;

  background:
    rgba(59, 130, 246, 0.1);
}

.admin-sidebar__link-label {
  flex: 1;

  font-size: 11px;
  font-weight: 600;
}

.admin-sidebar__link-arrow {
  color:
    rgba(255, 255, 255, 0.18);

  font-size: 13px;

  transition:
    transform 0.2s ease;
}

.admin-sidebar__link:hover
.admin-sidebar__link-arrow {
  transform: translateX(2px);

  color:
    rgba(255, 255, 255, 0.45);
}

.admin-sidebar__link--active
.admin-sidebar__link-arrow {
  color:
    rgba(147, 197, 253, 0.55);
}


/* =========================================================
   BOTTOM
========================================================= */

.admin-sidebar__bottom {
  margin-top: auto;

  padding-top: 20px;
}


/* =========================================================
   SECURITY
========================================================= */

.admin-sidebar__security {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 12px;
  padding: 11px;

  border:
    1px solid
    rgba(255, 255, 255, 0.05);

  border-radius: 11px;

  background:
    rgba(255, 255, 255, 0.025);
}

.admin-sidebar__security-icon {
  width: 30px;
  height: 30px;

  flex: 0 0 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  color: #60a5fa;

  background:
    rgba(59, 130, 246, 0.08);

  font-size: 13px;
}

.admin-sidebar__security strong {
  display: block;

  color:
    rgba(255, 255, 255, 0.7);

  font-size: 9px;
  font-weight: 700;
}

.admin-sidebar__security span {
  display: block;

  margin-top: 3px;

  color:
    rgba(255, 255, 255, 0.3);

  font-size: 8px;
}


/* =========================================================
   LOGOUT
========================================================= */

.admin-sidebar__logout {
  width: 100%;
  height: 44px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 12px;

  border:
    1px solid
    rgba(239, 68, 68, 0.1);

  border-radius: 10px;

  color:
    rgba(248, 113, 113, 0.75);

  background:
    rgba(239, 68, 68, 0.045);

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.admin-sidebar__logout svg {
  font-size: 16px;
}

.admin-sidebar__logout:hover {
  color: #fca5a5;

  border-color:
    rgba(239, 68, 68, 0.2);

  background:
    rgba(239, 68, 68, 0.08);
}


/* =========================================================
   OVERLAY
========================================================= */

.admin-sidebar__overlay {
  display: none;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 900px) {

  .admin-sidebar {
    width: 280px;

    transform: translateX(-105%);

    transition:
      transform 0.28s ease;

    box-shadow:
      20px 0 50px
      rgba(15, 23, 42, 0.22);
  }

  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-sidebar__close {
    display: flex;
  }

  .admin-sidebar__overlay {
    position: fixed;

    inset: 0;

    z-index: 999;

    display: block;

    background:
      rgba(15, 23, 42, 0.48);

    backdrop-filter: blur(3px);
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 400px) {

  .admin-sidebar {
    width: 86vw;
    max-width: 290px;
  }

}`}
        </style>

      </aside>
    </>
  );
}