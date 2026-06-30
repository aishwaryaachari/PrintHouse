import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

const dashboardStyles = `
  .dash-container {
    max-width: 1100px; margin: 40px auto; padding: 0 24px;
    font-family: 'Outfit', sans-serif;
  }
  .dash-title-section {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;
  }
  .dash-title { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; }
  .dash-back-btn {
    background: none; border: 1px solid var(--border-color); border-radius: 4px;
    padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
    color: var(--text-dark); display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .dash-back-btn:hover { background: var(--bg-offwhite); }
  
  .dash-list { display: flex; flex-direction: column; gap: 24px; }
  .dash-card {
    background: var(--bg-white); border: 1px solid var(--border-color);
    border-radius: 10px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    transition: box-shadow 0.2s;
  }
  .dash-card:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.06); }
  
  .dash-card-header {
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px;
  }
  .dash-order-id { font-weight: 700; font-size: 15px; }
  .dash-date { font-size: 13px; color: var(--text-light); }
  
  .dash-badge {
    padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .dash-badge.pending { background: #fff7e6; color: #d48806; border: 1px solid #ffe7ba; }
  .dash-badge.awaiting { background: #fff2e8; color: #d4380d; border: 1px solid #ffd8bf; }
  .dash-badge.submitted { background: #e6f7ff; color: #096dd9; border: 1px solid #bae7ff; }
  .dash-badge.verified { background: #f6ffed; color: #389e0d; border: 1px solid #d9f7be; }
  .dash-badge.processing { background: #f9f0ff; color: #531dab; border: 1px solid #efdbff; }
  .dash-badge.printing { background: #fff0f6; color: #c41d7f; border: 1px solid #ffd6e7; }
  .dash-badge.shipped { background: #e6fffb; color: #08979c; border: 1px solid #b5f5ec; }
  .dash-badge.delivered { background: #f6ffed; color: #389e0d; border: 1px solid #d9f7be; }

  .dash-card-body {
    display: grid; grid-template-columns: 2fr 1fr; gap: 24px;
  }
  @media (max-width: 768px) {
    .dash-card-body { grid-template-columns: 1fr; gap: 16px; }
  }
  
  .dash-items-list { display: flex; flex-direction: column; gap: 12px; }
  .dash-item-row { display: flex; align-items: center; gap: 12px; }
  .dash-item-img {
    width: 50px; height: 50px; object-fit: contain; border-radius: 4px;
    border: 1px solid var(--border-color); background: var(--bg-offwhite);
  }
  .dash-item-name { font-size: 14px; font-weight: 600; }
  .dash-item-details { font-size: 12px; color: var(--text-light); }
  
  .dash-pricing-details {
    display: flex; flex-direction: column; justify-content: space-between;
    background: var(--bg-offwhite); padding: 16px; border-radius: 8px;
    border: 1px dashed var(--border-color);
  }
  .dash-pricing-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
  .dash-pricing-total { font-weight: 700; font-size: 15px; color: var(--text-dark); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-color); }
  
  .dash-actions {
    display: flex; gap: 12px; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;
  }
  .dash-btn {
    padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: 4px; cursor: pointer;
    font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;
    transition: all 0.2s;
  }
  .dash-btn-primary { background: var(--text-dark); color: var(--bg-white); border: none; }
  .dash-btn-primary:hover { background: #2c2f36; }
  .dash-btn-secondary { background: none; border: 1px solid var(--border-color); color: var(--text-dark); }
  .dash-btn-secondary:hover { background: var(--bg-offwhite); }
  
  /* INVOICE PRINT STYLES */
  .invoice-container {
    background: white; color: black; max-width: 800px; margin: 40px auto; padding: 40px;
    border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.05); font-family: 'Outfit', sans-serif;
  }
  .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
  .invoice-logo { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; }
  .invoice-title { text-transform: uppercase; font-size: 18px; font-weight: 700; letter-spacing: 1px; color: #555; }
  .invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
  .invoice-block-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 10px; }
  .invoice-block-text { font-size: 13px; line-height: 1.5; color: #333; }
  
  .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .invoice-table th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #ddd; }
  .invoice-table td { padding: 12px 10px; font-size: 13px; border-bottom: 1px solid #eee; }
  
  .invoice-totals { display: flex; flex-direction: column; align-items: flex-end; }
  .invoice-totals-row { display: flex; width: 250px; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
  .invoice-totals-final { font-weight: 700; font-size: 16px; border-top: 1px solid #333; padding-top: 8px; margin-top: 6px; }
  
  .invoice-footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #777; }
  
  @media print {
    body * { visibility: hidden; }
    .invoice-print-wrapper, .invoice-print-wrapper * { visibility: visible; }
    .invoice-print-wrapper { position: absolute; left: 0; top: 0; width: 100%; }
    .dash-btn { display: none !important; }
  }
`;

export default function Dashboard({ onBack }) {
  // Inject CSS
  useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector("#dashboard-styles")) {
      const tag = document.createElement("style");
      tag.id = "dashboard-styles";
      tag.innerHTML = dashboardStyles;
      document.head.appendChild(tag);
    }
  }, []);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Payment Modal States
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Invoice States
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const fetchInquiries = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/auth/inquiries/', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or database error");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setInquiries(data.inquiries || []);
        } else {
          setErrorMsg(data.error || "Failed to load inquiries.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Failed to connect to backend database.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openPaymentModal = (inq) => {
    setSelectedInquiry(inq);
    setPayModalOpen(true);
  };

  const getStatusClass = (code) => {
    switch (code) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'awaiting';
      case 'AWAITING_PAYMENT': return 'awaiting';
      case 'PAYMENT_SUBMITTED': return 'submitted';
      case 'PAYMENT_VERIFIED': return 'verified';
      case 'PROCESSING': return 'processing';
      case 'PRINTING': return 'printing';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': return 'delivered';
      case 'COMPLETED': return 'delivered';
      case 'REJECTED': return 'awaiting'; 
      default: return 'pending';
    }
  };

  if (viewingInvoice) {
    const inv = viewingInvoice;
    return (
      <div className="invoice-print-wrapper" style={{ padding: 24 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 12, marginBottom: 20 }}>
          <button className="dash-btn dash-btn-secondary" onClick={() => setViewingInvoice(null)}>← Back to Dashboard</button>
          <button className="dash-btn dash-btn-primary" onClick={() => window.print()}>Print / Download PDF 🖨️</button>
        </div>

        <div className="invoice-container">
          <div className="invoice-header">
            <div>
              <div className="invoice-logo">HARI OM PRINT HOUSE</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                123 Industrial Area Phase II, New Delhi, India<br />
                Email: accounts@hariomprinthouse.com | Phone: +91 98765 43210
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="invoice-title">Tax Invoice</div>
              <div style={{ fontSize: 13, color: '#333', marginTop: 8 }}>
                <strong>Invoice No:</strong> HOPH-{inv.id}<br />
                <strong>Date:</strong> {new Date(inv.created_at).toLocaleDateString("en-IN")}<br />
                <strong>Status:</strong> {inv.status}
              </div>
            </div>
          </div>

          <div className="invoice-grid">
            <div>
              <div className="invoice-block-title">Billed & Shipped To</div>
              <div className="invoice-block-text">
                <strong>{inv.contact_person}</strong><br />
                {inv.company_name}<br />
                {inv.delivery_address}<br />
                <strong>Phone:</strong> {inv.phone_number}<br />
                <strong>Email:</strong> {inv.contact_email}
              </div>
            </div>
            <div>
              <div className="invoice-block-title">Inquiry / Tax Details</div>
              <div className="invoice-block-text">
                <strong>GSTIN:</strong> {inv.gst_number || 'N/A (B2C Order)'}<br />
                <strong>Payment Method:</strong> {inv.payment_method || 'Awaiting Payment'}<br />
                {inv.payment_submitted_at && (
                  <span><strong>Paid At:</strong> {new Date(inv.payment_submitted_at).toLocaleDateString("en-IN")}<br /></span>
                )}
                <strong>Reference Notes:</strong> {inv.notes || 'None'}
              </div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Product Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>
                      Size: {item.size} | Color: {item.color} | Customizations: {item.customizations?.join(", ") || 'None'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>₹{item.pricePerItem.toLocaleString("en-IN")}</td>
                  <td style={{ textAlign: 'right' }}>₹{(item.pricePerItem * item.qty).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-totals">
            <div className="invoice-totals-row">
              <span>Subtotal:</span>
              <span>₹{inv.items.reduce((s, i) => s + i.pricePerItem * i.qty, 0).toLocaleString("en-IN")}</span>
            </div>
            
            {inv.total_price < inv.items.reduce((s, i) => s + i.pricePerItem * i.qty, 0) && (
              <div className="invoice-totals-row" style={{ color: '#008060' }}>
                <span>Discounts Applied:</span>
                <span>−₹{(inv.items.reduce((s, i) => s + i.pricePerItem * i.qty, 0) - inv.total_price).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="invoice-totals-row invoice-totals-final">
              <span>Total Invoice Amount:</span>
              <span>₹{inv.total_price.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="invoice-footer">
            <p>Thank you for choosing Hari Om Print House! For bulk inquiry assistance, contact support@hariomprinthouse.com.</p>
            <p style={{ fontSize: 10, color: '#aaa', marginTop: 10 }}>This is a computer-generated tax invoice and requires no physical signature.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <div className="dash-title-section">
        <div>
          <span style={{ fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Center</span>
          <h1 className="dash-title">Your Corporate Inquiry History</h1>
        </div>
        <button className="dash-back-btn" onClick={onBack}>
          🔙 Back to Shop
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <span style={{ fontSize: 15, color: 'var(--text-light)' }}>Loading order history...</span>
        </div>
      ) : errorMsg ? (
        <div style={{ padding: 24, background: '#fff2e8', border: '1px solid #ffbb96', borderRadius: 8, color: '#d4380d' }}>
          {errorMsg}
        </div>
      ) : inquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed var(--border-color)', borderRadius: 8 }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>📋</span>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>No inquiries submitted yet</h3>
          <p style={{ color: 'var(--text-light)', fontSize: 13, margin: 0 }}>Add products to your cart and request a quote to get started.</p>
        </div>
      ) : (
        <div className="dash-list">
          {inquiries.map((inq) => (
            <div key={inq.id} className="dash-card">
              <div className="dash-card-header">
                <div>
                  <span className="dash-order-id">Quote Inquiry #HOPH-{inq.id}</span>
                  <span className="dash-date" style={{ marginLeft: 16 }}>
                    {new Date(inq.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className={`dash-badge ${getStatusClass(inq.status_code)}`}>
                  {inq.status}
                </span>
              </div>

              <div className="dash-card-body">
                {/* Left: Items list */}
                <div className="dash-items-list">
                  {inq.items.map((item, idx) => (
                    <div key={idx} className="dash-item-row">
                      <img src={item.image} alt={item.name} className="dash-item-img" />
                      <div>
                        <div className="dash-item-name">{item.name}</div>
                        <div className="dash-item-details">
                          Size: {item.size} | Color: {item.color} | Qty: {item.qty} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Pricing breakdown */}
                <div className="dash-pricing-details">
                  <div>
                    <div className="dash-pricing-row">
                      <span style={{ color: 'var(--text-light)' }}>Total Units</span>
                      <span>{inq.total_items} items</span>
                    </div>
                    <div className="dash-pricing-row">
                      <span style={{ color: 'var(--text-light)' }}>GST Status</span>
                      <span>{inq.gst_number ? 'Corporate B2B' : 'Consumer B2C'}</span>
                    </div>
                  </div>
                  <div className="dash-pricing-row dash-pricing-total">
                    <span>Final Quote</span>
                    <span>₹{inq.total_price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="dash-actions">
                <button className="dash-btn dash-btn-secondary" onClick={() => setViewingInvoice(inq)}>
                  📄 View & Download Invoice
                </button>
                
                {(inq.status_code === 'PENDING' || inq.status_code === 'AWAITING_PAYMENT') && (
                  <button className="dash-btn dash-btn-primary" onClick={() => openPaymentModal(inq)}>
                    💳 Submit Payment Proof
                  </button>
                )}

                {inq.status_code === 'PAYMENT_SUBMITTED' && (
                  <button className="dash-btn dash-btn-secondary" disabled style={{ background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }}>
                    ⌛ Awaiting Verification
                  </button>
                )}
                
                {inq.status_code !== 'PENDING' && inq.status_code !== 'AWAITING_PAYMENT' && inq.status_code !== 'PAYMENT_SUBMITTED' && (
                  <button className="dash-btn dash-btn-secondary" disabled style={{ background: '#f6ffed', color: '#389e0d', border: '1px solid #b7eb8f', cursor: 'default' }}>
                    ✓ Payment Verified
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInquiry && (
        <PaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          inquiryId={selectedInquiry.id}
          totalPrice={selectedInquiry.total_price}
          onPaymentSuccess={() => {
            setPayModalOpen(false);
            fetchInquiries();
          }}
        />
      )}
    </div>
  );
}
