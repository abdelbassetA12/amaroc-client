const products = [
  // ============================================================
  // 1. حقيبة خصر سبورت
  // NEW + SALE + BESTSELLER + FEATURED
  // ============================================================
  {
    _id: "product-001",

    // =========================
    // BASIC INFORMATION
    // =========================
    name: "حقيبة خصر سبورت",
    slug: "حقيبة-خصر-سبورت",

    description:
      "حقيبة خصر رياضية عملية وخفيفة، مصممة للاستخدام اليومي والرياضة والتنقل. توفر مساحة مناسبة للهاتف والمحفظة والمفاتيح وغيرها من الأغراض الشخصية مع تصميم مريح وأنيق.",

    shortDescription:
      "حقيبة خصر رياضية عملية وخفيفة للاستخدام اليومي.",

    brand: "AMAROC",

    category: {
      id: "category-waist-bags",
      name: "حقائب الخصر",
      slug: "waist-bags"
    },

    subcategory: {
      id: "subcategory-sport-waist-bags",
      name: "حقائب رياضية",
      slug: "sport-waist-bags"
    },


    // =========================
    // MEDIA
    // =========================
    images: [
      {
        url: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة خصر سبورت",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة خصر سبورت - الجانب"
      },
      {
        url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة خصر سبورت - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=700&q=85",


    // =========================
    // PRICING
    // =========================
    pricing: {
      regularPrice: 199,

      salePrice: 159,

      currency: "MAD",

      discount: {
        enabled: true,
        type: "percentage",
        value: 20,

        startDate: "2026-08-15T00:00:00.000Z",
        endDate: "2026-09-15T23:59:59.000Z"
      }
    },


    // =========================
    // INVENTORY
    // =========================
    inventory: {
      quantity: 25,

      trackQuantity: true,

      lowStockThreshold: 5,

      status: "in_stock"
    },


    // =========================
    // OPTIONS / VARIANTS
    // =========================
    variants: {
      colors: [
        {
          name: "أسود",
          value: "#000000",
          image:
            "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "بني",
          value: "#6B4226",
          image:
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=85"
        }
      ],

      sizes: [
        {
          name: "صغير",
          value: "S"
        },
        {
          name: "متوسط",
          value: "M"
        },
        {
          name: "كبير",
          value: "L"
        }
      ],

      dimensions: {
        length: 30,
        width: 12,
        height: 8,
        unit: "cm"
      },

      weight: {
        value: 350,
        unit: "g"
      }
    },


    // =========================
    // PRODUCT STATUS
    // =========================
    status: {
      active: true,

      published: true,

      featured: true,

      bestseller: true,

      newProduct: true,

      archived: false
    },


    // =========================
    // BADGE
    // =========================
    badge: {
      enabled: true,

      type: "new",

      text: "جديد"
    },


    // =========================
    // RATINGS
    // =========================
    rating: {
      average: 4.8,

      count: 124
    },


    // =========================
    // SALES
    // =========================
    sales: {
      totalSold: 342,

      views: 1520
    },


    // =========================
    // PRODUCT DETAILS
    // =========================
    details: {
      material: "بوليستر",

      gender: "unisex",

      style: "sport",

      season: "all",

      countryOfOrigin: "China",

      warranty: null
    },


    // =========================
    // SHIPPING
    // =========================
    shipping: {
      available: true,

      freeShipping: false,

      shippingPrice: 25,

      estimatedDelivery: "2-4 أيام"
    },


    // =========================
    // SEO
    // =========================
    seo: {
      title: "حقيبة خصر سبورت | AMAROC",

      description:
        "حقيبة خصر رياضية عملية وأنيقة للاستخدام اليومي والرياضة.",

      keywords: [
        "حقيبة خصر",
        "حقيبة رياضية",
        "حقائب",
        "حقيبة خصر سبورت"
      ]
    },


    // =========================
    // TIMESTAMPS
    // =========================
    createdAt: "2026-08-10T10:00:00.000Z",

    updatedAt: "2026-08-22T15:30:00.000Z"
  },


  // ============================================================
  // 2. حقيبة ظهر كلاسيك
  // FEATURED + BESTSELLER
  // NO SALE
  // ============================================================
  {
    _id: "product-002",

    // =========================
    // BASIC INFORMATION
    // =========================
    name: "حقيبة ظهر كلاسيك",
    slug: "حقيبة-ظهر-كلاسيك",

    description:
      "حقيبة ظهر كلاسيكية بتصميم عملي وأنيق، مناسبة للعمل والدراسة والتنقل اليومي. توفر مساحة داخلية واسعة لتنظيم الأغراض الشخصية واللوازم اليومية.",

    shortDescription:
      "حقيبة ظهر كلاسيكية واسعة وأنيقة للاستخدام اليومي.",

    brand: "AMAROC",

    category: {
      id: "category-backpacks",
      name: "حقائب الظهر",
      slug: "backpacks"
    },

    subcategory: {
      id: "subcategory-classic-backpacks",
      name: "حقائب ظهر كلاسيكية",
      slug: "classic-backpacks"
    },


    // =========================
    // MEDIA
    // =========================
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة ظهر كلاسيك",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة ظهر كلاسيك - الخلف"
      },
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة ظهر كلاسيك - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",


    // =========================
    // PRICING
    // =========================
    pricing: {
      regularPrice: 349,

      salePrice: null,

      currency: "MAD",

      discount: {
        enabled: false,
        type: "percentage",
        value: 0,

        startDate: null,
        endDate: null
      }
    },


    // =========================
    // INVENTORY
    // =========================
    inventory: {
      quantity: 48,

      trackQuantity: true,

      lowStockThreshold: 8,

      status: "in_stock"
    },


    // =========================
    // OPTIONS / VARIANTS
    // =========================
    variants: {
      colors: [
        {
          name: "أسود",
          value: "#111111",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "رمادي",
          value: "#777777",
          image:
            "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "بيج",
          value: "#D2B48C",
          image:
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=85"
        }
      ],

      sizes: [
        {
          name: "متوسط",
          value: "M"
        },
        {
          name: "كبير",
          value: "L"
        }
      ],

      dimensions: {
        length: 45,
        width: 30,
        height: 15,
        unit: "cm"
      },

      weight: {
        value: 720,
        unit: "g"
      }
    },


    // =========================
    // PRODUCT STATUS
    // =========================
    status: {
      active: true,

      published: true,

      featured: true,

      bestseller: true,

      newProduct: false,

      archived: false
    },


    // =========================
    // BADGE
    // =========================
    badge: {
      enabled: true,

      type: "bestseller",

      text: "الأكثر مبيعاً"
    },


    // =========================
    // RATINGS
    // =========================
    rating: {
      average: 4.7,

      count: 86
    },


    // =========================
    // SALES
    // =========================
    sales: {
      totalSold: 287,

      views: 2180
    },


    // =========================
    // PRODUCT DETAILS
    // =========================
    details: {
      material: "بوليستر مقاوم للماء",

      gender: "unisex",

      style: "classic",

      season: "all",

      countryOfOrigin: "China",

      warranty: "6 أشهر"
    },


    // =========================
    // SHIPPING
    // =========================
    shipping: {
      available: true,

      freeShipping: true,

      shippingPrice: 0,

      estimatedDelivery: "2-4 أيام"
    },


    // =========================
    // SEO
    // =========================
    seo: {
      title: "حقيبة ظهر كلاسيك | AMAROC",

      description:
        "حقيبة ظهر كلاسيكية واسعة وأنيقة مناسبة للعمل والدراسة والتنقل.",

      keywords: [
        "حقيبة ظهر",
        "حقيبة ظهر كلاسيك",
        "حقائب",
        "حقيبة مدرسية"
      ]
    },


    // =========================
    // TIMESTAMPS
    // =========================
    createdAt: "2026-07-28T09:30:00.000Z",

    updatedAt: "2026-08-21T12:20:00.000Z"
  },


  // ============================================================
  // 3. حقيبة كروس أنيقة
  // SALE + LOW STOCK
  // ============================================================
  {
    _id: "product-003",

    // =========================
    // BASIC INFORMATION
    // =========================
    name: "حقيبة كروس أنيقة",
    slug: "حقيبة-كروس-انيقة",

    description:
      "حقيبة كروس أنيقة وعملية بتصميم عصري، مناسبة للخروج والمناسبات والاستخدام اليومي. حجمها المدمج يسمح بحمل الأساسيات بسهولة.",

    shortDescription:
      "حقيبة كروس عصرية وأنيقة للاستخدام اليومي.",

    brand: "AMAROC",

    category: {
      id: "category-crossbody",
      name: "حقائب كروس",
      slug: "crossbody-bags"
    },

    subcategory: {
      id: "subcategory-elegant-crossbody",
      name: "حقائب كروس أنيقة",
      slug: "elegant-crossbody"
    },


    // =========================
    // MEDIA
    // =========================
    images: [
      {
        url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة كروس أنيقة",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة كروس أنيقة - الجانب"
      },
      {
        url: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة كروس أنيقة - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85",


    // =========================
    // PRICING
    // =========================
    pricing: {
      regularPrice: 199,

      salePrice: 159,

      currency: "MAD",

      discount: {
        enabled: true,

        type: "percentage",

        value: 20,

        startDate: "2026-08-01T00:00:00.000Z",

        endDate: "2026-08-31T23:59:59.000Z"
      }
    },


    // =========================
    // INVENTORY
    // =========================
    inventory: {
      quantity: 4,

      trackQuantity: true,

      lowStockThreshold: 5,

      status: "low_stock"
    },


    // =========================
    // OPTIONS / VARIANTS
    // =========================
    variants: {
      colors: [
        {
          name: "أسود",
          value: "#111111",
          image:
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "بني",
          value: "#704214",
          image:
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "أبيض",
          value: "#F5F5F5",
          image:
            "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=700&q=85"
        }
      ],

      sizes: [
        {
          name: "صغير",
          value: "S"
        },
        {
          name: "متوسط",
          value: "M"
        }
      ],

      dimensions: {
        length: 24,
        width: 18,
        height: 7,
        unit: "cm"
      },

      weight: {
        value: 420,
        unit: "g"
      }
    },


    // =========================
    // PRODUCT STATUS
    // =========================
    status: {
      active: true,

      published: true,

      featured: false,

      bestseller: false,

      newProduct: false,

      archived: false
    },


    // =========================
    // BADGE
    // =========================
    badge: {
      enabled: true,

      type: "sale",

      text: "-20%"
    },


    // =========================
    // RATINGS
    // =========================
    rating: {
      average: 4.5,

      count: 58
    },


    // =========================
    // SALES
    // =========================
    sales: {
      totalSold: 136,

      views: 980
    },


    // =========================
    // PRODUCT DETAILS
    // =========================
    details: {
      material: "جلد صناعي",

      gender: "women",

      style: "elegant",

      season: "all",

      countryOfOrigin: "China",

      warranty: null
    },


    // =========================
    // SHIPPING
    // =========================
    shipping: {
      available: true,

      freeShipping: false,

      shippingPrice: 25,

      estimatedDelivery: "2-4 أيام"
    },


    // =========================
    // SEO
    // =========================
    seo: {
      title: "حقيبة كروس أنيقة - خصم 20% | AMAROC",

      description:
        "حقيبة كروس أنيقة وعصرية مع خصم 20% لفترة محدودة.",

      keywords: [
        "حقيبة كروس",
        "حقيبة نسائية",
        "حقيبة أنيقة",
        "حقيبة جلدية"
      ]
    },


    // =========================
    // TIMESTAMPS
    // =========================
    createdAt: "2026-07-15T14:00:00.000Z",

    updatedAt: "2026-08-22T10:15:00.000Z"
  },


  // ============================================================
  // 4. محفظة جلدية جديدة
  // ACTIVE + PUBLISHED + LOW STOCK
  // NO BADGE
  // ============================================================
  {
    _id: "product-004",

    // =========================
    // BASIC INFORMATION
    // =========================
    name: "محفظة جلدية جديدة",
    slug: "محفظة-جلدية-جديدة",

    description:
      "محفظة جلدية عملية بتصميم بسيط وأنيق، تحتوي على مساحات متعددة للبطاقات والنقود والأوراق الشخصية، وتناسب الاستخدام اليومي.",

    shortDescription:
      "محفظة جلدية أنيقة وعملية للاستخدام اليومي.",

    brand: "AMAROC",

    category: {
      id: "category-wallets",
      name: "المحافظ",
      slug: "wallets"
    },

    subcategory: {
      id: "subcategory-leather-wallets",
      name: "محافظ جلدية",
      slug: "leather-wallets"
    },


    // =========================
    // MEDIA
    // =========================
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=90",
        alt: "محفظة جلدية جديدة",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=90",
        alt: "محفظة جلدية - الجانب"
      },
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=90",
        alt: "محفظة جلدية - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85",


    // =========================
    // PRICING
    // =========================
    pricing: {
      regularPrice: 149,

      salePrice: null,

      currency: "MAD",

      discount: {
        enabled: false,

        type: "percentage",

        value: 0,

        startDate: null,

        endDate: null
      }
    },


    // =========================
    // INVENTORY
    // =========================
    inventory: {
      quantity: 3,

      trackQuantity: true,

      lowStockThreshold: 5,

      status: "low_stock"
    },


    // =========================
    // OPTIONS / VARIANTS
    // =========================
    variants: {
      colors: [
        {
          name: "بني",
          value: "#6B4226",
          image:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "أسود",
          value: "#111111",
          image:
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"
        }
      ],

      sizes: [
        {
          name: "موحد",
          value: "ONE_SIZE"
        }
      ],

      dimensions: {
        length: 11,
        width: 9,
        height: 2,
        unit: "cm"
      },

      weight: {
        value: 180,
        unit: "g"
      }
    },


    // =========================
    // PRODUCT STATUS
    // =========================
    status: {
      active: true,

      published: true,

      featured: false,

      bestseller: false,

      newProduct: true,

      archived: false
    },


    // =========================
    // BADGE
    // =========================
    badge: {
      enabled: false,

      type: null,

      text: null
    },


    // =========================
    // RATINGS
    // =========================
    rating: {
      average: 4.6,

      count: 92
    },


    // =========================
    // SALES
    // =========================
    sales: {
      totalSold: 74,

      views: 730
    },


    // =========================
    // PRODUCT DETAILS
    // =========================
    details: {
      material: "جلد صناعي فاخر",

      gender: "unisex",

      style: "classic",

      season: "all",

      countryOfOrigin: "Morocco",

      warranty: "3 أشهر"
    },


    // =========================
    // SHIPPING
    // =========================
    shipping: {
      available: true,

      freeShipping: false,

      shippingPrice: 20,

      estimatedDelivery: "2-4 أيام"
    },


    // =========================
    // SEO
    // =========================
    seo: {
      title: "محفظة جلدية جديدة | AMAROC",

      description:
        "محفظة جلدية أنيقة وعملية مع تصميم مدمج ومساحات متعددة.",

      keywords: [
        "محفظة جلدية",
        "محفظة",
        "محافظ رجالية",
        "محافظ نسائية"
      ]
    },


    // =========================
    // TIMESTAMPS
    // =========================
    createdAt: "2026-08-18T11:30:00.000Z",

    updatedAt: "2026-08-22T09:45:00.000Z"
  },


  // ============================================================
  // 5. نظارات شمسية
  // OUT OF STOCK
  // ACTIVE + PUBLISHED
  // ============================================================
  {
    _id: "product-005",

    // =========================
    // BASIC INFORMATION
    // =========================
    name: "نظارات شمسية",
    slug: "نظارات-شمسية",

    description:
      "نظارات شمسية بتصميم عصري وأنيق، مناسبة للاستخدام اليومي والخروج والسفر، مع إطار خفيف وتصميم مريح.",

    shortDescription:
      "نظارات شمسية عصرية وخفيفة للاستخدام اليومي.",

    brand: "AMAROC",

    category: {
      id: "category-accessories",
      name: "الإكسسوارات",
      slug: "accessories"
    },

    subcategory: {
      id: "subcategory-sunglasses",
      name: "نظارات شمسية",
      slug: "sunglasses"
    },


    // =========================
    // MEDIA
    // =========================
    images: [
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=90",
        alt: "نظارات شمسية",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=90",
        alt: "نظارات شمسية - الجانب"
      },
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=90",
        alt: "نظارات شمسية - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",


    // =========================
    // PRICING
    // =========================
    pricing: {
      regularPrice: 129,

      salePrice: null,

      currency: "MAD",

      discount: {
        enabled: false,

        type: "percentage",

        value: 0,

        startDate: null,

        endDate: null
      }
    },


    // =========================
    // INVENTORY
    // =========================
    inventory: {
      quantity: 0,

      trackQuantity: true,

      lowStockThreshold: 5,

      status: "out_of_stock"
    },


    // =========================
    // OPTIONS / VARIANTS
    // =========================
    variants: {
      colors: [
        {
          name: "أسود",
          value: "#111111",
          image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
        },
        {
          name: "بني",
          value: "#704214",
          image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
        }
      ],

      sizes: [
        {
          name: "موحد",
          value: "ONE_SIZE"
        }
      ],

      dimensions: {
        length: 15,
        width: 14,
        height: 5,
        unit: "cm"
      },

      weight: {
        value: 32,
        unit: "g"
      }
    },


    // =========================
    // PRODUCT STATUS
    // =========================
    status: {
      active: true,

      published: true,

      featured: false,

      bestseller: false,

      newProduct: false,

      archived: false
    },


    // =========================
    // BADGE
    // =========================
    badge: {
      enabled: true,

      type: "out_of_stock",

      text: "نفد المخزون"
    },


    // =========================
    // RATINGS
    // =========================
    rating: {
      average: 4.3,

      count: 64
    },


    // =========================
    // SALES
    // =========================
    sales: {
      totalSold: 51,

      views: 860
    },


    // =========================
    // PRODUCT DETAILS
    // =========================
    details: {
      material: "أسيتات",

      gender: "unisex",

      style: "casual",

      season: "summer",

      countryOfOrigin: "China",

      warranty: "3 أشهر"
    },


    // =========================
    // SHIPPING
    // =========================
    shipping: {
      available: false,

      freeShipping: false,

      shippingPrice: 0,

      estimatedDelivery: null
    },


    // =========================
    // SEO
    // =========================
    seo: {
      title: "نظارات شمسية عصرية | AMAROC",

      description:
        "نظارات شمسية عصرية وخفيفة مناسبة للاستخدام اليومي.",

      keywords: [
        "نظارات شمسية",
        "نظارات",
        "إكسسوارات",
        "نظارات عصرية"
      ]
    },


    // =========================
    // TIMESTAMPS
    // =========================
    createdAt: "2026-06-20T08:00:00.000Z",

    updatedAt: "2026-08-22T16:00:00.000Z"
  }
];

export default products;