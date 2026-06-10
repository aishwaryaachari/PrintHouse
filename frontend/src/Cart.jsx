const cartStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  /* OVERLAY */
  .cart-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
    z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
  }
  .cart-overlay.open { opacity: 1; pointer-events: all; }

  /* DRAWER */
  .cart-drawer {
    position: fixed; top: 0; right: 0; height: 100vh; width: 480px; max-width: 100vw;
    background: var(--bg-white); z-index: 1000; display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: -20px 0 60px rgba(0,0,0,0.15);
  }
  .cart-drawer.open { transform: translateX(0); }

  /* HEADER */
  .cart-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 32px; border-bottom: 1px solid var(--border-color);
    background: var(--bg-white); flex-shrink: 0;
  }
  .cart-header-left { display: flex; align-items: center; gap: 14px; }
  .cart-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-dark); }
  .cart-count-badge {
    background: var(--text-dark); color: var(--bg-white); font-size: 11px; font-weight: 700;
    width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; letter-spacing: 0;
  }
  .cart-close {
    background: none; border: none; cursor: pointer; color: var(--text-light);
    font-size: 24px; line-height: 1; padding: 4px; border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }
  .cart-close:hover { color: var(--text-dark); background: var(--bg-offwhite); }

  /* BODY */
  .cart-body { flex: 1; overflow-y: auto; padding: 0; }
  .cart-body::-webkit-scrollbar { width: 4px; }
  .cart-body::-webkit-scrollbar-track { background: transparent; }
  .cart-body::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }

  /* EMPTY STATE */
  .cart-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100%; padding: 48px 32px; text-align: center; gap: 16px;
  }
  .cart-empty-icon { font-size: 64px; opacity: 0.3; }
  .cart-empty-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 600; color: var(--text-dark); }
  .cart-empty-sub { font-size: 14px; color: var(--text-light); font-weight: 300; line-height: 1.6; }

  /* CART ITEMS */
  .cart-item {
    display: flex; gap: 20px; padding: 24px 32px; border-bottom: 1px solid var(--border-color);
    transition: background 0.2s;
  }
  .cart-item:hover { background: var(--bg-offwhite); }
  .cart-item-img {
    width: 90px; height: 110px; object-fit: cover; border-radius: 6px;
    background: var(--bg-offwhite); flex-shrink: 0;
  }
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name { font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600; color: var(--text-dark); margin-bottom: 6px; line-height: 1.2; }
  .cart-item-meta { font-size: 12px; color: var(--text-light); margin-bottom: 4px; font-weight: 400; }
  .cart-item-meta span { margin-right: 10px; }
  .cart-item-price { font-size: 18px; font-weight: 600; color: var(--text-dark); margin-top: 8px; }
  .cart-item-per { font-size: 12px; color: var(--text-light); font-weight: 300; }
  .cart-item-qty { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
  .cart-qty-btn {
    width: 28px; height: 28px; border: 1px solid var(--border-color); background: var(--bg-white);
    color: var(--text-dark); border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 500;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .cart-qty-btn:hover { border-color: var(--text-dark); background: var(--bg-offwhite); }
  .cart-qty-val { font-size: 14px; font-weight: 600; color: var(--text-dark); min-width: 32px; text-align: center; }
  .cart-item-remove {
    background: none; border: none; cursor: pointer; color: var(--text-light);
    font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    padding: 0; margin-top: 8px; display: block; transition: color 0.2s;
  }
  .cart-item-remove:hover { color: #dc2626; }

  /* FOOTER */
  .cart-footer { padding: 24px 32px 32px; border-top: 1px solid var(--border-color); flex-shrink: 0; background: var(--bg-white); }
  .cart-summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .cart-summary-label { font-size: 13px; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
  .cart-summary-value { font-size: 13px; color: var(--text-dark); font-weight: 500; }
  .cart-total-row { display: flex; justify-content: space-between; align-items: baseline; margin: 16px 0 24px; padding-top: 16px; border-top: 1px solid var(--border-color); }
  .cart-total-label { font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-dark); }
  .cart-total-value { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: var(--text-dark); }
  .cart-checkout-btn {
    width: 100%; background: var(--btn-bg); color: var(--btn-text); border: none; border-radius: 4px;
    padding: 18px; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase;
    letter-spacing: 2px; font-family: 'Outfit', sans-serif; transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 12px;
  }
  .cart-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); opacity: 0.9; }
  .cart-continue-btn {
    width: 100%; background: transparent; color: var(--text-light); border: 1px solid var(--border-color);
    border-radius: 4px; padding: 14px; font-size: 12px; font-weight: 600; cursor: pointer;
    text-transform: uppercase; letter-spacing: 2px; font-family: 'Outfit', sans-serif; transition: all 0.3s ease;
  }
  .cart-continue-btn:hover { border-color: var(--text-dark); color: var(--text-dark); }

  /* TOAST */
  .cart-toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--text-dark); color: var(--bg-white); padding: 14px 28px; border-radius: 6px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.5px; z-index: 2000;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
    opacity: 0; pointer-events: none; white-space: nowrap; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    font-family: 'Outfit', sans-serif;
  }
  .cart-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
`;

export default function Cart({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout }) {
  // Inject styles once
  if (typeof document !== "undefined" && !document.querySelector("#cart-styles")) {
    const tag = document.createElement("style");
    tag.id = "cart-styles";
    tag.innerHTML = cartStyles;
    document.head.appendChild(tag);
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.pricePerItem * i.qty, 0);
  const savings = items.reduce((sum, i) => {
    const maxPrice = i.allPrices ? Math.max(...Object.values(i.allPrices)) : i.pricePerItem;
    return sum + (maxPrice - i.pricePerItem) * i.qty;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div className={`cart-overlay${isOpen ? " open" : ""}`} onClick={onClose} />

      {/* Drawer */}
      <div className={`cart-drawer${isOpen ? " open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <span className="cart-title">Your Cart</span>
            {items.length > 0 && <span className="cart-count-badge">{totalItems}</span>}
          </div>
          <button className="cart-close" onClick={onClose} title="Close cart">✕</button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <div className="cart-empty-title">Your cart is empty</div>
              <div className="cart-empty-sub">Add a product to get started.<br />Minimum order quantities apply.</div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.style.background = "var(--bg-offwhite)"; e.target.style.display = "none"; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="cart-item-meta">
                    <span>Customization: {item.customizations?.join(", ")}</span>
                  </div>
                  <div className="cart-item-price">
                    ₹{(item.pricePerItem * item.qty).toLocaleString("en-IN")}
                    <span className="cart-item-per"> (₹{item.pricePerItem}/item)</span>
                  </div>
                  <div className="cart-item-qty">
                    <button className="cart-qty-btn" onClick={() => onUpdateQty(item.cartId, Math.max(item.minQty, item.qty - item.minQty))}>−</button>
                    <span className="cart-qty-val">{item.qty}</span>
                    <button className="cart-qty-btn" onClick={() => onUpdateQty(item.cartId, item.qty + item.minQty)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => onRemove(item.cartId)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal ({totalItems} items)</span>
              <span className="cart-summary-value">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            {savings > 0 && (
              <div className="cart-summary-row">
                <span className="cart-summary-label" style={{ color: "#22c55e" }}>Volume Savings</span>
                <span className="cart-summary-value" style={{ color: "#22c55e" }}>−₹{savings.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <button className="cart-checkout-btn" onClick={onCheckout}>Submit Bulk Inquiry →</button>
            <button className="cart-continue-btn" onClick={onClose}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}
