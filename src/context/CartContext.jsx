 
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "amaroc_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // ============================================================
  // SAVE CART
  // ============================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems]);

  // ============================================================
  // CART DRAWER
  // ============================================================

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = useCallback(
    (product, quantity = 1, options = {}) => {
      if (!product?._id) {
        return {
          success: false,
          message: "المنتج غير صالح.",
        };
      }

      const inventory = product.inventory || {};

      const stockQuantity = Number(
        inventory.quantity || 0
      );

      const isOutOfStock =
        inventory.status === "out_of_stock" ||
        stockQuantity <= 0;

      if (isOutOfStock) {
        return {
          success: false,
          message: "هذا المنتج غير متوفر حالياً.",
        };
      }

      const availableColors =
        product.variants?.colors || [];

      const availableSizes =
        product.variants?.sizes || [];

      const requiresColor =
        availableColors.length > 0;

      const requiresSize =
        availableSizes.length > 0 &&
        !(
          availableSizes.length === 1 &&
          availableSizes[0]?.value ===
            "ONE_SIZE"
        );

      const selectedColor =
        options.color || null;

      const selectedSize =
        options.size || null;

      // ========================================================
      // VALIDATE COLOR
      // ========================================================

      if (requiresColor && !selectedColor) {
        return {
          success: false,
          message: "يرجى اختيار اللون.",
          requiresOptions: true,
        };
      }

      // ========================================================
      // VALIDATE SIZE
      // ========================================================

      if (requiresSize && !selectedSize) {
        return {
          success: false,
          message: "يرجى اختيار المقاس.",
          requiresOptions: true,
        };
      }

      // ========================================================
      // AUTOMATIC ONE SIZE
      // ========================================================

      const finalSize =
        selectedSize ||
        (availableSizes.length === 1
          ? availableSizes[0]
          : null);

      // ========================================================
      // UNIQUE CART ITEM
      // ========================================================

      const itemKey = [
        product._id,
        selectedColor?.value ||
          selectedColor?.name ||
          "",
        finalSize?.value ||
          finalSize?.name ||
          "",
      ].join("__");

      const requestedQuantity = Math.max(
        1,
        Number(quantity) || 1
      );

      let result = {
        success: true,
        message: "تمت إضافة المنتج إلى السلة.",
      };

      setCartItems((currentItems) => {
        const existingIndex =
          currentItems.findIndex(
            (item) =>
              item.itemKey === itemKey
          );

        // ======================================================
        // EXISTING ITEM
        // ======================================================

        if (existingIndex !== -1) {
          const updatedItems = [
            ...currentItems,
          ];

          const existingItem =
            updatedItems[existingIndex];

          const newQuantity = Math.min(
            existingItem.quantity +
              requestedQuantity,
            stockQuantity
          );

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
            maxQuantity: stockQuantity,
          };

          if (
            newQuantity ===
            existingItem.quantity
          ) {
            result = {
              success: false,
              message: `لا يمكنك إضافة أكثر من ${stockQuantity} من هذا المنتج.`,
            };
          } else if (
            newQuantity <
            existingItem.quantity +
              requestedQuantity
          ) {
            result = {
              success: true,
              message: `تمت إضافة الكمية المتاحة فقط (${newQuantity}).`,
            };
          }

          return updatedItems;
        }

        // ======================================================
        // NEW ITEM
        // ======================================================

        const safeQuantity = Math.min(
          requestedQuantity,
          stockQuantity
        );

        if (
          safeQuantity <
          requestedQuantity
        ) {
          result = {
            success: true,
            message: `تمت إضافة ${safeQuantity} فقط لعدم توفر كمية أكبر.`,
          };
        }

        const pricing =
          product.pricing || {};

        const hasDiscount =
          pricing.discount?.enabled &&
          pricing.salePrice !== null &&
          Number(pricing.salePrice) <
            Number(pricing.regularPrice);

        const currentPrice = hasDiscount
          ? Number(pricing.salePrice)
          : Number(
              pricing.regularPrice || 0
            );

        return [
          ...currentItems,

          {
            itemKey,

            productId: product._id,

            name: product.name,

            slug: product.slug,

            thumbnail:
              product.thumbnail ||
              product.images?.find(
                (image) =>
                  image?.isPrimary
              )?.url ||
              product.images?.[0]?.url ||
              "",

            price: currentPrice,

            regularPrice: Number(
              pricing.regularPrice ||
                currentPrice
            ),

            currency:
              pricing.currency || "MAD",

            quantity: safeQuantity,

            maxQuantity: stockQuantity,

            color: selectedColor,

            size: finalSize,
          },
        ];
      });

      return result;
    },
    []
  );

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================

  const updateQuantity = useCallback(
    (itemKey, quantity) => {
      setCartItems((currentItems) =>
        currentItems
          .map((item) => {
            if (
              item.itemKey !== itemKey
            ) {
              return item;
            }

            const maxQuantity = Number(
              item.maxQuantity || 999999
            );

            const nextQuantity = Math.max(
              0,
              Math.min(
                Number(quantity) || 0,
                maxQuantity
              )
            );

            return {
              ...item,
              quantity: nextQuantity,
            };
          })
          .filter(
            (item) => item.quantity > 0
          )
      );
    },
    []
  );

  // ============================================================
  // INCREASE
  // ============================================================

  const increaseQuantity = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems.map((item) => {
          if (
            item.itemKey !== itemKey
          ) {
            return item;
          }

          const maxQuantity = Number(
            item.maxQuantity || 999999
          );

          if (
            item.quantity >= maxQuantity
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        })
      );
    },
    []
  );

  // ============================================================
  // DECREASE
  // ============================================================

  const decreaseQuantity = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems
          .map((item) => {
            if (
              item.itemKey !== itemKey
            ) {
              return item;
            }

            return {
              ...item,
              quantity:
                item.quantity - 1,
            };
          })
          .filter(
            (item) => item.quantity > 0
          )
      );
    },
    []
  );

  // ============================================================
  // REMOVE
  // ============================================================

  const removeFromCart = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.itemKey !== itemKey
        )
      );
    },
    []
  );

  // ============================================================
  // CLEAR
  // ============================================================

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // ============================================================
  // TOTAL ITEMS
  // ============================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const cartItemsCount =
    cartItems.length;

  const isEmpty =
    cartItems.length === 0;

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = useMemo(
    () => ({
      cartItems,

      cartCount,

      cartItemsCount,

      subtotal,

      isEmpty,

      isCartOpen,

      addToCart,

      updateQuantity,

      increaseQuantity,

      decreaseQuantity,

      removeFromCart,

      clearCart,

      openCart,

      closeCart,

      toggleCart,
    }),
    [
      cartItems,
      cartCount,
      cartItemsCount,
      subtotal,
      isEmpty,
      isCartOpen,
      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}

export default CartContext;
 
/*
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "amaroc_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // ============================================================
  // SAVE CART
  // ============================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  // ============================================================
  // OPEN / CLOSE CART
  // ============================================================

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = useCallback(
    (product, quantity = 1, options = {}) => {
      if (!product?._id) {
        return {
          success: false,
          message: "المنتج غير صالح.",
        };
      }

      const inventory = product.inventory || {};

      const stockQuantity = Number(
        inventory.quantity || 0
      );

      const isOutOfStock =
        inventory.status === "out_of_stock" ||
        stockQuantity <= 0;

      if (isOutOfStock) {
        return {
          success: false,
          message: "هذا المنتج غير متوفر حالياً.",
        };
      }

      const requestedQuantity = Math.max(
        1,
        Number(quantity) || 1
      );

      const color = options.color || null;
      const size = options.size || null;

      const itemKey = [
        product._id,
        color?.value || color?.name || "",
        size?.value || size?.name || "",
      ].join("__");

      let result = {
        success: true,
        message: "تمت إضافة المنتج إلى السلة.",
      };

      setCartItems((currentItems) => {
        const existingIndex = currentItems.findIndex(
          (item) => item.itemKey === itemKey
        );

        if (existingIndex !== -1) {
          const updatedItems = [...currentItems];

          const existingItem =
            updatedItems[existingIndex];

          const newQuantity = Math.min(
            existingItem.quantity + requestedQuantity,
            stockQuantity
          );

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };

          if (
            newQuantity === existingItem.quantity
          ) {
            result = {
              success: false,
              message: `يمكنك إضافة ${stockQuantity} فقط من هذا المنتج.`,
            };
          }

          return updatedItems;
        }

        const safeQuantity = Math.min(
          requestedQuantity,
          stockQuantity
        );

        if (safeQuantity < requestedQuantity) {
          result = {
            success: true,
            message: `تمت إضافة ${safeQuantity} فقط لعدم توفر كمية أكبر.`,
          };
        }

        const pricing = product.pricing || {};

        const hasDiscount =
          pricing.discount?.enabled &&
          pricing.salePrice !== null &&
          Number(pricing.salePrice) <
            Number(pricing.regularPrice);

        const currentPrice = hasDiscount
          ? Number(pricing.salePrice)
          : Number(pricing.regularPrice);

        return [
          ...currentItems,
          {
            itemKey,

            productId: product._id,

            name: product.name,

            slug: product.slug,

            thumbnail:
              product.thumbnail ||
              product.images?.find(
                (image) => image?.isPrimary
              )?.url ||
              product.images?.[0]?.url ||
              "",

            price: currentPrice,

            regularPrice: Number(
              pricing.regularPrice || currentPrice
            ),

            currency:
              pricing.currency || "MAD",

            quantity: safeQuantity,

            maxQuantity: stockQuantity,

            color,

            size,
          },
        ];
      });

      return result;
    },
    []
  );

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================

  const updateQuantity = useCallback(
    (itemKey, quantity) => {
      setCartItems((currentItems) =>
        currentItems
          .map((item) => {
            if (item.itemKey !== itemKey) {
              return item;
            }

            const maxQuantity = Number(
              item.maxQuantity || 999999
            );

            const nextQuantity = Math.max(
              0,
              Math.min(
                Number(quantity) || 0,
                maxQuantity
              )
            );

            return {
              ...item,
              quantity: nextQuantity,
            };
          })
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  const increaseQuantity = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems.map((item) => {
          if (item.itemKey !== itemKey) {
            return item;
          }

          const maxQuantity = Number(
            item.maxQuantity || 999999
          );

          if (item.quantity >= maxQuantity) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        })
      );
    },
    []
  );

  // ============================================================
  // DECREASE QUANTITY
  // ============================================================

  const decreaseQuantity = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems
          .map((item) => {
            if (item.itemKey !== itemKey) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity - 1,
            };
          })
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeFromCart = useCallback(
    (itemKey) => {
      setCartItems((currentItems) =>
        currentItems.filter(
          (item) => item.itemKey !== itemKey
        )
      );
    },
    []
  );

  // ============================================================
  // CLEAR CART
  // ============================================================

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // ============================================================
  // CART TOTALS
  // ============================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const cartItemsCount = cartItems.length;

  const isEmpty = cartItems.length === 0;

  const value = useMemo(
    () => ({
      cartItems,

      cartCount,

      cartItemsCount,

      subtotal,

      isEmpty,

      isCartOpen,

      addToCart,

      updateQuantity,

      increaseQuantity,

      decreaseQuantity,

      removeFromCart,

      clearCart,

      openCart,

      closeCart,

      toggleCart,
    }),
    [
      cartItems,
      cartCount,
      cartItemsCount,
      subtotal,
      isEmpty,
      isCartOpen,
      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}

export default CartContext;
 
*/