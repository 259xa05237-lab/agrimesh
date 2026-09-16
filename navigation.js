/**
 * AGRI MESH - Clean Professional Navigation Bar & Mobile Drawer
 */

import { store } from '../state/store.js';

export function renderNavbar(container) {
  const state = store.getState();
  const currentRole = state.currentUser.role;
  const currentPage = state.currentPage;
  const isDark = state.theme === 'dark';
  const isOnline = state.isOnline;
  const isSyncing = state.isSyncing;
  const offlineCount = state.offlineQueue.length;
  const cartItemsCount = state.cart ? state.cart.length : 0;

  container.innerHTML = `
    <!-- Top Live Connectivity & Platform Tools Bar -->
    <div class="demo-control-bar">
      <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
        <span class="badge badge-success" style="font-size:0.75rem; background:rgba(16,185,129,0.2); color:#34d399; border-color:#059669;">
          🌱 AGRIMESH CORE ENGINE
        </span>
        <span style="font-weight:600; font-size:0.85rem;">Direct Agricultural Marketplace & Logistics Engine</span>
      </div>

      <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
        <!-- Network Connectivity Indicator Pill -->
        <button id="btn-toggle-network-status" class="btn btn-sm" style="font-size:0.78rem; padding:0.25rem 0.65rem; border:none; background:${isOnline ? '#065f46' : '#991b1b'}; color:#ffffff; font-weight:700;" title="Simulate Offline/Online Network">
          ${isSyncing ? '🟡 Syncing...' : isOnline ? '🟢 Online' : `🔴 Offline (${offlineCount} Queued)`}
        </button>

        <button id="btn-basic-phone-nav" class="btn btn-sm btn-ghost" style="color:white; font-size:0.78rem; padding:0.2rem 0.45rem;" data-nav="basic-phone-access">
          📞 2G IVR / SMS
        </button>

        <button id="btn-admin-panel-nav" class="btn btn-sm btn-ghost" style="color:white; font-size:0.78rem; padding:0.2rem 0.45rem;" data-nav="admin-demo">
          🛠 Demo Controls
        </button>
      </div>
    </div>

    <!-- Main Clean Header -->
    <header class="navbar-wrapper">
      <div class="container">
        <nav class="navbar">
          <!-- Brand Logo -->
          <a href="#" class="brand-logo" id="nav-brand-logo">
            <div class="logo-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z"></path>
                <path d="M12 6v6l4 2"></path>
                <path d="M16 2v4"></path>
                <path d="M8 2v4"></path>
                <path d="M12 18v.01"></path>
                <path d="M7 14s2-2 5-2 5 2 5 2"></path>
              </svg>
            </div>
            <div>
              <span style="letter-spacing:-0.03em;">AGRI<span style="color:var(--primary-500);">MESH</span></span>
              <div style="font-size:0.68rem; font-weight:700; color:var(--primary-600); letter-spacing:0.04em; text-transform:uppercase; margin-top:-4px;">
                Direct Farmers. Better Prices.
              </div>
            </div>
          </a>

          <!-- Main Navigation Links -->
          <ul class="nav-links">
            <li><a class="nav-link ${currentPage === 'landing' ? 'active' : ''}" data-nav="landing">Home</a></li>
            <li><a class="nav-link ${currentPage === 'browse-produce' ? 'active' : ''}" data-nav="browse-produce">Marketplace</a></li>
            <li><a class="nav-link" data-nav="landing" data-scroll="how-it-works-sec">How It Works</a></li>
            <li><a class="nav-link ${currentPage === 'market-intelligence' ? 'active' : ''}" data-nav="market-intelligence">Market Intelligence</a></li>
            <li><a class="nav-link ${currentPage === 'order-tracking' ? 'active' : ''}" data-nav="order-tracking">Logistics</a></li>
            <li><a class="nav-link" data-nav="landing" data-scroll="about-sec">About</a></li>
          </ul>

          <!-- Right Action Controls -->
          <div class="nav-actions">
            <!-- Theme Toggle -->
            <button id="btn-theme-toggle" class="btn btn-icon btn-ghost" title="Toggle Dark/Light Mode">
              ${isDark ? '☀️' : '🌙'}
            </button>

            <!-- Role Selector Pill -->
            <div class="role-switcher-pill" title="Switch User Persona">
              <button class="role-btn ${currentRole === 'farmer' ? 'active' : ''}" data-role="farmer">Farmer</button>
              <button class="role-btn ${currentRole === 'buyer' ? 'active' : ''}" data-role="buyer">Buyer</button>
              <button class="role-btn ${currentRole === 'agent' ? 'active' : ''}" data-role="agent">Agent</button>
              <button class="role-btn ${currentRole === 'admin' ? 'active' : ''}" data-role="admin">Admin</button>
            </div>

            <!-- Cart Button with Dynamic Item Count Badge -->
            <button id="btn-nav-cart" class="btn btn-secondary btn-sm" style="position:relative; font-weight:700;" data-nav="cart">
              <span style="font-size:1.15rem;">🛒</span> Cart
              ${cartItemsCount > 0 ? `
                <span style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:#ffffff; font-size:0.72rem; font-weight:800; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);" class="animate-pulse-glow">
                  ${cartItemsCount}
                </span>
              ` : ''}
            </button>

            <!-- Primary Action CTA -->
            <button id="btn-nav-primary-action" class="btn btn-primary btn-sm">
              ${currentRole === 'farmer' ? 'Farmer Dashboard' : currentRole === 'buyer' ? 'Browse Produce' : currentRole === 'agent' ? 'Agent Hub' : 'Get Started'}
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="mobile-bottom-bar">
      <div class="mobile-nav-item ${currentPage === 'landing' ? 'active' : ''}" data-nav="landing">
        <span style="font-size:1.2rem;">🏠</span>
        <span>Home</span>
      </div>
      <div class="mobile-nav-item ${currentPage === 'browse-produce' ? 'active' : ''}" data-nav="browse-produce">
        <span style="font-size:1.2rem;">🥬</span>
        <span>Market</span>
      </div>
      <div class="mobile-nav-item ${currentPage === 'cart' || currentPage === 'order-review' ? 'active' : ''}" data-nav="cart" style="position:relative;">
        <span style="font-size:1.3rem;">🛒</span>
        <span>Cart</span>
        ${cartItemsCount > 0 ? `
          <span style="position:absolute; top:2px; right:12px; background:#ef4444; color:#ffffff; font-size:0.65rem; font-weight:800; border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center;">
            ${cartItemsCount}
          </span>
        ` : ''}
      </div>
      <div class="mobile-nav-item ${currentPage === 'farmer-dashboard' ? 'active' : ''}" data-nav="farmer-dashboard">
        <span style="font-size:1.2rem;">👨‍🌾</span>
        <span>Farmer</span>
      </div>
      <div class="mobile-nav-item ${currentPage === 'order-tracking' ? 'active' : ''}" data-nav="order-tracking">
        <span style="font-size:1.2rem;">🚚</span>
        <span>Tracking</span>
      </div>
    </nav>
  `;

  // Attach Event Listeners
  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = el.getAttribute('data-nav');
      const scrollId = el.getAttribute('data-scroll');
      if (scrollId && targetPage === 'landing' && store.getState().currentPage === 'landing') {
        const sec = document.getElementById(scrollId);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else {
        store.navigate(targetPage);
        if (scrollId) {
          setTimeout(() => {
            const sec = document.getElementById(scrollId);
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    });
  });

  container.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newRole = btn.getAttribute('data-role');
      store.setRole(newRole);
      if (newRole === 'farmer') store.navigate('farmer-dashboard');
      else if (newRole === 'buyer') store.navigate('browse-produce');
      else if (newRole === 'agent') store.navigate('village-agent-dashboard');
      else if (newRole === 'admin') store.navigate('admin-demo');
    });
  });

  const toggleNetBtn = container.querySelector('#btn-toggle-network-status');
  if (toggleNetBtn) {
    toggleNetBtn.addEventListener('click', () => {
      store.toggleNetwork();
    });
  }

  const themeBtn = container.querySelector('#btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => store.toggleTheme());
  }

  const brandLogo = container.querySelector('#nav-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      store.navigate('landing');
    });
  }

  const primaryActionBtn = container.querySelector('#btn-nav-primary-action');
  if (primaryActionBtn) {
    primaryActionBtn.addEventListener('click', () => {
      if (currentRole === 'farmer') store.navigate('farmer-dashboard');
      else if (currentRole === 'buyer') store.navigate('browse-produce');
      else if (currentRole === 'agent') store.navigate('village-agent-dashboard');
      else store.navigate('admin-demo');
    });
  }
}
