 
import {
  FiMenu,
  FiBell,
  FiSearch,
} from "react-icons/fi";

import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminHeader({ onMenuClick }) {
  const { admin } = useAdminAuth();

  const adminName =
    admin?.name || "Administrator";

  return (
    <>
      <header className="admin-dashboard__header">

        <div className="admin-dashboard__header-left">

          <button
            type="button"
            className="admin-dashboard__menu-button"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div>
            <div className="admin-dashboard__breadcrumb">
              ADMIN / DASHBOARD
            </div>

            <h1>
              Dashboard
            </h1>
          </div>

        </div>


        <div className="admin-dashboard__header-right">

          <div className="admin-dashboard__search">

            <FiSearch />

            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />

          </div>


          <button
            type="button"
            className="admin-dashboard__icon-button"
            aria-label="Notifications"
          >
            <FiBell />

            <span className="admin-dashboard__notification-dot" />
          </button>


          <div className="admin-dashboard__header-user">

            <div className="admin-dashboard__header-avatar">
              {adminName
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="admin-dashboard__header-user-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </div>

      </header>


      <style>
        {`

/* =========================================================
   ADMIN HEADER
========================================================= */

.admin-dashboard__header {
  width: 100%;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 25px;

  padding:
    0 34px;

  border-bottom:
    1px solid
    #e9edf3;

  background:
    rgba(255, 255, 255, 0.92);

  backdrop-filter: blur(12px);
}


/* =========================================================
   HEADER LEFT
========================================================= */

.admin-dashboard__header-left {
  display: flex;
  align-items: center;

  gap: 15px;

  min-width: 0;
}


/* =========================================================
   BREADCRUMB
========================================================= */

.admin-dashboard__breadcrumb {
  margin-bottom: 5px;

  color: #94a3b8;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 0.14em;
}


/* =========================================================
   TITLE
========================================================= */

.admin-dashboard__header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 20px;
  font-weight: 800;

  line-height: 1.2;

  letter-spacing: -0.025em;
}


/* =========================================================
   MENU BUTTON
========================================================= */

.admin-dashboard__menu-button {
  display: none;

  width: 38px;
  height: 38px;

  align-items: center;
  justify-content: center;

  padding: 0;

  border:
    1px solid
    #e2e8f0;

  border-radius: 9px;

  color: #475569;

  background: #ffffff;

  cursor: pointer;
}


/* =========================================================
   HEADER RIGHT
========================================================= */

.admin-dashboard__header-right {
  display: flex;
  align-items: center;

  gap: 14px;
}


/* =========================================================
   SEARCH
========================================================= */

.admin-dashboard__search {
  width: 210px;
  height: 38px;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 0 11px;

  border:
    1px solid
    #e2e8f0;

  border-radius: 9px;

  background: #ffffff;
}

.admin-dashboard__search svg {
  flex: 0 0 auto;

  color: #94a3b8;

  font-size: 15px;
}

.admin-dashboard__search input {
  width: 100%;

  padding: 0;

  border: 0;
  outline: 0;

  color: #334155;

  background: transparent;

  font-family: inherit;

  font-size: 10px;
}

.admin-dashboard__search input::placeholder {
  color: #a8b2c0;
}


/* =========================================================
   NOTIFICATION
========================================================= */

.admin-dashboard__icon-button {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border:
    1px solid
    #e2e8f0;

  border-radius: 9px;

  color: #64748b;

  background: #ffffff;

  cursor: pointer;
}

.admin-dashboard__icon-button svg {
  font-size: 16px;
}

.admin-dashboard__notification-dot {
  position: absolute;

  top: 8px;
  right: 8px;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #ef4444;
}


/* =========================================================
   HEADER USER
========================================================= */

.admin-dashboard__header-user {
  display: flex;
  align-items: center;

  gap: 9px;

  padding-left: 5px;
}


/* =========================================================
   AVATAR
========================================================= */

.admin-dashboard__header-avatar {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  color: #dbeafe;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #3b82f6
    );

  font-size: 9px;
  font-weight: 800;
}


/* =========================================================
   USER INFO
========================================================= */

.admin-dashboard__header-user-info strong {
  display: block;

  max-width: 130px;

  overflow: hidden;

  color: #334155;

  font-size: 10px;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-dashboard__header-user-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 8px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

  .admin-dashboard__search {
    width: 170px;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 900px) {

  .admin-dashboard__menu-button {
    display: flex;
  }

  .admin-dashboard__header {
    height: 68px;

    padding:
      0
      18px;
  }

  .admin-dashboard__search {
    display: none;
  }

  .admin-dashboard__header-user-info {
    display: none;
  }

  .admin-dashboard__header-right {
    gap: 9px;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .admin-dashboard__header {
    padding:
      0
      14px;
  }

  .admin-dashboard__header h1 {
    font-size: 18px;
  }

}

        `}
      </style>
    </>
  );
}
 
