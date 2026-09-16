/**
 * AGRI MESH - Market Intelligence & AI Price Forecasting
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderMarketIntelligence(container) {
  const state = store.getState();
  const crops = state.marketIntelligence.crops;
  let activeCrop = crops[0]; // Tomato default

  function renderInner() {
    container.innerHTML = `
      <div class="container section-py" style="padding-top:2rem;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div>
            <span class="badge badge-success">APMC AGMARKNET SYNDICATION</span>
            <h2 style="font-size:2rem; margin-top:0.25rem;">Market Intelligence & AI Price Predictor</h2>
            <p style="font-size:0.95rem; color:var(--text-muted);">
              Real-time spot mandi prices, 7-day algorithmic forecasting, and regional arrival volumes.
            </p>
          </div>

          <!-- Crop Switcher Tabs -->
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${crops.map(c => `
              <button class="btn btn-sm ${c.name === activeCrop.name ? 'btn-primary' : 'btn-secondary'} btn-crop-tab" data-crop-name="${c.name}">
                ${c.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Main Spotlight Card for Active Crop -->
        <div class="grid grid-3" style="margin-bottom:2rem;">
          <!-- Price & AI Forecast Card -->
          <div class="card" style="grid-column: span 2; background:var(--bg-card);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
              <div>
                <h3 style="font-size:1.4rem;">${activeCrop.name} Price Trend (Past 7 Days)</h3>
                <div style="font-size:0.85rem; color:var(--text-muted);">Weighted average modal APMC spot price across AP & Telangana mandis</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:2.2rem; font-weight:900; color:var(--primary-700); font-family:var(--font-heading);">
                  ₹${activeCrop.currentAvgPrice.toFixed(2)}<span style="font-size:1rem; font-weight:500; color:var(--text-muted);">/kg</span>
                </div>
                <span class="badge ${activeCrop.weeklyTrendPercent >= 0 ? 'badge-success' : 'badge-danger'}">
                  ${activeCrop.weeklyTrendPercent >= 0 ? '▲ +' : '▼ '}${activeCrop.weeklyTrendPercent}% 7-Day Trend
                </span>
              </div>
            </div>

            <!-- Stylized SVG Price Curve Chart -->
            <div style="position:relative; height:200px; background:var(--bg-subtle); border-radius:var(--radius-lg); padding:1rem 1.5rem; display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:1.5rem;">
              ${activeCrop.historyPrices.map((price, idx) => {
                const min = Math.min(...activeCrop.historyPrices) * 0.9;
                const max = Math.max(...activeCrop.historyPrices) * 1.1;
                const heightPercent = Math.max(15, Math.min(100, ((price - min) / (max - min)) * 100));
                return `
                  <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; flex:1;">
                    <div style="font-size:0.75rem; font-weight:700; color:var(--primary-700);">₹${price.toFixed(2)}</div>
                    <div style="width:24px; height:${heightPercent}%; background:linear-gradient(180deg, var(--primary-500) 0%, var(--primary-300) 100%); border-radius:4px 4px 0 0; transition:height 0.4s ease;"></div>
                    <div style="font-size:0.72rem; color:var(--text-muted);">Day ${idx + 1}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- AI Forecast Banner -->
            <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:1rem; display:flex; align-items:center; gap:0.75rem;">
              <span style="font-size:1.5rem;">🤖</span>
              <div>
                <div style="font-weight:800; color:var(--primary-900); font-size:0.95rem;">AgriMesh Machine Learning Forecast</div>
                <div style="font-size:0.88rem; color:var(--primary-800);">${activeCrop.forecastTrend}</div>
              </div>
            </div>
          </div>

          <!-- Demand Gauge & Fast Stats -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3 style="font-size:1.25rem; margin-bottom:1rem;">Regional Demand Index</h3>
              <div style="text-align:center; padding:1.5rem 0;">
                <div style="font-size:3rem; font-weight:900; color:var(--primary-600); font-family:var(--font-heading);">
                  ${activeCrop.demandLevel.toUpperCase()}
                </div>
                <div style="font-size:0.85rem; color:var(--text-muted);">Retail Buyer Inquiries Today: 14 Orders</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between;">
                  <span>Mandi Arrival Volume:</span>
                  <strong>${activeCrop.mandis[0]?.arrivals || '1,200 Tonnes'}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span>Direct Farm Price Uplift:</span>
                  <strong style="color:var(--primary-600);">+₹2.80/kg via AgriMesh</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span>Reefer Availability:</span>
                  <strong>94% High Capacity</strong>
                </div>
              </div>
            </div>

            <button class="btn btn-primary btn-sm" style="width:100%; margin-top:1.5rem;" data-nav="add-produce">
              + List ${activeCrop.name} Now
            </button>
          </div>
        </div>

        <!-- Regional Mandi Benchmark Comparison Table -->
        <div class="card">
          <h3 style="font-size:1.25rem; margin-bottom:1.25rem;">Live APMC Agmarknet Spot Comparison (${activeCrop.name})</h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
              <thead>
                <tr style="border-bottom:2px solid var(--border-light); color:var(--text-muted); font-size:0.8rem; text-transform:uppercase;">
                  <th style="padding:0.75rem;">Mandi / APMC Yard</th>
                  <th style="padding:0.75rem;">Modal Price (₹/kg)</th>
                  <th style="padding:0.75rem;">Daily Arrivals</th>
                  <th style="padding:0.75rem;">AgriMesh Direct Payout</th>
                  <th style="padding:0.75rem;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${activeCrop.mandis.map(m => `
                  <tr style="border-bottom:1px solid var(--border-light);">
                    <td style="padding:1rem 0.75rem; font-weight:700;">📍 ${m.mandi}</td>
                    <td style="padding:1rem 0.75rem; font-weight:800; color:var(--text-main);">₹${m.modalPrice.toFixed(2)}/kg</td>
                    <td style="padding:1rem 0.75rem; color:var(--text-muted);">${m.arrivals}</td>
                    <td style="padding:1rem 0.75rem; font-weight:800; color:var(--primary-600);">
                      ₹${(m.modalPrice + 1.20).toFixed(2)}/kg <span class="badge badge-success" style="font-size:0.65rem;">+12%</span>
                    </td>
                    <td style="padding:1rem 0.75rem;">
                      <button class="btn btn-sm btn-outline" data-nav="add-produce">Sell Here</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    container.querySelectorAll('.btn-crop-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropName = btn.getAttribute('data-crop-name');
        activeCrop = crops.find(c => c.name === cropName) || crops[0];
        renderInner();
      });
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
