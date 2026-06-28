import { useEffect, useRef, useState } from "react";
import { PRODUCT_GROUPS } from "./data";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import AuthModal from "./AuthModal";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --text-dark: #0f1115;
    --text-light: #5c6370;
    --brand-color: #0f1115;
    --btn-bg: #0f1115;
    --btn-text: #ffffff;
    --accent: #d4af37;
    --bg-white: #ffffff;
    --bg-offwhite: #f5f7fa;
    --nav-bg: rgba(255, 255, 255, 0.85);
    --border-color: rgba(15, 17, 21, 0.08);
  }

  [data-theme="dark"] {
    --text-dark: #ffffff;
    --text-light: #a0aabf;
    --brand-color: #ffffff;
    --btn-bg: #ffffff;
    --btn-text: #0f1115;
    --accent: #d4af37;
    --bg-white: #0f1115;
    --bg-offwhite: #16191f;
    --nav-bg: rgba(15, 17, 21, 0.85);
    --border-color: rgba(255, 255, 255, 0.08);
  }

  body { font-family: 'Outfit', sans-serif; background: var(--bg-white); color: var(--text-dark); -webkit-font-smoothing: antialiased; transition: background 0.3s ease; }

  /* NAV (Upper Container) */
  .moo-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid var(--border-color); background: var(--nav-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 100; transition: all 0.3s ease; }
  .moo-nav-logo { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-dark); }
  /* NAV LINKS */
  .moo-nav-links { display: flex; gap: 0; list-style: none; align-items: center; }
  .moo-nav-links > li { position: relative; }
  .moo-nav-links > li > a { display: block; padding: 8px 18px; font-size: 13px; font-weight: 500; color: var(--text-dark); text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px; transition: color 0.3s ease, opacity 0.3s ease; opacity: 0.8; }
  .moo-nav-links > li > a:hover { opacity: 1; color: var(--accent); }

  /* MEGA MENU */
  .moo-mega { position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%); background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.12); padding: 28px 32px; min-width: 680px; display: none; z-index: 200; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; }
  .moo-mega::before { content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: var(--bg-white); border-top: 1px solid var(--border-color); border-left: 1px solid var(--border-color); rotate: 45deg; }
  .moo-nav-links > li:hover .moo-mega { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; opacity: 1; pointer-events: all; }
  .moo-mega-group-title { font-size: 10px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); }
  .moo-mega-item { display: block; font-size: 13px; color: var(--text-light); text-decoration: none; padding: 6px 0; font-weight: 400; transition: color 0.2s, padding-left 0.2s; cursor: pointer; }
  .moo-mega-item:hover { color: var(--text-dark); padding-left: 6px; }

  /* NAV CART ICON */
  .moo-nav-cart { position: relative; background: none; border: none; cursor: pointer; padding: 8px; border-radius: 4px; color: var(--text-dark); transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
  .moo-nav-cart:hover { background: var(--bg-offwhite); }
  .moo-nav-cart svg { width: 22px; height: 22px; stroke: var(--text-dark); fill: none; }
  .moo-cart-badge { position: absolute; top: 2px; right: 2px; background: var(--accent); color: #0f1115; font-size: 10px; font-weight: 800; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
  .moo-nav-btn { background: var(--btn-bg); color: var(--btn-text); padding: 14px 28px; font-size: 12px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .moo-nav-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); opacity: 0.9; }

  /* HERO */
  .moo-hero { display: flex; align-items: center; justify-content: space-between; padding: 0; background: var(--bg-offwhite); min-height: 85vh; overflow: hidden; position: relative; }
  .moo-hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); pointer-events: none; z-index: 1; }
  [data-theme="dark"] .moo-hero::before { background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%); }
  
  .moo-hero-content { padding: 80px 10%; max-width: 50%; z-index: 2; position: relative; }
  .moo-hero-h1 { font-family: 'Cinzel', serif; font-size: 72px; font-weight: 600; line-height: 1.05; margin-bottom: 24px; color: var(--text-dark); letter-spacing: -1px; }
  .moo-hero-p { font-size: 18px; color: var(--text-light); line-height: 1.8; margin-bottom: 48px; font-weight: 300; max-width: 90%; }
  .moo-hero-image { flex: 1; height: 100%; min-height: 85vh; background: url('/hero_banner.png') center/cover no-repeat; position: relative; z-index: 2; box-shadow: -20px 0 50px rgba(0,0,0,0.05); }

  /* USP BAR */
  .moo-usp { display: flex; justify-content: center; gap: 80px; padding: 24px 48px; background: var(--bg-white); border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
  .moo-usp-item { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-light); text-transform: uppercase; letter-spacing: 2px; }

  /* CATEGORIES */
  .moo-categories { padding: 80px 48px 100px; max-width: 1400px; margin: 0 auto; }
  .moo-cat-title { font-family: 'Cinzel', serif; font-size: 48px; font-weight: 600; margin-bottom: 16px; color: var(--text-dark); text-align: center; }
  .moo-cat-sub { font-size: 16px; color: var(--text-light); margin-bottom: 64px; font-weight: 300; letter-spacing: 0.5px; text-align: center; }

  /* CATEGORY GROUP SECTIONS */
  .moo-section { margin-bottom: 72px; }
  .moo-section-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; display: flex; align-items: center; gap: 16px; }
  .moo-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border-color); }

  .moo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 28px; }
  .moo-card { text-align: left; cursor: pointer; }
  .moo-card-img-wrap { width: 100%; aspect-ratio: 3/4; overflow: hidden; background: var(--bg-offwhite); margin-bottom: 18px; border-radius: 8px; }
  .moo-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .moo-card:hover .moo-card-img { transform: scale(1.08); }
  .moo-card-title { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--text-dark); line-height: 1.3; }
  .moo-card-desc { font-size: 13px; color: var(--text-light); line-height: 1.6; margin-bottom: 14px; font-weight: 300; }
  .moo-card-link { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dark); border-bottom: 1px solid var(--text-dark); padding-bottom: 3px; display: inline-block; transition: color 0.3s, border-color 0.3s; }
  .moo-card:hover .moo-card-link { color: var(--accent); border-color: var(--accent); }

  /* INFO SECTION */
  .moo-info { background: var(--text-dark); color: #fff; display: grid; grid-template-columns: 1fr 1fr; }
  .moo-info-content { padding: 120px 10%; display: flex; flex-direction: column; justify-content: center; }
  .moo-info-h2 { font-family: 'Cinzel', serif; font-size: 56px; font-weight: 500; margin-bottom: 32px; line-height: 1.1; }
  .moo-info-p { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 48px; font-weight: 300; }
  .moo-info-btn { background: transparent; color: #fff; padding: 14px 32px; font-size: 12px; font-weight: 600; border: 1px solid #fff; border-radius: 4px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; display: inline-block; width: fit-content; transition: all 0.3s ease; }
  .moo-info-btn:hover { background: #fff; color: var(--text-dark); }
  .moo-info-visual { background: #1a1d24; display: flex; align-items: center; justify-content: center; min-height: 600px; color: #fff; font-family: 'Cinzel', serif; font-size: 36px; font-weight: 300; position: relative; overflow: hidden; }
  .moo-info-visual::after { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,0.1); pointer-events: none; }

  /* FOOTER */
  .moo-footer { padding: 80px 48px 40px; background: var(--bg-white); border-top: 1px solid var(--border-color); text-align: center; }
  .moo-footer-logo { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; margin-bottom: 32px; letter-spacing: 2px; text-transform: uppercase; }
  .moo-footer-links { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; }
  .moo-footer-links a { font-size: 12px; color: var(--text-light); text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transition: color 0.3s; }
  .moo-footer-links a:hover { color: var(--text-dark); }
  .moo-footer-copy { font-size: 13px; color: var(--text-light); font-weight: 300; }
`;

export default function App() {
  const [view, setView] = useState('home');
  const [theme, setTheme] = useState('light');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: '' }), 2800);
  };

  const handleAddToCart = (item) => {
    if (!user) { setAuthOpen(true); return; }
    setCartItems(prev => {
      const existing = prev.find(i => i.cartId === item.cartId);
      if (existing) {
        showToast(`Updated: ${item.name}`);
        return prev.map(i => i.cartId === item.cartId ? { ...i, qty: item.qty, pricePerItem: item.pricePerItem } : i);
      }
      showToast(`Added to cart: ${item.name}`);
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (cartId, newQty) => {
    setCartItems(prev => prev.map(i => {
      if (i.cartId !== cartId) return i;
      // Recalculate price based on new qty using stored price tiers
      const priceTiers = i.allPrices || {};
      const tiers = Object.keys(priceTiers).map(Number).sort((a, b) => a - b);
      let price = i.pricePerItem;
      for (const t of tiers) { if (newQty >= t) price = priceTiers[t]; }
      return { ...i, qty: newQty, pricePerItem: price };
    }));
  };

  const handleRemove = (cartId) => {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
  };

  const handleLogout = async () => {
    try { await fetch('http://127.0.0.1:8000/api/auth/logout/', { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null);
    showToast('Signed out successfully');
  };

  const handleCheckout = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const totalPrice = cartItems.reduce((sum, i) => sum + i.pricePerItem * i.qty, 0);
    const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/inquiry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          totalPrice,
          totalItems,
          email: user.email,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCartItems([]);
        setCartOpen(false);
        alert(`Bulk inquiry #${data.inquiry_id} submitted successfully! Our team will contact you shortly.`);
      } else {
        alert(data.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend database.');
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  useEffect(() => {
    if (!document.querySelector("#moo-styles")) {
      const tag = document.createElement("style");
      tag.id = "moo-styles";
      tag.innerHTML = styles;
      document.head.appendChild(tag);
    }
    return () => {
      const tag = document.querySelector("#moo-styles");
      if (tag) tag.remove();
    };
  }, []);

  if (view.startsWith('pdp')) {
    const activeProductId = view.split('-')[1] || 'bottles';
    return (
      <>
        <ProductDetail
          key={activeProductId}
          onBack={() => setView('home')}
          onNavigate={(cat) => setView(`pdp-${cat}`)}
          activeProductId={activeProductId}
          theme={theme}
          toggleTheme={toggleTheme}
          onAddToCart={handleAddToCart}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          user={user}
          onOpenAuth={() => setAuthOpen(true)}
          onLogout={handleLogout}
        />
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
        />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => { setUser(u); showToast(`Welcome, ${u.name}!`); }} />
        <div className={`cart-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
      </>
    );
  }

  return (
    <div>
      {/* NAV */}
      <nav className="moo-nav">
        <div className="moo-nav-logo">Hari Om Print House</div>
        <ul className="moo-nav-links">
          <li>
            <a href="#" onClick={e => e.preventDefault()}>Products ▾</a>
            <div className="moo-mega">
              {PRODUCT_GROUPS.map(g => (
                <div key={g.group}>
                  <div className="moo-mega-group-title">{g.group}</div>
                  {g.items.map(item => (
                    <span key={item.id} className="moo-mega-item" onClick={() => setView(`pdp-${item.id}`)}>{item.label}</span>
                  ))}
                </div>
              ))}
            </div>
          </li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); toggleTheme(); }}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</a></li>
        </ul>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '10px 18px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s' }}>Sign Out</button>
            </div>
          ) : (
            <button onClick={() => setAuthOpen(true)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '12px 24px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.3s ease' }}>Sign In</button>
          )}
          <button className="moo-nav-cart" onClick={() => setCartOpen(true)} title="View cart">
            <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="moo-cart-badge">{cartCount}</span>}
          </button>
          <button className="moo-nav-btn" onClick={() => setView('pdp-bottles')}>Shop Now</button>
        </div>
      </nav>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onUpdateQty={handleUpdateQty} onRemove={handleRemove} onCheckout={handleCheckout} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => { setUser(u); showToast(`Welcome, ${u.name}!`); }} />
      <div className={`cart-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>

      {/* HERO */}
      <section className="moo-hero">
        <div className="moo-hero-content">
          <h1 className="moo-hero-h1">Make your mark.</h1>
          <p className="moo-hero-p">Premium corporate stationery, beautifully printed. Upload your brand logo and we'll craft the perfect physical experience for your team and clients.</p>
          <button className="moo-nav-btn" onClick={() => setView('pdp-bottles')}>Start Creating</button>
        </div>
        <div className="moo-hero-image"></div>
      </section>

      {/* USP BAR */}
      <div className="moo-usp">
        <div className="moo-usp-item">✦ Premium Materials</div>
        <div className="moo-usp-item">✦ Next-Day Dispatch Available</div>
        <div className="moo-usp-item">✦ Volume Discounts</div>
      </div>

      {/* CATEGORIES */}
      <section className="moo-categories">
        <h2 className="moo-cat-title">Explore the Collection</h2>
        <p className="moo-cat-sub">High-quality products designed to showcase your brand beautifully.</p>

        {PRODUCT_GROUPS.map(g => (
          <div key={g.group} className="moo-section">
            <div className="moo-section-label">{g.group}</div>
            <div className="moo-grid">
              {g.items.map(item => {
                const PRODUCTS_MAP = {
                  bottles:        { img: '/products/bottles/bottle_white.png',                   desc: 'Double-walled insulated bottles. Perfect for laser engraving or vibrant wrap printing.' },
                  mugs:           { img: '/products/mugs/mug_white.png',                          desc: 'Classic ceramic mugs. High-definition sublimation ensures your logo never fades.' },
                  diaries:        { img: '/products/diaries/diary_leather_black.png',             desc: 'Premium leather hardcover diary with ribbon bookmark and 80gsm ruled pages.' },
                  spiral_diaries: { img: '/products/diaries/spiral_black.png',                   desc: 'Spiral-bound notebooks that lay flat. Ideal for meetings and everyday notes.' },
                  pens:           { img: '/products/pens/pen_black.png',                         desc: 'Heavy metallic rollerball pens ideal for laser engraving and gifting.' },
                  business_cards: { img: '/products/business_cards/card_white.png',              desc: 'Premium 350gsm cards with matte, gloss, spot UV and embossed finishes.' },
                  id_cards:       { img: '/products/id_cards/pvc_id_card.png',                   desc: 'Durable PVC ID cards with full-colour print and optional RFID chip.' },
                  lanyards:       { img: '/products/lanyards/polyester_lanyard_blue.png',        desc: 'Full-colour sublimation polyester & satin lanyards for events and offices.' },
                  tshirts:        { img: '/products/tshirts/polo_white.png',                     desc: '220gsm cotton-polyester polo shirts with chest embroidery or screen print.' },
                  bags:           { img: '/products/bags/tote_bag.png',                          desc: 'Tote bags, laptop bags and backpacks fully customised with your logo.' },
                  caps:           { img: '/products/caps/cap_black.png',                         desc: 'Structured 6-panel baseball caps with front panel embroidery.' },
                  stickers:       { img: '/products/stickers/vinyl_sticker.png',                 desc: 'Weatherproof vinyl stickers in glossy, matte and holographic finishes.' },
                  packaging:      { img: '/products/packaging/gift_box_black.png',               desc: 'Premium branded gift boxes and paper bags that elevate every unboxing.' },
                  keychains:      { img: '/products/keychains/metal_keychain.png',               desc: 'Acrylic, metal, wood and leather keychains with logo engraving.' },
                  awards:         { img: '/products/awards/crystal_trophy.png',                  desc: 'Crystal trophies, wooden plaques and medals with precision engraving.' },
                  office:         { img: '/products/office/mouse_pad_black.png',                 desc: 'Mouse pads, desk calendars and office accessories with full-colour print.' },
                };
                const meta = PRODUCTS_MAP[item.id] || { img: '/products/bottles/stainless_steel_bottle_silver.png', desc: '' };
                return (
                  <div key={item.id} className="moo-card" onClick={() => setView(`pdp-${item.id}`)}>
                    <div className="moo-card-img-wrap">
                      <img src={meta.img} alt={item.label} className="moo-card-img" />
                    </div>
                    <h3 className="moo-card-title">{item.label}</h3>
                    <p className="moo-card-desc">{meta.desc}</p>
                    <span className="moo-card-link">Shop Now →</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* INFO SECTION */}
      <section className="moo-info">
        <div className="moo-info-content">
          <h2 className="moo-info-h2">The Design Engine.</h2>
          <p className="moo-info-p">We don't just print; we engineer perfection. Our live 3D customizer lets you place your logo exactly where you want it. Curve it, scale it, preview it. What you see is exactly what we print on our factory floor.</p>
          <button className="moo-info-btn" onClick={() => setView('pdp-bottles')}>Try Customizer</button>
        </div>
        <div className="moo-info-visual">
          "Quality is our signature."
        </div>
      </section>

      {/* FOOTER */}
      <footer className="moo-footer">
        <div className="moo-footer-logo">Hari Om Print House</div>
        <div className="moo-footer-address" style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "32px", lineHeight: "1.6" }}>
          Office no 9, Ground Floor, Mehta chambers, East,<br />
          Kalyan St, Dana Bandar, Masjid Bandar,<br />
          Mumbai, Maharashtra 400009
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", gap: "64px", marginBottom: "40px", textAlign: "left" }}>
          <div>
            <div className="moo-footer-heading" style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Products</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Steel Bottles", "Ceramic Mugs", "Business Cards", "ID Cards", "Lanyards", "T-Shirts", "Bags", "Caps", "Keychains", "Awards"].map((i) => <li key={i}><a href="#" style={{ color: "var(--text-light)", textDecoration: "none", fontSize: "13px" }}>{i}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="moo-footer-heading" style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Services</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Bulk Inquiries", "Custom Packaging", "Pan-India Delivery"].map((i) => <li key={i}><a href="#" style={{ color: "var(--text-light)", textDecoration: "none", fontSize: "13px" }}>{i}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="moo-footer-heading" style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Company</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {["About Us", "Contact", "Privacy Policy", "Terms"].map((i) => <li key={i}><a href="#" style={{ color: "var(--text-light)", textDecoration: "none", fontSize: "13px" }}>{i}</a></li>)}
            </ul>
          </div>
        </div>
        
        <div className="moo-footer-copy">© 2026 Hari Om Print House. All rights reserved. Elevating B2B gifting.</div>
      </footer>
    </div>
  );
}
