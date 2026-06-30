export const PRODUCTS = {
  bottles: {
    name: "Steel Insulated Bottle",
    badge: "Best Seller",
    description: "Our premium insulated bottle keeps water cold for 24 hours and hot for 12. A perfect canvas to showcase your brand identity.",
    features: [
      "Double-walled vacuum insulation",
      "BPA-free stainless steel (Grade 304)",
      "Leak-proof screw lid",
      "Dishwasher safe body",
      "Print area: 5cm × 8cm (front zone)"
    ],
    offer: "Build your ideal bundle and save. Get 10% off when you buy 2, 15% off when you buy 3, and 20% off on 4 or more.",
    sizes: ["500ml", "750ml", "1L"],
    colors: [
      { name: "Matte White", hex: "#e8e8e8", image: "/products/bottles/bottle_white.png" },
      { name: "Matte Black", hex: "#1a1a1a", image: "/products/bottles/bottle_black.png" },
      { name: "Steel Grey",  hex: "#8a8a8a", image: "/products/bottles/bottle_grey.png" },
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 320, 50: 280, 100: 240, 250: 200, 500: 170, 1000: 150 },
    images: [
      "/products/bottles/bottle_white.png",
      "/products/bottles/bottle_black.png",
      "/products/bottles/bottle_grey.png"
    ],
    printZones: [
      { id: "front_logo", title: "Main Body Print", type: "cylindrical", px: 0.35, py: 0.3, pWidth: 0.3, pHeight: 0.45, angle: 0, shape: "rectangle" },
      { id: "lid_engraving", title: "Lid Engraving", type: "flat", px: 0.4, py: 0.1, pWidth: 0.2, pHeight: 0.08, angle: 0, shape: "rectangle" }
    ]
  },

  mugs: {
    name: "Ceramic Coffee Mug",
    badge: "Classic",
    description: "Classic 11oz ceramic mug with a smooth finish. Perfect for morning coffees and corporate giveaways.",
    features: [
      "High-quality ceramic",
      "Microwave and dishwasher safe",
      "Smooth, glossy finish",
      "Comfortable C-handle",
      "Vibrant full-color printing"
    ],
    offer: "Volume discounts available. Save 20% on orders over 100.",
    sizes: ["11oz", "15oz"],
    colors: [
      { name: "White",  hex: "#ffffff", image: "/products/mugs/mug_white.png" },
      { name: "Black",  hex: "#111111", image: "/products/mugs/mug_black.png" },
      { name: "Grey",   hex: "#8a8a8a", image: "/products/mugs/mug_grey.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 150, 50: 120, 100: 100, 250: 85, 500: 70, 1000: 60 },
    images: [
      "/products/mugs/mug_white.png",
      "/products/mugs/mug_black.png",
      "/products/mugs/mug_grey.png"
    ],
    printZones: [
      { id: "front", title: "Front Print", type: "cylindrical", px: 0.3, py: 0.3, pWidth: 0.4, pHeight: 0.4, angle: 0, shape: "rectangle" }
    ]
  },

  diaries: {
    name: "Premium Leather Diary",
    badge: "Executive",
    description: "A5 hardcover diary with a premium leather finish and 80gsm ruled paper. The perfect corporate companion.",
    features: [
      "Premium leather cover",
      "192 pages of 80gsm ruled paper",
      "Ribbon bookmark",
      "Elastic closure band",
      "Expandable inner pocket"
    ],
    offer: "Free embossing on orders over 50.",
    sizes: ["A5", "A4"],
    colors: [
      { name: "Black", hex: "#111111", image: "/products/diaries/diary_leather_black.png" },
      { name: "Grey",  hex: "#8a8a8a", image: "/products/diaries/diary_leather_grey.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/diaries/diary_leather_white.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 250, 50: 220, 100: 190, 250: 160, 500: 140, 1000: 120 },
    images: [
      "/products/diaries/diary_leather_black.png",
      "/products/diaries/diary_leather_grey.png",
      "/products/diaries/diary_leather_white.png"
    ],
    printZones: [
      { id: "cover", title: "Front Cover", type: "flat", px: 0.25, py: 0.2, pWidth: 0.5, pHeight: 0.6, angle: 0, shape: "rectangle" }
    ]
  },

  spiral_diaries: {
    name: "Spiral Notebook",
    badge: "New",
    description: "A5 spiral-bound notebook with smooth 70gsm lined pages. Lightweight and flexible — ideal for everyday notes and meetings.",
    features: [
      "Spiral-bound for flat lay",
      "200 pages of 70gsm lined paper",
      "Durable card cover",
      "Custom print on front cover",
      "Available in 3 cover colours"
    ],
    offer: "Free custom cover design on orders over 50.",
    sizes: ["A5", "A4"],
    colors: [
      { name: "Black", hex: "#111111", image: "/products/diaries/spiral_black.png" },
      { name: "Grey",  hex: "#8a8a8a", image: "/products/diaries/spiral_grey.png" },
      { name: "Brown", hex: "#7B4F2E", image: "/products/diaries/spiral_brown.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 160, 50: 135, 100: 110, 250: 90, 500: 75, 1000: 60 },
    images: [
      "/products/diaries/spiral_black.png",
      "/products/diaries/spiral_grey.png",
      "/products/diaries/spiral_brown.png"
    ],
    printZones: [
      { id: "cover", title: "Front Cover", type: "flat", px: 0.1, py: 0.1, pWidth: 0.8, pHeight: 0.7, angle: 0, shape: "rectangle" }
    ]
  },

  pens: {
    name: "Metallic Rollerball Pen",
    badge: "Premium",
    description: "Smooth-writing premium rollerball pen with a heavy metallic body for laser engraving.",
    features: [
      "Heavy metallic body",
      "Smooth-writing rollerball tip",
      "Premium black ink",
      "Sleek professional design",
      "Perfect for precision laser engraving"
    ],
    offer: "Custom presentation boxes available on bulk orders.",
    sizes: ["Standard"],
    colors: [
      { name: "Black",  hex: "#111111", image: "/products/pens/pen_black.png" },
      { name: "Silver", hex: "#c0c0c0", image: "/products/pens/pen_grey.png" },
      { name: "Blue",   hex: "#1a52ff", image: "/products/pens/pen_blue.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [50, 100, 250, 500, 1000],
    pricePerItem: { 50: 80, 100: 60, 250: 45, 500: 35, 1000: 25 },
    images: [
      "/products/pens/pen_black.png",
      "/products/pens/pen_grey.png",
      "/products/pens/pen_blue.png"
    ],
    printZones: [
      { id: "barrel", title: "Pen Barrel", type: "flat", px: 0.45, py: 0.4, pWidth: 0.1, pHeight: 0.4, angle: 0, shape: "rectangle" }
    ]
  },

  business_cards: {
    name: "Premium Business Cards",
    badge: "New",
    description: "Make a lasting first impression with our premium business cards. Available in matte, glossy, spot UV and embossed finishes.",
    features: [
      "350gsm premium card stock",
      "Full-colour double-sided printing",
      "Matte, gloss & spot UV finishes",
      "Embossing & foil stamping options",
      "Standard 90mm × 54mm size"
    ],
    offer: "Free design proofing on every order. Reorder at 15% off.",
    sizes: ["Standard (90×54mm)", "Square (55×55mm)", "Slim (85×40mm)"],
    colors: [
      { name: "Matte White", hex: "#f5f5f5", image: "/products/business_cards/card_white.png" },
      { name: "Matte Black", hex: "#111111", image: "/products/business_cards/card_black.png" },
      { name: "Red",         hex: "#c0392b", image: "/products/business_cards/card_red.png"   }
    ],
    customizations: ["Text", "Image"],
    quantities: [100, 250, 500, 1000, 2500, 5000],
    pricePerItem: { 100: 8, 250: 6, 500: 4.5, 1000: 3.5, 2500: 2.5, 5000: 2 },
    images: [
      "/products/business_cards/card_white.png",
      "/products/business_cards/card_black.png",
      "/products/business_cards/card_red.png"
    ],
    printZones: [
      { id: "front", title: "Front Face", type: "flat", px: 0.05, py: 0.05, pWidth: 0.9, pHeight: 0.9, angle: 0, shape: "rectangle" }
    ]
  },

  id_cards: {
    name: "Corporate ID Cards",
    badge: "Popular",
    description: "Durable PVC ID cards for employees, visitors and access control. Full-colour printing with optional RFID chip.",
    features: [
      "CR80 standard PVC card",
      "Full-colour double-sided print",
      "Glossy or matte lamination",
      "Optional RFID / NFC chip",
      "Compatible with all card printers"
    ],
    offer: "Lanyards included free on orders over 100 cards.",
    sizes: ["Standard CR80", "Thick CR80"],
    colors: [
      { name: "White",  hex: "#ffffff", image: "/products/id_cards/pvc_id_card.png" },
      { name: "Black",  hex: "#111111", image: "/products/id_cards/pvc_id_card.png" },
      { name: "Silver", hex: "#c0c0c0", image: "/products/id_cards/pvc_id_card.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [50, 100, 250, 500, 1000],
    pricePerItem: { 50: 45, 100: 35, 250: 28, 500: 22, 1000: 18 },
    images: ["/products/id_cards/pvc_id_card.png"],
    printZones: [
      { id: "front", title: "Card Front", type: "flat", px: 0.05, py: 0.05, pWidth: 0.9, pHeight: 0.9, angle: 0, shape: "rectangle" }
    ]
  },

  lanyards: {
    name: "Custom Printed Lanyards",
    badge: "Trending",
    description: "High-quality polyester and satin lanyards with full-colour sublimation printing. Perfect for events and corporate IDs.",
    features: [
      "Polyester or satin material",
      "15mm or 20mm width options",
      "Full-colour dye-sublimation print",
      "Metal or plastic clip attachment",
      "Safety breakaway buckle available"
    ],
    offer: "ID card holders included free on orders over 200 lanyards.",
    sizes: ["15mm", "20mm"],
    colors: [
      { name: "Navy Blue", hex: "#1a237e", image: "/products/lanyards/polyester_lanyard_blue.png" },
      { name: "Black",     hex: "#111111", image: "/products/lanyards/polyester_lanyard_blue.png" },
      { name: "White",     hex: "#f5f5f5", image: "/products/lanyards/polyester_lanyard_blue.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [50, 100, 250, 500, 1000],
    pricePerItem: { 50: 55, 100: 40, 250: 30, 500: 22, 1000: 16 },
    images: ["/products/lanyards/polyester_lanyard_blue.png"],
    printZones: [
      { id: "strap", title: "Lanyard Strap", type: "flat", px: 0.35, py: 0.1, pWidth: 0.3, pHeight: 0.8, angle: 0, shape: "rectangle" }
    ]
  },

  tshirts: {
    name: "Corporate Polo T-Shirt",
    badge: "Premium",
    description: "Premium 220gsm cotton-polyester polo shirts with chest embroidery or screen printing. The ideal corporate uniform.",
    features: [
      "220gsm cotton-polyester blend",
      "Collar with 2-button placket",
      "Chest embroidery or screen print",
      "Moisture-wicking fabric",
      "Available in XS to 3XL"
    ],
    offer: "Free embroidery digitizing on your first order.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: [
      { name: "White", hex: "#f5f5f5", image: "/products/tshirts/polo_white.png" },
      { name: "Black", hex: "#111111", image: "/products/tshirts/polo_black.png" },
      { name: "Blue",  hex: "#1565c0", image: "/products/tshirts/polo_blue.png"  }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500],
    pricePerItem: { 25: 450, 50: 380, 100: 320, 250: 270, 500: 230 },
    images: [
      "/products/tshirts/polo_white.png",
      "/products/tshirts/polo_black.png",
      "/products/tshirts/polo_blue.png"
    ],
    printZones: [
      { id: "chest", title: "Left Chest", type: "flat", px: 0.15, py: 0.25, pWidth: 0.25, pHeight: 0.2, angle: 0, shape: "rectangle" },
      { id: "back",  title: "Back Print", type: "flat", px: 0.2,  py: 0.15, pWidth: 0.6,  pHeight: 0.5, angle: 0, shape: "rectangle" }
    ]
  },

  bags: {
    name: "Custom Corporate Bags",
    badge: "Gift Ready",
    description: "From tote bags to executive laptop bags — fully customisable with your logo via screen printing or embroidery.",
    features: [
      "Canvas, polyester & nylon options",
      "Screen print or embroidery",
      "Multiple compartments",
      "Padded laptop sleeve (laptop bag)",
      "Reinforced stitching & handles"
    ],
    offer: "Free satin inner lining upgrade on orders over 50.",
    sizes: ["Tote", "Laptop 15\"", "Laptop 17\"", "Backpack"],
    colors: [
      { name: "Natural",     hex: "#d4c8a8", image: "/products/bags/office_bag.png" },
      { name: "Matte Black", hex: "#111111", image: "/products/bags/office_bag.png" },
      { name: "Navy",        hex: "#1a237e", image: "/products/bags/office_bag.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500],
    pricePerItem: { 25: 550, 50: 480, 100: 400, 250: 340, 500: 290 },
    images: ["/products/bags/office_bag.png"],
    printZones: [
      { id: "front", title: "Front Panel", type: "flat", px: 0.2, py: 0.2, pWidth: 0.6, pHeight: 0.5, angle: 0, shape: "rectangle" }
    ]
  },

  caps: {
    name: "Branded Baseball Cap",
    badge: "Sporty",
    description: "Structured 6-panel baseball caps with front panel embroidery. Perfect for events, teams and outdoor promotions.",
    features: [
      "100% brushed cotton twill",
      "Structured 6-panel design",
      "Front embroidery area",
      "Adjustable velcro back strap",
      "One size fits most"
    ],
    offer: "Mix colours in the same order. Min 24 pieces per colour.",
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#111111", image: "/products/caps/cap_black.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/caps/cap_white.png" },
      { name: "Grey",  hex: "#8a8a8a", image: "/products/caps/cap_grey.png"  }
    ],
    customizations: ["Text", "Image"],
    quantities: [24, 50, 100, 250, 500],
    pricePerItem: { 24: 280, 50: 240, 100: 200, 250: 170, 500: 145 },
    images: [
      "/products/caps/cap_black.png",
      "/products/caps/cap_white.png",
      "/products/caps/cap_grey.png"
    ],
    printZones: [
      { id: "front_panel", title: "Front Panel Embroidery", type: "flat", px: 0.25, py: 0.2, pWidth: 0.5, pHeight: 0.35, angle: 0, shape: "rectangle" }
    ]
  },

  stickers: {
    name: "Custom Die-Cut Stickers",
    badge: "Fun",
    description: "Vibrant, weatherproof vinyl stickers cut to any shape. From transparent to holographic finishes — your brand everywhere.",
    features: [
      "Premium vinyl material",
      "Weatherproof & UV resistant",
      "Die-cut to custom shapes",
      "Glossy, matte or holographic",
      "Indoor and outdoor use"
    ],
    offer: "Order 500+ stickers and get free die-cut template setup.",
    sizes: ["50×50mm", "75×75mm", "100×100mm", "Custom"],
    colors: [
      { name: "Gloss",        hex: "#f5f5f5", image: "/products/stickers/vinyl_sticker.png" },
      { name: "Matte",        hex: "#d0d0d0", image: "/products/stickers/vinyl_sticker.png" },
      { name: "Holographic",  hex: "#a78bfa", image: "/products/stickers/vinyl_sticker.png" }
    ],
    customizations: ["Image"],
    quantities: [100, 250, 500, 1000, 2500],
    pricePerItem: { 100: 12, 250: 8, 500: 6, 1000: 4, 2500: 3 },
    images: ["/products/stickers/vinyl_sticker.png"],
    printZones: [
      { id: "face", title: "Sticker Face", type: "flat", px: 0.05, py: 0.05, pWidth: 0.9, pHeight: 0.9, angle: 0, shape: "rectangle" }
    ]
  },

  packaging: {
    name: "Custom Gift Packaging",
    badge: "Luxe",
    description: "Premium branded packaging that elevates every unboxing. Rigid gift boxes, kraft mailers, and paper bags with custom print.",
    features: [
      "Rigid or folding box options",
      "Kraft, white & black card stock",
      "Custom foil or CMYK print",
      "Magnetic closure available",
      "Custom inserts & tissue paper"
    ],
    offer: "Free tissue paper and ribbon on orders over 50 boxes.",
    sizes: ["Small", "Medium", "Large", "Custom"],
    colors: [
      { name: "Gloss Black",  hex: "#111111", image: "/products/packaging/gift_box_black.png" },
      { name: "Kraft Brown",  hex: "#8B6914", image: "/products/packaging/gift_box_black.png" },
      { name: "Clean White",  hex: "#f5f5f5", image: "/products/packaging/gift_box_black.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500],
    pricePerItem: { 25: 180, 50: 150, 100: 120, 250: 95, 500: 80 },
    images: ["/products/packaging/gift_box_black.png"],
    printZones: [
      { id: "lid", title: "Lid Print", type: "flat", px: 0.15, py: 0.1, pWidth: 0.7, pHeight: 0.45, angle: 0, shape: "rectangle" }
    ]
  },

  keychains: {
    name: "Custom Keychains",
    badge: "Gifting",
    description: "Durable custom keychains in acrylic, metal, wood and leather. A compact, high-impact branded giveaway.",
    features: [
      "Acrylic, metal, wood & leather options",
      "Full-colour or laser engraving",
      "Split ring or carabiner attachment",
      "Custom shapes available",
      "Individual OPP bag packaging"
    ],
    offer: "Free individual gift bag packaging on every order.",
    sizes: ["Standard", "Large"],
    colors: [
      { name: "Silver Metal", hex: "#c0c0c0", image: "/products/keychains/metal_keychain.png" },
      { name: "Gold Metal",   hex: "#d4af37", image: "/products/keychains/metal_keychain.png" },
      { name: "Natural Wood", hex: "#8B6914", image: "/products/keychains/metal_keychain.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [50, 100, 250, 500, 1000],
    pricePerItem: { 50: 90, 100: 70, 250: 55, 500: 42, 1000: 32 },
    images: ["/products/keychains/metal_keychain.png"],
    printZones: [
      { id: "face", title: "Keychain Face", type: "flat", px: 0.2, py: 0.15, pWidth: 0.6, pHeight: 0.7, angle: 0, shape: "rectangle" }
    ]
  },

  awards: {
    name: "Corporate Awards & Trophies",
    badge: "Prestige",
    description: "Recognise achievement with premium crystal trophies, wooden plaques and gold medals. Custom engraved with any text.",
    features: [
      "K9 optical crystal glass",
      "Precision laser engraving",
      "Wooden plaque with metal plate",
      "Gift box included",
      "Custom text and logo engraving"
    ],
    offer: "Free gift box and velvet pouch on every award.",
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Crystal Clear", hex: "#e8f4f8", image: "/products/awards/trophy.png" },
      { name: "Gold Finish",   hex: "#d4af37", image: "/products/awards/trophy.png" },
      { name: "Walnut Wood",   hex: "#5C4033", image: "/products/awards/trophy.png" }
    ],
    customizations: ["Text"],
    quantities: [1, 5, 10, 25, 50],
    pricePerItem: { 1: 1200, 5: 1000, 10: 850, 25: 700, 50: 600 },
    images: ["/products/awards/trophy.png"],
    printZones: [
      { id: "plate", title: "Engraving Plate", type: "flat", px: 0.2, py: 0.5, pWidth: 0.6, pHeight: 0.3, angle: 0, shape: "rectangle" }
    ]
  },

  office: {
    name: "Branded Office Supplies",
    badge: "Workspace",
    description: "Keep your brand front and centre on every desk. Mouse pads, calendars and desk organisers with full-colour printing.",
    features: [
      "Non-slip rubber base (mouse pad)",
      "Full-colour CMYK surface print",
      "Desk & wall calendar options",
      "Custom monthly layout",
      "Pen holder with logo area"
    ],
    offer: "Bundle any 3 items and save 15%.",
    sizes: ["Mouse Pad (30×25cm)", "Desk Calendar", "Wall Calendar"],
    colors: [
      { name: "Black Base", hex: "#111111", image: "/products/office/mouse_pad_black.png" },
      { name: "White Base", hex: "#f5f5f5", image: "/products/office/mouse_pad_black.png" },
      { name: "Grey Base",  hex: "#8a8a8a", image: "/products/office/mouse_pad_black.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500],
    pricePerItem: { 25: 200, 50: 170, 100: 140, 250: 115, 500: 95 },
    images: ["/products/office/mouse_pad_black.png"],
    printZones: [
      { id: "surface", title: "Surface Print", type: "flat", px: 0.05, py: 0.05, pWidth: 0.9, pHeight: 0.9, angle: 0, shape: "rectangle" }
    ]
  }
};

// Grouped for navigation megamenu
export const PRODUCT_GROUPS = [
  {
    group: "Drinkware",
    items: [
      { id: "bottles", label: "Steel Bottles" },
      { id: "mugs",    label: "Ceramic Mugs"  }
    ]
  },
  {
    group: "Stationery",
    items: [
      { id: "diaries",         label: "Leather Diary"        },
      { id: "spiral_diaries",  label: "Spiral Notebook"      },
      { id: "pens",            label: "Pens"                },
      { id: "business_cards",  label: "Business Cards"      },
      { id: "id_cards",        label: "ID Cards"            },
      { id: "office",          label: "Office Supplies"     }
    ]
  },
  {
    group: "Apparel & Accessories",
    items: [
      { id: "tshirts",   label: "T-Shirts & Polos" },
      { id: "caps",      label: "Caps"              },
      { id: "bags",      label: "Bags"              },
      { id: "lanyards",  label: "Lanyards"          }
    ]
  },
  {
    group: "Gifting & Events",
    items: [
      { id: "keychains",  label: "Keychains"  },
      { id: "awards",     label: "Awards"     },
      { id: "stickers",   label: "Stickers"   },
      { id: "packaging",  label: "Packaging"  }
    ]
  }
];
