console.log("✅ main.js loaded");

// --- Theme Toggle ---
const toggle = document.getElementById("themeToggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggle.setAttribute("aria-checked", isDark);
  });
}

// --- Slide Up Animation ---
const sliders = document.querySelectorAll('.slide-up');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('slide-in');
    observer.unobserve(entry.target);
  });
}, appearOptions);
sliders.forEach(slider => {
  appearOnScroll.observe(slider);
});

// --- Toast Notification ---
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.remove('bg-green-600', 'bg-red-600', 'bg-yellow-500');
  if (type === 'success') toast.classList.add('bg-green-600');
  else if (type === 'error') toast.classList.add('bg-red-600');
  else if (type === 'warning') toast.classList.add('bg-yellow-500');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// --- Modal ---
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModal');
function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}
function hideModal() {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}
if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});

// --- Loading Spinner Modal ---
function showLoading(message) {
  showModal(`<span class='loading-spinner'></span> ${message}`);
}
function hideLoading() {
  hideModal();
}

// --- Copy Address ---
const copyAddressBtn = document.getElementById('copyAddressBtn');
if (copyAddressBtn) {
  copyAddressBtn.addEventListener('click', () => {
    const addr = document.getElementById('scriptAddress').textContent;
    navigator.clipboard.writeText(addr);
    showToast('Address copied!', 'success');
  });
}

// --- Share Button ---
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'SafeNest - Secure Real Estate',
      text: 'Check out SafeNest, a Cardano-powered escrow platform for secure property deals!',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Thanks for sharing!', 'success');
      } catch (e) {
        showToast('Share cancelled.', 'warning');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  });
}

// --- CTA Banner Scroll ---
const ctaBanner = document.getElementById('ctaBanner');
if (ctaBanner) {
  ctaBanner.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Progress Bar Logic ---
const progressSteps = [
  { label: 'Start', selector: '.step-circle:nth-child(1)' },
  { label: 'Payment', selector: '.step-circle:nth-child(3)' },
  { label: 'Lawyer', selector: '.step-circle:nth-child(5)' },
  { label: 'Inspector', selector: '.step-circle:nth-child(7)' },
  { label: 'Release', selector: '.step-circle:nth-child(9)' },
];
let currentStep = 0;
function setProgress(step) {
  currentStep = step;
  const circles = document.querySelectorAll('.step-circle');
  circles.forEach((circle, idx) => {
    if (idx <= step) {
      circle.classList.add('bg-brand', 'text-white', 'scale-110');
    } else {
      circle.classList.remove('bg-brand', 'text-white', 'scale-110');
    }
  });
}
setProgress(0);

// --- Transaction Timeline ---
const txHistory = document.getElementById('txHistory');
function addTxHistory(action, details, icon = '📝') {
  const hash = '0x' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
  const time = new Date().toLocaleTimeString();
  const li = document.createElement('li');
  li.innerHTML = `<div class="flex items-center gap-2"><span class="text-lg">${icon}</span><span class="font-semibold">${action}:</span> ${details} <span class="text-xs text-gray-500 ml-2">[${hash}]</span> <span class="text-xs text-gray-400">${time}</span></div>`;
  txHistory.querySelector('.text-gray-500')?.remove();
  txHistory.appendChild(li);
}

// --- Escrow Actions ---
document.querySelectorAll('.start-escrow').forEach(btn => {
  btn.addEventListener('click', e => {
    const property = btn.getAttribute('data-property');
    // No loading spinner or modal here
    showToast(`Escrow started for ${property} (demo)`, 'success');
    addTxHistory('Escrow Started', `Property: <span class='text-brand'>${property}</span>`, '🏠');
    setProgress(1);
  });
});

// --- Buyer Actions ---
const walletStatus = document.getElementById('walletStatus');
const amountInput = document.getElementById('amountInput');
const amountError = document.getElementById('amountError');
let walletConnected = false;
let paymentSent = false;
let lawyerConfirmed = false;
let inspectorConfirmed = false;

function validateAmount() {
  const value = parseFloat(amountInput.value);
  if (isNaN(value) || value < 1) {
    amountError.textContent = 'Please enter a valid amount (min 1 ADA).';
    amountError.classList.remove('hidden');
    amountInput.setAttribute('aria-invalid', 'true');
    return false;
  }
  amountError.textContent = '';
  amountError.classList.add('hidden');
  amountInput.removeAttribute('aria-invalid');
  return true;
}

// --- Remove loading spinner/modal for all main action buttons ---
// Connect Wallet
function connectWallet() {
  // No loading spinner
  walletConnected = true;
  walletStatus.textContent = 'Wallet connected (simulated)';
  showToast('Wallet connected (simulated)', 'success');
  addTxHistory('Wallet Connected', 'Eternl (simulated)', '👛');
  showModal('Wallet connected! You can now send payment.');
}
// Send Payment
function sendPayment() {
  if (!walletConnected) {
    showToast('Please connect your wallet first.', 'warning');
    return;
  }
  if (!validateAmount()) {
    showToast('Invalid amount.', 'error');
    return;
  }
  paymentSent = true;
  const amount = amountInput.value;
  showToast('Payment sent (simulated)', 'success');
  addTxHistory('Payment Sent', `${amount} ADA to escrow`, '💸');
  setProgress(2);
  showModal('Transaction confirmed in block #3,847,592');
}
// Lawyer Confirm
// Inspector Confirm
// Release Funds

// --- FAQ Expand/Collapse ---
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const answer = this.nextElementSibling;
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
      answer.style.maxHeight = '0px';
      answer.style.padding = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.padding = '8px 0';
    }
  });
});

// --- Microinteractions ---
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('mousedown', () => btn.classList.add('scale-95'));
  btn.addEventListener('mouseup', () => btn.classList.remove('scale-95'));
  btn.addEventListener('mouseleave', () => btn.classList.remove('scale-95'));
});

// --- Confetti Animation ---
function launchConfetti() {
  const confettiDiv = document.getElementById('confetti');
  confettiDiv.innerHTML = '';
  confettiDiv.classList.remove('hidden');
  // Simple confetti: 40 pieces
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti-piece';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.background = `hsl(${Math.random()*360},80%,60%)`;
    conf.style.animationDelay = (Math.random() * 0.7) + 's';
    confettiDiv.appendChild(conf);
  }
  setTimeout(() => confettiDiv.classList.add('hidden'), 2200);
}

// --- SafeNest AI Chat ---
// --- AI Chat Modal Logic ---
const aiBtn = document.getElementById('helpBtn');
const aiModal = document.getElementById('aiChatModal');
const closeAiModal = document.getElementById('closeAiModal');
const aiChatArea = document.getElementById('aiChatArea');

function openAiModal() {
  aiModal.classList.add('show');
  aiModal.classList.remove('hidden');
  if (aiChatArea.innerHTML.trim() === '') {
    aiAddMessage('ai', 'Hi! I am SafeNest AI. Ask me anything about property escrow, Cardano, or how SafeNest works!');
  }
  setTimeout(() => aiChatArea.scrollTop = aiChatArea.scrollHeight, 100);
}
function closeAiModalFunc() {
  aiModal.classList.remove('show');
  setTimeout(() => aiModal.classList.add('hidden'), 300);
}
if (aiBtn) aiBtn.addEventListener('click', openAiModal);
if (closeAiModal) closeAiModal.addEventListener('click', closeAiModalFunc);
aiModal.addEventListener('click', (e) => {
  if (e.target === aiModal) closeAiModalFunc();
});

const aiChatForm = aiModal.querySelector('#aiChatForm');
const aiChatInput = aiModal.querySelector('#aiChatInput');
function aiAddMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'ai' ? 'ai-msg ai' : 'ai-msg user';
  msg.innerHTML = sender === 'ai' ? `<span class='ai-avatar'>🤖</span> <span>${text}</span>` : `<span>${text}</span>`;
  aiChatArea.appendChild(msg);
  aiChatArea.scrollTop = aiChatArea.scrollHeight;
}
// --- SafeNest AI Intents and Answers ---
const aiIntents = [
  // SafeNest mission and basics
  {
    tags: ['what is safenest', 'about safenest', 'safenest', 'platform', 'mission', 'vision'],
    answer: "SafeNest is a Cardano-powered escrow platform that protects Nigerian property buyers and sellers from fraud, fake documents, and slow transactions."
  },
  // Cardano/blockchain/escrow basics
  {
    tags: ['cardano', 'blockchain', 'why cardano', 'why blockchain', 'plutus', 'smart contract'],
    answer: "SafeNest uses Cardano's secure, low-fee blockchain and Plutus smart contracts to automate and secure real estate escrow. Cardano is chosen for its security, transparency, and low transaction costs."
  },
  {
    tags: ['escrow', 'how escrow', 'escrow work', 'escrow meaning', 'escrow process'],
    answer: "Escrow means funds are held securely until all conditions are met. In SafeNest, buyer funds are locked in a smart contract and only released after lawyer and inspector confirm."
  },
  // Buyer journey and mid-escrow
  {
    tags: ['how do i start', 'how to start', 'start escrow', 'initiate', 'begin', 'buy property', 'buying', 'purchase'],
    answer: "To start, select a property and click 'Start Escrow'. Then connect your wallet, send ADA, and choose your lawyer and inspector."
  },
  {
    tags: ['send payment', 'how to pay', 'payment', 'funds', 'ada', 'transfer', 'deposit'],
    answer: "After connecting your wallet, enter the amount in ADA and click 'Send Payment'. Your funds will be securely held in escrow until all confirmations are complete."
  },
  {
    tags: ['lawyer', 'role of lawyer', 'what does lawyer do', 'legal', 'legal check', 'lawyer confirm'],
    answer: "The lawyer verifies all legal documents and confirms the transaction is legitimate before funds are released."
  },
  {
    tags: ['inspector', 'role of inspector', 'what does inspector do', 'inspection', 'property check', 'inspector confirm'],
    answer: "The inspector checks the property to ensure it matches the listing and is in good condition before confirming the transaction."
  },
  {
    tags: ['release funds', 'when do i get my money', 'when does seller get paid', 'funds released', 'final step'],
    answer: "Funds are released to the seller only after both the lawyer and inspector have confirmed. This ensures maximum security and trust."
  },
  // Security, fraud, trust
  {
    tags: ['fraud', 'fake', 'scam', 'secure', 'security', 'trust', 'how safe', 'is it safe', 'protection'],
    answer: "SafeNest eliminates property fraud by using blockchain escrow. Funds are only released after all parties confirm, and fake documents are rejected by the lawyer."
  },
  // Market, business, impact
  {
    tags: ['market', 'size', 'business', 'impact', 'nigeria', 'real estate', 'how big', 'opportunity'],
    answer: "Nigeria's real estate market is worth ₦2.3T, with 25M properties sold annually. SafeNest aims to reduce the 45% fraud rate to 0%."
  },
  // Demo vs. production
  {
    tags: ['demo', 'production', 'mainnet', 'real', 'testnet', 'is this real', 'is this live'],
    answer: "This is a demo version for the Cardano Hackathon. In production, SafeNest will connect to real Cardano wallets and smart contracts. We're ready for mainnet!"
  },
  // Troubleshooting
  {
    tags: ['not working', 'problem', 'issue', 'error', 'help', 'support', 'stuck', 'trouble'],
    answer: "If you have any issues, please refresh the page or check the FAQ below. For more help, contact the SafeNest team."
  },
  // Team
  {
    tags: ['team', 'who built', 'who are you', 'founder', 'developer', 'hackathon'],
    answer: "SafeNest was built by a passionate team for the Cardano Hackathon, dedicated to solving property fraud in Africa using blockchain."
  },
  // Buyer-specific mid-escrow
  {
    tags: ['can i cancel', 'cancel escrow', 'change lawyer', 'change inspector', 'what if', 'midway', 'change mind'],
    answer: "If you need to cancel or change your lawyer/inspector, please contact SafeNest support. In production, these features will be available in-app."
  },
  // General real estate/escrow
  {
    tags: ['property', 'land', 'title', 'ownership', 'deed', 'document', 'how to verify'],
    answer: "SafeNest ensures all property documents are verified by a trusted lawyer before any funds are released. This protects buyers from fake titles and scams."
  },
  // Greeting
  {
    tags: ['hello', 'hi', 'hey', 'greetings'],
    answer: "Hello! I'm SafeNest AI. How can I help you with property escrow or Cardano?"
  },
  // Thanks
  {
    tags: ['thanks', 'thank you', 'appreciate', 'grateful'],
    answer: "You're welcome! If you have more questions about SafeNest, just ask."
  },
];
aiIntents.unshift(
  // Project overview & mission
  {
    tags: [
      'overview', 'what is safenest', 'about safenest', 'safenest', 'mission', 'purpose', 'why safenest', 'anti-fraud', 'real estate dapp', 'cardano dapp', 'what problem', 'why was safenest built', 'inspiration', 'quote', 'philosophy', 'plantain', 'real estate is not plantain'
    ],
    answer: `SafeNest is a Cardano-powered smart contract dApp built to prevent real estate fraud in Nigeria. It protects buyers by ensuring funds are only released after property inspection and legal verification. Inspired by real-life scams, SafeNest ensures transactions are transparent, professional, and safe. As we say: "Real estate is not plantain—you don’t just buy because it looks ripe."`
  },
  // Problem statements
  {
    tags: [
      'problem', 'fraud', 'fake agent', 'agent scam', 'disappear', 'no verification', 'no lawyer', 'no inspection', 'no accountability', 'no refund', 'pain point', 'risk', 'why is this needed', 'what does it solve', 'scam', 'common scams', 'nigeria fraud', 'property fraud', 'land fraud'
    ],
    answer: `SafeNest solves four major problems: 1) Fake agents who disappear after payment, 2) No legal document verification, 3) No trusted inspection process, and 4) No accountability or refund after fraud. It brings trust and transparency to Nigerian real estate.`
  },
  // Key buyer questions
  {
    tags: [
      'have i verified', 'is this agent verified', 'agent verification', 'is agent real', 'is this agent legit', 'is there a lawyer', 'property lawyer', 'is there an inspector', 'property inspected', 'professional inspection', 'who checks', 'who verifies', 'who inspects', 'is it safe to pay', 'should i trust', 'can i trust'
    ],
    answer: `SafeNest ensures every agent is verified, a property lawyer is involved, and a professional inspector checks the property before any funds are released. You are protected at every step.`
  },
  // Solution flow
  {
    tags: [
      'how does it work', 'solution flow', 'step by step', 'process', 'mvp', 'how do i use', 'how to use', 'how to buy', 'how to start', 'how to purchase', 'how to escrow', 'walk me through', 'what are the steps', 'what happens', 'what is the flow', 'explain the process'
    ],
    answer: `SafeNest flow: 1) Agent lists property. 2) Buyer connects wallet and selects property. 3) Buyer chooses a lawyer and inspector (or uses defaults). 4) Buyer sends payment to escrow contract. 5) Lawyer and Inspector confirm the property. 6) Buyer signs off to release payment to agent. All confirmations are enforced on-chain.`
  },
  // Smart contract logic
  {
    tags: [
      'smart contract', 'escrowdatum', 'redeemer', 'on-chain', 'contract logic', 'how is it enforced', 'how does contract work', 'aiken', 'datum', 'redeemer', 'roles', 'who are the parties', 'who is involved', 'who signs', 'who confirms', 'who releases', 'who can withdraw', 'who is agent', 'who is buyer', 'who is lawyer', 'who is inspector'
    ],
    answer: `The SafeNest smart contract (written in Aiken) uses an EscrowDatum with: buyer, agent, lawyer, inspector, lawyer_confirmed, inspector_confirmed. Redeemers: ConfirmLawyer, ConfirmInspector, WithdrawToAgent. Funds cannot be released unless both lawyer and inspector have signed. Buyer has the final sign-off. All confirmations are enforced on-chain.`
  },
  // Security
  {
    tags: [
      'security', 'how secure', 'is it safe', 'can i lose money', 'how is fraud prevented', 'how is it enforced', 'how do i know', 'is it on chain', 'is it trustless', 'is it transparent', 'is it professional', 'is it safe', 'is it legit', 'is it legal', 'is it blockchain', 'is it cardano', 'is it aiken'
    ],
    answer: `SafeNest is fully on-chain and trustless. Funds cannot be released unless both lawyer and inspector have signed. The buyer has the final sign-off. All actions are transparent and enforced by Cardano smart contracts.`
  },
  // Test instructions
  {
    tags: [
      'test', 'how to test', 'testing', 'test instructions', 'simulate', 'demo', 'try', 'how do i know it works', 'can i try', 'can i test', 'can i simulate', 'can i see a test', 'can i see a demo'
    ],
    answer: `To test SafeNest: 1) Lawyer signs (ConfirmLawyer), 2) Inspector signs (ConfirmInspector), 3) Buyer withdraws (WithdrawToAgent). Each stage is enforced by the smart contract and can be simulated in the demo.`
  },
  // Tech stack
  {
    tags: [
      'tech stack', 'technology', 'what tools', 'what is it built with', 'aiken', 'node.js', 'cli', 'eternl', 'wallet', 'blockchain', 'cardano', 'testnet', 'preview', 'backend', 'off-chain', 'on-chain', 'which wallet', 'which blockchain', 'which smart contract', 'which language'
    ],
    answer: `SafeNest uses: Smart Contracts: Aiken, Blockchain: Cardano (Preview/Testnet), Off-Chain: Node.js or CLI (optional), Wallets: Eternl. All escrow logic is on-chain.`
  },
  // Credits & license
  {
    tags: [
      'who built', 'who made', 'who created', 'credits', 'license', 'author', 'github', 'hackathon', 'who is kehn', 'kehn marv', 'who is the developer', 'open source', 'license', 'who to thank', 'who to contact'
    ],
    answer: `SafeNest was created by Kehn Marv (GitHub: Kehn-Marv) for the Cardano Hackathon. This project is open source and built to solve a real problem affecting thousands. Thank you for supporting SafeNest!`
  },
  // Philosophy/quote
  {
    tags: [
      'philosophy', 'quote', 'why plantain', 'what does plantain mean', 'real estate is not plantain', 'inspiration', 'motto', 'saying', 'wisdom', 'advice'
    ],
    answer: `"Real estate is not plantain—you don’t just buy because it looks ripe." This means you should always verify, inspect, and use SafeNest to protect your investment!`
  },
);
function aiFlexibleMatch(userText) {
  const lower = userText.toLowerCase();
  for (const intent of aiIntents) {
    for (const tag of intent.tags) {
      // Flexible: match if all words in tag are present, or if tag is a substring, or if any synonym is present
      const tagWords = tag.split(' ');
      if (
        lower.includes(tag) ||
        tagWords.every(word => lower.includes(word)) ||
        (tag.length > 4 && lower.indexOf(tag.replace(/[^a-z0-9]/g, '')) !== -1)
      ) {
        return intent.answer;
      }
    }
  }
  // Fallback
  return "I'm not sure, but here's what I can tell you about SafeNest: SafeNest is a Cardano-powered escrow platform that protects buyers and sellers from fraud. Ask me about escrow, Cardano, or how SafeNest works!";
}
async function aiHuggingFaceResponse(userText) {
  // Use HuggingFace free endpoint for flan-t5-small
  const endpoint = 'https://api-inference.huggingface.co/models/google/flan-t5-small';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: userText })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      return data.generated_text;
    } else if (typeof data === 'string') {
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
function aiSimulateResponse(userText) {
  setTimeout(() => {
    aiAddMessage('ai', `<span class='ai-typing'>...</span>`);
    setTimeout(async () => {
      aiChatArea.querySelector('.ai-typing')?.parentElement?.remove();
      // Try local match first
      const local = aiFlexibleMatch(userText);
      if (local && !local.startsWith("I'm not sure")) {
        aiAddMessage('ai', local);
      } else {
        // Try HuggingFace
        const hf = await aiHuggingFaceResponse(userText);
        if (hf && hf.trim().length > 0) {
          aiAddMessage('ai', hf);
        } else {
          aiAddMessage('ai', local);
        }
      }
    }, 900);
  }, 600);
}
aiChatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = aiChatInput.value.trim();
  if (!text) return;
  aiAddMessage('user', text);
  aiChatInput.value = '';
  aiSimulateResponse(text);
});

// --- Animate Cardano logo watermark (if present) ---
const heroLogo = document.querySelector('.hero-bg-logo');
if (heroLogo) {
  heroLogo.style.animation = 'float 6s ease-in-out infinite alternate';
}

// Add property search functionality
// Wait for DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('section#hero input[type="text"]');
  const searchButton = document.querySelector('section#hero button');
  const propertyCards = document.querySelectorAll('section#properties > div');

  function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:#fde68a; color:inherit; padding:0;">$1</mark>');
  }

  function filterProperties() {
    const term = searchInput.value.trim().toLowerCase();
    propertyCards.forEach(card => {
      const titleEl = card.querySelector('h2');
      const descEl = card.querySelector('p');
      const title = titleEl?.textContent || '';
      const desc = descEl?.textContent || '';
      const match = !term || title.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
      card.style.display = match ? '' : 'none';
      // Highlight matches
      if (titleEl) {
        titleEl.innerHTML = highlightMatch(title, term);
      }
      if (descEl) {
        descEl.innerHTML = highlightMatch(desc, term);
      }
      // Remove highlight if no term
      if (!term) {
        if (titleEl) titleEl.innerHTML = title;
        if (descEl) descEl.innerHTML = desc;
      }
    });
  }

  searchButton.addEventListener('click', filterProperties);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') filterProperties();
  });
  searchInput.addEventListener('input', filterProperties); // Live filtering
});

// Ensure all event listeners are attached after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  // Connect Wallet
  const connectWalletBtn = document.getElementById('connectWallet');
  if (connectWalletBtn) connectWalletBtn.addEventListener('click', connectWallet);

  // Send Payment
  const sendPaymentBtn = document.getElementById('sendPayment');
  if (sendPaymentBtn) sendPaymentBtn.addEventListener('click', sendPayment);

  // Lawyer Confirm
  const lawyerConfirmBtn = document.getElementById('lawyerConfirm');
  if (lawyerConfirmBtn) lawyerConfirmBtn.addEventListener('click', () => {
    if (!paymentSent) {
      showToast('Send payment before confirmation.', 'warning');
      return;
    }
    lawyerConfirmed = true;
    lawyerStatus.textContent = ' Confirmed ✅';
    showToast('Lawyer confirmed.', 'success');
    addTxHistory('Lawyer Confirmed', 'Legal review complete', '⚖️');
    setProgress(3);
    showModal('Transaction confirmed in block #3,847,593');
  });

  // Inspector Confirm
  const inspectorConfirmBtn = document.getElementById('inspectorConfirm');
  if (inspectorConfirmBtn) inspectorConfirmBtn.addEventListener('click', () => {
    if (!paymentSent) {
      showToast('Send payment before confirmation.', 'warning');
      return;
    }
    inspectorConfirmed = true;
    inspectorStatus.textContent = ' Confirmed ✅';
    showToast('Inspector confirmed.', 'success');
    addTxHistory('Inspector Confirmed', 'Inspection complete', '🕵️');
    setProgress(4);
    showModal('Transaction confirmed in block #3,847,594');
  });

  // Release Funds
  const releaseFundsBtn = document.getElementById('releaseFunds');
  if (releaseFundsBtn) releaseFundsBtn.addEventListener('click', () => {
    if (lawyerConfirmed && inspectorConfirmed) {
      showToast('Funds released (simulated)', 'success');
      addTxHistory('Funds Released', 'Buyer receives property, seller receives funds', '🎉');
      setProgress(5);
      showModal('Transaction confirmed in block #3,847,595');
      launchConfetti();
    } else {
      showToast('Both lawyer and inspector must confirm before releasing funds.', 'warning');
    }
  });
});