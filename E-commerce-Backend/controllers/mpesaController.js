import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// STEP 1: Generate OAuth Token
const generateToken = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");
  }

  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

// STEP 2: Initiate STK Push
export const initiateSTKPush = async (req, res) => {
  try {
    const { MPESA_SHORTCODE, MPESA_PASS_KEY, MPESA_CALLBACK_URL } = process.env;

    if (!MPESA_SHORTCODE || !MPESA_PASS_KEY || !MPESA_CALLBACK_URL) {
      return res.status(500).json({
        error: "Missing one or more required .env variables",
      });
    }

    // 1. Generate OAuth token
    const token = await generateToken();
    console.log("🔐 Access Token:", token);

    // 2. Generate Timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    // 3. Generate Password
    const password = Buffer.from(
      MPESA_SHORTCODE + MPESA_PASS_KEY + timestamp
    ).toString("base64");

    // 4. Prepare Payload
    const payload = {
      BusinessShortCode: Number(MPESA_SHORTCODE),
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1,
      PartyA: 254708374149,
      PartyB: Number(MPESA_SHORTCODE),
      PhoneNumber: 254797942186, 
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: "ChuoMarket",
      TransactionDesc: "Pay Chuo Market",
    };

    console.log("📦 Payload being sent:", payload);

    // 5. Make STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 6. Return successful response
    return res.status(200).json({
      message: " STK Push initiated successfully",
      data: stkResponse.data,
    });
  } catch (error) {
    console.error(" STK Push Error:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "STK Push Failed",
      details: error?.response?.data || error.message,
    });
  }
};
