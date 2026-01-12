// Backend/utils/otpService.js
import crypto from 'crypto';
import https from 'https';



// Generate secure 4-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString();
};





// OLD - Your entire sendOTPviaSMS function

// NEW
export const sendOTPviaSMS = async (phone, otp, countryCode = '+91') => {
  try {
    const apiKey = process.env.FAST2SMS;
    
    if (!apiKey) {
      throw new Error('FAST2SMS API key not found');
    }

    const cleanPhone = phone.replace(/^\+?\d{1,3}/, '');
    const message = `Your OTP for LandsTime verification is: ${otp}. Valid for 10 minutes.`;

    const postData = JSON.stringify({
      route: 'v3',
      sender_id: 'TXTIND',
      message: message,
      language: 'english',
      flash: 0,
      numbers: cleanPhone
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.fast2sms.com',
        port: 443,
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)  // ✅ Changed this line
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('FAST2SMS Response:', response);  // ✅ Added debug log
            
            if (response.return === true) {
              resolve({
                success: true,
                message: 'OTP sent successfully',
                data: response
              });
            } else {
              resolve({
                success: false,
                message: response.message || 'Failed to send OTP',
                error: response
              });
            }
          } catch (e) {
            console.error('Parse error:', e);  // ✅ Added error log
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        console.error('Request error:', e);  // ✅ Added error log
        reject(e);
      });

      req.write(postData);
      req.end();
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    };
  }
};

// Validate OTP format
export const isValidOTP = (otp) => {
  return /^\d{4}$/.test(otp);
};

// Check if phone number is valid
export const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};