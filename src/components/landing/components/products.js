 
 const products = [
  

  // ============================================================
  // 3. حقيبة كروس أنيقة
  // SALE + LOW STOCK
  // ============================================================
  {
    _id: "product-003",
    sku: "AMR-CB-003",

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

    tags: [
      "أناقة",
      "خروج",
      "مناسبات",
      "نسائي",
      "حقائب",
      "يومي"
    ],

    features: [
      "تصميم عصري",
      "حجم مناسب للأساسيات",
      "حزام قابل للتعديل",
      "خفيفة وسهلة الحمل",
      "مناسبة للخروج والمناسبات"
    ],

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

    pricing: {
      regularPrice: 199,
      salePrice: 159,
      currency: "MAD",

      discount: {
        enabled: true,
        type: "percentage",
        value: 20,
        startDate: "2026-09-01T00:00:00.000Z",
        endDate: "2026-09-30T23:59:59.000Z"
      }
    },

    inventory: {
      quantity: 4,
      trackQuantity: true,
      lowStockThreshold: 5,
      status: "low_stock"
    },

    variants: [
      {
        id: "variant-003-black-one",
        color: "أسود",
        colorValue: "#111111",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-CB-003-BLK-ONE",
        price: 159,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-003-brown-one",
        color: "بني",
        colorValue: "#704214",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-CB-003-BRN-ONE",
        price: 159,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-003-white-one",
        color: "أبيض",
        colorValue: "#F5F5F5",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-CB-003-WHT-ONE",
        price: 159,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=700&q=85"
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
    },

    status: {
      active: true,
      published: true,
      featured: false,
      bestseller: false,
      newProduct: false,
      archived: false
    },

    badge: {
      enabled: true,
      type: "sale",
      text: "-20%"
    },

    rating: {
      average: 4.5,
      count: 58
    },

    sales: {
      orders: 62,
      unitsSold: 136,
      views: 980
    },

    details: {
      material: "جلد صناعي",
      gender: "women",
      style: "elegant",
      season: "all",
      countryOfOrigin: "China",
      warranty: null
    },

    shipping: {
      available: true,
      freeShipping: false,
      defaultPrice: 25,
      estimatedDelivery: "2-4 أيام"
    },

    relatedProducts: [
      "product-004",
      "product-001"
    ],

    careInstructions: [
      "تنظيف بقطعة قماش ناعمة",
      "تجنب التعرض الطويل للماء",
      "يحفظ في كيس مناسب عند عدم الاستخدام"
    ],

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

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: false,

    createdAt: "2026-07-15T14:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },

  // ============================================================
  // 4. محفظة جلدية جديدة
  // NEW + LOW STOCK + NO BADGE
  // ============================================================
  {
    _id: "product-004",
    sku: "AMR-WL-004",

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

    tags: [
      "محافظ",
      "جلد",
      "هدايا",
      "رجالي",
      "نسائي",
      "يومي"
    ],

    features: [
      "تصميم مدمج",
      "مساحات متعددة للبطاقات",
      "جيب للنقود",
      "سهلة الحمل",
      "مناسبة للاستخدام اليومي"
    ],

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

    inventory: {
      quantity: 3,
      trackQuantity: true,
      lowStockThreshold: 5,
      status: "low_stock"
    },

    variants: [
      {
        id: "variant-004-brown-one",
        color: "بني",
        colorValue: "#6B4226",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-WL-004-BRN-ONE",
        price: 149,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-004-black-one",
        color: "أسود",
        colorValue: "#111111",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-WL-004-BLK-ONE",
        price: 149,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"
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
    },

    status: {
      active: true,
      published: true,
      featured: false,
      bestseller: false,
      newProduct: true,
      archived: false
    },

    badge: {
      enabled: false,
      type: null,
      text: null
    },

    rating: {
      average: 4.6,
      count: 92
    },

    sales: {
      orders: 38,
      unitsSold: 74,
      views: 730
    },

    details: {
      material: "جلد صناعي فاخر",
      gender: "unisex",
      style: "classic",
      season: "all",
      countryOfOrigin: "Morocco",
      warranty: "3 أشهر"
    },

    shipping: {
      available: true,
      freeShipping: false,
      defaultPrice: 20,
      estimatedDelivery: "2-4 أيام"
    },

    relatedProducts: [
      "product-003",
      "product-005"
    ],

    careInstructions: [
      "تنظيف بقطعة قماش جافة",
      "تجنب التعرض للماء",
      "لا تضعها تحت ضغط شديد"
    ],

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

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: false,

    createdAt: "2026-08-18T11:30:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },

  // ============================================================
  // 5. نظارات شمسية
  // OUT OF STOCK
  // ============================================================
  {
    _id: "product-005",
    sku: "AMR-SG-005",

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

    tags: [
      "نظارات",
      "صيف",
      "سفر",
      "إكسسوارات",
      "كاجوال",
      "موضة"
    ],

    features: [
      "إطار خفيف",
      "تصميم عصري",
      "مناسبة للاستخدام اليومي",
      "مريحة أثناء الارتداء",
      "مناسبة للسفر والخروج"
    ],

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

    inventory: {
      quantity: 0,
      trackQuantity: true,
      lowStockThreshold: 5,
      status: "out_of_stock"
    },

    variants: [
      {
        id: "variant-005-black-one",
        color: "أسود",
        colorValue: "#111111",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-SG-005-BLK-ONE",
        price: 129,
        quantity: 0,
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-005-brown-one",
        color: "بني",
        colorValue: "#704214",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-SG-005-BRN-ONE",
        price: 129,
        quantity: 0,
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
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
    },

    status: {
      active: true,
      published: true,
      featured: false,
      bestseller: false,
      newProduct: false,
      archived: false
    },

    badge: {
      enabled: true,
      type: "out_of_stock",
      text: "نفد المخزون"
    },

    rating: {
      average: 4.3,
      count: 64
    },

    sales: {
      orders: 25,
      unitsSold: 51,
      views: 860
    },

    details: {
      material: "أسيتات",
      gender: "unisex",
      style: "casual",
      season: "summer",
      countryOfOrigin: "China",
      warranty: "3 أشهر"
    },

    shipping: {
      available: false,
      freeShipping: false,
      defaultPrice: 0,
      estimatedDelivery: null
    },

    relatedProducts: [
      "product-001",
      "product-003"
    ],

    careInstructions: [
      "تنظيف العدسات بقطعة قماش مخصصة",
      "يحفظ داخل علبة عند عدم الاستخدام",
      "تجنب وضع النظارات والعدسات إلى الأسفل"
    ],

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

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: false,

    createdAt: "2026-06-20T08:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },

  // ============================================================
  // 6. حزام جلدي رجالي
  // REGULAR PRICE + FEATURED
  // ============================================================
  {
    _id: "product-006",
    sku: "AMR-BL-006",

    name: "حزام جلدي رجالي",
    slug: "حزام-جلدي-رجالي",

    description:
      "حزام جلدي بتصميم كلاسيكي أنيق، مناسب للعمل والمناسبات والاستخدام اليومي. يجمع بين البساطة والمتانة وسهولة التنسيق مع مختلف الإطلالات.",

    shortDescription:
      "حزام جلدي كلاسيكي مناسب للعمل والمناسبات.",

    brand: "AMAROC",

    category: {
      id: "category-accessories",
      name: "الإكسسوارات",
      slug: "accessories"
    },

    subcategory: {
      id: "subcategory-belts",
      name: "أحزمة",
      slug: "belts"
    },

    tags: [
      "حزام",
      "جلد",
      "رجالي",
      "أناقة",
      "عمل",
      "مناسبات"
    ],

    features: [
      "جلد صناعي متين",
      "إبزيم معدني أنيق",
      "قابل للتعديل",
      "مناسب للعمل والمناسبات",
      "سهل التنسيق مع الملابس"
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=90",
        alt: "حزام جلدي رجالي",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=90",
        alt: "حزام جلدي - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85",

    pricing: {
      regularPrice: 119,
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

    inventory: {
      quantity: 18,
      trackQuantity: true,
      lowStockThreshold: 5,
      status: "in_stock"
    },

    variants: [
      {
        id: "variant-006-black-m",
        color: "أسود",
        colorValue: "#111111",
        size: "متوسط",
        sizeValue: "M",
        sku: "AMR-BL-006-BLK-M",
        price: 119,
        quantity: 8,
        image:
          "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-006-black-l",
        color: "أسود",
        colorValue: "#111111",
        size: "كبير",
        sizeValue: "L",
        sku: "AMR-BL-006-BLK-L",
        price: 119,
        quantity: 6,
        image:
          "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-006-brown-m",
        color: "بني",
        colorValue: "#704214",
        size: "متوسط",
        sizeValue: "M",
        sku: "AMR-BL-006-BRN-M",
        price: 119,
        quantity: 4,
        image:
          "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85"
      }
    ],

    dimensions: {
      length: 120,
      width: 3.5,
      height: 0.5,
      unit: "cm"
    },

    weight: {
      value: 220,
      unit: "g"
    },

    status: {
      active: true,
      published: true,
      featured: true,
      bestseller: false,
      newProduct: false,
      archived: false
    },

    badge: {
      enabled: false,
      type: null,
      text: null
    },

    rating: {
      average: 4.4,
      count: 31
    },

    sales: {
      orders: 18,
      unitsSold: 42,
      views: 510
    },

    details: {
      material: "جلد صناعي",
      gender: "men",
      style: "classic",
      season: "all",
      countryOfOrigin: "Morocco",
      warranty: "3 أشهر"
    },

    shipping: {
      available: true,
      freeShipping: false,
      defaultPrice: 20,
      estimatedDelivery: "2-4 أيام"
    },

    relatedProducts: [
      "product-004",
      "product-007"
    ],

    careInstructions: [
      "تنظيف بقطعة قماش جافة",
      "تجنب الرطوبة العالية",
      "لا تثنِ الحزام بشكل حاد"
    ],

    seo: {
      title: "حزام جلدي رجالي | AMAROC",
      description:
        "حزام جلدي كلاسيكي أنيق مناسب للعمل والمناسبات والاستخدام اليومي.",
      keywords: [
        "حزام جلدي",
        "حزام رجالي",
        "إكسسوارات رجالية",
        "حزام أنيق"
      ]
    },

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: false,

    createdAt: "2026-08-25T10:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },

  // ============================================================
  // 7. تيشيرت أوفرسايز كاجوال
  // SALE + NEW + MULTIPLE SIZES
  // ============================================================
  {
    _id: "product-007",
    sku: "AMR-TS-007",

    name: "تيشيرت أوفرسايز كاجوال",
    slug: "تيشيرت-اوفرسايز-كاجوال",

    description:
      "تيشيرت أوفرسايز بتصميم عصري وقصة مريحة، مناسب للإطلالات اليومية والكاجوال. يمكن تنسيقه بسهولة مع الجينز أو السراويل الرياضية.",

    shortDescription:
      "تيشيرت أوفرسايز مريح بإطلالة عصرية وكاجوال.",

    brand: "AMAROC",

    category: {
      id: "category-clothing",
      name: "الملابس",
      slug: "clothing"
    },

    subcategory: {
      id: "subcategory-tshirts",
      name: "تيشيرتات",
      slug: "tshirts"
    },

    tags: [
      "ملابس",
      "تيشيرت",
      "كاجوال",
      "أوفرسايز",
      "صيف",
      "شبابي"
    ],

    features: [
      "قصة أوفرسايز مريحة",
      "قماش ناعم",
      "تصميم عصري",
      "مناسب للإطلالات اليومية",
      "سهل التنسيق"
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=90",
        alt: "تيشيرت أوفرسايز كاجوال",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=90",
        alt: "تيشيرت أوفرسايز - التفاصيل"
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",

    pricing: {
      regularPrice: 179,
      salePrice: 149,
      currency: "MAD",

      discount: {
        enabled: true,
        type: "percentage",
        value: 17,
        startDate: "2026-09-01T00:00:00.000Z",
        endDate: "2026-09-30T23:59:59.000Z"
      }
    },

    inventory: {
      quantity: 30,
      trackQuantity: true,
      lowStockThreshold: 6,
      status: "in_stock"
    },

    variants: [
      {
        id: "variant-007-black-s",
        color: "أسود",
        colorValue: "#111111",
        size: "S",
        sizeValue: "S",
        sku: "AMR-TS-007-BLK-S",
        price: 149,
        quantity: 8,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-007-black-m",
        color: "أسود",
        colorValue: "#111111",
        size: "M",
        sizeValue: "M",
        sku: "AMR-TS-007-BLK-M",
        price: 140,
        quantity: 10,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-007-white-m",
        color: "أبيض",
        colorValue: "#F5F5F5",
        size: "M",
        sizeValue: "M",
        sku: "AMR-TS-007-WHT-M",
        price: 140,
        quantity: 7,
        image:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85"
      },
      {
        id: "variant-007-gray-l",
        color: "رمادي",
        colorValue: "#777777",
        size: "L",
        sizeValue: "L",
        sku: "AMR-TS-007-GRY-L",
        price: 149,
        quantity: 5,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
      }
    ],

    dimensions: {
      length: 72,
      width: 58,
      height: 1,
      unit: "cm"
    },

    weight: {
      value: 260,
      unit: "g"
    },

    status: {
      active: true,
      published: true,
      featured: false,
      bestseller: false,
      newProduct: true,
      archived: false
    },

    badge: {
      enabled: true,
      type: "new",
      text: "جديد"
    },

    rating: {
      average: 4.7,
      count: 19
    },

    sales: {
      orders: 14,
      unitsSold: 27,
      views: 440
    },

    details: {
      material: "قطن",
      gender: "unisex",
      style: "casual",
      season: "summer",
      countryOfOrigin: "Morocco",
      warranty: null
    },

    shipping: {
      available: true,
      freeShipping: false,
      defaultPrice: 25,
      estimatedDelivery: "2-4 أيام"
    },

    relatedProducts: [
      "product-006",
      "product-001"
    ],

    careInstructions: [
      "يغسل بالماء البارد",
      "يفضل قلب التيشيرت قبل الغسيل",
      "تجنب التجفيف بدرجة حرارة مرتفعة"
    ],

    seo: {
      title: "تيشيرت أوفرسايز كاجوال | AMAROC",
      description:
        "تيشيرت أوفرسايز مريح وعصري مناسب للإطلالات اليومية.",
      keywords: [
        "تيشيرت أوفرسايز",
        "تيشيرت",
        "ملابس كاجوال",
        "ملابس شبابية"
      ]
    },

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: false,

    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },

  // ============================================================
  // 8. حقيبة سفر قديمة
  // ARCHIVED + INACTIVE + SOFT DELETED
  // ============================================================
  {
    _id: "product-008",
    sku: "AMR-OLD-008",

    name: "حقيبة سفر قديمة",
    slug: "حقيبة-سفر-قديمة",

    description:
      "منتج قديم للاختبار فقط، لم يعد متاحًا للبيع في المتجر.",

    shortDescription:
      "منتج مؤرشف للاختبار.",

    brand: "AMAROC",

    category: {
      id: "category-travel-bags",
      name: "حقائب السفر",
      slug: "travel-bags"
    },

    subcategory: {
      id: "subcategory-old-travel-bags",
      name: "منتجات قديمة",
      slug: "old-travel-bags"
    },

    tags: [
      "قديم",
      "مؤرشف",
      "اختبار"
    ],

    features: [
      "منتج مؤرشف"
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=90",
        alt: "حقيبة سفر قديمة",
        isPrimary: true
      }
    ],

    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",

    pricing: {
      regularPrice: 399,
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

    inventory: {
      quantity: 0,
      trackQuantity: true,
      lowStockThreshold: 5,
      status: "out_of_stock"
    },

    variants: [
      {
        id: "variant-008-one",
        color: "أسود",
        colorValue: "#111111",
        size: "موحد",
        sizeValue: "ONE_SIZE",
        sku: "AMR-OLD-008-BLK-ONE",
        price: 399,
        quantity: 0,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"
      }
    ],

    dimensions: {
      length: 55,
      width: 35,
      height: 25,
      unit: "cm"
    },

    weight: {
      value: 1200,
      unit: "g"
    },

    status: {
      active: false,
      published: false,
      featured: false,
      bestseller: false,
      newProduct: false,
      archived: true
    },

    badge: {
      enabled: false,
      type: null,
      text: null
    },

    rating: {
      average: 4.1,
      count: 12
    },

    sales: {
      orders: 9,
      unitsSold: 15,
      views: 210
    },

    details: {
      material: "بوليستر",
      gender: "unisex",
      style: "travel",
      season: "all",
      countryOfOrigin: "China",
      warranty: null
    },

    shipping: {
      available: false,
      freeShipping: false,
      defaultPrice: 0,
      estimatedDelivery: null
    },

    relatedProducts: [
      "product-002"
    ],

    careInstructions: [],

    seo: {
      title: "حقيبة سفر قديمة | AMAROC",
      description: "منتج مؤرشف للاختبار.",
      keywords: [
        "حقيبة سفر",
        "منتج قديم"
      ]
    },

    createdBy: "admin-user-001",
    updatedBy: "admin-user-001",
    isDeleted: true,

    createdAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-09-14T10:00:00.000Z"
  },




  {
  _id: "009",
  sku: "AMR-PER-001",
  name: "Noir Éclat Eau de Parfum",
  slug: "noir-eclat-eau-de-parfum",

  description:
    "عطر أنيق بطابع خشبي دافئ يجمع بين الحمضيات والتوابل والأخشاب.",
  shortDescription:
    "عطر Eau de Parfum بطابع خشبي دافئ وأنيق.",

  brand: "AMAROC",

  category: {
    id: "perfumes",
    name: "العطور",
    slug: "perfumes"
  },

  subcategory: {
    id: "men-perfumes",
    name: "عطور رجالية",
    slug: "men-perfumes"
  },

  tags: ["عطر", "رجالي", "EDP", "خشبي"],

  features: [
    "ثبات طويل",
    "مناسب للمساء",
    "تركيبة Eau de Parfum"
  ],

  images: [
    {
      url: "https://media.zid.store/thumbs/fb15d9a7-536c-4be4-8572-dc3edebe3e82/c7209be5-08c4-4c09-9bc2-6e4512991845-thumbnail-1000x1000-70.webp",
      alt: "Noir Éclat Eau de Parfum",
      isPrimary: true
    },
    {
      url: "https://media.zid.store/thumbs/fb15d9a7-536c-4be4-8572-dc3edebe3e82/c7209be5-08c4-4c09-9bc2-6e4512991845-thumbnail-1000x1000-70.webp",
      alt: "Noir Éclat bottle"
    }
  ],

  thumbnail: "https://media.zid.store/thumbs/fb15d9a7-536c-4be4-8572-dc3edebe3e82/c7209be5-08c4-4c09-9bc2-6e4512991845-thumbnail-1000x1000-70.webp",

  pricing: {
    regularPrice: 699,
    salePrice: 549,
    currency: "MAD",
    discount: {
      enabled: true,
      type: "percentage",
      value: 21,
      startDate: null,
      endDate: null
    }
  },

  inventory: {
    quantity: 25,
    trackQuantity: true,
    lowStockThreshold: 5,
    status: "in_stock"
  },

  variants: [
     {
      id: "009-50ml",
      volume: 50,
      volumeUnit: "ml",
      sku: "AMR-PER-001-50",
      price: 399,
      quantity: 10,
      image: "https://media.zid.store/thumbs/fb15d9a7-536c-4be4-8572-dc3edebe3e82/c7209be5-08c4-4c09-9bc2-6e4512991845-thumbnail-1000x1000-70.webp"
    },
    {
      id: "009-100ml",
      volume: 100,
      volumeUnit: "ml",
      sku: "AMR-PER-001-100",
      price: 549,
      quantity: 15,
      image: "https://media.zid.store/thumbs/fb15d9a7-536c-4be4-8572-dc3edebe3e82/c7209be5-08c4-4c09-9bc2-6e4512991845-thumbnail-1000x1000-70.webp"
    }
   
  ],

  perfume: {
    gender: "men",

    concentration: "EDP",

    fragranceFamily: "woody",

    topNotes: [
      "Bergamot",
      "Lemon"
    ],

    middleNotes: [
      "Lavender",
      "Rose"
    ],

    baseNotes: [
      "Musk",
      "Amber",
      "Sandalwood"
    ],

    longevity: "6-8 hours",

    sillage: "moderate",

    season: [
      "autumn",
      "winter"
    ],

    occasion: [
      "evening",
      "formal"
    ]
  },

  dimensions: {
    length: 8,
    width: 5,
    height: 14,
    unit: "cm"
  },

  weight: {
    value: 0.45,
    unit: "kg"
  },

  status: {
    active: true,
    published: true,
    featured: true,
    bestseller: false,
    newProduct: true,
    archived: false
  },

  badge: {
    enabled: true,
    type: "new",
    text: "جديد"
  },

  rating: {
    average: 4.8,
    count: 34
  },

  sales: {
    orders: 28,
    unitsSold: 31,
    views: 850
  },

  details: {
    material: "Glass bottle",
    gender: "men",
    style: "elegant",
    season: "autumn/winter",
    countryOfOrigin: "France",
    warranty: "غير متوفر"
  },

  shipping: {
    available: true,
    freeShipping: true,
    defaultPrice: 0,
    estimatedDelivery: "2-4 أيام"
  },

  relatedProducts: [],

  careInstructions: [
    "يحفظ بعيداً عن أشعة الشمس المباشرة",
    "يحفظ في مكان بارد وجاف",
    "لا يترك بالقرب من مصادر الحرارة"
  ],

  seo: {
    title: "Noir Éclat Eau de Parfum",
    description: "عطر خشبي أنيق Eau de Parfum",
    keywords: ["عطر", "EDP", "عطر رجالي"]
  },

  createdBy: "admin",
  updatedBy: "admin",
  isDeleted: false
}
];

export default products; 
 


 












 