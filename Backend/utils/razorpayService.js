import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance with error checking
const initializeRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log('🔧 Razorpay Initialization:');
  console.log('RAZORPAY_KEY_ID:', keyId ? '✅ Set' : '❌ Missing');
  console.log('RAZORPAY_KEY_SECRET:', keySecret ? '✅ Set' : '❌ Missing');

  if (!keyId || !keySecret) {
    console.error('❌ Razorpay credentials not found in environment variables');
    return null;
  }

  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.error('❌ Failed to initialize Razorpay:', error);
    return null;
  }
};

const razorpayInstance = initializeRazorpay();

// Create Razorpay Order
// Create Razorpay Order
export const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    console.log('💰 Creating Razorpay order...');
    console.log('Amount:', amount, 'Currency:', currency, 'Receipt:', receipt);

    if (!razorpayInstance) {
      console.error('❌ Razorpay instance not initialized');
      return {
        success: false,
        message: 'Payment gateway not configured. Please contact support.',
        error: 'Razorpay instance is null',
      };
    }

    const options = {
      amount: amount * 100, // Amount in paise (₹999 = 99900 paise)
      currency: currency,
      receipt: receipt,
      notes: notes,
    };

    console.log('📤 Sending order request to Razorpay:', options);
    const order = await razorpayInstance.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    return {
      success: true,
      order: order,
    };
  } catch (error) {
    console.error('❌ Razorpay Order Creation Error:', error);
    console.error('Error details:', {
      message: error.message,
      description: error.error?.description,
      code: error.error?.code,
      statusCode: error.statusCode
    });

    return {
      success: false,
      message: 'Failed to create payment order',
      error: error.message || 'Unknown error',
      details: error.error?.description || null,
    };
  }
};

// Verify Razorpay Payment Signature
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Signature Verification Error:', error);
    return false;
  }
};

// Fetch Payment Details from Razorpay
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return {
      success: true,
      payment: payment,
    };
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    return {
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message,
    };
  }
};

// Generate Receipt ID
export const generateReceiptId = (userId, planId) => {
  const timestamp = Date.now();
  return `rcpt_${userId.toString().slice(-6)}_${planId}_${timestamp}`;
};