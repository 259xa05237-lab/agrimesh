/**
 * AGRI MESH - Platform Operations & Simulation Console
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderAdminDemo(container) {
  const state = store.getState();

  container.innerHTML = `
    <div class="container section-py" style="padding-top:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="badge badge-primary">ENTERPRISE PLATFORM CONSOLE</span>
          <h2 style="font-size:2rem; margin-top:0.25rem;">Admin & Inclusive Simulation Console</h2>
          <p style="font-size:0.95rem; color:var(--text-muted);">
            Test and trigger every platform state, low-connectivity offline synchronization, 2G IVR simulator, and Village Agent workflows.
          </p>
        </div>

        <button class="btn btn-secondary" id="btn-admin-reset-all">
          🔄 Reset to Fresh Demo State
        </button>
      </div>

      <!-- Quick Action Triggers Grid -->
      <div class="grid grid-3" style="margin-bottom:2rem;">
        <!-- Card 1: Low-Connectivity Offline Demo -->
        <div class="card" style="border-top:4px solid #ef4444;">
          <div class="badge badge-danger" style="margin-bottom:0.5rem;">OFFLINE-FIRST DEMO</div>
          <h3 style="font-size:1.25rem; margin-bottom:0.5rem;">🔴 Complete Low-Connectivity Demo</h3>
          <p style="font-size:0.85rem; margin-bottom:1.25rem;">
            Simulates: Internet Cut ➔ Offline Save Tomato ➔ Local Cache ➔ Internet Restored ➔ Cloud Sync ➔ AI Match with FreshMart ➔ Instant SMS.
          </p>
          <button class="btn btn-primary btn-sm" id="btn-run-offline-demo-story" style="width:100%; background:linear-gradient(135deg, #b91c1c 0%, #059669 100%);">
            ▶ Run 8-Step Offline Demo Story
          </button>
        </div>

        <!-- Card 2: 2G Basic Phone IVR Demo -->
        <div class="card" style="border-top:4px solid var(--accent-gold);">
          <div class="badge badge-gold" style="margin-bottom:0.5rem;">NO SMARTPHONE DEMO</div>
          <h3 style="font-size:1.25rem; margin-bottom:0.5rem;">📞 Basic Phone IVR & SMS</h3>
          <p style="font-size:0.85rem; margin-bottom:1.25rem;">
            Launches interactive toll-free 1800-AGRI-MESH phone keypad simulator with Telugu voice menu and automated text messages.
          </p>
          <button class="btn btn-accent btn-sm" id="btn-goto-ivr-demo" style="width:100%;" data-nav="basic-phone-access">
            ▶ Launch 2G IVR Phone Simulator
          </button>
        </div>

        <!-- Card 3: Village Agent Demo -->
        <div class="card" style="border-top:4px solid var(--accent-blue);">
          <div class="badge badge-info" style="margin-bottom:0.5rem;">ASSISTED ACCESS</div>
          <h3 style="font-size:1.25rem; margin-bottom:0.5rem;">👨‍💼 Village Digital Agent</h3>
          <p style="font-size:0.85rem; margin-bottom:1.25rem;">
            Demonstrates how a local VLE / Krishi Mitra lists produce and manages escrow payouts for non-tech-savvy farmers.
          </p>
          <button class="btn btn-secondary btn-sm" id="btn-goto-agent-demo" style="width:100%;" data-nav="village-agent-dashboard">
            ▶ Open Village Agent Portal
          </button>
        </div>
      </div>

      <!-- Second Row: Core Platform Triggers -->
      <div class="grid grid-3" style="margin-bottom:2rem;">
        <!-- 1-Click Complete Pitch Flow -->
        <div class="card" style="border-top:4px solid var(--primary-500);">
          <h4 style="font-size:1.15rem; margin-bottom:0.4rem;">⚡ Standard Smartphone Pitch</h4>
          <p style="font-size:0.82rem; margin-bottom:1rem;">
            Auto-navigates standard smartphone AI workflow: List Tomato ➔ AI Match ➔ FreshMart Dispatch.
          </p>
          <button class="btn btn-primary btn-sm" id="btn-run-full-demo-story" style="width:100%;">
            ▶ Run Standard Pitch Flow
          </button>
        </div>

        <!-- APMC Price Surge -->
        <div class="card" style="border-top:4px solid var(--accent-gold);">
          <h4 style="font-size:1.15rem; margin-bottom:0.4rem;">📈 APMC Mandi Price Surge</h4>
          <p style="font-size:0.82rem; margin-bottom:1rem;">
            Simulates retail demand spike in Madanapalle APMC mandis (+15%).
          </p>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-accent" id="btn-surge-tomato" style="flex:1;">
              + Tomato (₹22/kg)
            </button>
            <button class="btn btn-sm btn-outline" id="btn-surge-chilli" style="flex:1;">
              + Chilli (₹210/kg)
            </button>
          </div>
        </div>

        <!-- Logistics Telemetry Advance -->
        <div class="card" style="border-top:4px solid var(--accent-blue);">
          <h4 style="font-size:1.15rem; margin-bottom:0.4rem;">🚚 Fleet Telemetry Advance</h4>
          <p style="font-size:0.82rem; margin-bottom:1rem;">
            Fast-forward truck position, cold-chain temperature readings, and delivery.
          </p>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-secondary" id="btn-truck-transit" style="flex:1;">
              In Transit (4.2°C)
            </button>
            <button class="btn btn-sm btn-primary" id="btn-truck-deliver" style="flex:1;">
              Mark Delivered
            </button>
          </div>
        </div>
      </div>

      <!-- Live Database Overview Tables -->
      <div class="grid grid-2">
        <!-- Active Produce Listings -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem;">Live Produce Listings (${state.listings.length})</h3>
            <button class="btn btn-sm btn-outline" data-nav="add-produce">+ Add Listing</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:280px; overflow-y:auto;">
            ${state.listings.map(l => `
              <div style="padding:0.6rem 0.8rem; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
                <div>
                  <strong>${l.crop}</strong> (${l.quantityKg} kg) • ₹${l.expectedPricePerKg}/kg
                  <div style="font-size:0.75rem; color:var(--text-muted);">${l.farmerName} • ${l.location}</div>
                </div>
                <span class="badge ${l.isOfflinePending ? 'badge-gold' : 'badge-success'}">
                  ${l.isOfflinePending ? 'Offline Saved' : 'Online'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Active Orders & Telemetry -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem;">Active Deals & Orders (${state.orders.length})</h3>
            <button class="btn btn-sm btn-outline" data-nav="order-tracking">Fleet Tracking</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:280px; overflow-y:auto;">
            ${state.orders.map(o => `
              <div style="padding:0.6rem 0.8rem; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
                <div>
                  <strong>#${o.id}</strong> — ${o.crop} (${o.quantityKg} kg)
                  <div style="font-size:0.75rem; color:var(--text-muted);">${o.buyerName} • Net ₹${o.netRealizationPerKg}/kg</div>
                </div>
                <span class="badge ${o.status === 'Delivered' ? 'badge-success' : 'badge-gold'}">${o.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Admin Listeners
  container.querySelector('#btn-admin-reset-all').addEventListener('click', () => {
    store.resetDemoData();
    renderAdminDemo(container);
  });

  container.querySelector('#btn-run-offline-demo-story').addEventListener('click', () => {
    store.runOfflineDemoStory();
  });

  container.querySelector('#btn-surge-tomato').addEventListener('click', () => {
    store.updateMandiPrice('Tomato', 22.00);
  });

  container.querySelector('#btn-surge-chilli').addEventListener('click', () => {
    store.updateMandiPrice('Guntur Chilli', 210.00);
  });

  const transitBtn = container.querySelector('#btn-truck-transit');
  if (transitBtn && state.orders[0]) {
    transitBtn.addEventListener('click', () => {
      store.updateOrderStatus(state.orders[0].id, 'In Transit');
    });
  }

  const deliverBtn = container.querySelector('#btn-truck-deliver');
  if (deliverBtn && state.orders[0]) {
    deliverBtn.addEventListener('click', () => {
      store.updateOrderStatus(state.orders[0].id, 'Delivered');
    });
  }

  container.querySelector('#btn-run-full-demo-story').addEventListener('click', () => {
    store.resetDemoData();
    store.setRole('farmer');
    store.navigate('add-produce');
    store.showToast('Standard Pitch Demo Flow Started', 'Step 1: Farmer lists 1,000 kg Tomato in Guntur', 'info');
  });

  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      store.navigate(el.getAttribute('data-nav'));
    });
  });
}
