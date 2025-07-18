// main.js
import { Lucid } from "https://unpkg.com/lucid-cardano/web/mod.js";


console.log("✅ main.js loaded");

window.walletConnected = false;
let paymentSent = false;
let lawyerConfirmed = false;
let inspectorConfirmed = false;



// Connect to Eternl wallet
window.connectWallet = async function () {
  console.log("🧠 Attempting to connect to Eternl Wallet...");

  if (!window.cardano || !window.cardano.eternl) {
    alert("Eternl Wallet extension not found.");
    return;
  }

  try {
    const api = await window.cardano.eternl.enable();

    lucid = await Lucid.new(api, "Preview");
    await lucid.selectWalletFromApi(api);

    const address = await lucid.wallet.address();

    console.log("✅ Connected to Eternl Wallet");
    console.log("Wallet Address:", address);

    document.getElementById("walletStatus").textContent = `✅ Connected: ${address.slice(0, 15)}...`;
    walletConnected = true;
  } catch (err) {
    console.error("❌ Failed to connect to Eternl:", err);
    alert("Failed to connect to Eternl Wallet. Please try again.");
  }
};



// Simulate payment
window.sendPayment = () => {
  if (!walletConnected) {
    alert("Please connect wallet first.");
    return;
  }

  const amount = document.getElementById("amountInput").value;
  if (!amount || parseFloat(amount) <= 0) {
    alert("Enter a valid ADA amount.");
    return;
  }

  paymentSent = true;
  alert(`✅ Payment of ${amount} ADA sent (demo).`);
};

// Simulate lawyer confirmation
window.lawyerConfirm = () => {
  if (!paymentSent) {
    alert("Send payment before confirmation.");
    return;
  }

  lawyerConfirmed = true;
  document.getElementById("lawyerStatus").textContent = " Confirmed ✅";
  alert("Lawyer has confirmed.");
};

// Simulate inspector confirmation
window.inspectorConfirm = () => {
  if (!paymentSent) {
    alert("Send payment before confirmation.");
    return;
  }

  inspectorConfirmed = true;
  document.getElementById("inspectorStatus").textContent = " Confirmed ✅";
  alert("Inspector has confirmed.");
};

// Simulate fund release
window.releaseFunds = () => {
  if (lawyerConfirmed && inspectorConfirmed) {
    alert("🎉 Funds released to the seller!");
  } else {
    alert("Both lawyer and inspector must confirm before releasing funds.");
  }
};
