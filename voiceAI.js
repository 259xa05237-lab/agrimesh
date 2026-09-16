/**
 * AGRI MESH - Premium Floating Robo AI Assistant & Multi-Agent Orchestration System
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

// State variables for Floating Voice AI Agent
let currentAIState = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking' | 'offline'
let isOverlayOpen = false;
let selectedLanguage = 'te-IN'; // Default to Telugu (Indian Agritech Hub), configurable
let recognitionInstance = null;
let activeUtterance = null;
let workingAgentsList = [];
let pendingConfirmationAction = null;

const SUPPORTED_LANGUAGES = [
  { code: 'te-IN', label: 'తెలుగు (Telugu)', name: 'Telugu' },
  { code: 'en-IN', label: 'English (India)', name: 'English' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', name: 'Hindi' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', name: 'Tamil' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', name: 'Kannada' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', name: 'Malayalam' }
];

const SPECIALIZED_AGENTS = [
  { id: 'market', name: 'Market Agent', icon: '🌾', desc: 'Checking APMC Mandi rates & daily price trends' },
  { id: 'buyer', name: 'Buyer Match Agent', icon: '🤝', desc: 'Finding verified bulk & retail buyers' },
  { id: 'location', name: 'Location Agent', icon: '📍', desc: 'Computing proximity & radius distance' },
  { id: 'logistics', name: 'Logistics Agent', icon: '🚚', desc: 'Calculating reefer fleet freight & cluster savings' },
  { id: 'recommend', name: 'Recommendation Agent', icon: '🎯', desc: 'Formulating optimal net-realization action' }
];

// Conversation History for the Session
let conversationHistory = [
  {
    sender: 'ai',
    text: "Namaste! I am your AgriMesh AI Agent. Speak to me in Telugu, Hindi, or English to find buyers, check Mandi prices, list harvest produce, or manage your cart.",
    time: 'Just now'
  }
];

export function initVoiceAIModal() {
  // Ensure single global instance in DOM
  let container = document.getElementById('agrimeesh-floating-ai-system');
  if (!container) {
    container = document.createElement('div');
    container.id = 'agrimeesh-floating-ai-system';
    document.body.appendChild(container);
  }

  // Check Web Speech API Support
  setupSpeechRecognition();

  // Listen for global store state changes
  store.subscribe(() => {
    updateOnlineState();
  });

  renderFloatingAIAssistant(container);

  // Global custom trigger support
  window.addEventListener('open-voice-ai-modal', () => {
    openAIOverlay();
    startListening();
  });
}

function updateOnlineState() {
  const isOnline = store.getState().isOnline;
  if (!isOnline && currentAIState !== 'listening' && currentAIState !== 'thinking') {
    currentAIState = 'offline';
  } else if (isOnline && currentAIState === 'offline') {
    currentAIState = 'idle';
  }
  updateRoboButtonDOM();
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = selectedLanguage;

    recognitionInstance.onstart = () => {
      currentAIState = 'listening';
      updateRoboButtonDOM();
      updateOverlayUI();
    };

    recognitionInstance.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const displayTranscript = finalTranscript || interimTranscript;
      const transcriptBox = document.getElementById('ai-live-transcript-box');
      if (transcriptBox && displayTranscript) {
        transcriptBox.textContent = displayTranscript;
        transcriptBox.classList.add('active');
      }

      if (finalTranscript) {
        handleUserSpokenCommand(finalTranscript.trim());
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn('Speech Recognition Event Error:', event.error);
      if (event.error === 'not-allowed') {
        store.showToast('Microphone Access Needed', 'Please allow microphone access to speak to AgriMesh AI, or use the quick text input.', 'warning');
      }
      currentAIState = 'idle';
      updateRoboButtonDOM();
      updateOverlayUI();
    };

    recognitionInstance.onend = () => {
      if (currentAIState === 'listening') {
        currentAIState = 'idle';
        updateRoboButtonDOM();
        updateOverlayUI();
      }
    };
  }
}

function startListening() {
  if (currentAIState === 'speaking') {
    stopSpeaking();
  }

  if (recognitionInstance) {
    try {
      recognitionInstance.lang = selectedLanguage;
      recognitionInstance.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  } else {
    // Simulated speech input for unsupported browsers / environments
    currentAIState = 'listening';
    updateRoboButtonDOM();
    updateOverlayUI();

    setTimeout(() => {
      const sampleQueries = [
        "Show nearby tomato buyers in Guntur",
        "What is today's tomato Mandi price?",
        "Add 20 kg tomatoes to my cart",
        "Show vegetables within 10 km"
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      const transcriptBox = document.getElementById('ai-live-transcript-box');
      if (transcriptBox) {
        transcriptBox.textContent = randomQuery;
        transcriptBox.classList.add('active');
      }
      setTimeout(() => {
        handleUserSpokenCommand(randomQuery);
      }, 900);
    }, 1800);
  }
}

function stopListening() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      // Ignored
    }
  }
  currentAIState = 'idle';
  updateRoboButtonDOM();
  updateOverlayUI();
}

function speakAIResponse(text) {
  if (!('speechSynthesis' in window)) return;

  stopSpeaking();
  currentAIState = 'speaking';
  updateRoboButtonDOM();
  updateOverlayUI();

  activeUtterance = new SpeechSynthesisUtterance(text);
  activeUtterance.rate = 1.0;
  activeUtterance.pitch = 1.05;

  activeUtterance.onend = () => {
    currentAIState = 'idle';
    updateRoboButtonDOM();
    updateOverlayUI();
  };

  activeUtterance.onerror = () => {
    currentAIState = 'idle';
    updateRoboButtonDOM();
    updateOverlayUI();
  };

  window.speechSynthesis.speak(activeUtterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentAIState === 'speaking') {
    currentAIState = 'idle';
    updateRoboButtonDOM();
    updateOverlayUI();
  }
}

// =======================================================
// NATURAL LANGUAGE NLP & MULTI-AGENT ORCHESTRATION ENGINE
// =======================================================

function handleUserSpokenCommand(userInput) {
  stopListening();

  // Add User message to conversation
  conversationHistory.push({
    sender: 'user',
    text: userInput,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  currentAIState = 'thinking';
  updateRoboButtonDOM();
  updateOverlayUI();

  // Decide required specialized agents based on intent
  const inputLower = userInput.toLowerCase();
  const matchedAgentIds = determineSpecializedAgents(inputLower);

  // Animate Multi-Agent Coordination Pipeline
  simulateAgentActivity(matchedAgentIds, () => {
    executeIntentAndRespond(userInput, inputLower);
  });
}

function determineSpecializedAgents(input) {
  const agents = ['recommend']; // Default coordinator

  if (input.includes('price') || input.includes('mandi') || input.includes('rate') || input.includes('trend') || input.includes('cost')) {
    agents.unshift('market');
  }
  if (input.includes('buyer') || input.includes('sell') || input.includes('demand') || input.includes('match') || input.includes('list')) {
    agents.unshift('buyer');
  }
  if (input.includes('km') || input.includes('near') || input.includes('location') || input.includes('distance') || input.includes('around') || input.includes('guntur') || input.includes('kurnool')) {
    agents.unshift('location');
  }
  if (input.includes('delivery') || input.includes('track') || input.includes('truck') || input.includes('logistics') || input.includes('reefer') || input.includes('order')) {
    agents.unshift('logistics');
  }

  // Ensure at least 3 agents collaborate for visual depth
  if (agents.length < 3) {
    ['market', 'location', 'logistics', 'buyer'].forEach(a => {
      if (!agents.includes(a) && agents.length < 4) agents.push(a);
    });
  }

  return agents;
}

function simulateAgentActivity(agentIds, onComplete) {
  workingAgentsList = agentIds.map(id => ({
    id,
    status: 'working' // 'working' | 'done'
  }));
  updateOverlayUI();

  let step = 0;
  const interval = setInterval(() => {
    if (step < workingAgentsList.length) {
      workingAgentsList[step].status = 'done';
      step++;
      updateOverlayUI();
    } else {
      clearInterval(interval);
      setTimeout(onComplete, 350);
    }
  }, 450);
}

function executeIntentAndRespond(originalText, lower) {
  const state = store.getState();
  let aiResponseText = "";
  let actionConfirmation = null;

  // 1. INTENT: LIST PRODUCE WITH CONFIRMATION (Voice Confirmation Requirement 11)
  const listMatch = lower.match(/(?:list|add|sell|publish)\s+(\d+)\s*(?:kg|kilos|kilograms)?\s*(?:of\s+)?([a-z]+)\s*(?:at|for|@)?\s*(?:₹|rs|rupees)?\s*(\d+(?:\.\d+)?)/i);
  if (listMatch) {
    const qty = Number(listMatch[1]);
    const cropNameRaw = listMatch[2];
    const cropName = cropNameRaw.charAt(0).toUpperCase() + cropNameRaw.slice(1);
    const price = Number(listMatch[3]);

    aiResponseText = `I am ready to publish ${qty} kg of ${cropName} at ₹${price}/kg from your farm in ${state.userLocation.city}. Shall I publish it to the marketplace?`;
    
    actionConfirmation = {
      type: 'PUBLISH_LISTING',
      title: `Publish ${qty} kg ${cropName} @ ₹${price}/kg?`,
      details: `Crop: ${cropName} • Qty: ${qty} kg • Price: ₹${price}/kg • Location: ${state.userLocation.city}`,
      confirmLabel: '✓ Confirm & Publish',
      cancelLabel: '✕ Cancel',
      onConfirm: () => {
        store.addListing({
          crop: cropName,
          quantityKg: qty,
          expectedPricePerKg: price,
          grade: 'Grade A',
          location: state.userLocation.name
        });
        store.setRole('farmer');
        store.navigate('farmer-dashboard');
        addAIResponseMessage(`✓ Success! Your ${qty} kg ${cropName} listing is now live in the marketplace.`);
      }
    };
  }

  // 2. INTENT: ADD TO CART (Context-Aware)
  else if (lower.includes('add') && (lower.includes('cart') || lower.includes('kg') || lower.includes('kilos'))) {
    const qtyMatch = lower.match(/(\d+)\s*(?:kg|kilos|kilograms)?/);
    const qty = qtyMatch ? Number(qtyMatch[1]) : 5;

    // Check if user is currently inspecting a produce item in modal
    let targetListing = state.selectedProduceForInspection;

    if (!targetListing) {
      // Find matching crop in active listings
      const matchedCrop = state.listings.find(l => lower.includes(l.crop.toLowerCase()));
      targetListing = matchedCrop || state.listings[0];
    }

    if (targetListing) {
      store.addToCart(targetListing, qty);
      aiResponseText = `Added ${qty} kg of fresh ${targetListing.crop} from ${targetListing.farmerName} (₹${targetListing.pricePerKg}/kg) to your cart.`;
      store.showToast('🛒 Added by Voice AI', `${qty} kg ${targetListing.crop} added to shopping cart`, 'success');
    } else {
      aiResponseText = `I couldn't identify the specific produce. You can browse tomatoes, onions, or mangoes in the marketplace.`;
    }
  }

  // 3. INTENT: FIND BUYERS / AI MATCHING
  else if (lower.includes('buyer') || lower.includes('sell') || lower.includes('match') || lower.includes('find buyers')) {
    aiResponseText = `I analyzed 8 institutional buyers in your regional corridor. The closest verified bulk buyer is 3.1 km away in ${state.userLocation.city}. Showing AI Net-Realization matches.`;
    store.setRole('farmer');
    store.navigate('farmer-dashboard');
  }

  // 4. INTENT: MANDI PRICE / MARKET INTELLIGENCE
  else if (lower.includes('price') || lower.includes('mandi') || lower.includes('rate') || lower.includes('trend')) {
    aiResponseText = `Today's APMC Mandi modal price for Grade A Tomato in ${state.userLocation.city} is ₹18.50/kg, up 8.5% this week. Opening Market Intelligence for full price analytics.`;
    store.navigate('market-intelligence');
  }

  // 5. INTENT: DISTANCE FILTER / PROXIMITY
  else if (lower.includes('within') || lower.includes('nearby') || lower.includes('km')) {
    const kmMatch = lower.match(/(\d+)\s*km/);
    const km = kmMatch ? kmMatch[1] : '10';
    store.setDistanceFilter(km);
    store.navigate('browse-produce');
    aiResponseText = `Filtered direct farm produce listings within ${km} km radius of ${state.userLocation.city}.`;
  }

  // 6. INTENT: BROWSE VEGETABLES OR FRUITS
  else if (lower.includes('vegetable') || lower.includes('tomato') || lower.includes('onion') || lower.includes('potato') || lower.includes('carrot')) {
    store.navigate('browse-produce');
    aiResponseText = `Opening verified fresh vegetable catalog from nearby farm gates.`;
  } else if (lower.includes('fruit') || lower.includes('mango') || lower.includes('banana') || lower.includes('apple')) {
    store.navigate('browse-produce');
    aiResponseText = `Opening direct harvest fruit listings with live farmer quality scores.`;
  }

  // 7. INTENT: CART & CHECKOUT
  else if (lower.includes('cart') || lower.includes('checkout') || lower.includes('bag')) {
    store.navigate('cart');
    aiResponseText = `Opening your shopping cart. You currently have ${state.cart.length} produce lots ready for clustered logistics dispatch.`;
  }

  // 8. INTENT: ORDER TRACKING & LOGISTICS
  else if (lower.includes('track') || lower.includes('order') || lower.includes('delivery') || lower.includes('truck') || lower.includes('reefer')) {
    store.navigate('order-tracking');
    aiResponseText = `Opening live Reefer Smart Fleet radar. Active cold-chain fleet is maintaining 4.2°C temperature with on-time delivery ETA.`;
  }

  // 9. INTENT: ADD PRODUCE FLOW
  else if (lower.includes('add produce') || lower.includes('start selling') || lower.includes('new listing')) {
    store.setRole('farmer');
    store.navigate('add-produce');
    aiResponseText = `Opening produce listing creator. You can snap live harvest photos or upload them directly.`;
  }

  // 10. DEFAULT HELPFUL FALLBACK
  else {
    aiResponseText = `I understand you said "${originalText}". I have coordinated with our Market & Location agents to bring up the best agricultural matches for you.`;
    store.navigate('browse-produce');
  }

  pendingConfirmationAction = actionConfirmation;

  // Add AI response to conversation
  conversationHistory.push({
    sender: 'ai',
    text: aiResponseText,
    confirmation: actionConfirmation,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  currentAIState = 'speaking';
  updateRoboButtonDOM();
  updateOverlayUI();

  // Speak AI response aloud
  speakAIResponse(aiResponseText);
}

function addAIResponseMessage(text) {
  conversationHistory.push({
    sender: 'ai',
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  updateOverlayUI();
  speakAIResponse(text);
}

// =======================================================
// RENDER & DOM INTERFACE BUILDER
// =======================================================

function renderFloatingAIAssistant(container) {
  container.innerHTML = `
    <!-- 1. Floating Robo AI Button (Always Fixed at Bottom-Right) -->
    <div id="agrimeesh-robo-button-wrapper" class="robo-floating-wrapper ${currentAIState}">
      <!-- Animated Ambient Orbital Ring -->
      <div class="robo-orbital-ring"></div>
      
      <!-- Listening Soundwave Ripple Rings -->
      <div class="robo-wave-ring ring-1"></div>
      <div class="robo-wave-ring ring-2"></div>
      <div class="robo-wave-ring ring-3"></div>

      <!-- Main Robo Floating Button -->
      <button type="button" id="btn-floating-robo-ai" class="robo-floating-btn" aria-label="AgriMesh AI Voice Assistant">
        <!-- Modern Cybernetic Agricultural Robot SVG -->
        <div class="robo-avatar-box">
          <svg class="robo-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="roboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#059669" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#022c22" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Antenna with glowing cyber beacon -->
            <line x1="50" y1="18" x2="50" y2="8" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="7" r="4" fill="#34d399" class="robo-antenna-node" filter="url(#glowFilter)"/>

            <!-- Robot Head Helmet -->
            <rect x="20" y="18" width="60" height="52" rx="20" fill="url(#roboGrad)" stroke="#34d399" stroke-width="2"/>

            <!-- Ear Communication Nodes -->
            <rect x="13" y="36" width="7" height="16" rx="3.5" fill="#047857"/>
            <rect x="80" y="36" width="7" height="16" rx="3.5" fill="#047857"/>

            <!-- Dark High-Tech Visor Screen -->
            <rect x="27" y="28" width="46" height="30" rx="12" fill="url(#visorGrad)" stroke="rgba(52,211,153,0.4)" stroke-width="1.5"/>

            <!-- Animated LED Robot Eyes -->
            <circle cx="40" cy="42" r="5.5" fill="#10b981" class="robo-eye eye-left" filter="url(#glowFilter)"/>
            <circle cx="60" cy="42" r="5.5" fill="#10b981" class="robo-eye eye-right" filter="url(#glowFilter)"/>
            <circle cx="42" cy="40" r="1.5" fill="#ffffff"/>
            <circle cx="62" cy="40" r="1.5" fill="#ffffff"/>

            <!-- Cute Agri-Leaf Badge on Forehead -->
            <path d="M50 21 C48 24, 46 25, 45 27 C49 27, 51 25, 50 21 Z" fill="#6ee7b7"/>

            <!-- Animated Equalizer Mouth in Visor -->
            <line x1="42" y1="52" x2="46" y2="52" stroke="#34d399" stroke-width="2" stroke-linecap="round" class="mouth-bar bar-1"/>
            <line x1="48" y1="52" x2="52" y2="52" stroke="#34d399" stroke-width="2" stroke-linecap="round" class="mouth-bar bar-2"/>
            <line x1="54" y1="52" x2="58" y2="52" stroke="#34d399" stroke-width="2" stroke-linecap="round" class="mouth-bar bar-3"/>

            <!-- Robot Chassis Collar -->
            <path d="M30 70 L70 70 L76 86 L24 86 Z" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
            <!-- Energy Core -->
            <circle cx="50" cy="78" r="4" fill="#38bdf8" filter="url(#glowFilter)" class="robo-energy-core"/>
          </svg>
        </div>

        <!-- Micro State Badge -->
        <span class="robo-state-badge" id="robo-badge-indicator">
          ${getRoboBadgeContent()}
        </span>
      </button>
    </div>

    <!-- 2. Premium Compact Voice AI Overlay (Floats Bottom-Right) -->
    <div id="agrimeesh-voice-overlay" class="robo-voice-overlay ${isOverlayOpen ? 'open' : 'closed'}">
      <div class="robo-overlay-card">
        
        <!-- Header -->
        <div class="robo-overlay-header">
          <div class="robo-header-identity">
            <div class="robo-header-avatar">
              <span style="font-size:1.4rem;">🤖</span>
              <span class="status-dot ${currentAIState}"></span>
            </div>
            <div>
              <div class="robo-title">AgriMesh AI Agent</div>
              <div class="robo-subtitle">Multi-Agent Agritech Coordinator</div>
            </div>
          </div>

          <div class="robo-header-actions">
            <!-- Language Dropdown -->
            <select id="select-voice-lang" class="robo-lang-select" title="Change Voice Language">
              ${SUPPORTED_LANGUAGES.map(lang => `
                <option value="${lang.code}" ${lang.code === selectedLanguage ? 'selected' : ''}>
                  ${lang.label}
                </option>
              `).join('')}
            </select>

            <button type="button" class="btn-robo-close" id="btn-close-robo-overlay" title="Close Assistant">
              ✕
            </button>
          </div>
        </div>

        <!-- Multi-Agent Orchestration Visualizer (Requirements 6 & 7) -->
        <div class="robo-multi-agent-section">
          <div class="multi-agent-header">
            <span class="multi-agent-title">🧠 COOPERATIVE AGENT ACTIVITY</span>
            <span class="multi-agent-status ${currentAIState === 'thinking' ? 'working' : 'ready'}">
              ${currentAIState === 'thinking' ? '⚡ AGENTS ORCHESTRATING' : '✓ AGENTS READY'}
            </span>
          </div>

          <div class="agent-nodes-pipeline">
            ${renderAgentPipelineNodesHTML()}
          </div>
        </div>

        <!-- Conversation Stream -->
        <div class="robo-conversation-scroll" id="robo-conversation-scroll">
          ${renderConversationStreamHTML()}
        </div>

        <!-- Live Speech Recognition Streaming Box -->
        <div class="ai-live-transcript-container">
          <div class="live-transcript-label">
            ${currentAIState === 'listening' ? '🎙️ LISTENING TO YOUR VOICE...' : currentAIState === 'thinking' ? '⚡ ANALYZING COMMAND...' : '💬 VOICE OR TEXT PROMPT'}
          </div>
          <div id="ai-live-transcript-box" class="ai-live-transcript-box ${currentAIState === 'listening' ? 'active' : ''}">
            ${currentAIState === 'listening' ? 'Speak now in Telugu, English, or Hindi...' : 'Tap the microphone to speak or pick a quick suggestion below.'}
          </div>
        </div>

        <!-- Quick Suggestion Action Chips -->
        <div class="robo-suggestion-chips">
          <button type="button" class="suggestion-chip" data-query="Show tomatoes within 10 km">
            🍅 Tomatoes within 10 km
          </button>
          <button type="button" class="suggestion-chip" data-query="What is today's tomato Mandi price?">
            📈 Mandi Price Today
          </button>
          <button type="button" class="suggestion-chip" data-query="Find buyers for my produce">
            🤝 Find Nearby Buyers
          </button>
          <button type="button" class="suggestion-chip" data-query="Add 20 kg tomatoes to cart">
            🛒 Add 20 kg to Cart
          </button>
          <button type="button" class="suggestion-chip" data-query="Track my delivery order">
            🚚 Track My Reefer Order
          </button>
        </div>

        <!-- Bottom Action Bar: Big Mic Button & Text Input Fallback -->
        <div class="robo-overlay-footer">
          <form id="form-ai-text-input" class="robo-text-input-form">
            <input 
              type="text" 
              id="inp-ai-command" 
              class="robo-text-input" 
              placeholder="Ask anything or speak (e.g. 'Show tomatoes nearby')..." 
              autocomplete="off"
            />
            <button type="submit" class="btn-robo-send" title="Send message">➔</button>
          </form>

          <div class="robo-mic-container">
            <button type="button" id="btn-toggle-robo-mic" class="btn-robo-mic ${currentAIState === 'listening' ? 'listening' : ''}">
              <span class="mic-icon">${currentAIState === 'listening' ? '⏹️' : '🎙️'}</span>
              <span class="mic-label">${currentAIState === 'listening' ? 'Stop' : 'Speak'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  attachOverlayEventListeners(container);
}

function getRoboBadgeContent() {
  if (currentAIState === 'listening') return '🎙️ Listening...';
  if (currentAIState === 'thinking') return '⚡ Thinking...';
  if (currentAIState === 'speaking') return '🔊 Speaking...';
  if (currentAIState === 'offline') return '🔴 Offline Mode';
  return '🤖 AI Agent';
}

function renderAgentPipelineNodesHTML() {
  return SPECIALIZED_AGENTS.map(agent => {
    const activeItem = workingAgentsList.find(w => w.id === agent.id);
    const isWorking = activeItem && activeItem.status === 'working';
    const isDone = activeItem && activeItem.status === 'done';

    return `
      <div class="agent-node ${isWorking ? 'working' : isDone ? 'done' : ''}" title="${agent.desc}">
        <div class="agent-node-icon">${agent.icon}</div>
        <div class="agent-node-info">
          <span class="agent-node-name">${agent.name}</span>
          <span class="agent-node-status">${isWorking ? 'Processing...' : isDone ? '✓ Verified' : 'Standby'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderConversationStreamHTML() {
  return conversationHistory.map(msg => `
    <div class="chat-message ${msg.sender}">
      <div class="message-bubble ${msg.sender}">
        <div class="message-text">${msg.text}</div>
        
        <!-- Confirmation Action Box if present (Requirement 11) -->
        ${msg.confirmation ? `
          <div class="ai-confirmation-box">
            <div class="confirm-title">⚠️ ${msg.confirmation.title}</div>
            <div class="confirm-details">${msg.confirmation.details}</div>
            <div class="confirm-actions">
              <button type="button" class="btn btn-sm btn-primary btn-ai-confirm-action">
                ${msg.confirmation.confirmLabel}
              </button>
              <button type="button" class="btn btn-sm btn-secondary btn-ai-cancel-action">
                ${msg.confirmation.cancelLabel}
              </button>
            </div>
          </div>
        ` : ''}

        <div class="message-time">${msg.time}</div>
      </div>
    </div>
  `).join('');
}

function updateRoboButtonDOM() {
  const wrapper = document.getElementById('agrimeesh-robo-button-wrapper');
  const badge = document.getElementById('robo-badge-indicator');
  if (wrapper) {
    wrapper.className = `robo-floating-wrapper ${currentAIState}`;
  }
  if (badge) {
    badge.textContent = getRoboBadgeContent();
  }
}

function updateOverlayUI() {
  const overlay = document.getElementById('agrimeesh-voice-overlay');
  if (!overlay) return;

  overlay.className = `robo-voice-overlay ${isOverlayOpen ? 'open' : 'closed'}`;

  // Update pipeline
  const pipeline = overlay.querySelector('.agent-nodes-pipeline');
  if (pipeline) {
    pipeline.innerHTML = renderAgentPipelineNodesHTML();
  }

  // Update conversation
  const chatScroll = overlay.querySelector('#robo-conversation-scroll');
  if (chatScroll) {
    chatScroll.innerHTML = renderConversationStreamHTML();
    chatScroll.scrollTop = chatScroll.scrollHeight;

    // Attach confirmation handlers
    const confirmBtn = chatScroll.querySelector('.btn-ai-confirm-action');
    const cancelBtn = chatScroll.querySelector('.btn-ai-cancel-action');
    if (confirmBtn && pendingConfirmationAction) {
      confirmBtn.addEventListener('click', () => {
        pendingConfirmationAction.onConfirm();
        pendingConfirmationAction = null;
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        pendingConfirmationAction = null;
        addAIResponseMessage('Action cancelled. How else can I assist you?');
      });
    }
  }

  // Update mic button
  const micBtn = overlay.querySelector('#btn-toggle-robo-mic');
  if (micBtn) {
    micBtn.className = `btn-robo-mic ${currentAIState === 'listening' ? 'listening' : ''}`;
    micBtn.querySelector('.mic-icon').textContent = currentAIState === 'listening' ? '⏹️' : '🎙️';
    micBtn.querySelector('.mic-label').textContent = currentAIState === 'listening' ? 'Stop' : 'Speak';
  }
}

function openAIOverlay() {
  isOverlayOpen = true;
  updateOverlayUI();
  const inp = document.getElementById('inp-ai-command');
  if (inp) inp.focus();
}

function closeAIOverlay() {
  isOverlayOpen = false;
  stopListening();
  stopSpeaking();
  updateOverlayUI();
}

function attachOverlayEventListeners(container) {
  // Toggle Robo Overlay
  const btnFloating = container.querySelector('#btn-floating-robo-ai');
  if (btnFloating) {
    btnFloating.addEventListener('click', () => {
      if (isOverlayOpen) {
        closeAIOverlay();
      } else {
        openAIOverlay();
        startListening();
      }
    });
  }

  // Close Overlay
  const btnClose = container.querySelector('#btn-close-robo-overlay');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      closeAIOverlay();
    });
  }

  // Mic Toggle Button inside Overlay
  const btnMic = container.querySelector('#btn-toggle-robo-mic');
  if (btnMic) {
    btnMic.addEventListener('click', () => {
      if (currentAIState === 'listening') {
        stopListening();
      } else {
        startListening();
      }
    });
  }

  // Language selector
  const langSelect = container.querySelector('#select-voice-lang');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      selectedLanguage = e.target.value;
      if (recognitionInstance) {
        recognitionInstance.lang = selectedLanguage;
      }
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
      store.showToast('AI Language Changed', `Voice recognition set to ${langObj ? langObj.label : selectedLanguage}`, 'info');
    });
  }

  // Suggestion chips
  container.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      handleUserSpokenCommand(query);
    });
  });

  // Text input submit form
  const formText = container.querySelector('#form-ai-text-input');
  const inpText = container.querySelector('#inp-ai-command');
  if (formText && inpText) {
    formText.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inpText.value.trim();
      if (val) {
        inpText.value = '';
        handleUserSpokenCommand(val);
      }
    });
  }
}

