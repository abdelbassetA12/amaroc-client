import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <>
    
      <div className="notfound-page">

        {/* BACKGROUND */}
        <div className="bg-shape shape1"></div>
        <div className="bg-shape shape2"></div>

        {/* CARD */}
        <div className="notfound-card">

          {/* NUMBER */}
          <div className="error-code">
            404
          </div>

          {/* TITLE */}
          <h1>
            Oops! Page Not Found
          </h1>

          {/* DESCRIPTION */}
          <p>
            The page you are looking for does not exist
            or may have been moved to another location.
          </p>

          {/* BUTTON */}
          <Link to="/" className="back-btn">
            <FiArrowLeft />
            Back to Dashboard
          </Link>

        </div>

      </div>

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family:'Inter',sans-serif;
          background:#f8fafc;
        }

        /* =========================
           PAGE
        ========================= */

        .notfound-page{
          min-height:100vh;

          display:flex;
          align-items:center;
          justify-content:center;

          position:relative;
          overflow:hidden;

          padding:30px;

          background:
            linear-gradient(
              135deg,
              #eef2ff 0%,
              #f8fafc 50%,
              #e0e7ff 100%
            );
        }

        /* =========================
           BACKGROUND SHAPES
        ========================= */

        .bg-shape{
          position:absolute;
          border-radius:50%;
          filter:blur(80px);
          opacity:0.35;
        }

        .shape1{
          width:320px;
          height:320px;

          background:#6366f1;

          top:-80px;
          left:-80px;
        }

        .shape2{
          width:260px;
          height:260px;

          background:#8b5cf6;

          bottom:-60px;
          right:-60px;
        }

        /* =========================
           CARD
        ========================= */

        .notfound-card{
          position:relative;
          z-index:2;

          width:100%;
          max-width:620px;

          background:rgba(255,255,255,0.75);

          backdrop-filter:blur(18px);

          border:1px solid rgba(255,255,255,0.5);

          border-radius:32px;

          padding:70px 50px;

          text-align:center;

          box-shadow:
            0 25px 60px rgba(99,102,241,0.12);
        }

        /* =========================
           ERROR CODE
        ========================= */

        .error-code{
          font-size:120px;
          font-weight:900;

          line-height:1;

          margin-bottom:20px;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #7c3aed,
              #2563eb
            );

          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        /* =========================
           TEXT
        ========================= */

        .notfound-card h1{
          font-size:38px;
          color:#111827;

          margin-bottom:18px;
        }

        .notfound-card p{
          font-size:17px;
          line-height:1.8;

          color:#6b7280;

          max-width:480px;
          margin:auto auto 35px;
        }

        /* =========================
           BUTTON
        ========================= */

        .back-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;

          height:56px;
          padding:0 28px;

          border-radius:18px;

          text-decoration:none;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #7c3aed
            );

          color:white;

          font-size:15px;
          font-weight:700;

          transition:0.25s;

          box-shadow:
            0 12px 28px rgba(99,102,241,0.25);
        }

        .back-btn:hover{
          transform:translateY(-2px);
          opacity:0.96;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width:900px){

          .notfound-card{
            padding:60px 35px;
          }

          .error-code{
            font-size:100px;
          }

          .notfound-card h1{
            font-size:32px;
          }

          .notfound-card p{
            font-size:16px;
          }

        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width:600px){

          .notfound-page{
            padding:18px;
          }

          .notfound-card{
            padding:50px 24px;
            border-radius:26px;
          }

          .error-code{
            font-size:76px;
            margin-bottom:14px;
          }

          .notfound-card h1{
            font-size:26px;
            line-height:1.3;
          }

          .notfound-card p{
            font-size:14px;
            line-height:1.7;
            margin-bottom:28px;
          }

          .back-btn{
            width:100%;
            height:52px;

            border-radius:16px;

            font-size:14px;
          }

        }

        /* =========================
           VERY SMALL MOBILE
        ========================= */

        @media (max-width:380px){

          .error-code{
            font-size:64px;
          }

          .notfound-card h1{
            font-size:22px;
          }

          .notfound-card p{
            font-size:13px;
          }

        }

      `}</style>

    </>
  );
}
