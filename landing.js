/**
 * AGRI MESH - Clean Commercial Startup Landing Page
 */

import { store } from '../state/store.js';
import { MathEngine } from '../data/mathEngine.js';

export function renderLandingPage(container) {
  const state = store.getState();

  container.innerHTML = `
    <!-- 1. HERO SECTION -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="badge badge-success" style="font-size:0.82rem; margin-bottom:1.25rem; background:rgba(16,185,129,0.15); color:var(--primary-700); border:1px solid var(--primary-300);">
              🌱 DIRECT FARMER-TO-BUYER COMMERCE
            </div>
            <h1 class="hero-title">
              Connecting Farmers <span class="text-gradient">Directly</span> to Better Markets
            </h1>
            <p class="hero-sub">
              AgriMesh connects farmers and buyers through intelligent matching, market insights and optimized logistics. Helping farmers earn higher net payouts while buyers source fresher produce directly at the farm gate.
            </p>
            <div class="hero-cta-group">
              <button id="btn-hero-farmer-start" class="btn btn-primary btn-lg">
                <span>🌾</span> Start Selling
              </button>
              <button id="btn-hero-buyer-browse" class="btn btn-secondary btn-lg" data-nav="browse-produce">
                <span>🛒</span> Explore Marketplace
              </button>
            </div>

            <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; font-size:0.88rem; color:var(--text-muted);">
              <div style="display:flex; align-items:center; gap:0.4rem;">
                <span style="color:var(--primary-500); font-weight:bold;">✓</span> Zero Middlemen Cut
              </div>
              <div style="display:flex; align-items:center; gap:0.4rem;">
                <span style="color:var(--primary-500); font-weight:bold;">✓</span> 100% Offline-First Mode
              </div>
              <div style="display:flex; align-items:center; gap:0.4rem;">
                <span style="color:var(--primary-500); font-weight:bold;">✓</span> 2G IVR & SMS Access
              </div>
            </div>
          </div>

          <!-- Hero Telemetry Flow Diagram -->
          <div>
            <div class="hero-telemetry-board">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                <div style="font-weight:700; font-size:0.92rem; display:flex; align-items:center; gap:0.5rem;">
                  <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block;" class="animate-pulse-glow"></span>
                  LIVE LOGISTICS & AI ENGINE
                </div>
                <span class="badge badge-success">Guntur Corridors Active</span>
              </div>

              <!-- Animated 5-node flow -->
              <div class="telemetry-flow">
                <!-- Farmer Node -->
                <div class="telemetry-node">
                  <div class="telemetry-node-icon">🌾</div>
                  <div style="font-weight:800; font-size:0.88rem;">Farmer</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Ramesh Kumar</div>
                  <span class="badge badge-success" style="font-size:0.65rem; margin-top:4px;">1,000 kg Tomato</span>
                </div>

                <!-- Signal 1 -->
                <div class="pulse-arrow">➔</div>

                <!-- AI Central Core -->
                <div class="telemetry-node active-hub">
                  <div class="telemetry-node-icon">⚡</div>
                  <div style="font-weight:800; font-size:0.95rem;">AgriMesh AI</div>
                  <div style="font-size:0.75rem; opacity:0.9;">Net Realization: ₹16.70/kg</div>
                  <span class="badge badge-gold" style="font-size:0.68rem; margin-top:4px;">98% Match Score</span>
                </div>

                <!-- Signal 2 -->
                <div class="pulse-arrow">➔</div>

                <!-- Institutional Buyer -->
                <div class="telemetry-node">
                  <div class="telemetry-node-icon">🏢</div>
                  <div style="font-weight:800; font-size:0.88rem;">Best Buyer</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">FreshMart Retail</div>
                  <span class="badge badge-info" style="font-size:0.65rem; margin-top:4px;">₹18.50/kg Gross</span>
                </div>
              </div>

              <!-- Cluster & Cold Chain Stream -->
              <div class="live-badge-stream">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span>🚚</span>
                  <span><strong>Shared Reefer Hub:</strong> Mangalagiri Cluster NH-16</span>
                </div>
                <div style="color:var(--primary-600); font-weight:700;">4.2°C Cold Chain</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS STRIP -->
    <section class="stats-strip">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">20–40%</div>
            <div class="stat-label">Higher Farmer Net Payout</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">10–30%</div>
            <div class="stat-label">Reduction in Farm-Gate Spoilage</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Up to 60%</div>
            <div class="stat-label">Logistics Cost Savings via Clustered Reefer</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Universal Access (Offline, IVR, Agent)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. HOW AGRIMESH WORKS -->
    <section class="section-py" id="how-it-works-sec" style="background:var(--bg-surface);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Step-By-Step</div>
          <h2 class="section-title">How AgriMesh Works</h2>
          <p class="section-desc">
            A transparent and frictionless direct supply chain from farm gate to institutional delivery.
          </p>
        </div>

        <div class="grid grid-3">
          <div class="card" style="border-top: 4px solid #0284c7;">
            <div style="font-weight:800; font-size:1.5rem; color:#0284c7; margin-bottom:0.5rem;">01</div>
            <h4>Universal Farmer Access</h4>
            <p>Farmers can participate through <strong>Offline-First Smartphone App</strong>, <strong>2G Toll-Free IVR/SMS</strong>, or <strong>Village Digital Agents</strong>.</p>
          </div>

          <div class="card" style="border-top: 4px solid var(--primary-500);">
            <div style="font-weight:800; font-size:1.5rem; color:var(--primary-600); margin-bottom:0.5rem;">02</div>
            <h4>Produce Registration</h4>
            <p>List vegetables and fruits with quantity, expected price, and harvest date using simple forms or vernacular voice commands.</p>
          </div>

          <div class="card" style="border-top: 4px solid var(--primary-500);">
            <div style="font-weight:800; font-size:1.5rem; color:var(--primary-600); margin-bottom:0.5rem;">03</div>
            <h4>AI Net-Realization Matching</h4>
            <p>The algorithm evaluates buyer bids, freight costs, and platform fees to rank matches by true take-home earnings ($P_{net}$).</p>
          </div>

          <div class="card" style="border-top: 4px solid var(--accent-gold);">
            <div style="font-weight:800; font-size:1.5rem; color:var(--accent-gold); margin-bottom:0.5rem;">04</div>
            <h4>Clustered Reefer Pickup</h4>
            <p>Consolidated refrigerated transport aggregates produce from neighboring farms, cutting transport expenses by up to 60%.</p>
          </div>

          <div class="card" style="border-top: 4px solid var(--accent-gold);">
            <div style="font-weight:800; font-size:1.5rem; color:var(--accent-gold); margin-bottom:0.5rem;">05</div>
            <h4>Live Telemetry Tracking</h4>
            <p>Monitor real-time GPS location and 4.2°C temperature sensor readings continuously until delivery at the buyer distribution center.</p>
          </div>

          <div class="card" style="border-top: 4px solid var(--accent-gold);">
            <div style="font-weight:800; font-size:1.5rem; color:var(--accent-gold); margin-bottom:0.5rem;">06</div>
            <h4>Instant Escrow Settlement</h4>
            <p>Upon digital dock verification at the buyer gate, escrow funds are automatically disbursed to the farmer's account.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FARMER & BUYER BENEFITS -->
    <section class="section-py" style="background:var(--bg-main);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Value Proposition</div>
          <h2 class="section-title">Built for Farmers & Institutional Buyers</h2>
          <p class="section-desc">
            Direct connections eliminate middleman margins, ensure fair compensation, and guarantee fresh produce.
          </p>
        </div>

        <div class="grid grid-2">
          <!-- Farmer Benefits -->
          <div class="card" style="border-top:4px solid var(--primary-600); padding:2rem;">
            <div class="feature-icon-wrapper" style="background:var(--primary-100); color:var(--primary-800);">🌾</div>
            <h3 style="font-size:1.4rem; margin-bottom:1rem;">Benefits for Farmers</h3>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem; color:var(--text-muted);">
              <li>✓ <strong>Higher Net Income:</strong> Retain 20–40% more value by bypassing multi-tiered traders and commission agents.</li>
              <li>✓ <strong>Guaranteed Digital Payments:</strong> T+1 automated escrow releases directly to your bank or UPI.</li>
              <li>✓ <strong>Shared Green Logistics:</strong> Access cold-chain reefer vehicles at a fraction of standalone freight costs.</li>
              <li>✓ <strong>Zero Technology Barriers:</strong> List produce via vernacular voice, offline mode, or village assistance.</li>
            </ul>
            <button class="btn btn-primary btn-sm" style="margin-top:1.5rem;" data-nav="farmer-dashboard">
              Open Farmer Portal ➔
            </button>
          </div>

          <!-- Buyer Benefits -->
          <div class="card" style="border-top:4px solid #0284c7; padding:2rem;">
            <div class="feature-icon-wrapper" style="background:var(--accent-blue-light); color:var(--accent-blue);">🏢</div>
            <h3 style="font-size:1.4rem; margin-bottom:1rem;">Benefits for Buyers</h3>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem; color:var(--text-muted);">
              <li>✓ <strong>Direct Farm-Gate Sourcing:</strong> Procure fresh Grade A vegetables and fruits directly from verified producers.</li>
              <li>✓ <strong>Multi-Item Cart Procurement:</strong> Bundle multiple crops across multiple farmers in a single consolidated delivery.</li>
              <li>✓ <strong>Cold-Chain Quality Assurance:</strong> 4.2°C temperature sensor tracking ensures zero shelf-life degradation.</li>
              <li>✓ <strong>Transparent Pricing:</strong> Transparent freight and platform fee structure with no hidden fees.</li>
            </ul>
            <button class="btn btn-secondary btn-sm" style="margin-top:1.5rem;" data-nav="browse-produce">
              Browse Produce Catalog ➔
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. INCLUSIVE ACCESS SECTION -->
    <section class="section-py" style="background:var(--bg-cream);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Universal Accessibility</div>
          <h2 class="section-title">AgriMesh for Every Farmer</h2>
          <p class="section-desc">
            Smart agriculture should not depend on owning a smartphone or having continuous internet.
          </p>
        </div>

        <div class="grid grid-3">
          <!-- Option A -->
          <div class="card" style="border-top:4px solid var(--primary-500); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="feature-icon-wrapper" style="background:var(--primary-100); color:var(--primary-800);">📱</div>
              <span class="badge badge-success" style="margin-bottom:0.5rem;">OPTION A</span>
              <h3 style="font-size:1.35rem; margin-bottom:0.5rem;">Smartphone Farmers</h3>
              <div style="font-weight:700; color:var(--primary-700); margin-bottom:0.75rem;">"Offline-First App"</div>
              <p style="font-size:0.9rem; line-height:1.6;">
                Works with zero mobile signal in deep rural fields. Transactions are cached on device and automatically synchronized when connectivity returns.
              </p>
            </div>
            <button class="btn btn-sm btn-outline" style="margin-top:1.5rem;" data-nav="farmer-dashboard">
              Test Offline Mode ➔
            </button>
          </div>

          <!-- Option B -->
          <div class="card" style="border-top:4px solid var(--accent-gold); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="feature-icon-wrapper" style="background:var(--accent-gold-light); color:var(--accent-amber);">📞</div>
              <span class="badge badge-gold" style="margin-bottom:0.5rem;">OPTION B</span>
              <h3 style="font-size:1.35rem; margin-bottom:0.5rem;">Basic 2G Feature Phones</h3>
              <div style="font-weight:700; color:var(--accent-amber); margin-bottom:0.75rem;">"Toll-Free IVR + SMS"</div>
              <p style="font-size:0.9rem; line-height:1.6;">
                Farmers dial <strong>1800-AGRI-MESH</strong> in Telugu, Hindi, or English. Simple number key presses list produce, followed by automated deal SMS updates.
              </p>
            </div>
            <button class="btn btn-sm btn-outline" style="margin-top:1.5rem;" data-nav="basic-phone-access">
              Open IVR Simulator ➔
            </button>
          </div>

          <!-- Option C -->
          <div class="card" style="border-top:4px solid var(--accent-blue); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="feature-icon-wrapper" style="background:var(--accent-blue-light); color:var(--accent-blue);">👨‍💼</div>
              <span class="badge badge-info" style="margin-bottom:0.5rem;">OPTION C</span>
              <h3 style="font-size:1.35rem; margin-bottom:0.5rem;">No Smartphone / Assisted</h3>
              <div style="font-weight:700; color:var(--accent-blue); margin-bottom:0.75rem;">"Village Assisted Marketplace"</div>
              <p style="font-size:0.9rem; line-height:1.6;">
                Local Village Level Entrepreneurs (VLEs) and Krishi Mitras register crop lots, manage crate pickups, and assist with biometric digital escrow payouts.
              </p>
            </div>
            <button class="btn btn-sm btn-outline" style="margin-top:1.5rem;" data-nav="village-agent-dashboard">
              Open Agent Portal ➔
            </button>
          </div>
        </div>

        <!-- Highlighted Banner -->
        <div style="margin-top:3rem; background:linear-gradient(135deg, var(--navy-900) 0%, #064e3b 100%); color:#ffffff; border-radius:var(--radius-xl); padding:2rem 2.5rem; text-align:center; box-shadow:var(--shadow-md);">
          <div style="font-size:1.35rem; font-weight:800; color:var(--primary-300); margin-bottom:0.5rem;">
            "Technology should adapt to farmers — farmers should not have to adapt to technology."
          </div>
          <p style="color:rgba(255,255,255,0.85); font-size:0.95rem; max-width:800px; margin:0 auto;">
            AgriMesh does not require every farmer to own a smartphone or remain continuously connected to the internet. Farmers can participate through smartphones, basic phones, SMS/IVR, offline-first access, or assisted village agents.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. AI NET-REALIZATION MATCHING & CALCULATOR -->
    <section class="section-py" id="math-model-sec" style="background:var(--bg-surface);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Intelligent Pricing</div>
          <h2 class="section-title">AI Net-Realization Matching Engine</h2>
          <p class="section-desc">
            Traditional bids hide transport and handling deductions. AgriMesh algorithmically ranks buyers on true net take-home earnings ($P_{net}$).
          </p>
        </div>

        <!-- Interactive Calculator -->
        <div class="card" style="background:var(--bg-main); padding:2rem;">
          <div style="font-weight:800; font-size:1.2rem; margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
            <span>🧮</span> Interactive Net Realization Calculator
          </div>
          
          <div class="grid grid-3" style="margin-bottom:1.5rem;">
            <div>
              <label class="form-label">Buyer Gross Bid (₹/kg): <span id="calc-gross-val" style="color:var(--primary-600); font-weight:800;">₹18.50</span></label>
              <input type="range" id="calc-gross-slider" min="10" max="30" step="0.5" value="18.5" style="width:100%;">
            </div>
            <div>
              <label class="form-label">Distance to Buyer (km): <span id="calc-dist-val" style="color:var(--primary-600); font-weight:800;">120 km</span></label>
              <input type="range" id="calc-dist-slider" min="10" max="400" step="10" value="120" style="width:100%;">
            </div>
            <div>
              <label class="form-label">Produce Quantity (kg): <span id="calc-qty-val" style="color:var(--primary-600); font-weight:800;">1000 kg</span></label>
              <input type="range" id="calc-qty-slider" min="200" max="5000" step="100" value="1000" style="width:100%;">
            </div>
          </div>

          <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="font-size:0.85rem; color:var(--text-muted);">Platform Fee (1.5%): <strong id="calc-fee-res">₹0.28/kg</strong></div>
              <div style="font-size:0.85rem; color:var(--text-muted);">Clustered Transport Cost: <strong id="calc-freight-res">₹1.20/kg</strong></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--primary-800);">CALCULATED NET REALIZATION:</div>
              <div id="calc-net-res" style="font-size:2rem; font-weight:900; color:var(--primary-700); font-family:var(--font-heading);">₹16.70/kg</div>
              <div style="font-size:0.75rem; color:var(--primary-600);">Total Payout: <strong id="calc-total-res">₹16,700</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. MULTI-FARMER CLUSTER LOGISTICS -->
    <section class="section-py" id="cluster-logistics-sec" style="background:var(--bg-main);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Logistics Innovation</div>
          <h2 class="section-title">Multi-Farmer Cluster Consolidation</h2>
          <p class="section-desc">
            Instead of individual farmers sending half-empty vans, our route optimizer aggregates produce from neighboring farms into a single refrigerated smart reefer truck.
          </p>
        </div>

        <div class="cluster-graphic">
          <div style="font-size:1.1rem; font-weight:700; color:var(--primary-300); text-align:center;">
            Guntur Cluster Corridor → Vijayawada Wholesale Terminal
          </div>

          <div class="cluster-nodes-row">
            <!-- 4 Farmers -->
            <div class="farmer-cluster-col">
              <div class="cluster-farmer-chip">
                <span>👨‍🌾</span> Farmer 1 (Ramesh) — 1,000 kg Tomato
              </div>
              <div class="cluster-farmer-chip">
                <span>👨‍🌾</span> Farmer 2 (Suresh) — 800 kg Onion
              </div>
              <div class="cluster-farmer-chip">
                <span>👨‍🌾</span> Farmer 3 (Venkat) — 1,200 kg Potato
              </div>
              <div class="cluster-farmer-chip">
                <span>👨‍🌾</span> Farmer 4 (Lakshmi) — 500 kg Brinjal
              </div>
            </div>

            <!-- Arrow Consolidation -->
            <div style="font-size:2.5rem; color:var(--primary-400);">➔</div>

            <!-- Shared Truck Hub -->
            <div class="shared-truck-hub">
              <div style="font-size:2.5rem; margin-bottom:0.25rem;">🚚 ❄️</div>
              <div style="font-weight:800; font-size:1.1rem;">Shared Reefer Fleet</div>
              <div style="font-size:0.85rem; opacity:0.95;">3,500 kg Capacity • 4.2°C Cold Active</div>
              <div class="badge badge-gold" style="margin-top:0.5rem; font-size:0.75rem;">60% Transport Cost Cut</div>
            </div>

            <!-- Arrow Delivery -->
            <div style="font-size:2.5rem; color:var(--primary-400);">➔</div>

            <!-- Buyer Hub -->
            <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
              <div style="font-size:2rem;">🏢</div>
              <div style="font-weight:800; font-size:1rem;">FreshMart Central Hub</div>
              <div style="font-size:0.8rem; color:rgba(255,255,255,0.8);">Single Consolidated Dock</div>
            </div>
          </div>

          <div class="grid grid-3" style="margin-top:2rem; text-align:center;">
            <div style="background:rgba(255,255,255,0.06); padding:1rem; border-radius:var(--radius-md);">
              <div style="font-size:1.3rem; font-weight:800; color:var(--primary-300);">94% Vehicle Fill Rate</div>
              <div style="font-size:0.8rem; opacity:0.8;">Zero deadhead miles</div>
            </div>
            <div style="background:rgba(255,255,255,0.06); padding:1rem; border-radius:var(--radius-md);">
              <div style="font-size:1.3rem; font-weight:800; color:var(--primary-300);">-48% Carbon Emissions</div>
              <div style="font-size:0.8rem; opacity:0.8;">Fewer trips, higher efficiency</div>
            </div>
            <div style="background:rgba(255,255,255,0.06); padding:1rem; border-radius:var(--radius-md);">
              <div style="font-size:1.3rem; font-weight:800; color:var(--primary-300);">4.2°C Continuous Sensor</div>
              <div style="font-size:0.8rem; opacity:0.8;">Zero cold-chain break</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. MARKET INTELLIGENCE PREVIEW -->
    <section class="section-py" id="market-intel-sec" style="background:var(--bg-surface);">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Market Pulse</div>
          <h2 class="section-title">Real-Time Mandi Intelligence & AI Forecasting</h2>
          <p class="section-desc">
            Directly syndicated with daily APMC market price feeds to eliminate asymmetric information.
          </p>
        </div>

        <div class="grid grid-3">
          ${state.marketIntelligence.crops.slice(0, 3).map(crop => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <div>
                  <h4 style="font-size:1.25rem;">${crop.name}</h4>
                  <div style="font-size:0.8rem; color:var(--text-muted);">Current Modal Price</div>
                </div>
                <span class="badge ${crop.weeklyTrendPercent >= 0 ? 'badge-success' : 'badge-danger'}">
                  ${crop.weeklyTrendPercent >= 0 ? '▲ +' : '▼ '}${crop.weeklyTrendPercent}%
                </span>
              </div>

              <div style="font-size:2rem; font-weight:900; font-family:var(--font-heading); color:var(--primary-700); margin-bottom:0.5rem;">
                ₹${crop.currentAvgPrice.toFixed(2)}<span style="font-size:1rem; font-weight:500; color:var(--text-muted);">/kg</span>
              </div>

              <div style="background:var(--bg-subtle); padding:0.6rem 0.8rem; border-radius:var(--radius-md); font-size:0.82rem; margin-bottom:1rem;">
                🤖 <strong>AI Forecast:</strong> ${crop.forecastTrend}
              </div>

              <button class="btn btn-sm btn-outline" style="width:100%;" data-nav="market-intelligence">
                View Full APMC Matrix
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 8. ABOUT AGRIMESH & LEADERSHIP -->
    <section class="section-py" id="about-sec" style="background:linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%); color:#ffffff;">
      <div class="container">
        <div class="section-header" style="text-align:center; margin-bottom:3rem;">
          <div class="badge badge-gold" style="font-size:0.8rem; margin-bottom:0.75rem;">LEADERSHIP & ARCHITECTURE</div>
          <h2 style="color:#ffffff; font-size:2.25rem;">The Team Behind AgriMesh</h2>
          <p style="color:rgba(255,255,255,0.75); max-width:650px; margin:0 auto;">
            Pioneering direct agricultural market access, proximity intelligence, and optimized cold-chain consolidation across India.
          </p>
        </div>

        <div class="grid grid-3" style="max-width:1200px; margin:0 auto; gap:1.75rem;">
          
          <!-- Leader 1: Petlu Vijay -->
          <div style="background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--radius-xl); padding:2.5rem 1.75rem; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.5); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="badge badge-gold" style="font-size:0.75rem; margin-bottom:1rem;">PROJECT FOUNDER</div>
              <div style="width:100px; height:100px; border-radius:50%; margin:0 auto 1.25rem; background:linear-gradient(135deg, var(--primary-500), var(--accent-gold)); padding:4px; box-shadow:0 0 25px rgba(16,185,129,0.5);">
                <div style="width:100%; height:100%; border-radius:50%; background:var(--navy-900); display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:900; color:white;">
                  PV
                </div>
              </div>
              <h3 style="font-size:1.5rem; color:#ffffff; margin-bottom:0.25rem;">Petlu Vijay</h3>
              <div style="color:var(--primary-300); font-weight:700; font-size:0.95rem; margin-bottom:1.25rem;">
                Founder & Lead Architect
              </div>
              <p style="font-size:0.9rem; color:rgba(255,255,255,0.85); line-height:1.6; margin-bottom:1.5rem;">
                "Connecting Indian Farmers to a Brighter Future through algorithmic empowerment, inclusive offline-first access, and transparent net-realization direct pricing."
              </p>
            </div>
            <div style="font-size:0.8rem; color:rgba(255,255,255,0.6); border-top:1px solid rgba(255,255,255,0.1); padding-top:0.75rem;">
              🌱 Concept & Core System Architecture
            </div>
          </div>

          <!-- Leader 2: Chinnakkagari Bhanodhaya Reddy -->
          <div style="background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--radius-xl); padding:2.5rem 1.75rem; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.5); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="badge badge-primary" style="font-size:0.75rem; margin-bottom:1rem; background:rgba(37,99,235,0.2); border-color:#3b82f6; color:#93c5fd;">LOGISTICS & LOCATION LEAD</div>
              <div style="width:100px; height:100px; border-radius:50%; margin:0 auto 1.25rem; background:linear-gradient(135deg, #3b82f6, var(--primary-500)); padding:4px; box-shadow:0 0 25px rgba(59,130,246,0.5);">
                <div style="width:100%; height:100%; border-radius:50%; background:var(--navy-900); display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:900; color:white;">
                  BR
                </div>
              </div>
              <h3 style="font-size:1.5rem; color:#ffffff; margin-bottom:0.25rem;">Chinnakkagari Bhanodhaya Reddy</h3>
              <div style="color:#93c5fd; font-weight:700; font-size:0.95rem; margin-bottom:1.25rem;">
                Logistics & Location Lead
              </div>
              <p style="font-size:0.9rem; color:rgba(255,255,255,0.85); line-height:1.6; margin-bottom:1.5rem;">
                "Building resilient geospatial proximity networks, multi-farmer clustered corridors, and real-time cold-chain reefer routing for farm-to-table freshness."
              </p>
            </div>
            <div style="font-size:0.8rem; color:rgba(255,255,255,0.6); border-top:1px solid rgba(255,255,255,0.1); padding-top:0.75rem;">
              🚚 Geospatial Proximity & Clustered Logistics
            </div>
          </div>

          <!-- Leader 3: Beera Sumanth -->
          <div style="background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--radius-xl); padding:2.5rem 1.75rem; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.5); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="badge badge-success" style="font-size:0.75rem; margin-bottom:1rem; background:rgba(16,185,129,0.2); border-color:#10b981; color:#6ee7b7;">AI & OPTIMIZATION LEAD</div>
              <div style="width:100px; height:100px; border-radius:50%; margin:0 auto 1.25rem; background:linear-gradient(135deg, #10b981, #06b6d4); padding:4px; box-shadow:0 0 25px rgba(16,185,129,0.5);">
                <div style="width:100%; height:100%; border-radius:50%; background:var(--navy-900); display:flex; align-items:center; justify-content:center; font-size:2.2rem; font-weight:900; color:white;">
                  BS
                </div>
              </div>
              <h3 style="font-size:1.5rem; color:#ffffff; margin-bottom:0.25rem;">Beera Sumanth</h3>
              <div style="color:#6ee7b7; font-weight:700; font-size:0.95rem; margin-bottom:1.25rem;">
                AI / ML & Optimization Engineer
              </div>
              <p style="font-size:0.9rem; color:rgba(255,255,255,0.85); line-height:1.6; margin-bottom:1.5rem;">
                "Designing high-dimensional Net-Realization mathematical matching, multi-constraint LP optimization, and real-time APMC Mandi predictive price engines."
              </p>
            </div>
            <div style="font-size:0.8rem; color:rgba(255,255,255,0.6); border-top:1px solid rgba(255,255,255,0.1); padding-top:0.75rem;">
              🤖 Net-Realization & Price Forecasting Models
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- 9. CALL TO ACTION -->
    <section class="section-py" style="background:var(--primary-900); color:#ffffff; text-align:center;">
      <div class="container">
        <h2 style="color:#ffffff; font-size:2.5rem; margin-bottom:1rem;">Ready to Transform Agricultural Trade?</h2>
        <p style="font-size:1.15rem; color:rgba(255,255,255,0.85); max-width:650px; margin:0 auto 2rem;">
          Join thousands of progressive farmers and institutional buyers today. Direct sales, automated cold-chain logistics, and guaranteed digital payments.
        </p>
        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" id="btn-cta-farmer">
            🌾 Register as Farmer
          </button>
          <button class="btn btn-secondary btn-lg" id="btn-cta-buyer" style="background:transparent; color:#ffffff; border-color:rgba(255,255,255,0.3);" data-nav="browse-produce">
            🛒 Explore Marketplace
          </button>
        </div>
      </div>
    </section>

    <!-- 10. CLEAN COMMERCIAL FOOTER -->
    <footer style="background:var(--navy-950); color:rgba(255,255,255,0.7); padding:4rem 0 2rem; border-top:1px solid rgba(255,255,255,0.1);">
      <div class="container">
        <div class="grid grid-4" style="margin-bottom:3rem;">
          <div>
            <div class="brand-logo" style="color:#ffffff; margin-bottom:1rem;">
              <div class="logo-icon-box" style="width:34px; height:34px;">🌱</div>
              <span>AGRI<span style="color:var(--primary-400);">MESH</span></span>
            </div>
            <p style="font-size:0.88rem; line-height:1.6; color:rgba(255,255,255,0.65);">
              Direct Farmers.<br>
              Better Prices.<br>
              Fresher Food.<br>
              A smarter tomorrow.
            </p>
          </div>

          <div>
            <div style="font-weight:700; color:#ffffff; margin-bottom:1rem;">Marketplace</div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem;">
              <li><a href="#" data-nav="browse-produce">All Vegetables & Fruits</a></li>
              <li><a href="#" data-nav="cart">Shopping Cart</a></li>
              <li><a href="#" data-nav="farmer-dashboard">Farmer Portal</a></li>
              <li><a href="#" data-nav="buyer-dashboard">Buyer Network</a></li>
            </ul>
          </div>

          <div>
            <div style="font-weight:700; color:#ffffff; margin-bottom:1rem;">Access & Logistics</div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem;">
              <li><a href="#" data-nav="basic-phone-access">2G IVR & SMS Center</a></li>
              <li><a href="#" data-nav="village-agent-dashboard">Village Agent Assisted</a></li>
              <li><a href="#" data-nav="order-tracking">Fleet & Cold-Chain Telemetry</a></li>
              <li><a href="#" data-nav="market-intelligence">Market Intelligence</a></li>
            </ul>
          </div>

          <div>
            <div style="font-weight:700; color:#ffffff; margin-bottom:1rem;">Company & Legal</div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem;">
              <li><a href="#" data-nav="landing" data-scroll="about-sec">About AgriMesh</a></li>
              <li><a href="#" data-nav="landing" data-scroll="about-sec">Founder & Team</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; font-size:0.8rem;">
          <div>© 2026 AgriMesh Technologies Inc. All rights reserved.</div>
          <div style="color:var(--primary-400); font-weight:600;">🌱 Direct Farmers. Better Prices. Fresher Food.</div>
        </div>
      </div>
    </footer>
  `;

  // Attach Landing Page Event Listeners
  const heroFarmerBtn = container.querySelector('#btn-hero-farmer-start');
  if (heroFarmerBtn) {
    heroFarmerBtn.addEventListener('click', () => {
      store.setRole('farmer');
      store.navigate('farmer-dashboard');
    });
  }

  const ctaFarmerBtn = container.querySelector('#btn-cta-farmer');
  if (ctaFarmerBtn) {
    ctaFarmerBtn.addEventListener('click', () => {
      store.setRole('farmer');
      store.navigate('farmer-dashboard');
    });
  }

  // Interactive Live Formula Calculator Slider Listeners
  const grossSlider = container.querySelector('#calc-gross-slider');
  const distSlider = container.querySelector('#calc-dist-slider');
  const qtySlider = container.querySelector('#calc-qty-slider');

  function updateCalc() {
    if (!grossSlider || !distSlider || !qtySlider) return;
    const gross = parseFloat(grossSlider.value);
    const dist = parseFloat(distSlider.value);
    const qty = parseFloat(qtySlider.value);

    container.querySelector('#calc-gross-val').textContent = `₹${gross.toFixed(2)}`;
    container.querySelector('#calc-dist-val').textContent = `${dist} km`;
    container.querySelector('#calc-qty-val').textContent = `${qty} kg`;

    const logistics = MathEngine.calculateLogisticsCost(dist, qty, true, true);
    const net = MathEngine.calculateNetRealization(gross, logistics.costPerKg, 0.015);
    const total = Math.round(net.netRealizationPerKg * qty);

    container.querySelector('#calc-fee-res').textContent = `₹${net.platformFeePerKg.toFixed(2)}/kg`;
    container.querySelector('#calc-freight-res').textContent = `₹${logistics.costPerKg.toFixed(2)}/kg`;
    container.querySelector('#calc-net-res').textContent = `₹${net.netRealizationPerKg.toFixed(2)}/kg`;
    container.querySelector('#calc-total-res').textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  if (grossSlider && distSlider && qtySlider) {
    grossSlider.addEventListener('input', updateCalc);
    distSlider.addEventListener('input', updateCalc);
    qtySlider.addEventListener('input', updateCalc);
  }

  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      const scrollId = el.getAttribute('data-scroll');
      if (scrollId) {
        const sec = document.getElementById(scrollId);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      } else {
        store.navigate(target);
      }
    });
  });
}
