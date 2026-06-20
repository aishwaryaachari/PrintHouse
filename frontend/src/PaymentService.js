/**
 * Reusable Payment Service structure.
 * Ready for future integrations like Razorpay.
 */
class PaymentService {
  /**
   * Fetch current UPI/Bank configurations from the server
   */
  async getPaymentSettings() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/payment/settings/');
      if (!response.ok) throw new Error('Failed to load payment settings');
      return await response.json();
    } catch (error) {
      console.error('PaymentService.getPaymentSettings error:', error);
      throw error;
    }
  }

  /**
   * Submit offline payment verification receipt (UPI screenshot or Bank receipt)
   */
  async submitOfflineReceipt(inquiryId, paymentMethod, receiptFile, paymentNotes = '') {
    try {
      const formData = new FormData();
      formData.append('payment_method', paymentMethod);
      formData.append('payment_receipt', receiptFile);
      formData.append('payment_notes', paymentNotes);

      const response = await fetch(`http://127.0.0.1:8000/api/auth/inquiry/${inquiryId}/submit-payment/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit receipt');
      }

      return await response.json();
    } catch (error) {
      console.error('PaymentService.submitOfflineReceipt error:', error);
      throw error;
    }
  }

  /**
   * FUTURE READY: Placeholder for Razorpay checkout integration
   * This is structured to be invoked easily when migrating to online checkouts.
   */
  async initRazorpayCheckout(orderData) {
    console.warn("Razorpay checkout is prepared but not activated yet. B2B manual transfer is active.");
    throw new Error("Razorpay online payments not configured yet. Please use UPI/Bank transfer.");
  }
}

export default new PaymentService();
