import React, { useState, useEffect } from 'react';
import PaymentService from './PaymentService';

const paymentStyles = `
  .pay-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 17, 21, 0.7); backdrop-filter: blur(8px);
    z-index: 1200; display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .pay-modal-overlay.open { opacity: 1; pointer-events: auto; }
  .pay-modal-container {
    background: var(--bg-white); color: var(--text-dark);
    width: 90%; max-width: 600px; max-height: 90vh;
    border-radius: 12px; box-shadow: 0 24px 60px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; overflow: hidden;
    transform: scale(0.95); transition: transform 0.3s ease;
    font-family: 'Outfit', sans-serif; border: 1px solid var(--border-color);
  }
  .pay-modal-overlay.open .pay-modal-container { transform: scale(1); }
  
  .pay-modal-header {
    padding: 24px 32px; border-bottom: 1px solid var(--border-color);
    display: flex; align-items: center; justify-content: space-between;
  }
  .pay-modal-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; }
  .pay-modal-close {
    background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-light);
  }
  
  .pay-modal-body {
    padding: 32px; overflow-y: auto;
  }
  
  .pay-tabs {
    display: flex; border-bottom: 1px solid var(--border-color); margin-bottom: 24px;
  }
  .pay-tab {
    flex: 1; text-align: center; padding: 12px; font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
    border-bottom: 2px solid transparent; color: var(--text-light); transition: all 0.2s;
  }
  .pay-tab.active {
    color: var(--text-dark); border-bottom-color: var(--text-dark);
  }
  
  .pay-instruction-box {
    background: var(--bg-offwhite); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 20px; margin-bottom: 24px;
  }
  .pay-instruction-title {
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: var(--text-dark); margin-bottom: 12px;
  }
  .pay-detail-row {
    display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;
    padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .pay-detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .pay-detail-label { color: var(--text-light); }
  .pay-detail-value { font-weight: 600; color: var(--text-dark); }
  
  .pay-qr-container {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .pay-qr-img {
    width: 160px; height: 160px; object-fit: contain;
    border: 1px solid var(--border-color); padding: 8px; border-radius: 8px; background: white;
  }
  .pay-qr-placeholder {
    width: 160px; height: 160px; display: flex; align-items: center; justify-content: center;
    border: 1px dashed var(--border-color); border-radius: 8px; font-size: 32px; background: var(--bg-offwhite);
  }
  
  .pay-upload-area {
    border: 2px dashed var(--border-color); border-radius: 8px; padding: 24px;
    text-align: center; cursor: pointer; transition: border-color 0.2s; margin-bottom: 16px;
  }
  .pay-upload-area:hover { border-color: var(--text-dark); }
  .pay-upload-icon { font-size: 24px; margin-bottom: 8px; display: block; }
  .pay-upload-text { font-size: 13px; color: var(--text-light); }
  .pay-upload-preview {
    font-size: 13px; color: #008060; font-weight: 600; margin-top: 8px; display: block;
  }
  
  .pay-form-input {
    width: 100%; border: 1px solid var(--border-color); border-radius: 6px;
    padding: 10px 14px; font-size: 13px; background: var(--bg-white); color: var(--text-dark);
    font-family: 'Outfit', sans-serif; box-sizing: border-box; margin-bottom: 24px;
  }
  
  .pay-submit-btn {
    width: 100%; background: var(--text-dark); color: var(--bg-white);
    border: none; border-radius: 6px; padding: 14px; font-size: 14px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: background 0.2s;
  }
  .pay-submit-btn:hover { background: #2c2f36; }
  .pay-submit-btn:disabled { background: var(--border-color); cursor: not-allowed; }
  
  .pay-error {
    color: #c5221f; font-size: 13px; font-weight: 500; margin-bottom: 16px;
    display: block;
  }
`;

export default function PaymentModal({ isOpen, onClose, inquiryId, totalPrice, onPaymentSuccess }) {
  // Inject styles
  useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector("#payment-styles")) {
      const tag = document.createElement("style");
      tag.id = "payment-styles";
      tag.innerHTML = paymentStyles;
      document.head.appendChild(tag);
    }
  }, []);

  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' or 'bank'
  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch payment settings (UPI, Bank Details)
  useEffect(() => {
    if (isOpen) {
      PaymentService.getPaymentSettings()
        .then(data => {
          if (data.success) {
            setSettings(data);
          }
        })
        .catch(err => {
          console.error(err);
          setErrorMsg("Failed to load payment credentials.");
        });
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      setErrorMsg("Please upload your payment screenshot/receipt.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const method = activeTab === 'upi' ? 'UPI' : 'BANK_TRANSFER';
      const result = await PaymentService.submitOfflineReceipt(
        inquiryId,
        method,
        receiptFile,
        paymentNotes
      );

      if (result.success) {
        alert("Payment details submitted successfully! Our admin will review and verify your payment shortly.");
        onPaymentSuccess();
      } else {
        setErrorMsg(result.error || "Failed to submit receipt.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error uploading payment details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pay-modal-overlay${isOpen ? " open" : ""}`} onClick={onClose}>
      <div className="pay-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pay-modal-header">
          <span className="pay-modal-title">Complete Payment</span>
          <button className="pay-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="pay-modal-body">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Total Amount to Pay</span>
            <h2 style={{ fontSize: 26, margin: '4px 0 0 0', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>
              ₹{totalPrice ? totalPrice.toLocaleString("en-IN") : '0'}
            </h2>
            <span style={{ fontSize: 11, color: 'var(--text-light)', display: 'block', marginTop: 4 }}>Order Inquiry #{inquiryId}</span>
          </div>

          {/* Payment Tabs */}
          <div className="pay-tabs">
            <div
              className={`pay-tab${activeTab === 'upi' ? ' active' : ''}`}
              onClick={() => setActiveTab('upi')}
            >
              UPI / QR Pay
            </div>
            <div
              className={`pay-tab${activeTab === 'bank' ? ' active' : ''}`}
              onClick={() => setActiveTab('bank')}
            >
              Bank Transfer
            </div>
          </div>

          {/* UPI Transfer Guide */}
          {activeTab === 'upi' && settings && (
            <div className="pay-instruction-box">
              <span className="pay-instruction-title">UPI Payment Instructions</span>
              <div className="pay-qr-container">
                {settings.qr_code ? (
                  <img
                    src={`http://127.0.0.1:8000${settings.qr_code}`}
                    alt="Payment QR Code"
                    className="pay-qr-img"
                  />
                ) : (
                  <div className="pay-qr-placeholder">📲</div>
                )}
                <span style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>Scan QR Code to pay</span>
              </div>
              <div className="pay-detail-row">
                <span className="pay-detail-label">UPI ID</span>
                <span className="pay-detail-value">{settings.upi_id}</span>
              </div>
              <div className="pay-detail-row">
                <span className="pay-detail-label">Payee Name</span>
                <span className="pay-detail-value">Hari Om Print House</span>
              </div>
            </div>
          )}

          {/* Bank Transfer Guide */}
          {activeTab === 'bank' && settings && (
            <div className="pay-instruction-box">
              <span className="pay-instruction-title">Direct Bank Transfer Details</span>
              <div className="pay-detail-row">
                <span className="pay-detail-label">Bank Name</span>
                <span className="pay-detail-value">{settings.bank_name}</span>
              </div>
              <div className="pay-detail-row">
                <span className="pay-detail-label">Account Name</span>
                <span className="pay-detail-value">{settings.account_name}</span>
              </div>
              <div className="pay-detail-row">
                <span className="pay-detail-label">Account Number</span>
                <span className="pay-detail-value">{settings.account_number}</span>
              </div>
              <div className="pay-detail-row">
                <span className="pay-detail-label">IFSC Code</span>
                <span className="pay-detail-value">{settings.ifsc_code}</span>
              </div>
            </div>
          )}

          {/* Receipt Upload Area */}
          <input
            type="file"
            id="receipt-file-input"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            className="pay-upload-area"
            onClick={() => document.getElementById("receipt-file-input").click()}
          >
            <span className="pay-upload-icon">📸</span>
            <span className="pay-upload-text">
              {receiptFile ? 'Change Payment Receipt' : 'Upload Payment Receipt / UPI Screenshot *'}
            </span>
            {receiptFile && (
              <span className="pay-upload-preview">✓ {receiptFile.name} Selected</span>
            )}
          </div>

          <label className="checkout-form-label">Payment Reference / Notes</label>
          <input
            type="text"
            className="pay-form-input"
            placeholder="e.g. Transaction ID, UTR Number, or reference details"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />

          {errorMsg && <span className="pay-error">{errorMsg}</span>}

          <button
            type="submit"
            className="pay-submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting Details...' : 'Submit Payment Proof →'}
          </button>
        </form>
      </div>
    </div>
  );
}
