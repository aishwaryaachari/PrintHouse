import React, { useState } from 'react';

const checkoutStyles = `
  .checkout-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 17, 21, 0.7); backdrop-filter: blur(8px);
    z-index: 1100; display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .checkout-modal-overlay.open { opacity: 1; pointer-events: auto; }
  .checkout-modal-container {
    background: var(--bg-white); color: var(--text-dark);
    width: 90%; max-width: 750px; max-height: 90vh;
    border-radius: 12px; box-shadow: 0 24px 60px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; overflow: hidden;
    transform: scale(0.95); transition: transform 0.3s ease;
    font-family: 'Outfit', sans-serif; border: 1px solid var(--border-color);
  }
  .checkout-modal-overlay.open .checkout-modal-container { transform: scale(1); }
  
  .checkout-modal-header {
    padding: 24px 32px; border-bottom: 1px solid var(--border-color);
    display: flex; align-items: center; justify-content: space-between;
  }
  .checkout-modal-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; }
  .checkout-modal-close {
    background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-light);
  }
  
  .checkout-modal-content {
    padding: 32px; overflow-y: auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px;
  }
  @media (max-width: 768px) {
    .checkout-modal-content { grid-template-columns: 1fr; gap: 24px; padding: 20px; }
  }
  
  .checkout-form-group { margin-bottom: 18px; }
  .checkout-form-label {
    display: block; font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; color: var(--text-light); margin-bottom: 6px;
  }
  .checkout-form-input {
    width: 100%; border: 1px solid var(--border-color); border-radius: 6px;
    padding: 10px 14px; font-size: 14px; background: var(--bg-white); color: var(--text-dark);
    font-family: 'Outfit', sans-serif; box-sizing: border-box; transition: border-color 0.2s;
  }
  .checkout-form-input:focus { border-color: var(--text-dark); outline: none; }
  .checkout-form-textarea { resize: vertical; min-height: 80px; }
  
  .checkout-summary-box {
    background: var(--bg-offwhite); border-radius: 8px; padding: 24px;
    border: 1px dashed var(--border-color); display: flex; flex-direction: column;
  }
  .checkout-summary-title {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px; color: var(--text-dark);
  }
  .checkout-summary-item {
    display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;
    color: var(--text-light);
  }
  .checkout-summary-item strong { color: var(--text-dark); }
  .checkout-summary-divider {
    border-top: 1px solid var(--border-color); margin: 16px 0;
  }
  .checkout-summary-total {
    display: flex; justify-content: space-between; font-size: 16px; font-weight: 700;
    color: var(--text-dark); margin-bottom: 24px;
  }
  
  .checkout-submit-btn {
    width: 100%; background: var(--text-dark); color: var(--bg-white);
    border: none; border-radius: 6px; padding: 14px; font-size: 14px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: background 0.2s;
  }
  .checkout-submit-btn:hover { background: #2c2f36; }
  .checkout-submit-btn:disabled { background: var(--border-color); cursor: not-allowed; }
  
  .checkout-error {
    color: #c5221f; font-size: 13px; font-weight: 500; margin-bottom: 16px;
    display: block;
  }
`;

export default function CheckoutModal({ isOpen, onClose, items, totalPrice, totalItems, email, onSubmitSuccess }) {
  // Inject styles
  React.useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector("#checkout-styles")) {
      const tag = document.createElement("style");
      tag.id = "checkout-styles";
      tag.innerHTML = checkoutStyles;
      document.head.appendChild(tag);
    }
  }, []);

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !phoneNumber || !deliveryAddress) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/inquiry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items,
          totalPrice,
          totalItems,
          email,
          companyName,
          contactPerson,
          phoneNumber,
          gstNumber,
          deliveryAddress,
          notes,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSubmitSuccess(data.inquiry_id, totalPrice);
      } else {
        setErrorMsg(data.error || 'Failed to submit B2B inquiry.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`checkout-modal-overlay${isOpen ? " open" : ""}`} onClick={onClose}>
      <div className="checkout-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <span className="checkout-modal-title">B2B Order Checkout</span>
          <button className="checkout-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-modal-content">
          {/* Left Form */}
          <div className="checkout-form-left">
            <div className="checkout-form-group">
              <label className="checkout-form-label">Company Name *</label>
              <input
                type="text"
                className="checkout-form-input"
                placeholder="e.g. Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            
            <div className="checkout-form-group">
              <label className="checkout-form-label">Contact Person *</label>
              <input
                type="text"
                className="checkout-form-input"
                placeholder="Your Full Name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </div>

            <div className="checkout-form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="checkout-form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="checkout-form-input"
                  placeholder="Mobile or direct line"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="checkout-form-label">GST Number (Optional)</label>
                <input
                  type="text"
                  className="checkout-form-input"
                  placeholder="15-digit GSTIN"
                  maxLength={15}
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-form-label">Delivery Address *</label>
              <textarea
                className="checkout-form-input checkout-form-textarea"
                placeholder="Full delivery location details, Pin code, City, State"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
            </div>

            <div className="checkout-form-group">
              <label className="checkout-form-label">Special Delivery/Notes</label>
              <textarea
                className="checkout-form-input checkout-form-textarea"
                placeholder="Instructions, customized branding details etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Right Summary */}
          <div className="checkout-form-right">
            <div className="checkout-summary-box">
              <span className="checkout-summary-title">Quote Summary</span>
              
              {items.map(item => (
                <div key={item.cartId} className="checkout-summary-item">
                  <span>{item.name} (x{item.qty})</span>
                  <strong>₹{(item.pricePerItem * item.qty).toLocaleString("en-IN")}</strong>
                </div>
              ))}
              
              <div className="checkout-summary-divider" />
              
              <div className="checkout-summary-item">
                <span>Subtotal Items</span>
                <strong>{totalItems} units</strong>
              </div>
              <div className="checkout-summary-total">
                <span>Total Quote</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              {errorMsg && <span className="checkout-error">{errorMsg}</span>}

              <button
                type="submit"
                className="checkout-submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Confirm & Get Quote →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
