import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { PRODUCTS, PRODUCT_GROUPS } from "./data";

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

export default function ProductDetail({ onBack, onNavigate, onCustomize, activeProductId = 'bottles', theme, toggleTheme, onAddToCart, cartCount = 0, onOpenCart, user, onOpenAuth, onLogout, onGoToDashboard }) {
  // DB Catalog State
  const [dbProducts, setDbProducts] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auth/products/")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setDbProducts(data);
        }
      })
      .catch(err => console.error("Error loading products from SQLite DB:", err));
  }, []);

  const activeCatalog = dbProducts || PRODUCTS;
  const PRODUCT = activeCatalog[activeProductId] || activeCatalog.bottles;
  const IMAGES = PRODUCT.images;
  const PRINT_ZONES = PRODUCT.printZones;

  const getSavedDesignVal = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`hoph_design_${activeProductId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed[key] !== undefined) {
          return parsed[key];
        }
      }
    } catch (e) {}
    return fallback;
  };

  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [selSize, setSelSize] = useState(() => getSavedDesignVal("selSize", PRODUCT.sizes[0]));
  const [selColor, setSelColor] = useState(() => getSavedDesignVal("selColor", 0));
  const [selCustom, setSelCustom] = useState(() => getSavedDesignVal("selCustom", [...PRODUCT.customizations]));
  const [textColor, setTextColor] = useState(() => getSavedDesignVal("textColor", "#111111"));
  const [fontFamily, setFontFamily] = useState(() => getSavedDesignVal("fontFamily", "Inter"));
  const [selQty, setSelQty] = useState(() => getSavedDesignVal("selQty", PRODUCT.quantities[0]));
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [printZoneObjs, setPrintZoneObjs] = useState([]);

  // Customizer States
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Sync state if catalog/activeProduct changes
  useEffect(() => {
    if (PRODUCT) {
      const saved = localStorage.getItem(`hoph_design_${activeProductId}`);
      let savedParsed = null;
      if (saved) {
        try { savedParsed = JSON.parse(saved); } catch {}
      }
      setSelSize(savedParsed && savedParsed.selSize !== undefined ? savedParsed.selSize : PRODUCT.sizes[0]);
      setSelColor(savedParsed && savedParsed.selColor !== undefined ? savedParsed.selColor : 0);
      setSelCustom(savedParsed && savedParsed.selCustom !== undefined ? savedParsed.selCustom : [...PRODUCT.customizations]);
      setSelQty(savedParsed && savedParsed.selQty !== undefined ? savedParsed.selQty : PRODUCT.quantities[0]);
      setActiveImg(0);
    }
  }, [activeProductId, dbProducts]);

  const totalPrice = PRODUCT.pricePerItem[selQty] * selQty;

  const handleAddToCart = () => {
    const cartId = `${activeProductId}-${selSize}-${PRODUCT.colors[selColor].name}`;
    let designJson = null;
    if (fabricCanvas) {
      designJson = fabricCanvas.toJSON();
    }
    onAddToCart && onAddToCart({
      cartId,
      productId: activeProductId,
      name: PRODUCT.name,
      image: PRODUCT.colors[selColor]?.image || PRODUCT.images[0],
      size: selSize,
      color: PRODUCT.colors[selColor].name,
      customizations: selCustom,
      qty: selQty,
      minQty: PRODUCT.quantities[0],
      pricePerItem: PRODUCT.pricePerItem[selQty],
      allPrices: PRODUCT.pricePerItem,
      design: designJson,
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

  // History Helper (Undo/Redo)
  const saveState = (canvasInstance) => {
    const canvas = canvasInstance || fabricCanvas;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIdx + 1);
      newHistory.push(json);
      setHistoryIdx(newHistory.length - 1);
      return newHistory;
    });
  };

  const undo = () => {
    if (historyIdx > 0 && fabricCanvas) {
      const prevIdx = historyIdx - 1;
      fabricCanvas.loadFromJSON(history[prevIdx]).then(() => {
        fabricCanvas.renderAll();
        setHistoryIdx(prevIdx);
      });
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1 && fabricCanvas) {
      const nextIdx = historyIdx + 1;
      fabricCanvas.loadFromJSON(history[nextIdx]).then(() => {
        fabricCanvas.renderAll();
        setHistoryIdx(nextIdx);
      });
    }
  };

  // Keyboard Shortcuts for Undo/Redo (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIdx, fabricCanvas]);

  // Layer Controls
  const bringToFront = () => {
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj) {
      fabricCanvas.bringObjectToFront(activeObj);
      fabricCanvas.renderAll();
      saveState();
    }
  };

  const sendToBack = () => {
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj) {
      fabricCanvas.sendObjectToBack(activeObj);
      fabricCanvas.renderAll();
      saveState();
    }
  };

  const moveForward = () => {
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj) {
      fabricCanvas.bringObjectForward(activeObj);
      fabricCanvas.renderAll();
      saveState();
    }
  };

  const moveBackward = () => {
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj) {
      fabricCanvas.sendObjectBackward(activeObj);
      fabricCanvas.renderAll();
      saveState();
    }
  };

  // Lock / Unlock Position
  const toggleLock = () => {
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj) {
      const nextLock = !isLocked;
      activeObj.set({
        lockMovementX: nextLock,
        lockMovementY: nextLock,
        lockScalingX: nextLock,
        lockScalingY: nextLock,
        lockRotation: nextLock,
        hasControls: !nextLock
      });
      setIsLocked(nextLock);
      fabricCanvas.renderAll();
      saveState();
    }
  };

  // Safety wrapper for back and category navigation
  const handleBackSafe = (e) => {
    if (e) e.preventDefault();
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects().filter(o => o.id !== 'guide-v' && o.id !== 'guide-h');
      if (objects.length > 0) {
        const confirmLeave = window.confirm("You have a customized design. Are you sure you want to leave this page?");
        if (!confirmLeave) return;
      }
    }
    onBack && onBack();
  };

  const handleNavigateSafe = (category) => {
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects().filter(o => o.id !== 'guide-v' && o.id !== 'guide-h');
      if (objects.length > 0) {
        const confirmLeave = window.confirm("You have a customized design. Are you sure you want to leave this page?");
        if (!confirmLeave) return;
      }
    }
    onNavigate && onNavigate(category);
  };

  // Warn before unloading / reloading tab if canvas has user designs
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (fabricCanvas) {
        const objects = fabricCanvas.getObjects().filter(o => o.id !== 'guide-v' && o.id !== 'guide-h');
        if (objects.length > 0) {
          e.preventDefault();
          e.returnValue = "You have a customized design in progress. Are you sure you want to leave?";
          return e.returnValue;
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [fabricCanvas, historyIdx]);

  // Init Fabric canvas
  useEffect(() => {
    let c = null;
    let mounted = true;
    
    const setupListeners = (canvasObj) => {
      const SNAP_THRESHOLD = 15;
      const addGuideLines = (x, y) => {
        canvasObj.getObjects().filter(o => o.id === 'guide-h' || o.id === 'guide-v').forEach(o => canvasObj.remove(o));
        
        if (x !== null) {
          const vLine = new fabric.Line([x, 0, x, canvasObj.height], {
            stroke: '#dc2626',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            strokeDashArray: [4, 4],
            id: 'guide-v'
          });
          canvasObj.add(vLine);
        }
        if (y !== null) {
          const hLine = new fabric.Line([0, y, canvasObj.width, y], {
            stroke: '#dc2626',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            strokeDashArray: [4, 4],
            id: 'guide-h'
          });
          canvasObj.add(hLine);
        }
      };

      const removeGuideLines = () => {
        canvasObj.getObjects().filter(o => o.id === 'guide-h' || o.id === 'guide-v').forEach(o => canvasObj.remove(o));
      };

      canvasObj.on('object:moving', (e) => {
        const obj = e.target;
        if (!obj || obj.id === 'guide-h' || obj.id === 'guide-v') return;

        const canvasCenterX = canvasObj.width / 2;
        const canvasCenterY = canvasObj.height / 2;
        const objCenter = obj.getCenterPoint();
        let snapX = null;
        let snapY = null;

        if (PRODUCT.snapGuidesEnabled !== false && Math.abs(objCenter.x - canvasCenterX) < SNAP_THRESHOLD) {
          obj.set({ left: canvasCenterX - obj.getScaledWidth() / 2 });
          snapX = canvasCenterX;
        }
        if (PRODUCT.snapGuidesEnabled !== false && Math.abs(objCenter.y - canvasCenterY) < SNAP_THRESHOLD) {
          obj.set({ top: canvasCenterY - obj.getScaledHeight() / 2 });
          snapY = canvasCenterY;
        }

        if (PRODUCT.snapGuidesEnabled !== false && (snapX !== null || snapY !== null)) {
          addGuideLines(snapX, snapY);
        } else {
          removeGuideLines();
        }
        canvasObj.renderAll();
      });

      canvasObj.on('object:scaling', (e) => {
        const obj = e.target;
        if (obj) {
          const maxDim = PRODUCT.maxLogoSize || 150;
          if (obj.getScaledWidth() > maxDim) obj.scaleToWidth(maxDim);
          if (obj.getScaledHeight() > maxDim) obj.scaleToHeight(maxDim);
        }
      });

      canvasObj.on('object:rotating', (e) => {
        const obj = e.target;
        if (obj) {
          setRotationAngle(Math.round(obj.angle || 0));
        }
      });

      canvasObj.on('selection:created', (ev) => {
        const obj = ev.selected[0];
        if (obj) {
          setRotationAngle(Math.round(obj.angle || 0));
          setIsLocked(!!obj.lockMovementX);
        }
      });

      canvasObj.on('selection:updated', (ev) => {
        const obj = ev.selected[0];
        if (obj) {
          setRotationAngle(Math.round(obj.angle || 0));
          setIsLocked(!!obj.lockMovementX);
        }
      });

      canvasObj.on('selection:cleared', () => {
        setRotationAngle(0);
        setIsLocked(false);
      });

      canvasObj.on('mouse:up', () => {
        removeGuideLines();
        canvasObj.renderAll();
      });

      canvasObj.on('object:added', (ev) => {
        if (ev.target && ev.target.id !== 'guide-v' && ev.target.id !== 'guide-h') {
          const jsonState = JSON.stringify(canvasObj.toJSON());
          setHistory(prev => {
            const newHist = prev.slice(0, historyIdx + 1);
            newHist.push(jsonState);
            setHistoryIdx(newHist.length - 1);
            return newHist;
          });
        }
      });

      canvasObj.on('object:modified', () => {
        const jsonState = JSON.stringify(canvasObj.toJSON());
        setHistory(prev => {
          const newHist = prev.slice(0, historyIdx + 1);
          newHist.push(jsonState);
          setHistoryIdx(newHist.length - 1);
          return newHist;
        });
      });

      canvasObj.on('object:removed', (ev) => {
        if (ev.target && ev.target.id !== 'guide-v' && ev.target.id !== 'guide-h') {
          const jsonState = JSON.stringify(canvasObj.toJSON());
          setHistory(prev => {
            const newHist = prev.slice(0, historyIdx + 1);
            newHist.push(jsonState);
            setHistoryIdx(newHist.length - 1);
            return newHist;
          });
        }
      });
    };

    const initCanvas = () => {
      if (!canvasRef.current) return;
      c = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_W,
        height: CANVAS_W,
        backgroundColor: null,
      });

      const currentColor = PRODUCT.colors[selColor] || PRODUCT.colors[0];
      const activeImageSrc = currentColor.image || IMAGES[0];

      const htmlImg = new Image();
      htmlImg.src = activeImageSrc;
      htmlImg.onload = () => {
        if (!mounted || !c || c._disposed) return;

        const imgW = htmlImg.naturalWidth || 800;
        const imgH = htmlImg.naturalHeight || 800;
        const scale = CANVAS_W / imgW;
        const finalHeight = imgH * scale;
        
        c.setDimensions({ width: CANVAS_W, height: finalHeight });
        
        const wrap = document.getElementById("pdp-canvas-wrap-id");
        if (wrap) {
          wrap.style.backgroundImage = `url("${activeImageSrc}")`;
          wrap.style.backgroundSize = "100% 100%";
          wrap.style.backgroundRepeat = "no-repeat";
          wrap.style.backgroundPosition = "center top";
        }
        
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

        c.renderAll();

        const savedDesignKey = `hoph_design_${activeProductId}`;
        const savedDesign = localStorage.getItem(savedDesignKey);
        if (savedDesign) {
          try {
            const parsed = JSON.parse(savedDesign);
            if (parsed.canvas) {
              c.loadFromJSON(parsed.canvas).then(() => {
                if (!mounted) return;
                c.renderAll();
                setupListeners(c);
                setFabricCanvas(c);
                setHistory([JSON.stringify(c.toJSON())]);
                setHistoryIdx(0);
              });
              return;
            }
          } catch (e) {
            console.error("Error restoring design:", e);
          }
        }

        setupListeners(c);
        setFabricCanvas(c);
        setHistory([JSON.stringify(c.toJSON())]);
        setHistoryIdx(0);
      };
    };

    initCanvas();
    return () => {
      mounted = false;
      if (c) c.dispose();
    };
  }, [activeProductId, selColor, dbProducts]);

  // Auto-save user customization progress
  useEffect(() => {
    if (fabricCanvas) {
      const dataToSave = {
        selSize,
        selColor,
        selCustom,
        selQty,
        textColor,
        fontFamily,
        canvas: fabricCanvas.toJSON()
      };
      localStorage.setItem(`hoph_design_${activeProductId}`, JSON.stringify(dataToSave));
    }
  }, [selSize, selColor, selCustom, selQty, textColor, fontFamily, fabricCanvas, historyIdx]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !fabricCanvas) return;
    const reader = new FileReader();
    reader.onload = async (f) => {
      const img = await fabric.FabricImage.fromURL(f.target.result);
      
      const defaultLogoSize = PRODUCT.defaultLogoSize || 120;
      img.scaleToWidth(defaultLogoSize);

      // Centered position
      const centerLeft = (fabricCanvas.width - img.getScaledWidth()) / 2;
      const centerTop = (fabricCanvas.height - img.getScaledHeight()) / 2;

      img.set({
        left: centerLeft,
        top: centerTop,
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
        <div className="pdp-nav-logo" onClick={handleBackSafe}>Hari Om Print House</div>
        <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
          {["Bottles", "Mugs", "Diaries", "Pens"].map(l => (
            <li key={l}>
              <a 
                href="#" 
                className="pdp-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavigateSafe(l.toLowerCase()); }} 
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px" }}
              >
                {l}
              </a>
            </li>
          ))}
          <li>
            <a href="#" className="pdp-nav-link" onClick={(e) => { e.preventDefault(); toggleTheme && toggleTheme(); }} style={{ display: 'block', padding: '8px 18px', fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', textDecoration: "none", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </a>
          </li>
        </ul>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500, cursor: 'pointer' }} onClick={onGoToDashboard}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onGoToDashboard} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif" }}>My Orders</button>
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
        <a onClick={handleBackSafe}>Home</a>
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
            <h3>Logo & Text Customization</h3>
            <p>Upload your logo or type custom text. Click, drag, scale, and rotate objects directly on the product.</p>

            {/* Undo / Redo Control Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button 
                className="pdp-ctrl-btn" 
                onClick={undo} 
                disabled={historyIdx <= 0}
                style={{ opacity: historyIdx <= 0 ? 0.5 : 1, cursor: historyIdx <= 0 ? 'not-allowed' : 'pointer' }}
              >
                ↩ Undo
              </button>
              <button 
                className="pdp-ctrl-btn" 
                onClick={redo} 
                disabled={historyIdx >= history.length - 1}
                style={{ opacity: historyIdx >= history.length - 1 ? 0.5 : 1, cursor: historyIdx >= history.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                ↪ Redo
              </button>
            </div>

            {selCustom.includes("Image") && PRODUCT.logoCustomizationEnabled !== false && (
              <label className="pdp-upload-label" style={{ display: 'block', marginBottom: '16px', textAlign: 'center', background: '#008060', color: '#fff', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                ↑ Upload Your Logo (Max: {PRODUCT.maxLogoSize || 150}px)
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </label>
            )}

            {selCustom.includes("Text") && PRODUCT.textCustomizationEnabled !== false && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select 
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    if (fabricCanvas) {
                      const activeObj = fabricCanvas.getActiveObject();
                      if (activeObj && activeObj.type === 'i-text') {
                        activeObj.set('fontFamily', e.target.value);
                        fabricCanvas.renderAll();
                        saveState();
                      }
                    }
                  }}
                  style={{ padding: '10px', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontFamily: "'Inter', sans-serif", fontSize: '13px', background: '#fff', color: '#111', cursor: 'pointer' }}
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
                        saveState();
                      }
                    }
                  }}
                  style={{ width: '40px', height: '40px', padding: '2px', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#fff', flexShrink: 0 }}
                  title="Choose text color"
                />
                <input 
                  type="text" 
                  placeholder={`Enter text (Max ${PRODUCT.maxTextLength || 50} chars)...`}
                  style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontFamily: "'Inter', sans-serif", fontSize: '13px', background: '#fff', color: '#111' }}
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
                    let text = document.getElementById("customTextEntry").value;
                    if (text && fabricCanvas) {
                      // Truncate to validation character limit
                      const maxChar = PRODUCT.maxTextLength || 50;
                      if (text.length > maxChar) {
                        text = text.substring(0, maxChar);
                      }
                      
                      const textObj = new fabric.IText(text, {
                        fontFamily: fontFamily,
                        fill: textColor,
                        fontSize: PRODUCT.defaultTextSize || 24,
                        cornerColor: "#008060",
                        cornerStyle: "circle",
                        transparentCorners: false,
                        borderColor: "#008060",
                      });
                      
                      // Auto centering on entire canvas area
                      const centerLeft = (fabricCanvas.width - textObj.getScaledWidth()) / 2;
                      const centerTop = (fabricCanvas.height - textObj.getScaledHeight()) / 2;
                      
                      textObj.set({
                        left: centerLeft,
                        top: centerTop
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

            {/* Simple Locking options for canvas-style manipulation */}
            {fabricCanvas && fabricCanvas.getActiveObject() && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  className="pdp-ctrl-btn" 
                  style={{ 
                    flex: 1,
                    background: isLocked ? '#111' : 'transparent', 
                    color: isLocked ? '#fff' : 'var(--text-dark)',
                    borderColor: isLocked ? '#111' : 'var(--border-color)',
                    padding: '10px'
                  }} 
                  onClick={toggleLock}
                >
                  {isLocked ? '🔓 Unlock Object' : '🔒 Lock Position'}
                </button>
              </div>
            )}

            <div className="pdp-canvas-wrap" id="pdp-canvas-wrap-id" style={{ background: '#f9f9f9', position: 'relative', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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

            <div className="pdp-canvas-controls" style={{ marginTop: '16px', marginBottom: '16px' }}>
              <button className="pdp-ctrl-btn danger" style={{ flex: 'none', width: '100%' }} onClick={handleDelete}>🗑 Delete Selected</button>
            </div>
          </div>

          <button className="pdp-cta" onClick={handleAddToCart}>Add to Cart →</button>
        </div>
      </div>
    </div>
  );
}
