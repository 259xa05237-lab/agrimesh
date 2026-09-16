/**
 * AGRI MESH - Main Application Controller & Router (Marketplace Cart & Direct Logistics)
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from './state/store.js';
import { renderNavbar } from './components/navigation.js';
import { renderLandingPage } from './components/landing.js';
import { renderFarmerPortal } from './components/farmerPortal.js';
import { renderBuyerPortal } from './components/buyerPortal.js';
import { renderCartPage } from './components/cartPage.js';
import { renderBasicPhoneAccess } from './components/basicPhoneIVR.js';
import { renderVillageAgentPortal } from './components/villageAgentPortal.js';
import { renderOrderConfirmation, renderOrderTracking } from './components/orderTracking.js';
import { renderMarketIntelligence } from './components/marketIntelligence.js';
import { renderAnalytics } from './components/analytics.js';
import { renderAdminDemo } from './components/adminDemo.js';
import { initVoiceAIModal } from './components/voiceAI.js';
import { initToastSystem } from './components/toast.js';

function initApp() {
  const navContainer = document.getElementById('navbar-mount');
  const mainContainer = document.getElementById('main-mount');

  // Initialize Modal & Toast engines
  initToastSystem();
  initVoiceAIModal();

  // Set initial theme
  document.documentElement.setAttribute('data-theme', store.getState().theme);

  function renderCurrentRoute() {
    const state = store.getState();
    const page = state.currentPage;

    // Render Navigation
    renderNavbar(navContainer);

    // Route Switching
    switch (page) {
      case 'landing':
        renderLandingPage(mainContainer);
        break;
      case 'farmer-dashboard':
        renderFarmerPortal(mainContainer, 'dashboard');
        break;
      case 'add-produce':
        renderFarmerPortal(mainContainer, 'add-produce');
        break;
      case 'ai-matching':
        renderFarmerPortal(mainContainer, 'matching');
        break;
      case 'farmer-listings':
        renderFarmerPortal(mainContainer, 'listings');
        break;
      case 'buyer-dashboard':
        renderBuyerPortal(mainContainer, 'dashboard');
        break;
      case 'browse-produce':
        renderBuyerPortal(mainContainer, 'browse');
        break;
      case 'cart':
        renderCartPage(mainContainer, 'cart');
        break;
      case 'order-review':
        renderCartPage(mainContainer, 'review');
        break;
      case 'basic-phone-access':
        renderBasicPhoneAccess(mainContainer);
        break;
      case 'village-agent-dashboard':
        renderVillageAgentPortal(mainContainer);
        break;
      case 'order-confirmation':
        renderOrderConfirmation(mainContainer);
        break;
      case 'order-tracking':
        renderOrderTracking(mainContainer);
        break;
      case 'market-intelligence':
        renderMarketIntelligence(mainContainer);
        break;
      case 'farmer-analytics':
      case 'buyer-analytics':
        renderAnalytics(mainContainer);
        break;
      case 'admin-demo':
        renderAdminDemo(mainContainer);
        break;
      default:
        renderLandingPage(mainContainer);
        break;
    }
  }

  // Subscribe to store updates for automatic reactivity
  store.subscribe(() => {
    renderCurrentRoute();
  });

  // Initial render
  renderCurrentRoute();
}

// Start application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
