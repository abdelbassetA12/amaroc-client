 
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    cartCount,
    isEmpty,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // ============================================================
  // LOCK BODY SCROLL
  // ============================================================

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isCartOpen]);

  // ============================================================
  // ESC KEY
  // ============================================================

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isCartOpen, closeCart]);

  // ============================================================
  // CHECKOUT
  // ============================================================

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  if (!isCartOpen) {
    return null;
  }

  return (
    <>
      <div
        className="cart-overlay"
        onClick={closeCart}
      />

      <aside
        className="cart-drawer"
        dir="rtl"
        aria-label="سلة التسوق"
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="cart-header">
          <div className="cart-title">
            <FiShoppingBag />

            <div>
              <h2>سلة التسوق</h2>

              <span>
                {cartCount}{" "}
                {cartCount === 1
                  ? "منتج"
                  : "منتجات"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={closeCart}
            aria-label="إغلاق السلة"
          >
            <FiX />
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="cart-content">
          {isEmpty ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <FiShoppingBag />
              </div>

              <h3>سلتك فارغة</h3>

              <p>
                لم تضف أي منتجات إلى السلة بعد.
              </p>

              <button
                type="button"
                className="cart-continue"
                onClick={closeCart}
              >
                ابدأ التسوق
                <FiArrowLeft />
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => {
                const itemVolume =
                  item?.volume ??
                  item?.variant?.volume ??
                  null;

                const itemVolumeUnit =
                  item?.volumeUnit ||
                  item?.variant?.volumeUnit ||
                  "ml";

                return (
                  <article
                    className="cart-item"
                    key={item.itemKey}
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/products/${item.slug}`}
                      className="cart-item-image"
                      onClick={closeCart}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                      />
                    </Link>

                    {/* INFO */}

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <Link
                          to={`/products/${item.slug}`}
                          className="cart-item-name"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>

                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() =>
                            removeFromCart(
                              item.itemKey
                            )
                          }
                          aria-label={`حذف ${item.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* OPTIONS */}

                      {(item?.color ||
                        item?.size ||
                        itemVolume != null) && (
                        <div className="cart-item-options">
                          {itemVolume != null && (
                            <span>
                              الحجم:{" "}
                              {itemVolume}{" "}
                              {itemVolumeUnit}
                            </span>
                          )}

                          {item?.color?.name && (
                            <span>
                              اللون:{" "}
                              {item.color.name}
                            </span>
                          )}

                          {item?.size?.name && (
                            <span>
                              المقاس:{" "}
                              {item.size.name}
                            </span>
                          )}
                        </div>
                      )}

                      {/* PRICE */}

                      <div className="cart-item-price">
                        {item.price.toFixed(2)}{" "}
                        {item.currency}
                      </div>

                      {/* QUANTITY */}

                      <div className="cart-item-bottom">
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.itemKey
                              )
                            }
                            aria-label="تقليل الكمية"
                          >
                            <FiMinus />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.itemKey
                              )
                            }
                            disabled={
                              item.quantity >=
                              item.maxQuantity
                            }
                            aria-label="زيادة الكمية"
                          >
                            <FiPlus />
                          </button>
                        </div>

                        <strong>
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}{" "}
                          {item.currency}
                        </strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        {!isEmpty && (
          <div className="cart-footer">
            <div className="cart-summary">
              <span>المجموع الفرعي</span>

              <strong>
                {subtotal.toFixed(2)} MAD
              </strong>
            </div>

            <p className="cart-shipping-note">
              سيتم احتساب تكلفة الشحن عند إتمام
              الطلب.
            </p>

            <button
              type="button"
              className="cart-checkout"
              onClick={handleCheckout}
            >
              إتمام الطلب
              <FiArrowLeft />
            </button>

            <button
              type="button"
              className="cart-shopping"
              onClick={closeCart}
            >
              متابعة التسوق
            </button>
          </div>
        )}
      </aside>

      <style>{`
        /* =========================================================
           CART OVERLAY
        ========================================================= */

        .cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(2px);
          animation: cartOverlayIn 0.25s ease;
        }

        /* =========================================================
           DRAWER
        ========================================================= */

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: min(440px, 100%);
          height: 100dvh;
          z-index: 10001;
          display: flex;
          flex-direction: column;
          background: #fff;
          box-shadow:
            -12px 0 40px rgba(0, 0, 0, 0.12);
          font-family:
            "Cairo",
            "Tajawal",
            Arial,
            sans-serif;
          animation: cartDrawerIn 0.32s
            cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        /* =========================================================
           HEADER
        ========================================================= */

        .cart-header {
          flex-shrink: 0;
          min-height: 82px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ebe7e1;
        }

        .cart-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cart-title > svg {
          width: 23px;
          height: 23px;
          stroke-width: 1.6;
        }

        .cart-title h2 {
          margin: 0;
          color: #171717;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 800;
        }

        .cart-title span {
          display: block;
          margin-top: 2px;
          color: #888;
          font-size: 11px;
        }

        .cart-close {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #f6f4f1;
          color: #222;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .cart-close:hover {
          background: #ece9e4;
          transform: rotate(5deg);
        }

        .cart-close svg {
          width: 19px;
          height: 19px;
        }

        /* =========================================================
           CONTENT
        ========================================================= */

        .cart-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 18px 20px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* =========================================================
           EMPTY
        ========================================================= */

        .cart-empty {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .cart-empty-icon {
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border-radius: 50%;
          background: #f7f3ed;
          color: #333;
        }

        .cart-empty-icon svg {
          width: 31px;
          height: 31px;
          stroke-width: 1.5;
        }

        .cart-empty h3 {
          margin: 0;
          color: #171717;
          font-size: 19px;
          font-weight: 800;
        }

        .cart-empty p {
          margin: 8px 0 20px;
          color: #888;
          font-size: 12px;
        }

        .cart-continue {
          min-height: 43px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          background: #111;
          color: #fff;
          border-radius: 4px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .cart-continue svg {
          width: 15px;
          height: 15px;
        }

        /* =========================================================
           ITEM
        ========================================================= */

        .cart-item {
          display: flex;
          gap: 13px;
          padding-bottom: 18px;
          border-bottom: 1px solid #eeeae5;
        }

        .cart-item-image {
          flex-shrink: 0;
          width: 92px;
          height: 104px;
          overflow: hidden;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .cart-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .cart-item-top {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .cart-item-name {
          flex: 1;
          min-width: 0;
          color: #171717;
          text-decoration: none;
          font-size: 13px;
          line-height: 1.7;
          font-weight: 700;
        }

        .cart-item-name:hover {
          text-decoration: underline;
        }

        .cart-remove {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          background: transparent;
          color: #999;
          cursor: pointer;
        }

        .cart-remove:hover {
          color: #b42318;
        }

        .cart-remove svg {
          width: 15px;
          height: 15px;
        }

        /* =========================================================
           OPTIONS
        ========================================================= */

        .cart-item-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
          color: #888;
          font-size: 10px;
        }

        /* =========================================================
           PRICE
        ========================================================= */

        .cart-item-price {
          margin-top: 5px;
          color: #222;
          font-size: 12px;
          font-weight: 700;
        }

        /* =========================================================
           BOTTOM
        ========================================================= */

        .cart-item-bottom {
          margin-top: auto;
          padding-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .cart-item-bottom > strong {
          color: #171717;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* =========================================================
           QUANTITY
        ========================================================= */

        .quantity-control {
          height: 31px;
          display: flex;
          align-items: center;
          border: 1px solid #dedad4;
          border-radius: 3px;
          overflow: hidden;
        }

        .quantity-control button {
          width: 29px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          background: #fff;
          color: #333;
          cursor: pointer;
        }

        .quantity-control button:hover:not(:disabled) {
          background: #f7f5f2;
        }

        .quantity-control button:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .quantity-control button svg {
          width: 12px;
          height: 12px;
        }

        .quantity-control span {
          min-width: 30px;
          text-align: center;
          color: #222;
          font-size: 11px;
          font-weight: 700;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .cart-footer {
          flex-shrink: 0;
          padding: 18px 20px 20px;
          border-top: 1px solid #ebe7e1;
          background: #fff;
        }

        .cart-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .cart-summary span {
          color: #666;
          font-size: 12px;
        }

        .cart-summary strong {
          color: #111;
          font-size: 17px;
          font-weight: 800;
        }

        .cart-shipping-note {
          margin: 7px 0 14px;
          color: #999;
          font-size: 10px;
          line-height: 1.7;
        }

        .cart-checkout {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 3px;
          background: #111;
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .cart-checkout:hover {
          background: #252525;
          transform: translateY(-1px);
        }

        .cart-checkout svg {
          width: 16px;
          height: 16px;
        }

        .cart-shopping {
          width: 100%;
          min-height: 39px;
          margin-top: 8px;
          border: 0;
          background: transparent;
          color: #555;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .cart-shopping:hover {
          color: #111;
        }

        /* =========================================================
           ANIMATION
        ========================================================= */

        @keyframes cartDrawerIn {
          from {
            transform: translateX(100%);
          }

          to {
            transform: translateX(0);
          }
        }

        @keyframes cartOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 600px) {
          .cart-drawer {
            width: 100%;
          }

          .cart-header {
            min-height: 72px;
            padding: 15px 16px;
          }

          .cart-content {
            padding: 16px;
          }

          .cart-footer {
            padding: 16px;
          }

          .cart-item-image {
            width: 84px;
            height: 96px;
          }
        }
      `}</style>
    </>
  );
}
 
