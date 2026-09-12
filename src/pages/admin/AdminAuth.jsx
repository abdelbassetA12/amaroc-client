import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiMail,
  FiUser,
  FiKey,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiDatabase,
  FiBarChart2,
} from "react-icons/fi";

import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminAuth() {
  const navigate = useNavigate();

  const {
    login,
    register,
    isAuthenticated,
  } = useAdminAuth();

  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    registerKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const isLogin = mode === "login";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const switchMode = () => {
    setMode((previous) =>
      previous === "login"
        ? "register"
        : "login"
    );

    setError("");
    setSuccess("");

    setForm({
      name: "",
      email: "",
      password: "",
      registerKey: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(
          form.email,
          form.password
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      await register(
        form.name,
        form.email,
        form.password,
        form.registerKey
      );

      setSuccess(
        "Admin account created successfully. You can now log in."
      );

      setMode("login");

      setForm({
        name: "",
        email: form.email,
        password: "",
        registerKey: "",
      });
    } catch (error) {
      setError(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="admin-auth__background">
        <div className="admin-auth__glow admin-auth__glow--one" />
        <div className="admin-auth__glow admin-auth__glow--two" />
      </div>


      {/* ==================================================
          MAIN CARD
      ================================================== */}

      <section className="admin-auth__container">


        {/* =================================================
            DESKTOP INTRO
        ================================================= */}

        <aside className="admin-auth__intro">

          <div className="admin-auth__brand">
            <div className="admin-auth__brand-icon">
              <FiShield />
            </div>

            <div className="admin-auth__brand-text">
              <strong>STORE ADMIN</strong>
              <span>Management Console</span>
            </div>
          </div>


          <div className="admin-auth__intro-content">

            <div className="admin-auth__status">
              <span className="admin-auth__status-dot" />
              SYSTEM SECURE
            </div>

            <h1>
              Your store.
              <br />
              <span>Under control.</span>
            </h1>

            <p>
              Manage your products, orders,
              customers and store operations
              from one secure administration
              panel.
            </p>

          </div>


          <div className="admin-auth__features">

            <div className="admin-auth__feature">
              <div className="admin-auth__feature-icon">
                <FiActivity />
              </div>

              <div>
                <strong>
                  Real-time control
                </strong>

                <span>
                  Monitor your store operations
                </span>
              </div>
            </div>


            <div className="admin-auth__feature">
              <div className="admin-auth__feature-icon">
                <FiBarChart2 />
              </div>

              <div>
                <strong>
                  Business insights
                </strong>

                <span>
                  Track your store performance
                </span>
              </div>
            </div>


            <div className="admin-auth__feature">
              <div className="admin-auth__feature-icon">
                <FiDatabase />
              </div>

              <div>
                <strong>
                  Secure management
                </strong>

                <span>
                  Your administration stays protected
                </span>
              </div>
            </div>

          </div>


          <div className="admin-auth__footer">

            <span>
              <FiLock />
              Protected administration area
            </span>

            <span>
              © {new Date().getFullYear()}
            </span>

          </div>

        </aside>


        {/* =================================================
            AUTH PANEL
        ================================================= */}

        <div className="admin-auth__panel">


          {/* =================================================
              MOBILE BRAND
          ================================================= */}

          <div className="admin-auth__mobile-brand">

            <div className="admin-auth__mobile-brand-icon">
              <FiShield />
            </div>

            <div className="admin-auth__mobile-brand-text">
              <strong>
                STORE ADMIN
              </strong>

              <span>
                Management Console
              </span>
            </div>

          </div>


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="admin-auth__panel-header">

            <div className="admin-auth__panel-icon">
              <FiLock />
            </div>

            <div className="admin-auth__header-content">

              <div className="admin-auth__eyebrow">
                ADMINISTRATION
              </div>

              <h2>
                {isLogin
                  ? "Welcome back"
                  : "Create admin account"}
              </h2>

              <p>
                {isLogin
                  ? "Sign in to access your store dashboard."
                  : "Create a secure administrator account for your store."}
              </p>

            </div>

          </header>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="admin-auth__alert admin-auth__alert--error"
              role="alert"
            >
              <FiAlertCircle />

              <span>
                {error}
              </span>
            </div>
          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div
              className="admin-auth__alert admin-auth__alert--success"
              role="status"
            >
              <FiCheckCircle />

              <span>
                {success}
              </span>
            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="admin-auth__form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            {!isLogin && (
              <div className="admin-auth__field">

                <label htmlFor="admin-name">
                  Name
                </label>

                <div className="admin-auth__input-wrapper">

                  <FiUser />

                  <input
                    id="admin-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Admin name"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>
            )}


            {/* EMAIL */}

            <div className="admin-auth__field">

              <label htmlFor="admin-email">
                Email address
              </label>

              <div className="admin-auth__input-wrapper">

                <FiMail />

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-auth__field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-auth__input-wrapper">

                <FiLock />

                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isLogin
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={8}
                  required
                />

              </div>

            </div>


            {/* REGISTER KEY */}

            {!isLogin && (
              <div className="admin-auth__field">

                <label htmlFor="admin-register-key">
                  Registration key
                </label>

                <div className="admin-auth__input-wrapper">

                  <FiKey />

                  <input
                    id="admin-register-key"
                    name="registerKey"
                    type="password"
                    value={form.registerKey}
                    onChange={handleChange}
                    placeholder="Enter admin registration key"
                    autoComplete="off"
                    required
                  />

                </div>

                <small>
                  Required to create an administrator account.
                </small>

              </div>
            )}


            {/* SUBMIT */}

            <button
              className="admin-auth__submit"
              type="submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign in to dashboard"
                  : "Create admin account"}
              </span>

              {!loading && (
                <FiArrowRight />
              )}

            </button>

          </form>


          {/* =================================================
              MODE SWITCH
          ================================================= */}

          <div className="admin-auth__switch">

            <span>
              {isLogin
                ? "Need to create an admin account?"
                : "Already have an admin account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
            >
              {isLogin
                ? "Create account"
                : "Sign in"}
            </button>

          </div>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="admin-auth__security">

            <FiShield />

            <span>
              Secure administrator authentication
            </span>

          </div>

        </div>

      </section>

      <style>
        {`
        /* =========================================================
   RESET
========================================================= */

.admin-auth,
.admin-auth *,
.admin-auth *::before,
.admin-auth *::after {
  box-sizing: border-box;
}


/* =========================================================
   PAGE
========================================================= */

.admin-auth {
  position: relative;

  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 10% 15%,
      rgba(37, 99, 235, 0.08),
      transparent 32%
    ),
    radial-gradient(
      circle at 90% 85%,
      rgba(14, 165, 233, 0.08),
      transparent 32%
    ),
    #f5f7fb;

  color: #0f172a;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


/* =========================================================
   BACKGROUND
========================================================= */

.admin-auth__background {
  position: fixed;

  inset: 0;

  overflow: hidden;

  pointer-events: none;
}

.admin-auth__glow {
  position: absolute;

  border-radius: 999px;

  filter: blur(100px);

  pointer-events: none;
}

.admin-auth__glow--one {
  width: 320px;
  height: 320px;

  top: -120px;
  left: -100px;

  background: rgba(37, 99, 235, 0.1);
}

.admin-auth__glow--two {
  width: 380px;
  height: 380px;

  right: -150px;
  bottom: -150px;

  background: rgba(14, 165, 233, 0.09);
}


/* =========================================================
   MAIN CONTAINER
========================================================= */

.admin-auth__container {
  position: relative;
  z-index: 2;

  width: min(1120px, 100%);

  min-height: 680px;

  display: grid;

  grid-template-columns:
    minmax(0, 0.95fr)
    minmax(0, 1.05fr);

  overflow: hidden;

  border:
    1px solid
    rgba(148, 163, 184, 0.18);

  border-radius: 28px;

  background: #ffffff;

  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.12),
    0 10px 30px rgba(15, 23, 42, 0.06);
}


/* =========================================================
   LEFT INTRO
========================================================= */

.admin-auth__intro {
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: 0;

  padding: 48px;

  overflow: hidden;

  color: #ffffff;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(59, 130, 246, 0.25),
      transparent 36%
    ),
    linear-gradient(
      145deg,
      #0f172a 0%,
      #111827 55%,
      #172554 100%
    );
}


/* =========================================================
   DESKTOP BRAND
========================================================= */

.admin-auth__brand {
  display: flex;
  align-items: center;

  gap: 13px;

  flex-shrink: 0;
}

.admin-auth__brand-icon {
  width: 44px;
  height: 44px;

  flex: 0 0 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(255, 255, 255, 0.13);

  border-radius: 13px;

  color: #60a5fa;

  background:
    rgba(255, 255, 255, 0.07);

  font-size: 20px;
}

.admin-auth__brand-text strong {
  display: block;

  color: #ffffff;

  font-size: 13px;
  font-weight: 800;

  letter-spacing: 0.11em;
}

.admin-auth__brand-text span {
  display: block;

  margin-top: 3px;

  color:
    rgba(255, 255, 255, 0.48);

  font-size: 11px;
}


/* =========================================================
   INTRO CONTENT
========================================================= */

.admin-auth__intro-content {
  margin-top: auto;
  margin-bottom: 54px;
}

.admin-auth__status {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 22px;

  color: #93c5fd;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.admin-auth__status-dot {
  width: 7px;
  height: 7px;

  flex: 0 0 7px;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 5px
    rgba(34, 197, 94, 0.12);
}

.admin-auth__intro h1 {
  margin: 0;

  font-size: clamp(38px, 4vw, 58px);

  line-height: 1.03;

  font-weight: 800;

  letter-spacing: -0.045em;
}

.admin-auth__intro h1 span {
  color: #60a5fa;
}

.admin-auth__intro p {
  max-width: 420px;

  margin: 22px 0 0;

  color:
    rgba(255, 255, 255, 0.56);

  font-size: 14px;

  line-height: 1.8;
}


/* =========================================================
   FEATURES
========================================================= */

.admin-auth__features {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.admin-auth__feature {
  display: flex;
  align-items: center;

  gap: 13px;
}

.admin-auth__feature-icon {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 10px;

  color: #93c5fd;

  background:
    rgba(255, 255, 255, 0.05);

  font-size: 16px;
}

.admin-auth__feature strong {
  display: block;

  color: #ffffff;

  font-size: 12px;
  font-weight: 700;
}

.admin-auth__feature span {
  display: block;

  margin-top: 3px;

  color:
    rgba(255, 255, 255, 0.4);

  font-size: 10px;
}


/* =========================================================
   INTRO FOOTER
========================================================= */

.admin-auth__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-top: auto;
  padding-top: 30px;

  color:
    rgba(255, 255, 255, 0.34);

  font-size: 10px;
}

.admin-auth__footer span {
  display: flex;
  align-items: center;

  gap: 6px;
}

.admin-auth__footer svg {
  font-size: 12px;
}


/* =========================================================
   RIGHT AUTH PANEL
========================================================= */

.admin-auth__panel {
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 64px 72px;

  background: #ffffff;
}


/* =========================================================
   MOBILE BRAND
========================================================= */

.admin-auth__mobile-brand {
  display: none;
}


/* =========================================================
   HEADER
========================================================= */

.admin-auth__panel-header {
  width: 100%;

  display: flex;
  align-items: flex-start;

  gap: 16px;

  margin-bottom: 32px;
}

.admin-auth__panel-icon {
  width: 46px;
  height: 46px;

  flex: 0 0 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid
    #dbeafe;

  border-radius: 14px;

  color: #2563eb;

  background: #eff6ff;

  font-size: 19px;
}

.admin-auth__header-content {
  min-width: 0;
}

.admin-auth__eyebrow {
  margin-bottom: 7px;

  color: #2563eb;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.admin-auth__panel-header h2 {
  margin: 0;

  color: #0f172a;

  font-size: 31px;
  font-weight: 800;

  line-height: 1.15;

  letter-spacing: -0.035em;
}

.admin-auth__panel-header p {
  max-width: 430px;

  margin: 9px 0 0;

  color: #64748b;

  font-size: 13px;

  line-height: 1.6;
}


/* =========================================================
   ALERTS
========================================================= */

.admin-auth__alert {
  width: 100%;

  display: flex;
  align-items: flex-start;

  gap: 10px;

  margin-bottom: 20px;
  padding: 12px 14px;

  border-radius: 11px;

  font-size: 12px;

  line-height: 1.5;
}

.admin-auth__alert svg {
  flex: 0 0 auto;

  margin-top: 1px;

  font-size: 16px;
}

.admin-auth__alert--error {
  color: #b91c1c;

  border:
    1px solid
    #fecaca;

  background: #fef2f2;
}

.admin-auth__alert--success {
  color: #15803d;

  border:
    1px solid
    #bbf7d0;

  background: #f0fdf4;
}


/* =========================================================
   FORM
========================================================= */

.admin-auth__form {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 18px;
}

.admin-auth__field {
  width: 100%;
}

.admin-auth__field label {
  display: block;

  margin-bottom: 7px;

  color: #334155;

  font-size: 11px;
  font-weight: 700;
}

.admin-auth__input-wrapper {
  position: relative;

  width: 100%;
}

.admin-auth__input-wrapper > svg {
  position: absolute;

  left: 14px;
  top: 50%;

  width: 15px;
  height: 15px;

  transform: translateY(-50%);

  color: #94a3b8;

  pointer-events: none;
}

.admin-auth__input-wrapper input {
  display: block;

  width: 100%;
  height: 48px;

  margin: 0;

  padding:
    0
    14px
    0
    42px;

  border:
    1px solid
    #dbe2ea;

  border-radius: 10px;

  outline: none;

  color: #0f172a;

  background: #ffffff;

  font-family: inherit;

  font-size: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.admin-auth__input-wrapper input::placeholder {
  color: #a8b2c0;
}

.admin-auth__input-wrapper input:focus {
  border-color: #60a5fa;

  box-shadow:
    0 0 0 3px
    rgba(59, 130, 246, 0.1);
}

.admin-auth__field small {
  display: block;

  margin-top: 7px;

  color: #94a3b8;

  font-size: 10px;

  line-height: 1.5;
}


/* =========================================================
   SUBMIT BUTTON
========================================================= */

.admin-auth__submit {
  width: 100%;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 5px;

  padding: 0 18px;

  border: 0;

  border-radius: 10px;

  color: #ffffff;

  background: #2563eb;

  font-family: inherit;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 8px 20px
    rgba(37, 99, 235, 0.2);

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.admin-auth__submit:hover:not(:disabled) {
  background: #1d4ed8;

  transform: translateY(-1px);

  box-shadow:
    0 12px 25px
    rgba(37, 99, 235, 0.25);
}

.admin-auth__submit:active:not(:disabled) {
  transform: translateY(0);
}

.admin-auth__submit:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}


/* =========================================================
   SWITCH
========================================================= */

.admin-auth__switch {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  margin-top: 24px;

  color: #94a3b8;

  font-size: 10px;

  text-align: center;
}

.admin-auth__switch button {
  margin: 0;
  padding: 0;

  border: 0;

  color: #2563eb;

  background: transparent;

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;
}

.admin-auth__switch button:hover {
  text-decoration: underline;
}

.admin-auth__switch button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}


/* =========================================================
   SECURITY
========================================================= */

.admin-auth__security {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 30px;
  padding-top: 18px;

  border-top:
    1px solid
    #eef2f7;

  color: #a0aec0;

  font-size: 9px;
}

.admin-auth__security svg {
  font-size: 12px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .admin-auth {
    padding: 20px;
  }

  .admin-auth__container {
    grid-template-columns:
      minmax(0, 0.85fr)
      minmax(0, 1.15fr);
  }

  .admin-auth__intro {
    padding: 38px;
  }

  .admin-auth__panel {
    padding: 48px;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 760px) {

  html,
  body,
  #root {
    width: 100%;
    min-width: 0;

    margin: 0;
    padding: 0;
  }


  /* ---------------------------------------------
     PAGE
  --------------------------------------------- */

  .admin-auth {
    position: relative;

    width: 100%;
    min-width: 0;

    min-height: 100vh;
    min-height: 100dvh;

    display: block;

    padding: 0;

    overflow-x: hidden;
    overflow-y: auto;

    background: #ffffff;
  }


  /* ---------------------------------------------
     REMOVE BACKGROUND
  --------------------------------------------- */

  .admin-auth__background {
    display: none;
  }


  /* ---------------------------------------------
     REMOVE DESKTOP SIDEBAR
  --------------------------------------------- */

  .admin-auth__intro {
    display: none !important;
  }


  /* ---------------------------------------------
     CONTAINER
  --------------------------------------------- */

  .admin-auth__container {
    width: 100%;
    max-width: none;

    min-height: 100vh;
    min-height: 100dvh;

    display: block;

    overflow: visible;

    border: 0;
    border-radius: 0;

    box-shadow: none;

    background: #ffffff;
  }


  /* ---------------------------------------------
     PANEL
  --------------------------------------------- */

  .admin-auth__panel {
    width: 100%;
    min-width: 0;

    min-height: 100vh;
    min-height: 100dvh;

    display: flex;
    flex-direction: column;

    justify-content: flex-start;

    padding:
      28px
      22px
      34px;

    background:
      linear-gradient(
        180deg,
        #f8fafc 0,
        #ffffff 260px
      );
  }


  /* ---------------------------------------------
     MOBILE BRAND
  --------------------------------------------- */

  .admin-auth__mobile-brand {
    width: 100%;

    display: flex;
    align-items: center;

    gap: 11px;

    margin: 0 0 54px;
  }

  .admin-auth__mobile-brand-icon {
    width: 42px;
    height: 42px;

    flex: 0 0 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border:
      1px solid
      #dbeafe;

    border-radius: 12px;

    color: #2563eb;

    background: #eff6ff;

    font-size: 18px;
  }

  .admin-auth__mobile-brand-text {
    min-width: 0;
  }

  .admin-auth__mobile-brand-text strong {
    display: block;

    color: #0f172a;

    font-size: 12px;
    font-weight: 800;

    line-height: 1.2;

    letter-spacing: 0.1em;
  }

  .admin-auth__mobile-brand-text span {
    display: block;

    margin-top: 3px;

    color: #94a3b8;

    font-size: 9px;

    line-height: 1.2;
  }


  /* ---------------------------------------------
     HEADER
  --------------------------------------------- */

  .admin-auth__panel-header {
    width: 100%;

    display: block;

    margin: 0 0 30px;
  }


  /* ---------------------------------------------
     NO SECOND ICON ON MOBILE
  --------------------------------------------- */

  .admin-auth__panel-icon {
    display: none;
  }


  .admin-auth__header-content {
    width: 100%;
    min-width: 0;
  }


  .admin-auth__eyebrow {
    margin-bottom: 9px;

    color: #2563eb;

    font-size: 9px;
    font-weight: 800;

    line-height: 1.2;

    letter-spacing: 0.14em;
  }


  .admin-auth__panel-header h2 {
    width: 100%;

    margin: 0;

    color: #0f172a;

    font-size: 34px;
    font-weight: 800;

    line-height: 1.08;

    letter-spacing: -0.045em;

    white-space: normal;
  }


  .admin-auth__panel-header p {
    width: 100%;
    max-width: 330px;

    margin: 11px 0 0;

    color: #64748b;

    font-size: 13px;

    line-height: 1.55;
  }


  /* ---------------------------------------------
     ALERTS
  --------------------------------------------- */

  .admin-auth__alert {
    width: 100%;

    box-sizing: border-box;

    margin-bottom: 20px;

    padding: 12px;

    border-radius: 10px;

    font-size: 12px;
  }


  /* ---------------------------------------------
     FORM
  --------------------------------------------- */

  .admin-auth__form {
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 20px;
  }

  .admin-auth__field {
    width: 100%;
  }

  .admin-auth__field label {
    margin-bottom: 8px;

    font-size: 11px;
  }


  /* ---------------------------------------------
     INPUT
  --------------------------------------------- */

  .admin-auth__input-wrapper {
    width: 100%;
  }

  .admin-auth__input-wrapper > svg {
    left: 14px;

    width: 16px;
    height: 16px;
  }

  .admin-auth__input-wrapper input {
    width: 100%;
    height: 50px;

    padding:
      0
      14px
      0
      43px;

    border-radius: 11px;

    font-size: 13px;
  }


  /* ---------------------------------------------
     REGISTER HELP
  --------------------------------------------- */

  .admin-auth__field small {
    margin-top: 7px;

    font-size: 10px;
  }


  /* ---------------------------------------------
     BUTTON
  --------------------------------------------- */

  .admin-auth__submit {
    width: 100%;
    height: 51px;

    margin-top: 3px;

    padding: 0 16px;

    border-radius: 11px;

    font-size: 12px;
  }


  /* ---------------------------------------------
     SWITCH
  --------------------------------------------- */

  .admin-auth__switch {
    width: 100%;

    display: flex;

    flex-wrap: wrap;

    margin-top: 25px;

    gap: 5px;

    font-size: 10px;
  }

  .admin-auth__switch button {
    font-size: 10px;
  }


  /* ---------------------------------------------
     SECURITY
  --------------------------------------------- */

  .admin-auth__security {
    width: 100%;

    margin-top: 30px;
    padding-top: 17px;

    font-size: 9px;
  }

}


/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 390px) {

  .admin-auth__panel {
    padding:
      24px
      18px
      30px;
  }

  .admin-auth__mobile-brand {
    margin-bottom: 46px;
  }

  .admin-auth__panel-header {
    margin-bottom: 28px;
  }

  .admin-auth__panel-header h2 {
    font-size: 31px;
  }

  .admin-auth__panel-header p {
    max-width: 290px;

    font-size: 12px;
  }

  .admin-auth__form {
    gap: 18px;
  }

  .admin-auth__input-wrapper input {
    height: 49px;
  }

  .admin-auth__submit {
    height: 50px;
  }

}


/* =========================================================
   VERY SMALL PHONES
========================================================= */

@media (max-width: 340px) {

  .admin-auth__panel {
    padding:
      22px
      16px
      28px;
  }

  .admin-auth__mobile-brand {
    margin-bottom: 40px;
  }

  .admin-auth__panel-header h2 {
    font-size: 29px;
  }

  .admin-auth__panel-header p {
    font-size: 11px;
  }

}`}
      </style>

    </main>
  );
}