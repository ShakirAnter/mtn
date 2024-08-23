const axios = require("axios");
require("dotenv").config();

const MTN_API_BASE_URL =
  "https://sandbox.momodeveloper.mtn.com/collection/v1_0";
const headers = {
  "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
  "X-Target-Environment": process.env.MTN_ENVIRONMENT,
  Authorization: `Bearer ${process.env.MTN_USER_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// Function to initiate a payment request
const requestToPay = async (
  amount,
  currency,
  externalId,
  payer,
  payerMessage
) => {
  try {
    const response = await axios.post(
      `${MTN_API_BASE_URL}/requesttopay`,
      {
        amount,
        currency,
        externalId,
        payer,
        payerMessage,
        payeeNote: "Payment for services",
      },
      { headers }
    );

    // Capture the referenceId from the response
    const referenceId = response.data.referenceId;
    console.log("Payment request initiated. Reference ID:", referenceId);

    return referenceId;
  } catch (error) {
    console.error(
      "Payment request failed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to check the status of the payment using the referenceId
const checkPaymentStatus = async (referenceId) => {
  try {
    const response = await axios.get(
      `${MTN_API_BASE_URL}/requesttopay/${referenceId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to check payment status:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Example usage:
const initiatePayment = async () => {
  try {
    // Initiate the payment and get the referenceId
    const referenceId = await requestToPay(
      "1000", // amount in UGX
      "UGX", // currency
      "Order123456", // externalId
      { partyIdType: "MSISDN", partyId: "256776XXXXXX" }, // payer's phone number
      "Payment for order #123456"
    );

    // Check the payment status using the referenceId
    const status = await checkPaymentStatus(referenceId);
    console.log("Payment status:", status);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Start the payment process
initiatePayment();
