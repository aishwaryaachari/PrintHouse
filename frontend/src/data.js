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
      { name: "Matte White", hex: "#e8e8e8", image: "/bottle_white.png" },
      { name: "Matte Black", hex: "#1a1a1a", image: "/bottle_black.png" },
      { name: "Steel Grey", hex: "#8a8a8a", image: "/bottle_grey.png" },
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 320, 50: 280, 100: 240, 250: 200, 500: 170, 1000: 150 },
    images: ["/product_bottle.png"],
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
      { name: "White", hex: "#ffffff", image: "/mug_white.png" },
      { name: "Black", hex: "#111111", image: "/mug_black.png" },
      { name: "Grey", hex: "#8a8a8a", image: "/mug_grey.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 150, 50: 120, 100: 100, 250: 85, 500: 70, 1000: 60 },
    images: ["/mug_black.png", "/mug_grey.png", "/mug_white.png"],
    printZones: [
      { id: "front", title: "Front Print", type: "cylindrical", px: 0.3, py: 0.3, pWidth: 0.4, pHeight: 0.4, angle: 0, shape: "rectangle" }
    ]
  },
  diaries: {
    name: "Premium Leatherette Diary",
    badge: "Executive",
    description: "A5 softcover diary with premium 80gsm ruled paper. The perfect corporate companion.",
    features: [
      "Premium faux leather cover",
      "192 pages of 80gsm ruled paper",
      "Ribbon bookmark",
      "Elastic closure band",
      "Expandable inner pocket"
    ],
    offer: "Free embossing on orders over 50.",
    sizes: ["A5", "A4"],
    colors: [
      { name: "Black", hex: "#111111", image: "/diary_black.png" },
      { name: "Grey", hex: "#8a8a8a", image: "/diary_grey.png" },
      { name: "White", hex: "#ffffff", image: "/diary_white.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [25, 50, 100, 250, 500, 1000],
    pricePerItem: { 25: 250, 50: 220, 100: 190, 250: 160, 500: 140, 1000: 120 },
    images: ["/diary_black.png", "/diary_grey.png", "/diary_white.png"],
    printZones: [
      { id: "cover", title: "Front Cover", type: "flat", px: 0.25, py: 0.2, pWidth: 0.5, pHeight: 0.6, angle: 0, shape: "rectangle" }
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
      { name: "Black", hex: "#111111", image: "/pen_black.png" },
      { name: "Blue", hex: "#0000ff", image: "/pen_blue.png" },
      { name: "Grey", hex: "#8a8a8a", image: "/pen_grey.png" }
    ],
    customizations: ["Text", "Image"],
    quantities: [50, 100, 250, 500, 1000],
    pricePerItem: { 50: 80, 100: 60, 250: 45, 500: 35, 1000: 25 },
    images: ["/pen_black.png", "/pen_blue.png", "/pen_grey.png"],
    printZones: [
      { id: "barrel", title: "Pen Barrel", type: "flat", px: 0.45, py: 0.4, pWidth: 0.1, pHeight: 0.4, angle: 0, shape: "rectangle" }
    ]
  }
};
