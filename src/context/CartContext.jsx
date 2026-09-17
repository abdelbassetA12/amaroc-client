 
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

      const variants = Array.isArray(product?.variants)
        ? product.variants
        : [];

      // ========================================================
      // PRODUCT TYPE
      // ========================================================

      const isPerfume =
        product?.category?.slug === "perfumes" ||
        product?.perfume;

      // ========================================================
      // SELECTED OPTIONS
      // ========================================================

      const selectedColor = options?.color || null;

      const selectedSize = options?.size || null;

      const selectedVolume =
        options?.volume !== undefined &&
        options?.volume !== null &&
        options?.volume !== ""
          ? Number(options.volume)
          : null;

      const selectedVolumeUnit =
        options?.volumeUnit || "ml";

      // ========================================================
      // PERFUME
      // ========================================================

      if (isPerfume) {
        const perfumeVariants = variants.filter(
          (variant) =>
            variant?.volume !== undefined &&
            variant?.volume !== null
        );

        // --------------------------------------------------------
        // AVAILABLE VOLUMES
        // --------------------------------------------------------

        const availableVolumes = [
          ...new Map(
            perfumeVariants
              .map((variant) => {
                const volume = Number(variant?.volume);

                if (!Number.isFinite(volume)) {
                  return null;
                }

                const unit =
                  variant?.volumeUnit || "ml";

                return [
                  `${volume}-${unit}`,
                  {
                    volume,
                    volumeUnit: unit,
                  },
                ];
              })
              .filter(Boolean)
          ).values(),
        ].sort((a, b) => a.volume - b.volume);

        // --------------------------------------------------------
        // VALIDATE VOLUME
        // --------------------------------------------------------

        const requiresVolume =
          availableVolumes.length > 1;

        if (requiresVolume && selectedVolume === null) {
          return {
            success: false,
            message: "يرجى اختيار الحجم.",
            requiresOptions: true,
          };
        }

        // --------------------------------------------------------
        // AUTO SELECT SINGLE VOLUME
        // --------------------------------------------------------

        const finalVolume =
          selectedVolume !== null
            ? selectedVolume
            : availableVolumes.length === 1
            ? availableVolumes[0].volume
            : null;

        const finalVolumeUnit =
          selectedVolumeUnit ||
          availableVolumes.find(
            (item) => item.volume === finalVolume
          )?.volumeUnit ||
          "ml";

        // --------------------------------------------------------
        // FIND EXACT PERFUME VARIANT
        // --------------------------------------------------------

        const selectedVariant = variants.find(
          (variant) => {
            if (
              variant?.volume === undefined ||
              variant?.volume === null
            ) {
              return false;
            }

            const variantVolume =
              Number(variant.volume);

            const variantUnit =
              variant?.volumeUnit || "ml";

            return (
              variantVolume === finalVolume &&
              variantUnit === finalVolumeUnit
            );
          }
        );

        if (
          perfumeVariants.length > 0 &&
          !selectedVariant
        ) {
          return {
            success: false,
            message: "الحجم المختار غير متوفر.",
            requiresOptions: true,
          };
        }

        // --------------------------------------------------------
        // INVENTORY
        // --------------------------------------------------------

        const inventory =
          product?.inventory || {};

        const productStock = Number(
          inventory?.quantity || 0
        );

        const variantStock = selectedVariant
          ? Number(
              selectedVariant?.quantity || 0
            )
          : productStock;

        const stockQuantity =
          perfumeVariants.length > 0
            ? variantStock
            : productStock;

        const inventoryStatus =
          perfumeVariants.length > 0
            ? stockQuantity <= 0
              ? "out_of_stock"
              : stockQuantity <=
                Number(
                  inventory?.lowStockThreshold || 0
                )
              ? "low_stock"
              : "in_stock"
            : inventory?.status;

        const isOutOfStock =
          inventoryStatus === "out_of_stock" ||
          stockQuantity <= 0;

        if (isOutOfStock) {
          return {
            success: false,
            message: "هذا الحجم غير متوفر حالياً.",
          };
        }

        // --------------------------------------------------------
        // QUANTITY
        // --------------------------------------------------------

        const requestedQuantity = Math.max(
          1,
          Number(quantity) || 1
        );

        // --------------------------------------------------------
        // PRICE
        // --------------------------------------------------------

        const pricing =
          product?.pricing || {};

        const regularPrice = Number(
          pricing?.regularPrice || 0
        );

        const salePrice =
          pricing?.salePrice !== null &&
          pricing?.salePrice !== undefined
            ? Number(pricing.salePrice)
            : null;

        const hasDiscount =
          pricing?.discount?.enabled === true &&
          salePrice !== null &&
          salePrice < regularPrice;

        const productCurrentPrice =
          hasDiscount
            ? salePrice
            : regularPrice;

        const variantPrice =
          selectedVariant &&
          selectedVariant?.price !== undefined
            ? Number(selectedVariant.price)
            : null;

        // Variant price takes priority.
        const currentPrice =
          variantPrice !== null
            ? variantPrice
            : productCurrentPrice;

        // --------------------------------------------------------
        // IMAGE
        // --------------------------------------------------------

        const thumbnail =
          selectedVariant?.image ||
          product?.thumbnail ||
          product?.images?.find(
            (image) => image?.isPrimary
          )?.url ||
          product?.images?.[0]?.url ||
          "";

        // --------------------------------------------------------
        // UNIQUE CART ITEM
        // --------------------------------------------------------

        const itemKey = [
          product?._id,
          selectedVariant?.id || "",
          `volume:${finalVolume ?? ""}`,
          `unit:${finalVolumeUnit || ""}`,
        ].join("__");

        let result = {
          success: true,
          message: "تمت إضافة المنتج إلى السلة.",
        };

        // --------------------------------------------------------
        // UPDATE CART
        // --------------------------------------------------------

        setCartItems((currentItems) => {
          const existingIndex =
            currentItems.findIndex(
              (item) =>
                item?.itemKey === itemKey
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

            const maxQuantity = Number(
              existingItem?.maxQuantity ||
                stockQuantity
            );

            const newQuantity = Math.min(
              Number(
                existingItem?.quantity || 0
              ) + requestedQuantity,
              maxQuantity
            );

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
              maxQuantity,
            };

            if (
              newQuantity ===
              Number(
                existingItem?.quantity || 0
              )
            ) {
              result = {
                success: false,
                message: `لا يمكنك إضافة أكثر من ${maxQuantity} من هذا الخيار.`,
              };
            } else if (
              newQuantity <
              Number(
                existingItem?.quantity || 0
              ) + requestedQuantity
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

          return [
            ...currentItems,
            {
              itemKey,
              productId: product?._id,

              variantId:
                selectedVariant?.id || null,

              sku:
                selectedVariant?.sku ||
                product?.sku ||
                null,

              name: product?.name,

              slug: product?.slug,

              brand: product?.brand,

              thumbnail,

              price: currentPrice,

              regularPrice,

              currency:
                pricing?.currency || "MAD",

              quantity: safeQuantity,

              maxQuantity: stockQuantity,

              // Normal product options
              color: null,
              size: null,

              // Perfume options
              volume: finalVolume,
              volumeUnit: finalVolumeUnit,

              variant:
                selectedVariant || null,
            },
          ];
        });

        return result;
      }

      // ============================================================
      // NORMAL PRODUCTS
      // ============================================================

      // ========================================================
      // AVAILABLE COLORS
      // ========================================================

      const availableColors = [
        ...new Map(
          variants
            .filter(
              (variant) => variant?.color
            )
            .map((variant) => [
              variant.color,
              {
                name: variant.color,
                value:
                  variant.colorValue ||
                  "#111111",
              },
            ])
        ).values(),
      ];

      // ========================================================
      // AVAILABLE SIZES
      // ========================================================

      const availableSizes = [
        ...new Map(
          variants
            .filter(
              (variant) => variant?.size
            )
            .map((variant) => [
              variant?.sizeValue ||
                variant?.size,
              {
                name: variant?.size,
                value:
                  variant?.sizeValue ||
                  variant?.size,
              },
            ])
        ).values(),
      ];

      const requiresColor =
        availableColors.length > 0;

      const requiresSize =
        availableSizes.length > 0 &&
        !(
          availableSizes.length === 1 &&
          availableSizes[0]?.value ===
            "ONE_SIZE"
        );

      // ========================================================
      // VALIDATE COLOR
      // ========================================================

      if (
        requiresColor &&
        !selectedColor
      ) {
        return {
          success: false,
          message: "يرجى اختيار اللون.",
          requiresOptions: true,
        };
      }

      // ========================================================
      // VALIDATE SIZE
      // ========================================================

      if (
        requiresSize &&
        !selectedSize
      ) {
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
      // FIND EXACT VARIANT
      // ========================================================

      const selectedVariant = variants.find(
        (variant) => {
          const colorMatches =
            !selectedColor ||
            variant?.color ===
              selectedColor?.name;

          const sizeMatches =
            !finalSize ||
            variant?.sizeValue ===
              finalSize?.value ||
            variant?.size ===
              finalSize?.name;

          return (
            colorMatches &&
            sizeMatches
          );
        }
      );

      if (
        variants.length > 0 &&
        !selectedVariant
      ) {
        return {
          success: false,
          message:
            "التركيبة المختارة من اللون والمقاس غير متوفرة.",
          requiresOptions: true,
        };
      }

      // ========================================================
      // INVENTORY
      // ========================================================

      const inventory =
        product?.inventory || {};

      const productStock = Number(
        inventory?.quantity || 0
      );

      const variantStock =
        selectedVariant
          ? Number(
              selectedVariant?.quantity ||
                0
            )
          : productStock;

      const stockQuantity =
        variants.length > 0
          ? variantStock
          : productStock;

      const inventoryStatus =
        variants.length > 0
          ? stockQuantity <= 0
            ? "out_of_stock"
            : stockQuantity <=
              Number(
                inventory?.lowStockThreshold ||
                  0
              )
            ? "low_stock"
            : "in_stock"
          : inventory?.status;

      const isOutOfStock =
        inventoryStatus ===
          "out_of_stock" ||
        stockQuantity <= 0;

      if (isOutOfStock) {
        return {
          success: false,
          message:
            "هذا الخيار غير متوفر حالياً.",
        };
      }

      // ========================================================
      // QUANTITY
      // ========================================================

      const requestedQuantity =
        Math.max(
          1,
          Number(quantity) || 1
        );

      // ========================================================
      // PRICE
      // ========================================================

      const pricing =
        product?.pricing || {};

      const regularPrice = Number(
        pricing?.regularPrice || 0
      );

      const salePrice =
        pricing?.salePrice !== null &&
        pricing?.salePrice !== undefined
          ? Number(pricing.salePrice)
          : null;

      const hasDiscount =
        pricing?.discount?.enabled ===
          true &&
        salePrice !== null &&
        salePrice < regularPrice;

      const productCurrentPrice =
        hasDiscount
          ? salePrice
          : regularPrice;

      const variantPrice =
        selectedVariant &&
        selectedVariant?.price !==
          undefined
          ? Number(
              selectedVariant.price
            )
          : null;

      const currentPrice =
        variantPrice !== null
          ? variantPrice
          : productCurrentPrice;

      // ========================================================
      // IMAGE
      // ========================================================

      const thumbnail =
        selectedVariant?.image ||
        product?.thumbnail ||
        product?.images?.find(
          (image) => image?.isPrimary
        )?.url ||
        product?.images?.[0]?.url ||
        "";

      // ========================================================
      // UNIQUE CART ITEM
      // ========================================================

      const itemKey = [
        product?._id,
        selectedVariant?.id || "",
        selectedColor?.value ||
          selectedColor?.name ||
          "",
        finalSize?.value ||
          finalSize?.name ||
          "",
      ].join("__");

      let result = {
        success: true,
        message:
          "تمت إضافة المنتج إلى السلة.",
      };

      // ========================================================
      // UPDATE CART
      // ========================================================

      setCartItems((currentItems) => {
        const existingIndex =
          currentItems.findIndex(
            (item) =>
              item?.itemKey === itemKey
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

          const maxQuantity = Number(
            existingItem?.maxQuantity ||
              stockQuantity
          );

          const newQuantity = Math.min(
            Number(
              existingItem?.quantity || 0
            ) + requestedQuantity,
            maxQuantity
          );

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
            maxQuantity,
          };

          if (
            newQuantity ===
            Number(
              existingItem?.quantity || 0
            )
          ) {
            result = {
              success: false,
              message: `لا يمكنك إضافة أكثر من ${maxQuantity} من هذا الخيار.`,
            };
          } else if (
            newQuantity <
            Number(
              existingItem?.quantity || 0
            ) + requestedQuantity
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

        return [
          ...currentItems,
          {
            itemKey,

            productId: product?._id,

            variantId:
              selectedVariant?.id || null,

            sku:
              selectedVariant?.sku ||
              product?.sku ||
              null,

            name: product?.name,

            slug: product?.slug,

            brand: product?.brand,

            thumbnail,

            price: currentPrice,

            regularPrice,

            currency:
              pricing?.currency || "MAD",

            quantity: safeQuantity,

            maxQuantity: stockQuantity,

            color: selectedColor,

            size: finalSize,

            // Perfume fields are null
            // for normal products.
            volume: null,
            volumeUnit: null,

            variant:
              selectedVariant || null,
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
              item?.itemKey !== itemKey
            ) {
              return item;
            }

            const maxQuantity = Number(
              item?.maxQuantity || 999999
            );

            const nextQuantity =
              Math.max(
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
            (item) =>
              item?.quantity > 0
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
            item?.itemKey !== itemKey
          ) {
            return item;
          }

          const maxQuantity = Number(
            item?.maxQuantity || 999999
          );

          if (
            Number(
              item?.quantity || 0
            ) >= maxQuantity
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              Number(
                item?.quantity || 0
              ) + 1,
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
              item?.itemKey !== itemKey
            ) {
              return item;
            }

            return {
              ...item,
              quantity:
                Number(
                  item?.quantity || 0
                ) - 1,
            };
          })
          .filter(
            (item) =>
              item?.quantity > 0
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
            item?.itemKey !== itemKey
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
        Number(
          item?.quantity || 0
        ),
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
        Number(item?.price || 0) *
          Number(
            item?.quantity || 0
          ),
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
      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

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

      const variants = Array.isArray(
        product.variants
      )
        ? product.variants
        : [];

      const selectedColor =
        options.color || null;

      const selectedSize =
        options.size || null;

      // ========================================================
      // AVAILABLE COLORS
      // ========================================================

      const availableColors = [
        ...new Map(
          variants
            .filter((variant) => variant?.color)
            .map((variant) => [
              variant.color,
              {
                name: variant.color,
                value:
                  variant.colorValue || "#111111",
              },
            ])
        ).values(),
      ];

      // ========================================================
      // AVAILABLE SIZES
      // ========================================================

      const availableSizes = [
        ...new Map(
          variants
            .filter((variant) => variant?.size)
            .map((variant) => [
              variant.sizeValue ||
                variant.size,
              {
                name: variant.size,
                value:
                  variant.sizeValue ||
                  variant.size,
              },
            ])
        ).values(),
      ];

      const requiresColor =
        availableColors.length > 0;

      const requiresSize =
        availableSizes.length > 0 &&
        !(
          availableSizes.length === 1 &&
          availableSizes[0]?.value ===
            "ONE_SIZE"
        );

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
      // FIND EXACT VARIANT
      // ========================================================

      const selectedVariant = variants.find(
        (variant) => {
          const colorMatches =
            !selectedColor ||
            variant.color ===
              selectedColor.name;

          const sizeMatches =
            !finalSize ||
            variant.sizeValue ===
              finalSize.value ||
            variant.size ===
              finalSize.name;

          return colorMatches && sizeMatches;
        }
      );

      if (variants.length > 0 && !selectedVariant) {
        return {
          success: false,
          message:
            "التركيبة المختارة من اللون والمقاس غير متوفرة.",
          requiresOptions: true,
        };
      }

      // ========================================================
      // INVENTORY
      // ========================================================

      const inventory = product.inventory || {};

      const productStock = Number(
        inventory.quantity || 0
      );

      const variantStock =
        selectedVariant
          ? Number(
              selectedVariant.quantity || 0
            )
          : productStock;

      const stockQuantity =
        variants.length > 0
          ? variantStock
          : productStock;

      const inventoryStatus =
        variants.length > 0
          ? stockQuantity <= 0
            ? "out_of_stock"
            : stockQuantity <=
              Number(
                inventory.lowStockThreshold || 0
              )
            ? "low_stock"
            : "in_stock"
          : inventory.status;

      const isOutOfStock =
        inventoryStatus ===
          "out_of_stock" ||
        stockQuantity <= 0;

      if (isOutOfStock) {
        return {
          success: false,
          message:
            "هذا الخيار غير متوفر حالياً.",
        };
      }

      // ========================================================
      // QUANTITY
      // ========================================================

      const requestedQuantity = Math.max(
        1,
        Number(quantity) || 1
      );

      // ========================================================
      // PRICE
      // ========================================================

      const pricing =
        product.pricing || {};

      const regularPrice = Number(
        pricing.regularPrice || 0
      );

      const salePrice =
        pricing.salePrice !== null &&
        pricing.salePrice !== undefined
          ? Number(pricing.salePrice)
          : null;

      const hasDiscount =
        pricing.discount?.enabled === true &&
        salePrice !== null &&
        salePrice < regularPrice;

      const productCurrentPrice =
        hasDiscount
          ? salePrice
          : regularPrice;

      const variantPrice =
        selectedVariant &&
        selectedVariant.price !== undefined
          ? Number(
              selectedVariant.price
            )
          : null;

    
        //Variant price takes priority when it
        //exists. Otherwise product pricing is used.
      
      const currentPrice =
        variantPrice !== null
          ? variantPrice
          : productCurrentPrice;

      // ========================================================
      // IMAGE
      // ========================================================

      const thumbnail =
        selectedVariant?.image ||
        product.thumbnail ||
        product.images?.find(
          (image) => image?.isPrimary
        )?.url ||
        product.images?.[0]?.url ||
        "";

      // ========================================================
      // UNIQUE CART ITEM
      // ========================================================

      const itemKey = [
        product._id,
        selectedVariant?.id || "",
        selectedColor?.value ||
          selectedColor?.name ||
          "",
        finalSize?.value ||
          finalSize?.name ||
          "",
      ].join("__");

      let result = {
        success: true,
        message:
          "تمت إضافة المنتج إلى السلة.",
      };

      // ========================================================
      // UPDATE CART
      // ========================================================

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

          const maxQuantity = Number(
            existingItem.maxQuantity ||
              stockQuantity
          );

          const newQuantity = Math.min(
            Number(existingItem.quantity || 0) +
              requestedQuantity,
            maxQuantity
          );

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
            maxQuantity,
          };

          if (
            newQuantity ===
            Number(existingItem.quantity || 0)
          ) {
            result = {
              success: false,
              message: `لا يمكنك إضافة أكثر من ${maxQuantity} من هذا الخيار.`,
            };
          } else if (
            newQuantity <
            Number(existingItem.quantity || 0) +
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

        return [
          ...currentItems,

          {
            itemKey,

            productId: product._id,

            variantId:
              selectedVariant?.id || null,

            sku:
              selectedVariant?.sku ||
              product.sku ||
              null,

            name: product.name,

            slug: product.slug,

            brand: product.brand,

            thumbnail,

            price: currentPrice,

            regularPrice,

            currency:
              pricing.currency || "MAD",

            quantity: safeQuantity,

            maxQuantity: stockQuantity,

            color: selectedColor,

            size: finalSize,

            variant:
              selectedVariant || null,
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
            Number(item.quantity || 0) >=
            maxQuantity
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              Number(item.quantity || 0) + 1,
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
                Number(item.quantity || 0) - 1,
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
*/
















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
*/

 