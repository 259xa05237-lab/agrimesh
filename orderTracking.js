/**
 * AGRI MESH - Order Confirmation & Live Telemetry Logistics Tracking
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderOrderConfirmation(container) {
  const state = store.getState();
  const order = state.selectedOrderForTracking || state.orders[0];

  container.innerHTML = `
    <div class="container section-py" style="max-width:860px; padding-top:2.5rem;">
      <div class="card" style="text-align:center; padding:3rem 2rem; border-top:6px solid var(--primary-500);">
        <!-- Animated Success Badge -->
        <div style="width:72px; height:72px; border-radius:50%; background:var(--primary-100); color:var(--primary-700); display:flex; align-items:center; justify-content:center; font-size:2.25rem; margin:0 auto 1.25rem;" class="animate-pulse-glow">
          ✓
        </div>

        <span class="badge badge-success" style="font-size:0.85rem; margin-bottom:0.75rem;">AI ESCROW CONTRACT GENERATED</span>
        <h1 style="font-size:2.2rem; margin-bottom:0.5rem;">Direct Order Confirmed!</h1>
        <p style="font-size:1.05rem; color:var(--text-muted); max-width:550px; margin:0 auto 2rem;">
          Order <strong>#${order.id}</strong> has been locked in automated escrow. Clustered cold-chain logistics assigned.
        </p>

        <!-- Deal Breakdown Receipt Box -->
        <div style="background:var(--bg-subtle); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.75rem; text-align:left; margin-bottom:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:1rem; margin-bottom:1rem;">
            <div>
              <div style="font-size:0.8rem; color:var(--text-muted);">PRODUCE COMMODITY</div>
              <div style="font-size:1.3rem; font-weight:800;">${order.crop} (${order.quantityKg} kg)</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.8rem; color:var(--text-muted);">BUYER</div>
              <div style="font-size:1.1rem; font-weight:800; color:var(--primary-700);">${order.buyerName}</div>
            </div>
          </div>

          <div class="grid grid-3" style="margin-bottom:1.25rem; font-size:0.9rem;">
            <div>
              <div style="color:var(--text-muted);">Gross Buyer Bid:</div>
              <div style="font-weight:700; font-size:1.05rem;">₹${order.grossPricePerKg.toFixed(2)}/kg</div>
            </div>
            <div>
              <div style="color:var(--text-muted);">Clustered Freight:</div>
              <div style="font-weight:700; font-size:1.05rem; color:var(--accent-crimson);">-₹${order.transportCostPerKg.toFixed(2)}/kg</div>
            </div>
            <div>
              <div style="color:var(--text-muted);">AgriMesh Fee (1.5%):</div>
              <div style="font-weight:700; font-size:1.05rem; color:var(--text-muted);">-₹${order.platformFeePerKg.toFixed(2)}/kg</div>
            </div>
          </div>

          <div style="border-top:1px dashed var(--border-light); padding-top:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="font-size:0.82rem; color:var(--text-muted);">NET REALIZATION PER KG:</div>
              <div style="font-size:1.75rem; font-weight:900; color:var(--primary-700); font-family:var(--font-heading);">
                ₹${order.netRealizationPerKg.toFixed(2)}/kg
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.82rem; color:var(--text-muted);">TOTAL GUARANTEED FARMER PAYOUT:</div>
              <div style="font-size:1.75rem; font-weight:900; color:var(--primary-600); font-family:var(--font-heading);">
                ₹${order.totalNetFarmerPayout.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" id="btn-goto-live-tracking">
            🚚 Track Reefer Logistics Telemetry ➔
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-goto-farmer-dashboard">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-goto-live-tracking').addEventListener('click', () => {
    store.navigate('order-tracking');
  });

  container.querySelector('#btn-goto-farmer-dashboard').addEventListener('click', () => {
    store.navigate('farmer-dashboard');
  });
}

export function renderOrderTracking(container) {
  const state = store.getState();
  const order = state.selectedOrderForTracking || state.orders[0];

  container.innerHTML = `
    <div class="container section-py" style="padding-top:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="badge badge-success">LIVE TELEMETRY ACTIVE</span>
          <h2 style="font-size:1.85rem; margin-top:0.25rem;">Cold-Chain Fleet & Order Tracking</h2>
          <div style="font-size:0.9rem; color:var(--text-muted);">
            Tracking Order <strong>#${order.id}</strong> • ${order.crop} (${order.quantityKg} kg)
          </div>
        </div>

        <!-- Quick Status Control for Simulation Testing -->
        <div style="display:flex; align-items:center; gap:0.5rem; background:var(--bg-subtle); padding:0.4rem 0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
          <span style="font-size:0.8rem; font-weight:700;">Demo Telemetry:</span>
          <button class="btn btn-sm btn-ghost" id="sim-status-pack" style="font-size:0.75rem; padding:0.2rem 0.4rem;">Packed</button>
          <button class="btn btn-sm btn-ghost" id="sim-status-transit" style="font-size:0.75rem; padding:0.2rem 0.4rem;">In Transit</button>
          <button class="btn btn-sm btn-ghost" id="sim-status-deliver" style="font-size:0.75rem; padding:0.2rem 0.4rem;">Delivered</button>
        </div>
      </div>

      <!-- Tracking Status Timeline -->
      <div class="card" style="margin-bottom:2rem;">
        <div class="tracking-timeline">
          <div class="timeline-step completed" title="Order Confirmed">✓</div>
          <div class="timeline-step ${order.status !== 'Confirmed' ? 'completed' : 'active'}" title="Quality Verified & Packed">
            ${order.status !== 'Confirmed' ? '✓' : '●'}
          </div>
          <div class="timeline-step ${order.status === 'In Transit' || order.status === 'Arrived' || order.status === 'Delivered' ? 'completed' : ''}" title="In Clustered Cold Transit">
            ${order.status === 'In Transit' ? '🚚' : order.status === 'Delivered' ? '✓' : '○'}
          </div>
          <div class="timeline-step ${order.status === 'Delivered' ? 'completed' : ''}" title="Delivered & Paid">
            ${order.status === 'Delivered' ? '✓' : '○'}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; text-align:center; margin-top:-1rem;">
          <div style="width:100px;">1. Order Confirmed</div>
          <div style="width:100px;">2. Crates Sealed</div>
          <div style="width:100px; color:var(--primary-600);">3. In Clustered Transit</div>
          <div style="width:100px;">4. Buyer Delivery</div>
        </div>
      </div>

      <!-- Main Map & Telemetry Dashboard -->
      <div class="telemetry-dashboard-grid">
        <!-- Interactive Simulated Map Route Visualizer -->
        <div class="logistics-map-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; font-weight:800;">
              <span style="color:#10b981;">📍</span> Corridor: Guntur ➔ Mangalagiri Hub ➔ Vijayawada
            </div>
            <span class="badge badge-gold" style="background:#1e3a8a; color:#ffffff; border:none;">
              Speed: 48 km/h • GPS Online
            </span>
          </div>

          <!-- Stylized Mock Map Canvas -->
          <div style="position:relative; height:320px; background:#071911; border-radius:var(--radius-lg); overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
            <!-- Map Road Line SVG -->
            <svg style="width:100%; height:100%; position:absolute; top:0; left:0;">
              <path d="M 60 250 Q 220 180, 360 160 T 680 80" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="10,6" opacity="0.85" />
              <!-- Farm Node 1 -->
              <circle cx="60" cy="250" r="10" fill="#10b981" />
              <text x="50" y="280" fill="#ffffff" font-size="12" font-weight="bold">Farm Gate (Guntur)</text>

              <!-- Cluster Pickup Hub -->
              <circle cx="360" cy="160" r="12" fill="#f59e0b" />
              <text x="320" y="195" fill="#fcd34d" font-size="11" font-weight="bold">Mangalagiri Cluster Hub</text>

              <!-- Buyer Destination Hub -->
              <circle cx="680" cy="80" r="12" fill="#38bdf8" />
              <text x="630" y="115" fill="#38bdf8" font-size="12" font-weight="bold">Vijayawada DC</text>

              <!-- Animated Truck Moving on Path -->
              <circle cx="280" cy="185" r="16" fill="#ffffff" stroke="#10b981" stroke-width="4" class="animate-pulse-glow" />
              <text x="272" y="191" font-size="14">🚚</text>
            </svg>

            <!-- Overlay Telemetry Floating Tag -->
            <div style="position:absolute; bottom:15px; left:15px; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); padding:0.6rem 1rem; border-radius:var(--radius-md); font-size:0.8rem; border:1px solid rgba(255,255,255,0.15);">
              <div>📍 <strong>Current Position:</strong> ${order.currentLocation}</div>
              <div style="color:#34d399;">⏱️ <strong>Estimated Arrival:</strong> ${order.eta}</div>
            </div>
          </div>
        </div>

        <!-- Right Side Telemetry Sensors -->
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div class="card" style="background:var(--bg-card); border:1px solid var(--border-light);">
            <div style="font-weight:800; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <span>❄️</span> Cold-Chain Reefer Status
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.85rem; color:var(--text-muted);">Cargo Chamber Temp:</span>
              <span style="font-size:1.5rem; font-weight:900; color:var(--primary-600);">${order.temperatureCelsius}°C</span>
            </div>
            <div style="font-size:0.75rem; color:var(--primary-600); background:var(--primary-50); padding:0.4rem 0.6rem; border-radius:var(--radius-sm);">
              ✓ Optimal range (2°C - 6°C) for ${order.crop} freshness
            </div>
          </div>

          <div class="card" style="background:var(--bg-card); border:1px solid var(--border-light);">
            <div style="font-weight:800; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🚚</span> Assigned Vehicle & Driver
            </div>
            <div style="font-size:0.85rem; line-height:1.6;">
              <div><strong>Fleet:</strong> ${order.truckNumber}</div>
              <div><strong>Driver:</strong> ${order.driverName}</div>
              <div><strong>Contact:</strong> ${order.driverPhone}</div>
              <div style="margin-top:0.5rem;">
                <span class="badge badge-info">Cluster Consolidated (3.5T)</span>
              </div>
            </div>
          </div>

          <div class="card" style="background:var(--bg-card); border:1px solid var(--border-light);">
            <div style="font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🛡️</span> Escrow Security
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">
              Payment of <strong>₹${order.totalNetFarmerPayout.toLocaleString('en-IN')}</strong> is locked in digital escrow and auto-disburses to farmer upon buyer gate barcode scan.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach simulation buttons
  const packBtn = container.querySelector('#sim-status-pack');
  const transitBtn = container.querySelector('#sim-status-transit');
  const deliverBtn = container.querySelector('#sim-status-deliver');

  if (packBtn) packBtn.addEventListener('click', () => { store.updateOrderStatus(order.id, 'Packed'); renderOrderTracking(container); });
  if (transitBtn) transitBtn.addEventListener('click', () => { store.updateOrderStatus(order.id, 'In Transit'); renderOrderTracking(container); });
  if (deliverBtn) deliverBtn.addEventListener('click', () => { store.updateOrderStatus(order.id, 'Delivered'); renderOrderTracking(container); });
}
