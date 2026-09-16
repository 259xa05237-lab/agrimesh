/**
 * AGRI MESH - Farmer & Buyer Performance Analytics
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderAnalytics(container) {
  const state = store.getState();
  const currentRole = state.currentUser.role;
  let activeTab = currentRole === 'buyer' ? 'buyer' : 'farmer';

  function renderInner() {
    container.innerHTML = `
      <div class="container section-py" style="padding-top:2rem;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div>
            <span class="badge badge-success">PERFORMANCE & IMPACT</span>
            <h2 style="font-size:2rem; margin-top:0.25rem;">Analytics & Realization Metrics</h2>
            <p style="font-size:0.95rem; color:var(--text-muted);">
              Track economic returns, logistics cost reduction, and farm-gate supply chain efficiency.
            </p>
          </div>

          <!-- View Mode Toggle -->
          <div class="role-switcher-pill">
            <button class="role-btn ${activeTab === 'farmer' ? 'active' : ''}" id="tab-farmer-analytics">
              🌾 Farmer Analytics
            </button>
            <button class="role-btn ${activeTab === 'buyer' ? 'active' : ''}" id="tab-buyer-analytics">
              🏢 Buyer Analytics
            </button>
          </div>
        </div>

        ${activeTab === 'farmer' ? renderFarmerAnalyticsView(state) : renderBuyerAnalyticsView(state)}
      </div>
    `;

    container.querySelector('#tab-farmer-analytics').addEventListener('click', () => {
      activeTab = 'farmer';
      renderInner();
    });

    container.querySelector('#tab-buyer-analytics').addEventListener('click', () => {
      activeTab = 'buyer';
      renderInner();
    });

    container.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        store.navigate(el.getAttribute('data-nav'));
      });
    });
  }

  renderInner();
}

function renderFarmerAnalyticsView(state) {
  const fa = state.farmerAnalytics;

  return `
    <!-- Top KPI Cards -->
    <div class="kpi-grid" style="margin-bottom:2rem;">
      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Total Sales Payout</div>
          <div class="kpi-val" style="color:var(--primary-700);">₹${fa.totalSales.toLocaleString('en-IN')}</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">100% Escrow Settled</div>
        </div>
        <div class="kpi-icon">💰</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Total Deals Completed</div>
          <div class="kpi-val">${fa.totalOrders}</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">0% Order Cancellations</div>
        </div>
        <div class="kpi-icon">📦</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Avg Net Realization</div>
          <div class="kpi-val" style="color:var(--primary-600);">₹${fa.averageNetRealizationPerKg.toFixed(2)}/kg</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">+₹3.20/kg vs local APMC</div>
        </div>
        <div class="kpi-icon">⚡</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Month-on-Month Growth</div>
          <div class="kpi-val" style="color:var(--primary-600);">+${fa.monthlyGrowthPercent}%</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">Expanding direct buyers</div>
        </div>
        <div class="kpi-icon">📈</div>
      </div>
    </div>

    <!-- Charts & Crop Breakdown -->
    <div class="grid grid-2" style="margin-bottom:2rem;">
      <!-- Crop Share Breakdown -->
      <div class="card">
        <h3 style="font-size:1.25rem; margin-bottom:1.25rem;">Produce Revenue Share by Crop</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${fa.cropShare.map(item => `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; margin-bottom:0.25rem;">
                <span>${item.crop} (${item.percent}%)</span>
                <span>₹${item.earnings.toLocaleString('en-IN')}</span>
              </div>
              <div style="width:100%; height:10px; background:var(--bg-subtle); border-radius:var(--radius-full); overflow:hidden;">
                <div style="width:${item.percent}%; height:100%; background:linear-gradient(90deg, var(--primary-600), var(--primary-400)); border-radius:var(--radius-full);"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Clustered Logistics & Spoilage Avoidance -->
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <h3 style="font-size:1.25rem; margin-bottom:1.25rem;">Green Logistics & Spoilage Prevention</h3>
          
          <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1rem;">
            <div style="font-size:0.85rem; color:var(--primary-800); font-weight:700;">Clustered Transport Savings:</div>
            <div style="font-size:2rem; font-weight:900; color:var(--primary-700); font-family:var(--font-heading);">
              ₹${fa.transportSavings.toLocaleString('en-IN')}
            </div>
            <div style="font-size:0.8rem; color:var(--primary-700); margin-top:2px;">
              Saved by sharing reefer trucks along Guntur-Vijayawada-Hyderabad corridor.
            </div>
          </div>

          <div style="background:var(--bg-subtle); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.25rem;">
            <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">Perishable Food Loss Avoided:</div>
            <div style="font-size:2rem; font-weight:900; color:var(--text-main); font-family:var(--font-heading);">
              ${fa.foodLossAvoidedKg} kg
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
              Consistently kept at 4.2°C cold-chain without intermediate dwell time.
            </div>
          </div>
        </div>

        <button class="btn btn-outline btn-sm" style="margin-top:1.5rem;" data-nav="farmer-dashboard">
          + Manage Produce Listings
        </button>
      </div>
    </div>
  `;
}

function renderBuyerAnalyticsView(state) {
  const ba = state.buyerAnalytics;

  return `
    <!-- Top Buyer KPI Cards -->
    <div class="kpi-grid" style="margin-bottom:2rem;">
      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Total Direct Procurement</div>
          <div class="kpi-val" style="color:var(--primary-700);">₹${ba.totalProcurement.toLocaleString('en-IN')}</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">100% Farm-Gate Sourced</div>
        </div>
        <div class="kpi-icon">🏢</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Orders Delivered</div>
          <div class="kpi-val">${ba.ordersCount}</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">Direct DC Delivery</div>
        </div>
        <div class="kpi-icon">📦</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">On-Time Delivery SLA</div>
          <div class="kpi-val" style="color:var(--primary-600);">${ba.onTimeDeliveryPercent}%</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">GPS & Telemetry Monitored</div>
        </div>
        <div class="kpi-icon">⏱️</div>
      </div>

      <div class="kpi-card">
        <div>
          <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Logistics Cost Cut</div>
          <div class="kpi-val" style="color:var(--primary-600);">${ba.logisticsSavingsPercent}%</div>
          <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">Via Clustered Fleet</div>
        </div>
        <div class="kpi-icon">⚡</div>
      </div>
    </div>

    <!-- Verified Farmer Network -->
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h3 style="font-size:1.25rem;">Verified Direct Supplier Network (28 Active Farmers)</h3>
          <div style="font-size:0.85rem; color:var(--text-muted);">Supplying Grade A Tomatoes, Onions, Potatoes, Chillies and Brinjal</div>
        </div>
        <button class="btn btn-primary btn-sm" data-nav="browse-produce">
          Browse Direct Network
        </button>
      </div>

      <div class="grid grid-3">
        <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md);">
          <div style="font-weight:800;">Ramesh Kumar</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Guntur, AP • 6.5 Acres</div>
          <div class="badge badge-success" style="font-size:0.65rem; margin-top:4px;">98.4% Reliability</div>
        </div>
        <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md);">
          <div style="font-weight:800;">Suresh Reddy</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Kurnool, AP • 12 Acres</div>
          <div class="badge badge-success" style="font-size:0.65rem; margin-top:4px;">96.8% Reliability</div>
        </div>
        <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md);">
          <div style="font-weight:800;">Venkat Rao</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Chittoor, AP • 8 Acres</div>
          <div class="badge badge-success" style="font-size:0.65rem; margin-top:4px;">94.5% Reliability</div>
        </div>
      </div>
    </div>
  `;
}
