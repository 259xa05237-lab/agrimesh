/**
 * AGRI MESH - Village Agent Portal (Assisted Marketplace for Non-Smartphone Farmers)
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderVillageAgentPortal(container) {
  const state = store.getState();
  const agent = state.villageAgent;

  container.innerHTML = `
    <div class="container section-py" style="padding-top:2rem;">
      <!-- Header Banner -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:linear-gradient(135deg, #064e3b 0%, #065f46 100%); color:#ffffff; padding:2rem; border-radius:var(--radius-xl); margin-bottom:2rem;">
        <div>
          <span class="badge badge-gold" style="font-size:0.75rem;">VILLAGE DIGITAL AGENT TERMINAL</span>
          <h2 style="color:#ffffff; margin:0.25rem 0;">Village Assisted Hub — ${agent.name}</h2>
          <p style="color:rgba(255,255,255,0.85); font-size:0.95rem;">
            📍 ${agent.location} • Helping local farmers without smartphones access direct institutional buyers.
          </p>
        </div>
        <button class="btn btn-accent" id="btn-quick-assisted-listing">
          + Create Assisted Farmer Listing
        </button>
      </div>

      <!-- 4 KPI Metrics -->
      <div class="kpi-grid" style="margin-bottom:2rem;">
        <div class="kpi-card">
          <div>
            <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Farmers Assisted</div>
            <div class="kpi-val" style="color:var(--primary-700);">${agent.farmersAssisted}</div>
            <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">Across 4 Gram Panchayats</div>
          </div>
          <div class="kpi-icon">👨‍🌾</div>
        </div>

        <div class="kpi-card">
          <div>
            <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Pending Listings</div>
            <div class="kpi-val">${agent.pendingListings}</div>
            <div style="font-size:0.75rem; color:var(--accent-amber); margin-top:2px;">Awaiting Clustered Pickup</div>
          </div>
          <div class="kpi-icon" style="background:var(--accent-gold-light); color:var(--accent-amber);">📝</div>
        </div>

        <div class="kpi-card">
          <div>
            <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Active Reefer Orders</div>
            <div class="kpi-val" style="color:var(--accent-blue);">${agent.activeOrders}</div>
            <div style="font-size:0.75rem; color:var(--accent-blue); margin-top:2px;">Consolidated Transit</div>
          </div>
          <div class="kpi-icon" style="background:var(--accent-blue-light); color:var(--accent-blue);">🚚</div>
        </div>

        <div class="kpi-card">
          <div>
            <div style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">Today's Inquiries</div>
            <div class="kpi-val" style="color:var(--primary-600);">${agent.todayRequests}</div>
            <div style="font-size:0.75rem; color:var(--primary-600); margin-top:2px;">Voice & In-Person Walk-ins</div>
          </div>
          <div class="kpi-icon">📞</div>
        </div>
      </div>

      <!-- Main Columns: Assisted Form & Registered Village Farmers -->
      <div class="grid grid-2">
        <!-- Assisted Listing Form -->
        <div class="form-card">
          <div style="margin-bottom:1.5rem;">
            <h3 style="font-size:1.4rem; margin-bottom:0.25rem;">Create Listing for Non-Smartphone Farmer</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">
              Enter farmer specifications. The system automatically notifies the farmer via 2G SMS updates.
            </p>
          </div>

          <form id="form-assisted-farmer-listing">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label" for="agent-farmer-name">Farmer Full Name *</label>
                <input type="text" class="form-input" id="agent-farmer-name" value="Appa Rao" required placeholder="e.g. Appa Rao">
              </div>

              <div class="form-group">
                <label class="form-label" for="agent-farmer-phone">Farmer Basic Mobile (SMS) *</label>
                <input type="tel" class="form-input" id="agent-farmer-phone" value="+91 94401 28912" required placeholder="+91 98480 XXXXX">
              </div>

              <div class="form-group">
                <label class="form-label" for="agent-crop">Crop Type *</label>
                <select class="form-select" id="agent-crop" required>
                  <option value="Tomato" selected>Tomato (టమాటా)</option>
                  <option value="Onion">Onion (ఉల్లిపాయ)</option>
                  <option value="Potato">Potato (ఆలూ)</option>
                  <option value="Guntur Chilli">Guntur Chilli (మిర్చి)</option>
                  <option value="Brinjal">Brinjal (వంకాయ)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="agent-quantity">Quantity (kg) *</label>
                <input type="number" class="form-input" id="agent-quantity" value="600" min="50" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="agent-price">Expected Reserve Price (₹/kg) *</label>
                <input type="number" step="0.5" class="form-input" id="agent-price" value="18.00" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="agent-grade">Quality / Grade</label>
                <select class="form-select" id="agent-grade">
                  <option value="Grade A" selected>Grade A (Premium)</option>
                  <option value="Grade B+">Grade B+ (Wholesale)</option>
                </select>
              </div>

              <div class="form-group" style="grid-column:span 2;">
                <label class="form-label" for="agent-location">Village / Field Location *</label>
                <input type="text" class="form-input" id="agent-location" value="Kollipara Village, Tenali Mandalam, AP" required>
              </div>
            </div>

            <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <span class="badge badge-success" style="font-size:0.75rem;">
                ✓ Farmer does NOT need a smartphone
              </span>
              <button type="submit" class="btn btn-primary">
                ⚡ Create Listing & Dispatch SMS
              </button>
            </div>
          </form>
        </div>

        <!-- Village Assisted Directory & Activity -->
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div class="card">
            <h3 style="font-size:1.25rem; margin-bottom:1rem;">Recent Assisted Village Farmers</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div style="padding:0.75rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong>Narayana Murthy</strong> (No Smartphone)
                  <div style="font-size:0.75rem; color:var(--text-muted);">800 kg Tomato • Kollipara • Matched with FreshMart</div>
                </div>
                <span class="badge badge-success">SMS Active</span>
              </div>
              <div style="padding:0.75rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong>Subba Reddy</strong> (Basic Jio Phone)
                  <div style="font-size:0.75rem; color:var(--text-muted);">1,200 kg Onion • Tenali • Reefer Pickup Tomorrow</div>
                </div>
                <span class="badge badge-info">In Cluster</span>
              </div>
              <div style="padding:0.75rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong>Sita Ramaiah</strong> (Assisted)
                  <div style="font-size:0.75rem; color:var(--text-muted);">400 kg Brinjal • Duggirala • Escrow Paid ₹6,400</div>
                </div>
                <span class="badge badge-success">Settled</span>
              </div>
            </div>
          </div>

          <div class="card" style="background:var(--primary-50); border:1px solid var(--primary-200);">
            <div style="font-weight:800; color:var(--primary-900); margin-bottom:0.4rem;">
              🛡️ The Village Agent Model in Digital India
            </div>
            <p style="font-size:0.85rem; color:var(--primary-800); line-height:1.5;">
              Village level entrepreneurs (VLEs) and Krishi Mitras act as human touchpoints. They register crop lots on behalf of non-tech-savvy farmers, aggregate village crates at local pickup points, and verify biometric digital escrow payouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Assisted Form Listener
  const form = container.querySelector('#form-assisted-farmer-listing');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const farmerName = container.querySelector('#agent-farmer-name').value;
      const farmerPhone = container.querySelector('#agent-farmer-phone').value;
      const crop = container.querySelector('#agent-crop').value;
      const quantityKg = container.querySelector('#agent-quantity').value;
      const expectedPricePerKg = container.querySelector('#agent-price').value;
      const location = container.querySelector('#agent-location').value;
      const grade = container.querySelector('#agent-grade').value;

      store.agentCreateFarmerListing({
        farmerName,
        farmerPhone,
        crop,
        quantityKg,
        expectedPricePerKg,
        location,
        grade
      });

      renderVillageAgentPortal(container);
    });
  }

  const quickBtn = container.querySelector('#btn-quick-assisted-listing');
  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      container.querySelector('#agent-farmer-name').focus();
    });
  }
}
