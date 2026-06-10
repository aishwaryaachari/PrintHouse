import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { PRODUCTS } from "./data";

const pdpStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Pacifico&family=Montserrat:wght@400;600&family=Oswald:wght@400;600&family=Playfair+Display:wght@400;600;700&display=swap');

  .pdp-wrap { font-family: 'Outfit', sans-serif; color: var(--text-dark); background: var(--bg-white); transition: background 0.3s ease; }

  /* NAV */
  .pdp-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid var(--border-color); background: var(--nav-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 100; transition: all 0.3s ease; }
  .pdp-nav-logo { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-dark); cursor: pointer; }
  .pdp-breadcrumb { font-size: 11px; color: var(--text-light); padding: 16px 48px; border-bottom: 1px solid var(--border-color); background: var(--bg-white); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
  .pdp-breadcrumb a { color: var(--text-light); text-decoration: none; cursor: pointer; transition: color 0.3s; }
  .pdp-breadcrumb a:hover { color: var(--text-dark); }
  .pdp-breadcrumb span { margin: 0 10px; color: var(--text-light); opacity: 0.5; }

  /* LAYOUT */
  .pdp-wrap { max-width: 1400px; margin: 0 auto; }
  .pdp-layout { display: grid; grid-template-columns: 1fr 480px; gap: 80px; min-height: calc(100vh - 80px); padding: 60px 48px; }

  /* GALLERY */
  .pdp-gallery { display: flex; flex-direction: column; align-items: center; }
  .pdp-gallery-main { width: 100%; max-width: 550px; aspect-ratio: 4/5; overflow: hidden; border-radius: 8px; background: var(--bg-offwhite); margin-bottom: 24px; }
  .pdp-gallery-main img { width: 100%; height: 100%; object-fit: cover; }
  .pdp-gallery-thumbs { display: flex; justify-content: center; gap: 16px; }
  .pdp-thumb { width: 80px; height: 80px; overflow: hidden; border-radius: 6px; background: var(--bg-offwhite); cursor: pointer; border: 2px solid transparent; transition: all 0.3s ease; opacity: 0.6; }
  .pdp-thumb:hover { opacity: 1; }
  .pdp-thumb.active { border-color: var(--text-dark); opacity: 1; }
  .pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* CONFIG PANEL */
  .pdp-config { padding: 0; position: sticky; top: 120px; max-height: calc(100vh - 140px); overflow-y: auto; padding-right: 16px; }
  .pdp-config::-webkit-scrollbar { width: 4px; }
  .pdp-config::-webkit-scrollbar-track { background: transparent; }
  .pdp-config::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
  
  .pdp-badge { display: inline-block; background: var(--text-dark); color: var(--bg-white); font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 4px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
  .pdp-title { font-family: 'Cinzel', serif; font-size: 42px; font-weight: 600; line-height: 1.1; margin-bottom: 24px; color: var(--text-dark); }
  .pdp-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border-color); margin-bottom: 24px; }
  .pdp-tab { padding: 12px 0; margin-right: 32px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--text-light); border-bottom: 2px solid transparent; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
  .pdp-tab:hover { color: var(--text-dark); }
  .pdp-tab.active { color: var(--text-dark); border-bottom-color: var(--text-dark); }
  .pdp-desc { font-size: 15px; color: var(--text-light); line-height: 1.8; margin-bottom: 16px; font-weight: 300; }
  .pdp-offer { font-size: 13px; color: var(--text-dark); line-height: 1.6; margin-bottom: 32px; background: var(--bg-offwhite); border-radius: 6px; padding: 16px 20px; border-left: 3px solid var(--accent); }
  .pdp-offer strong { display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; }

  .pdp-divider { border: none; border-top: 1px solid var(--border-color); margin: 24px 0; }

  /* OPTIONS */
  .pdp-option-row { margin-bottom: 24px; }
  .pdp-option-label { font-size: 12px; font-weight: 600; color: var(--text-dark); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
  .pdp-pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .pdp-pill { padding: 10px 20px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; background: var(--bg-white); color: var(--text-light); }
  .pdp-pill:hover { border-color: var(--text-dark); color: var(--text-dark); }
  .pdp-pill.selected { border-color: var(--text-dark); background: var(--text-dark); color: var(--bg-white); }
  .pdp-swatches { display: flex; gap: 12px; align-items: center; }
  .pdp-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 1px solid var(--border-color); transition: all 0.3s ease; }
  .pdp-swatch:hover { transform: scale(1.1); }
  .pdp-swatch.selected { border-color: var(--text-dark); outline: 2px solid var(--text-dark); outline-offset: 4px; }
  .pdp-swatch-label { font-size: 13px; color: var(--text-light); margin-top: 12px; font-weight: 500; }

  /* QUANTITY & PRICE */
  .pdp-qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
  .pdp-qty-select { flex: 1; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; font-family: 'Outfit', sans-serif; background: var(--bg-white); color: var(--text-dark); cursor: pointer; outline: none; }
  .pdp-min-note { font-size: 12px; color: var(--text-light); margin-bottom: 24px; font-weight: 300; }
  .pdp-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
  .pdp-price-label { font-size: 14px; color: var(--text-light); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
  .pdp-price-value { font-size: 32px; font-weight: 600; color: var(--text-dark); }
  .pdp-price-per { font-size: 14px; color: var(--text-light); font-weight: 300; }
  .pdp-cta { width: 100%; background: var(--btn-bg); color: var(--btn-text); border: none; border-radius: 4px; padding: 18px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .pdp-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); opacity: 0.9; }

  /* CUSTOMIZER ZONE EMBEDDED */
  .pdp-customizer-section { border-top: 1px solid var(--border-color); margin-top: 32px; padding-top: 32px; }
  .pdp-customizer-section h3 { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 600; margin-bottom: 12px; color: var(--text-dark); }
  .pdp-customizer-section p { font-size: 14px; color: var(--text-light); margin-bottom: 24px; font-weight: 300; line-height: 1.6; }
  .pdp-zone-info { background: var(--bg-offwhite); border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; border: 1px solid var(--border-color); }
  .pdp-zone-info h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-dark); margin-bottom: 12px; }
  .pdp-zone-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-light); padding: 6px 0; border-bottom: 1px solid var(--border-color); }
  .pdp-zone-row:last-child { border-bottom: none; padding-bottom: 0; }
  .pdp-zone-key { font-weight: 600; color: var(--text-dark); }
  .pdp-canvas-wrap { border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; background: var(--bg-offwhite); margin-bottom: 16px; }
  .pdp-canvas-controls { display: flex; gap: 12px; }
  .pdp-ctrl-btn { flex: 1; padding: 12px; border: 1px solid var(--border-color); background: var(--bg-white); color: var(--text-dark); border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; }
  .pdp-ctrl-btn:hover { border-color: var(--text-dark); background: var(--bg-offwhite); }
  .pdp-ctrl-btn.danger { border-color: rgba(220, 38, 38, 0.3); color: #dc2626; }
  .pdp-ctrl-btn.danger:hover { background: rgba(220, 38, 38, 0.05); border-color: #dc2626; }
  .pdp-upload-label { display: block; width: 100%; padding: 14px; background: var(--bg-white); color: var(--text-dark); border: 1px dashed var(--text-light); text-align: center; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; transition: all 0.3s ease; }
  .pdp-upload-label:hover { border-color: var(--text-dark); background: var(--bg-offwhite); }

  [data-theme="dark"] .pdp-upload-label { background: var(--bg-offwhite); border-color: var(--border-color); color: var(--text-dark); }
  [data-theme="dark"] .pdp-upload-label:hover { border-color: var(--text-light); }
  [data-theme="dark"] .pdp-ctrl-btn.danger { color: #fca5a5; }
`;

const CANVAS_W = 350;

export default function ProductDetail({ onBack, onNavigate, onCustomize, activeProductId = 'bottles', theme, toggleTheme, onAddToCart, cartCount = 0, onOpenCart, user, onOpenAuth, onLogout }) {
  const PRODUCT = PRODUCTS[activeProductId] || PRODUCTS.bottles;
  const IMAGES = PRODUCT.images;
  const PRINT_ZONES = PRODUCT.printZones;

  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [selSize, setSelSize] = useState(PRODUCT.sizes[0]);
  const [selColor, setSelColor] = useState(0);
  const [selCustom, setSelCustom] = useState([...PRODUCT.customizations]);
  const [textColor, setTextColor] = useState("#111111");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [selQty, setSelQty] = useState(PRODUCT.quantities[0]);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [printZoneObjs, setPrintZoneObjs] = useState([]);

  const totalPrice = PRODUCT.pricePerItem[selQty] * selQty;

  const handleAddToCart = () => {
    const cartId = `${activeProductId}-${selSize}-${PRODUCT.colors[selColor].name}`;
    onAddToCart && onAddToCart({
      cartId,
      name: PRODUCT.name,
      image: PRODUCT.colors[selColor]?.image || PRODUCT.images[0],
      size: selSize,
      color: PRODUCT.colors[selColor].name,
      customizations: selCustom,
      qty: selQty,
      minQty: PRODUCT.quantities[0],
      pricePerItem: PRODUCT.pricePerItem[selQty],
      allPrices: PRODUCT.pricePerItem,
    });
  };

  useEffect(() => {
    if (!document.querySelector("#pdp-styles")) {
      const tag = document.createElement("style");
      tag.id = "pdp-styles";
      tag.innerHTML = pdpStyles;
      document.head.appendChild(tag);
    }
    return () => {
      const tag = document.querySelector("#pdp-styles");
      if (tag) tag.remove();
    };
  }, []);

  // Init Fabric canvas
  useEffect(() => {
    let c = null;
    let mounted = true;
    const initCanvas = () => {
      if (!canvasRef.current) return;
      c = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_W,
        height: CANVAS_W, // Temporary height
        backgroundColor: null, // Transparent to show CSS background
      });

      const currentColor = PRODUCT.colors[selColor] || PRODUCT.colors[0];
      const activeImageSrc = currentColor.image || IMAGES[0];

      const htmlImg = new Image();
      htmlImg.src = activeImageSrc;
      htmlImg.onload = () => {
        // Guard: skip if the canvas was disposed before the image loaded
        if (!mounted || !c || c._disposed) return;

        const imgW = htmlImg.naturalWidth || 800;
        const imgH = htmlImg.naturalHeight || 800;

        // Calculate scale to fit container width exactly
        const scale = CANVAS_W / imgW;
        const finalHeight = imgH * scale;
        
        // Resize canvas to match the image aspect ratio exactly
        c.setDimensions({ width: CANVAS_W, height: finalHeight });
        
        // Use an ultra-reliable CSS background approach instead of Fabric image scaling
        const wrap = document.getElementById("pdp-canvas-wrap-id");
        if (wrap) {
          wrap.style.backgroundImage = `url("${activeImageSrc}")`;
          wrap.style.backgroundSize = "100% 100%";
          wrap.style.backgroundRepeat = "no-repeat";
          wrap.style.backgroundPosition = "center top";
        }
        
        // Handle overlay tinting for customizer canvas
        const tintOverlay = document.getElementById("pdp-canvas-tint-overlay");
        if (tintOverlay) {
          if (!currentColor.image && currentColor.hex !== '#ffffff') {
            tintOverlay.style.backgroundColor = currentColor.hex;
            tintOverlay.style.mixBlendMode = 'multiply';
            tintOverlay.style.opacity = '1';
          } else {
            tintOverlay.style.opacity = '0';
          }
        }

        const zones = [];
        PRINT_ZONES.forEach(zoneConfig => {
          const zone = new fabric.Rect({
            left: zoneConfig.px * CANVAS_W,
            top: zoneConfig.py * finalHeight,
            width: zoneConfig.pWidth * CANVAS_W,
            height: zoneConfig.pHeight * finalHeight,
            angle: zoneConfig.angle,
            fill: "transparent",
            stroke: "transparent", // Hidden as requested
            strokeWidth: 0,
            selectable: false,
            evented: false,
          });
          c.add(zone);
          zones.push(zone);
        });

        c.renderAll();
        setFabricCanvas(c);
        setPrintZoneObjs(zones);
      };
    };

    initCanvas();
    return () => {
      if (c) c.dispose();
    };
  }, [activeProductId, selColor]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !fabricCanvas || printZoneObjs.length === 0) return;
    const reader = new FileReader();
    reader.onload = async (f) => {
      const img = await fabric.FabricImage.fromURL(f.target.result);
      // default to first zone for initial placement
      const targetZone = printZoneObjs[0];
      img.scaleToWidth(targetZone.width * 0.8);
      img.set({
        left: targetZone.left + (targetZone.width - img.getScaledWidth()) / 2,
        top: targetZone.top + (targetZone.height - img.getScaledHeight()) / 2,
        cornerColor: "#008060",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: "#008060",
      });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    fabricCanvas.getActiveObjects().forEach((o) => fabricCanvas.remove(o));
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  return (
    <div className="pdp-wrap">
      {/* NAV */}
      <nav className="pdp-nav">
        <div className="pdp-nav-logo" onClick={onBack}>Hari Om Print House</div>
        <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
          {["Bottles", "Mugs", "Diaries", "Pens"].map(l => (
            <li key={l}>
              <a 
                href="#" 
                className="pdp-nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(l.toLowerCase()); }} 
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px" }}
              >
                {l}
              </a>
            </li>
          ))}
          <li>
            <a href="#" className="pdp-nav-link" onClick={(e) => { e.preventDefault(); toggleTheme && toggleTheme(); }} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </a>
          </li>
        </ul>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onLogout} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>Sign Out</button>
            </div>
          ) : (
            <button onClick={onOpenAuth} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '10px 20px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Outfit', sans-serif" }}>Sign In</button>
          )}
          <button
            onClick={onOpenCart}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 4, color: 'var(--text-dark)', transition: 'background 0.2s', display: 'flex', alignItems: 'center' }}
            title="View cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--accent)', color: '#0f1115', fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                {cartCount}
              </span>
            )}
          </button>
          <button style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)', padding: "12px 24px", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", transition: "all 0.3s ease" }}>
            Get Quote
          </button>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="pdp-breadcrumb">
        <a onClick={onBack}>Home</a>
        <span>/</span>
        <a href="#" style={{textTransform: 'capitalize'}}>{activeProductId}</a>
        <span>/</span>
        {PRODUCT.name}
      </div>

      {/* MAIN LAYOUT */}
      <div className="pdp-layout">
        {/* GALLERY */}
        <div className="pdp-gallery">
          <div className="pdp-gallery-main" style={{ position: 'relative', backgroundColor: '#f5f5f5' }}>
            <img 
              src={PRODUCT.colors[selColor]?.image || IMAGES[activeImg]} 
              alt="Main" 
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
            {/* Color Tint Overlay */}
            {!PRODUCT.colors[selColor]?.image && PRODUCT.colors[selColor]?.hex !== '#ffffff' && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  backgroundColor: PRODUCT.colors[selColor].hex,
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
          {IMAGES.length > 1 && (
            <div className="pdp-gallery-thumbs">
              {IMAGES.map((img, i) => (
                <div key={i} className={`pdp-thumb${activeImg === i ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Config */}
        <div className="pdp-config">
          <div className="pdp-badge">{PRODUCT.badge}</div>
          <h1 className="pdp-title">{PRODUCT.name}</h1>

          {/* TABS */}
          <div className="pdp-tabs">
            {["Description", "Features"].map(t => (
              <div key={t} className={`pdp-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>{t}</div>
            ))}
          </div>

          {activeTab === "Description" && (
            <>
              <p className="pdp-desc">{PRODUCT.description}</p>
              <div className="pdp-offer"><strong>Bundle & Save</strong>{PRODUCT.offer}</div>
            </>
          )}
          {activeTab === "Features" && (
            <ul style={{ paddingLeft: 18, fontSize: 14, color: "#555", lineHeight: 2, marginBottom: 20 }}>
              {PRODUCT.features && PRODUCT.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          )}

          <hr className="pdp-divider" />

          {/* SIZE */}
          <div className="pdp-option-row">
            <div className="pdp-option-label">Size</div>
            <div className="pdp-pills">
              {PRODUCT.sizes.map(s => (
                <div key={s} className={`pdp-pill${selSize === s ? " selected" : ""}`} onClick={() => setSelSize(s)}>{s}</div>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div className="pdp-option-row">
            <div className="pdp-option-label">Color</div>
            <div>
              <div className="pdp-swatches">
                {PRODUCT.colors.map((c, i) => (
                  <div key={c.name} className={`pdp-swatch${selColor === i ? " selected" : ""}`} style={{ background: c.hex }} onClick={() => setSelColor(i)} title={c.name} />
                ))}
              </div>
              <div className="pdp-swatch-label">{PRODUCT.colors[selColor].name}</div>
            </div>
          </div>

          {/* CUSTOMIZATION TYPE */}
          <div className="pdp-option-row">
            <div className="pdp-option-label">Customization</div>
            <div className="pdp-pills" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              {PRODUCT.customizations.map(c => (
                <div 
                  key={c} 
                  className={`pdp-pill${selCustom.includes(c) ? " selected" : ""}`} 
                  onClick={() => {
                    if (selCustom.includes(c)) {
                      if (selCustom.length > 1) setSelCustom(selCustom.filter(item => item !== c));
                    } else {
                      setSelCustom([...selCustom, c]);
                    }
                  }} 
                  style={{ width: "100%", borderRadius: 6 }}
                >
                  {c} {selCustom.includes(c) ? "✓" : "+"}
                </div>
              ))}
            </div>
          </div>

          <hr className="pdp-divider" />

          {/* QUANTITY */}
          <div className="pdp-option-row">
            <div className="pdp-option-label">Quantity</div>
            <div className="pdp-qty-row">
              <select className="pdp-qty-select" value={selQty} onChange={e => setSelQty(Number(e.target.value))}>
                {PRODUCT.quantities.map(q => <option key={q} value={q}>{q} items</option>)}
              </select>
            </div>
            <div className="pdp-min-note">(Minimum order {PRODUCT.quantities[0]} items)</div>
          </div>

          {/* PRICE */}
          <div className="pdp-price-row">
            <span className="pdp-price-label">Total price</span>
            <span className="pdp-price-value">₹{totalPrice.toLocaleString("en-IN")}</span>
            <span className="pdp-price-per">(₹{PRODUCT.pricePerItem[selQty]} per item)</span>
          </div>

          {/* ─── EMBEDDED CUSTOMIZER SECTION ─── */}
          <div className="pdp-customizer-section">
            <h3>Logo & Text Placement</h3>
            <p>Upload your logo and position it within the print zone. Drag, scale, and rotate to perfection.</p>

            {/* Print Zone coordinates from customization.json */}
            <div className="pdp-zone-info">
              <h4>📐 Print Zone Config</h4>
              {PRINT_ZONES.map((z) => (
                <div key={z.id} style={{marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #e5e5e5'}}>
                  <div style={{fontWeight: 600, color: '#333', fontSize: 12}}>{z.title}</div>
                  <div style={{fontSize: 11, color: '#666'}}>Shape: {z.shape} | X: {z.px*100}% | Y: {z.py*100}% | W: {z.pWidth*100}% | H: {z.pHeight*100}% | Angle: {z.angle}°</div>
                </div>
              ))}
            </div>

            {selCustom.includes("Image") && (
              <label className="pdp-upload-label">
                ↑ Upload Your Logo
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </label>
            )}

            {selCustom.includes("Text") && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select 
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    if (fabricCanvas) {
                      const activeObj = fabricCanvas.getActiveObject();
                      if (activeObj && activeObj.type === 'i-text') {
                        activeObj.set('fontFamily', e.target.value);
                        fabricCanvas.renderAll();
                      }
                    }
                  }}
                  style={{ padding: '10px', borderRadius: '6px', border: '1.5px solid #ddd', fontFamily: "'Inter', sans-serif", fontSize: '13px', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="Inter">Inter (Sans)</option>
                  <option value="Montserrat">Montserrat (Wide)</option>
                  <option value="Oswald">Oswald (Tall)</option>
                  <option value="Playfair Display">Playfair (Serif)</option>
                  <option value="Pacifico">Pacifico (Script)</option>
                </select>
                <input 
                  type="color" 
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    if (fabricCanvas) {
                      const activeObj = fabricCanvas.getActiveObject();
                      if (activeObj && activeObj.type === 'i-text') {
                        activeObj.set('fill', e.target.value);
                        fabricCanvas.renderAll();
                      }
                    }
                  }}
                  style={{ width: '40px', height: '40px', padding: '2px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', flexShrink: 0 }}
                  title="Choose text color"
                />
                <input 
                  type="text" 
                  placeholder="Enter custom text..." 
                  style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: '1.5px solid #ddd', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
                  id="customTextEntry"
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') document.getElementById('addTextBtn').click();
                  }}
                />
                <button 
                  id="addTextBtn"
                  className="pdp-ctrl-btn" 
                  style={{ flex: 'none', background: '#111', color: '#fff', borderColor: '#111', padding: '0 20px' }}
                  onClick={() => {
                    const text = document.getElementById("customTextEntry").value;
                    if (text && fabricCanvas && printZoneObjs.length > 0) {
                      const targetZone = printZoneObjs[0];
                      const textObj = new fabric.IText(text, {
                        left: targetZone.left + 10,
                        top: targetZone.top + 10,
                        fontFamily: fontFamily,
                        fill: textColor,
                        fontSize: 24,
                        cornerColor: "#008060",
                        cornerStyle: "circle",
                        transparentCorners: false,
                        borderColor: "#008060",
                      });
                      fabricCanvas.add(textObj);
                      fabricCanvas.setActiveObject(textObj);
                      fabricCanvas.renderAll();
                      document.getElementById("customTextEntry").value = "";
                    }
                  }}
                >
                  Add Text
                </button>
              </div>
            )}

            <div className="pdp-canvas-wrap" id="pdp-canvas-wrap-id" style={{ background: '#f9f9f9', position: 'relative' }}>
              <div 
                id="pdp-canvas-tint-overlay" 
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s',
                  zIndex: 0
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <canvas ref={canvasRef} />
              </div>
            </div>

            <div className="pdp-canvas-controls">
              <button className="pdp-ctrl-btn" onClick={() => { if (fabricCanvas) fabricCanvas.getActiveObjects().forEach(o => o.rotate((o.angle || 0) + 15)) && fabricCanvas.renderAll(); }}>↺ Rotate</button>
              <button className="pdp-ctrl-btn danger" onClick={handleDelete}>🗑 Delete</button>
            </div>
          </div>

          <button className="pdp-cta" onClick={handleAddToCart}>Add to Cart →</button>
        </div>
      </div>
    </div>
  );
}
