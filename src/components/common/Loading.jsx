 
import React from "react";

const Loading = ({
  fullScreen = true,
  text = "جاري التحميل",
  showText = true,
  size = "medium",
}) => {
  return (
    <div
      className={`amaroc-loading ${
        fullScreen ? "amaroc-loading--fullscreen" : "amaroc-loading--inline"
      } amaroc-loading--${size}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="amaroc-loading__content">
        <div className="amaroc-loading__logo">
          <span className="amaroc-loading__logo-ring"></span>
          <span className="amaroc-loading__logo-core">A</span>
        </div>

        <div className="amaroc-loading__pulse">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {showText && (
          <div className="amaroc-loading__text">
            <span>{text}</span>
            <span className="amaroc-loading__dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>
        )}
      </div>

      <style>{`
        .amaroc-loading,
        .amaroc-loading *,
        .amaroc-loading *::before,
        .amaroc-loading *::after {
          box-sizing: border-box;
        }

        .amaroc-loading {
          --loading-bg: #f7f3ed;
          --loading-gold: #d6ad5c;
          --loading-gold-light: #ead39b;
          --loading-dark: #171717;
          --loading-muted: #77716a;

          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          direction: rtl;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .amaroc-loading--fullscreen {
          min-height: 100vh;
          min-height: 100dvh;
          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(214, 173, 92, 0.10) 0%,
              rgba(214, 173, 92, 0.04) 24%,
              transparent 58%
            ),
            var(--loading-bg);
        }

        .amaroc-loading--inline {
          min-height: 260px;
          padding: 40px 20px;
          background: transparent;
        }

        .amaroc-loading__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }

        /* =========================================================
           LOGO
        ========================================================= */

        .amaroc-loading__logo {
          width: 76px;
          height: 76px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 26px;
        }

        .amaroc-loading__logo::before {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px solid rgba(214, 173, 92, 0.22);
        }

        .amaroc-loading__logo-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--loading-gold);
          border-right-color: rgba(214, 173, 92, 0.28);
          animation: amarocLoadingRotate 1.7s linear infinite;
        }

        .amaroc-loading__logo-ring::after {
          content: "";
          position: absolute;
          width: 7px;
          height: 7px;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: var(--loading-gold);
          box-shadow:
            0 0 10px rgba(214, 173, 92, 0.7),
            0 0 22px rgba(214, 173, 92, 0.28);
        }

        .amaroc-loading__logo-core {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          color: var(--loading-gold);
          background: var(--loading-dark);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 25px;
          font-weight: 600;
          letter-spacing: -1px;

          box-shadow:
            0 8px 24px rgba(23, 23, 23, 0.14),
            inset 0 0 0 1px rgba(214, 173, 92, 0.16);

          animation: amarocLoadingBreath 2.4s ease-in-out infinite;
        }

        /* =========================================================
           PULSE
        ========================================================= */

        .amaroc-loading__pulse {
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-bottom: 12px;
        }

        .amaroc-loading__pulse span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--loading-gold);
          opacity: 0.25;

          animation: amarocLoadingPulse 1.2s ease-in-out infinite;
        }

        .amaroc-loading__pulse span:nth-child(1) {
          animation-delay: 0s;
        }

        .amaroc-loading__pulse span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .amaroc-loading__pulse span:nth-child(3) {
          animation-delay: 0.3s;
        }

        /* =========================================================
           TEXT
        ========================================================= */

        .amaroc-loading__text {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 24px;

          color: var(--loading-muted);

          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1px;
        }

        .amaroc-loading__dots {
          display: inline-flex;
          align-items: flex-end;
          height: 18px;
          margin-right: 4px;
          gap: 2px;
        }

        .amaroc-loading__dots i {
          display: block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--loading-gold);

          animation: amarocLoadingDots 1.35s ease-in-out infinite;
        }

        .amaroc-loading__dots i:nth-child(1) {
          animation-delay: 0s;
        }

        .amaroc-loading__dots i:nth-child(2) {
          animation-delay: 0.15s;
        }

        .amaroc-loading__dots i:nth-child(3) {
          animation-delay: 0.3s;
        }

        /* =========================================================
           SIZE
        ========================================================= */

        .amaroc-loading--small .amaroc-loading__logo {
          width: 58px;
          height: 58px;
          margin-bottom: 20px;
        }

        .amaroc-loading--small .amaroc-loading__logo-core {
          width: 37px;
          height: 37px;
          font-size: 19px;
        }

        .amaroc-loading--small .amaroc-loading__text {
          font-size: 12px;
        }

        .amaroc-loading--large .amaroc-loading__logo {
          width: 92px;
          height: 92px;
          margin-bottom: 30px;
        }

        .amaroc-loading--large .amaroc-loading__logo-core {
          width: 58px;
          height: 58px;
          font-size: 30px;
        }

        .amaroc-loading--large .amaroc-loading__text {
          font-size: 14px;
        }

        /* =========================================================
           ANIMATIONS
        ========================================================= */

        @keyframes amarocLoadingRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes amarocLoadingBreath {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 8px 24px rgba(23, 23, 23, 0.14),
              inset 0 0 0 1px rgba(214, 173, 92, 0.16);
          }

          50% {
            transform: scale(1.035);
            box-shadow:
              0 10px 30px rgba(23, 23, 23, 0.17),
              0 0 24px rgba(214, 173, 92, 0.08),
              inset 0 0 0 1px rgba(214, 173, 92, 0.22);
          }
        }

        @keyframes amarocLoadingPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes amarocLoadingDots {
          0%,
          100% {
            opacity: 0.25;
            transform: translateY(0);
          }

          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 600px) {
          .amaroc-loading--fullscreen {
            min-height: 100svh;
          }

          .amaroc-loading__logo {
            width: 68px;
            height: 68px;
            margin-bottom: 22px;
          }

          .amaroc-loading__logo-core {
            width: 43px;
            height: 43px;
            font-size: 23px;
          }

          .amaroc-loading__text {
            font-size: 12px;
          }
        }

        /* =========================================================
           REDUCED MOTION
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {
          .amaroc-loading__logo-ring,
          .amaroc-loading__logo-core,
          .amaroc-loading__pulse span,
          .amaroc-loading__dots i {
            animation: none;
          }

          .amaroc-loading__logo-ring {
            border-color: rgba(214, 173, 92, 0.55);
          }

          .amaroc-loading__pulse span,
          .amaroc-loading__dots i {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
 
