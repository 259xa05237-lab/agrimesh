/**
 * AGRI MESH - Farmer Portal (Real Produce Photo Capture, Camera Integration & Listing Management)
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';
import { MathEngine } from '../data/mathEngine.js';

// Camera stream reference
let activeCameraStream = null;
let currentCapturedPhotoData = null;
let uploadedPhotosList = [];
let isLowQualityDetected = false;

export function renderFarmerPortal(container, subView = 'dashboard') {
  const state = store.getState();
  const farmer = state.currentUser;
  const farmerListings = state.listings.filter(l => l.farmerId === farmer.id);
  const activeOrders = state.orders.filter(o => o.farmerId === farmer.id || o.farmerName.includes(farmer.fullName));

  container.innerHTML = `
    <div class="container section-py" style="padding-top:1.5rem;">
      <div class="dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar-panel">
          <div class="farmer-profile-card">
            <div style="position:relative; width:64px; height:64px; margin-bottom:0.75rem;">
              <img src="${farmer.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=200'}" 
                   alt="${farmer.fullName}" 
                   style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--primary-500);">
              <span style="position:absolute; bottom:0; right:0; background:#10b981; width:14px; height:14px; border-radius:50%; border:2px solid white;"></span>
            </div>
            <h3 style="font-size:1.15rem; margin-bottom:0.2rem;">${farmer.fullName}</h3>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.5rem;">
              📍 ${farmer.location}
            </div>
            <div style="display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap;">
              <span class="badge badge-success" style="font-size:0.7rem;">✓ Verified Producer</span>
              <span class="badge badge-primary" style="font-size:0.7rem;">⭐ 98.4% Quality</span>
            </div>
          </div>

          <ul class="sidebar-menu">
            <li class="sidebar-item ${subView === 'dashboard' ? 'active' : ''}" data-subview="dashboard">
              <span>🌾</span> Farmer Overview
            </li>
            <li class="sidebar-item ${subView === 'add-produce' ? 'active' : ''}" data-subview="add-produce">
              <span>📸</span> Add Produce & Real Photo
            </li>
            <li class="sidebar-item ${subView === 'listings' ? 'active' : ''}" data-subview="listings">
              <span>📦</span> My Produce Listings (${farmerListings.length})
            </li>
            <li class="sidebar-item ${subView === 'orders' ? 'active' : ''}" data-subview="orders">
              <span>📋</span> Incoming Orders (${activeOrders.length})
            </li>
            <li class="sidebar-item ${subView === 'matching' ? 'active' : ''}" data-subview="matching">
              <span>⚡</span> AI Net-Realization Match
            </li>
            <li class="sidebar-item" data-nav="order-tracking">
              <span>🚚</span> Reefer Logistics Fleet
            </li>
            <li class="sidebar-item" data-nav="market-intelligence">
              <span>📈</span> APMC Mandi Prices
            </li>
            <li class="sidebar-item" data-nav="farmer-analytics">
              <span>📊</span> Realization Analytics
            </li>
          </ul>

          <!-- Low-Connectivity Market Data Box -->
          <div style="margin-top:2rem; padding:1rem; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.8rem; border:1px solid var(--border-light);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
              <span style="font-weight:700; color:var(--primary-700);">Cached Mandi Rates:</span>
              <span class="badge badge-success" style="font-size:0.65rem;">Offline Ready</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">
              Last synced: ${state.lastSyncedMarketTime}
            </div>
            <div>Tomato: <strong>₹18.50/kg</strong></div>
            <div>Onion: <strong>₹14.20/kg</strong></div>
            <div>Potato: <strong>₹12.00/kg</strong></div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="dashboard-main">
          ${renderSubView(subView, state, farmer, farmerListings, activeOrders)}
        </main>
      </div>
    </div>

    <!-- Real Photo Camera Capture Modal -->
    <div id="camera-capture-modal" class="modal-backdrop" style="display:none;">
      <div class="modal-card" style="max-width:540px; width:95%; padding:1.75rem; text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="text-align:left;">
            <span class="badge badge-success">📷 REAL PRODUCE CAMERA</span>
            <h3 style="margin-top:0.25rem; font-size:1.3rem;">Capture Produce Photo</h3>
          </div>
          <button type="button" class="btn btn-sm btn-ghost" id="btn-close-camera-modal" style="font-size:1.25rem;">✕</button>
        </div>

        <!-- Camera Viewfinder Box -->
        <div class="camera-viewfinder-container" style="position:relative; width:100%; height:320px; background:#000000; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:1rem; display:flex; align-items:center; justify-content:center;">
          <video id="camera-stream-video" autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video>
          <img id="camera-captured-preview" style="display:none; width:100%; height:100%; object-fit:cover;" alt="Captured produce preview" />
          <canvas id="camera-capture-canvas" style="display:none;"></canvas>

          <!-- Viewfinder Rule of Thirds Grid Overlay -->
          <div id="camera-grid-overlay" class="camera-grid-overlay">
            <div class="grid-line horizontal" style="top:33.3%;"></div>
            <div class="grid-line horizontal" style="top:66.6%;"></div>
            <div class="grid-line vertical" style="left:33.3%;"></div>
            <div class="grid-line vertical" style="left:66.6%;"></div>
          </div>

          <!-- Live camera badge -->
          <div style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.6); color:#10b981; font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-full); backdrop-filter:blur(4px); display:flex; align-items:center; gap:0.35rem;">
            <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block; animation:pulsePin 1.5s infinite;"></span>
            LIVE CAMERA (REAR)
          </div>
        </div>

        <!-- Controls: Capture / Retake / Use Photo -->
        <div id="camera-live-controls" style="display:flex; justify-content:center; gap:1rem;">
          <button type="button" class="btn btn-primary btn-lg" id="btn-snap-photo" style="border-radius:var(--radius-full); padding:0.75rem 2rem; font-weight:800;">
            📸 Capture Photo
          </button>
        </div>

        <div id="camera-preview-controls" style="display:none; justify-content:center; gap:1rem;">
          <button type="button" class="btn btn-secondary" id="btn-retake-photo">
            🔄 Retake Photo
          </button>
          <button type="button" class="btn btn-primary" id="btn-confirm-use-photo">
            ✓ Use This Photo
          </button>
        </div>

        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.75rem;">
          Natural daylight gives the best freshness and quality verification score.
        </div>
      </div>
    </div>
  `;

  attachFarmerListeners(container);
}

function renderSubView(subView, state, farmer, farmerListings, activeOrders) {
  if (subView === 'add-produce') {
    return renderAddProduceForm(state);
  } else if (subView === 'matching') {
    return renderAIMatchingView(state);
  } else if (subView === 'listings') {
    return renderListingsView(farmerListings);
  } else if (subView === 'orders') {
    return renderFarmerIncomingOrdersView(activeOrders);
  } else {
    return renderFarmerDashboardHome(farmer, farmerListings, activeOrders, state);
  }
}

function renderFarmerDashboardHome(farmer, farmerListings, activeOrders, state) {
  const pendingOrders = activeOrders.filter(o => o.status === 'Pending Confirmation');

  return `
    <!-- Top Greeting Banner -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%); color:#ffffff; padding:2rem; border-radius:var(--radius-xl); margin-bottom:2rem;">
      <div>
        <div style="font-size:0.85rem; color:var(--primary-300); font-weight:700;">
          FARMER PORTAL • ${state.isOnline ? '🟢 ONLINE MODE' : '🔴 OFFLINE-FIRST MODE'}
        </div>
        <h2 style="color:#ffffff; margin:0.25rem 0;">Good Morning, ${farmer.fullName}</h2>
        <p style="color:rgba(255,255,255,0.85); font-size:0.95rem;">
          Your produce listings are live with real photos for institutional buyers.
        </p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button class="btn btn-primary" id="btn-top-add-produce" style="background:#ffffff; color:var(--primary-800);">
          📸 + Add Produce & Real Photo
        </button>
      </div>
    </div>

    <!-- Active Produce Listings Snapshot -->
    <div class="card" style="margin-bottom:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h3 style="font-size:1.35rem; margin-bottom:0.15rem;">My Active Produce in Marketplace</h3>
          <span style="font-size:0.85rem; color:var(--text-muted);">Real photos displayed directly to retail and wholesale buyers</span>
        </div>
        <button class="btn btn-sm btn-ghost" id="btn-view-all-listings">View All (${farmerListings.length}) ➔</button>
      </div>

      <div class="grid grid-3">
        ${farmerListings.slice(0, 3).map(listing => `
          <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border-light);">
            <div style="position:relative; height:150px;">
              <img src="${listing.image}" alt="${listing.crop}" style="width:100%; height:100%; object-fit:cover;" onerror="window.handleAgriImageError(this, '${listing.backupImage || ''}', '${listing.crop}')" />
              <span class="badge ${listing.isOfflinePending ? 'badge-danger' : 'badge-success'}" style="position:absolute; top:8px; left:8px; font-size:0.7rem;">
                ${listing.status || 'Active'}
              </span>
            </div>
            <div style="padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.25rem;">
                <h4 style="font-size:1.1rem; margin:0;">${listing.crop}</h4>
                <div style="font-size:1.15rem; font-weight:900; color:var(--primary-600);">
                  ₹${listing.pricePerKg}/kg
                </div>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">
                Avail: <strong>${listing.quantityKg} kg</strong> • ${listing.grade}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAddProduceForm(state) {
  const isOnline = state.isOnline;
  const userLoc = state.userLocation || { name: 'Guntur, Andhra Pradesh', city: 'Guntur' };

  return `
    <!-- If newly published, show Social-Style Success Post -->
    ${state.newlyPublishedListing ? renderSocialPublishedPost(state.newlyPublishedListing) : ''}

    <div class="form-card" style="margin-top:${state.newlyPublishedListing ? '2rem' : '0'};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <h2 style="font-size:1.75rem; margin-bottom:0.25rem;">Add Produce Listing</h2>
            <span class="badge ${isOnline ? 'badge-success' : 'badge-danger'}">
              ${isOnline ? '🟢 Online' : '🔴 Offline Storage'}
            </span>
          </div>
          <p style="font-size:0.9rem; color:var(--text-muted);">
            Capture real photos of your harvest. Buyers order directly based on actual produce quality.
          </p>
        </div>
      </div>

      <form id="form-add-produce">
        
        <!-- ========================================== -->
        <!-- PROMINENT SECTION: ADD REAL PRODUCE PHOTO  -->
        <!-- ========================================== -->
        <div class="card" style="background:linear-gradient(135deg, var(--bg-surface) 0%, rgba(16,185,129,0.04) 100%); border:2px dashed var(--primary-400); padding:1.75rem; margin-bottom:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <span class="badge badge-primary" style="font-size:0.75rem; margin-bottom:0.25rem;">PRODUCE PHOTOGRAPHY</span>
              <h3 style="font-size:1.35rem; margin:0;">Add Real Produce Photo</h3>
              <p style="font-size:0.85rem; color:var(--text-muted);">
                Take or upload up to 5 real photos of your produce. The 1st photo will be your main marketplace image.
              </p>
            </div>

            <!-- 2 Primary Photo Options -->
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
              <button type="button" class="btn btn-primary btn-sm" id="btn-open-camera-modal" style="display:flex; align-items:center; gap:0.4rem;">
                📷 Take Photo
              </button>
              
              <label class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:0.4rem; cursor:pointer; margin:0;">
                🖼️ Upload Photo
                <input type="file" id="inp-upload-produce-photo" accept="image/*" multiple style="display:none;" />
              </label>
            </div>
          </div>

          <!-- Photo Quality Guidance Box -->
          <div style="background:var(--bg-subtle); border-left:4px solid var(--primary-500); padding:0.85rem 1rem; border-radius:var(--radius-md); margin-bottom:1.25rem; font-size:0.825rem;">
            <div style="font-weight:700; color:var(--text-main); margin-bottom:0.25rem; display:flex; align-items:center; gap:0.35rem;">
              💡 For a better produce photo:
            </div>
            <ul style="margin:0; padding-left:1.2rem; color:var(--text-muted); display:grid; grid-template-columns:repeat(2, 1fr); gap:0.25rem;">
              <li>• Use good natural lighting</li>
              <li>• Keep the produce clearly visible</li>
              <li>• Avoid extremely blurry photos</li>
              <li>• Keep camera focused on the produce</li>
            </ul>
          </div>

          <!-- Photo Quality Warning Banner (if detected) -->
          <div id="photo-quality-warning" style="display:${isLowQualityDetected ? 'flex' : 'none'}; justify-content:space-between; align-items:center; background:#fef3c7; border:1px solid #fcd34d; color:#92400e; padding:0.75rem 1rem; border-radius:var(--radius-md); margin-bottom:1.25rem; font-size:0.85rem;">
            <div>
              ⚠️ <strong>Photo quality is low.</strong> Retake for a clearer listing?
            </div>
            <button type="button" class="btn btn-sm btn-ghost" id="btn-dismiss-quality-warning" style="color:#92400e; font-size:0.75rem;">
              Continue Anyway
            </button>
          </div>

          <!-- Multi-Photo Preview Grid (Up to 5 slots) -->
          <div id="produce-photos-container" class="produce-photos-grid">
            ${renderPhotoSlotsHTML()}
          </div>
        </div>

        <!-- Produce Core Details Form -->
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label" for="inp-crop">Crop Type *</label>
            <select class="form-select" id="inp-crop" required>
              <optgroup label="Vegetables (27 Varieties)">
                <option value="Tomato" selected>Tomato (టమాటా / टमाटर)</option>
                <option value="Onion">Onion (ఉల్లిపాయ / प्याज)</option>
                <option value="Potato">Potato (బంగాళాదుంప / आलू)</option>
                <option value="Carrot">Carrot (క్యారెట్ / गाजर)</option>
                <option value="Brinjal / Eggplant">Brinjal / Eggplant (వంకాయ / बैंगन)</option>
                <option value="Green Chilli">Green Chilli (పచ్చి మిరపకాయలు / हरी मिर्च)</option>
                <option value="Capsicum">Capsicum / Bell Pepper (బెంగళూరు మిర్చి / शिमला मिर्च)</option>
                <option value="Lady Finger / Okra">Lady Finger / Okra (బెండకాయ / भिंडी)</option>
                <option value="Cabbage">Cabbage (క్యాబేజీ / पत्ता गोभी)</option>
                <option value="Cauliflower">Cauliflower (కాలీఫ్లవర్ / फूलगोभी)</option>
                <option value="Spinach">Spinach (పాలకూర / पालक)</option>
                <option value="Cucumber">Cucumber (దోసకాయ / खीरा)</option>
                <option value="Bottle Gourd">Bottle Gourd (సొరకాయ / लौकी)</option>
                <option value="Bitter Gourd">Bitter Gourd (కాకరకాయ / करेला)</option>
                <option value="Ridge Gourd">Ridge Gourd (బీరకాయ / तोरी)</option>
                <option value="Drumstick">Drumstick (మునగకాయ / सहजन)</option>
                <option value="Sweet Corn">Sweet Corn (స్వీట్ కార్న్ / मक्का)</option>
                <option value="Radish">Radish (ముల్లంగి / मूली)</option>
                <option value="Beetroot">Beetroot (బీట్‌రూట్ / चुकंदर)</option>
                <option value="French Beans">French Beans (బీన్స్ / फलियां)</option>
                <option value="Green Peas">Green Peas (బఠానీలు / हरी मटर)</option>
                <option value="Garlic">Garlic (వెల్లుల్లి / लहसुन)</option>
                <option value="Ginger">Ginger (అల్లం / अदरक)</option>
                <option value="Pumpkin">Pumpkin (గుమ్మడికాయ / कद्दू)</option>
                <option value="Coriander Leaves">Coriander Leaves (కొత్తిమీర / धनिया पत्ती)</option>
                <option value="Mint Leaves">Mint Leaves (పుదీనా / पुदीना)</option>
                <option value="Curry Leaves">Curry Leaves (కరివేపాకు / कड़ी पत्ता)</option>
              </optgroup>
              <optgroup label="Fruits (25 Varieties)">
                <option value="Mango">Mango (మామిడి / आम)</option>
                <option value="Banana">Banana (అరటి / केला)</option>
                <option value="Apple">Apple (యాపిల్ / सेब)</option>
                <option value="Orange">Orange (నారింజ / संतरा)</option>
                <option value="Papaya">Papaya (బొప్పాయి / पपीता)</option>
                <option value="Pomegranate">Pomegranate (దానిమ్మ / अनार)</option>
                <option value="Watermelon">Watermelon (పుచ్చకాయ / तरबूज)</option>
                <option value="Muskmelon">Muskmelon (ఖర్బూజ / खरबूजा)</option>
                <option value="Guava">Guava (జామకాయ / अमरूद)</option>
                <option value="Grapes">Grapes (ద్రాక్ష / अंगूर)</option>
                <option value="Black Grapes">Black Grapes (నల్ల ద్రాక్ష / काले अंगूर)</option>
                <option value="Green Grapes">Green Grapes (పచ్చ ద్రాక్ష / हरे अंगूर)</option>
                <option value="Pineapple">Pineapple (అనాస / अनानास)</option>
                <option value="Sapota / Chikoo">Sapota / Chikoo (సపోటా / चीकू)</option>
                <option value="Sweet Lime">Sweet Lime / Mosambi (బత్తాయి / मौसंबी)</option>
                <option value="Lemon">Lemon (నిమ్మకాయ / नींबू)</option>
                <option value="Coconut">Fresh Coconut (కొబ్బరికాయ / ताजा नारियल)</option>
                <option value="Jackfruit">Jackfruit (పనసపండు / कटहल)</option>
                <option value="Custard Apple">Custard Apple / Seethaphal (సీతాఫలం / शरीफा)</option>
                <option value="Strawberry">Strawberry (స్ట్రాబెర్రీ / स्ट्रॉबेरी)</option>
                <option value="Dragon Fruit">Dragon Fruit (డ్రాగన్ ఫ్రూట్ / ड्रैगन फ्रूट)</option>
                <option value="Kiwi">Kiwi (కివి / कीवी)</option>
                <option value="Blueberry">Blueberry (బ్లూబెర్రీ / ब्लूबेरी)</option>
                <option value="Peach / Aadu">Peach (పీచ్ / आड़ू)</option>
                <option value="Fig / Anjeer">Fresh Fig (అంజీర / ताज़ा अंजीर)</option>
                <option value="Dates / Khajoor">Fresh Dates (ఖర్జూరం / खजूर)</option>
                <option value="Lychee">Lychee (లీచీ / लीची)</option>
                <option value="Plum / Aloo Bukhara">Plum (ఆలూ బుఖారా / आलूबुखारा)</option>
              </optgroup>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-variety">Variety / Hybrid</label>
            <input type="text" class="form-input" id="inp-variety" value="Desi Grade A Harvest" placeholder="e.g. Desi, S17, Hybrid">
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-quantity">Total Quantity (kg) *</label>
            <input type="number" class="form-input" id="inp-quantity" value="100" min="10" max="50000" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-price">Farmer Reserve Price (₹/kg) *</label>
            <input type="number" step="0.5" class="form-input" id="inp-price" value="30.00" min="1" max="1000" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-location">Farm Gate Area (Approximate) *</label>
            <input type="text" class="form-input" id="inp-location" value="${userLoc.name}" required>
            <small style="color:var(--text-muted); font-size:0.75rem;">Only approximate district/city shown to buyers for privacy.</small>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-grade">Quality Grade</label>
            <select class="form-select" id="inp-grade">
              <option value="Grade A" selected>Grade A (Premium Fresh)</option>
              <option value="Grade B+">Grade B+ (Standard Mandi Grade)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-shelflife">Estimated Shelf Life (Days)</label>
            <input type="number" class="form-input" id="inp-shelflife" value="6" min="1" max="180">
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-harvest">Harvest Date & Time</label>
            <input type="text" class="form-input" id="inp-harvest" value="Today Morning, Fresh Cut">
          </div>
        </div>

        <div style="margin-top:2rem; display:flex; justify-content:flex-end; gap:1rem;">
          <button type="button" class="btn btn-secondary" id="btn-cancel-add-produce">Cancel</button>
          <button type="submit" class="btn btn-primary btn-lg" id="btn-submit-add-produce" style="padding:0.75rem 2rem; font-weight:800;">
            ${isOnline ? '⚡ Publish Listing to Marketplace' : '💾 Save Produce Locally (Waiting to Sync)'}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderPhotoSlotsHTML() {
  const slots = [
    { title: "Main Photo", desc: "Front overview" },
    { title: "Close-Up", desc: "Skin & texture" },
    { title: "Quality Grade", desc: "Size & sorting" },
    { title: "Packaging", desc: "Crate/Bag" },
    { title: "Farm Batch", desc: "Harvest lot" }
  ];

  return `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:0.75rem;">
      ${slots.map((slot, i) => {
        const photoUrl = uploadedPhotosList[i];
        return photoUrl ? `
          <div class="photo-slot filled" style="position:relative; height:120px; border-radius:var(--radius-md); overflow:hidden; border:2px solid var(--primary-500);">
            <img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover;" alt="${slot.title}" />
            ${i === 0 ? '<span class="badge badge-success" style="position:absolute; top:4px; left:4px; font-size:0.65rem;">★ MAIN</span>' : ''}
            <button type="button" class="btn-remove-photo" data-index="${i}" style="position:absolute; top:4px; right:4px; background:rgba(0,0,0,0.7); color:white; border:none; width:22px; height:22px; border-radius:50%; cursor:pointer; font-size:0.75rem; display:flex; align-items:center; justify-content:center;">✕</button>
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.65); color:white; font-size:0.65rem; padding:2px 4px; text-align:center;">
              ${slot.title}
            </div>
          </div>
        ` : `
          <div class="photo-slot empty btn-trigger-add-photo" style="height:120px; border-radius:var(--radius-md); border:2px dashed var(--border-light); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:var(--bg-subtle); color:var(--text-muted); transition:border-color 0.2s;">
            <span style="font-size:1.5rem; margin-bottom:0.25rem;">📷</span>
            <span style="font-size:0.75rem; font-weight:700;">+ ${slot.title}</span>
            <span style="font-size:0.65rem;">(${i+1}/5)</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSocialPublishedPost(listing) {
  return `
    <div class="card" style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, var(--bg-surface) 100%); border:2px solid var(--primary-500); padding:1.75rem; margin-bottom:2rem; animation:modalPop 0.3s ease;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.5rem;">🎉</span>
          <div>
            <h3 style="margin:0; font-size:1.4rem; color:var(--primary-800);">Your produce is now live!</h3>
            <span style="font-size:0.85rem; color:var(--text-muted);">Published to AgriMesh direct marketplace • Available for buyer orders</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-view-published-in-marketplace">
          🛒 View Listing in Marketplace
        </button>
      </div>

      <!-- Social Listing Card -->
      <div style="max-width:480px; margin:0 auto; background:var(--bg-card); border-radius:var(--radius-xl); border:1px solid var(--border-light); overflow:hidden; box-shadow:var(--shadow-md);">
        <div style="position:relative; height:240px;">
          <img src="${listing.image}" alt="${listing.crop}" style="width:100%; height:100%; object-fit:cover;" />
          <span class="badge badge-success" style="position:absolute; top:12px; left:12px; font-size:0.75rem;">
            ✓ REAL FARMER PHOTO
          </span>
          <span class="badge badge-primary" style="position:absolute; top:12px; right:12px; font-size:0.75rem;">
            ${listing.grade}
          </span>
        </div>

        <div style="padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.35rem;">
            <h3 style="font-size:1.35rem; margin:0;">${listing.crop}</h3>
            <div style="font-size:1.4rem; font-weight:900; color:var(--primary-600);">
              ₹${listing.pricePerKg}/kg
            </div>
          </div>

          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">
            👨‍🌾 <strong>${listing.farmerName}</strong> • 📍 ${listing.distanceKm} km away (${listing.location})
          </div>

          <div style="display:flex; justify-content:space-between; background:var(--bg-subtle); padding:0.6rem 0.85rem; border-radius:var(--radius-md); font-size:0.8rem;">
            <span>📦 Available: <strong>${listing.quantityKg} kg</strong></span>
            <span>🌱 Freshness: <strong>${listing.freshnessPercent}%</strong></span>
            <span>⏱️ <strong>Just Now</strong></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFarmerIncomingOrdersView(orders) {
  return `
    <div class="card">
      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1.75rem; margin-bottom:0.25rem;">Incoming Buyer Orders & Escrow Contracts</h2>
        <p style="font-size:0.9rem; color:var(--text-muted);">
          Accept orders placed by institutional buyers to lock guaranteed digital escrow settlement.
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${orders.map(o => `
          <div style="border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.5rem; background:var(--bg-surface);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <div style="font-weight:900; font-size:1.15rem; color:var(--primary-800);">Order #${o.id}</div>
                <div style="font-size:0.82rem; color:var(--text-muted);">Buyer: ${o.buyerName} (${o.buyerLocation})</div>
              </div>
              <span class="badge ${o.status === 'Confirmed' ? 'badge-success' : o.status === 'In Transit' ? 'badge-info' : 'badge-gold'}">
                ${o.status}
              </span>
            </div>

            <div style="margin-bottom:1rem; font-size:0.9rem;">
              <div><strong>Produce Requested:</strong> ${o.crop}</div>
              <div style="color:var(--text-muted); margin-top:2px;">
                Guaranteed Net Take-Home Payout: <strong style="color:var(--primary-700); font-size:1.1rem;">₹${(o.totalNetFarmerPayout || o.subtotalAmount || 192).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
              ${o.status === 'Pending Confirmation' ? `
                <button class="btn btn-sm btn-primary btn-farmer-accept" data-order-id="${o.id}">
                  ✓ Accept Order
                </button>
                <button class="btn btn-sm btn-secondary btn-farmer-reject" data-order-id="${o.id}">
                  ✕ Reject
                </button>
              ` : `
                <button class="btn btn-outline btn-sm" data-nav="order-tracking">
                  🚚 Track Reefer Fleet
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAIMatchingView(state) {
  const defaultListing = state.listings[0];
  const ranked = MathEngine.rankBuyersForProduce(defaultListing, state.registeredBuyers);

  return `
    <div>
      <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:1.75rem; margin-bottom:2rem;">
        <span class="badge badge-success">AI MATCHING RESULTS</span>
        <h2 style="font-size:1.85rem; margin-top:0.25rem;">Optimized Buyer Matches for ${defaultListing.crop}</h2>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${ranked.map((buyer, idx) => `
          <div class="ai-match-card ${buyer.isBestMatch ? 'best-match' : ''}">
            <div>
              <div style="font-weight:800; font-size:1.2rem; color:var(--primary-800);">
                #${idx + 1} ${buyer.companyName}
              </div>
              <div style="font-size:0.88rem; color:var(--text-muted);">
                🏢 ${buyer.type} • 📍 ${buyer.location} (${buyer.distanceKm} km)
              </div>
            </div>

            <div style="background:var(--bg-surface); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
              <div style="font-size:0.85rem;">Gross Price: <strong>₹${buyer.grossPricePerKg.toFixed(2)}/kg</strong></div>
              <div style="font-size:0.95rem; font-weight:800; color:var(--primary-700);">Net Realization: ₹${buyer.netRealizationPerKg.toFixed(2)}/kg</div>
            </div>

            <button class="btn btn-primary" data-nav="browse-produce">
              View in Marketplace ➔
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderListingsView(listings) {
  return `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2>My Produce Listings</h2>
          <p style="font-size:0.85rem; color:var(--text-muted);">Active farmer catalog items showing actual produce photography</p>
        </div>
        <button class="btn btn-primary" id="btn-listings-add-new">+ Add New Produce</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${listings.map(l => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem; border:1px solid var(--border-light); border-radius:var(--radius-lg); background:var(--bg-surface); flex-wrap:wrap; gap:1rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
              <img src="${l.image}" alt="${l.crop}" style="width:65px; height:65px; border-radius:var(--radius-md); object-fit:cover;" onerror="window.handleAgriImageError(this, '${l.backupImage || ''}', '${l.crop}')">
              <div>
                <div style="font-weight:800; font-size:1.1rem;">${l.crop} (${l.variety})</div>
                <div style="font-size:0.88rem; color:var(--text-muted);">
                  Quantity: <strong>${l.quantityKg} kg</strong> • Reserve Price: <strong>₹${l.pricePerKg || l.expectedPricePerKg}/kg</strong>
                </div>
              </div>
            </div>
            <span class="badge ${l.isOfflinePending ? 'badge-danger' : 'badge-success'}">
              ${l.status || 'Active in Catalog'}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function attachFarmerListeners(container) {
  // Sidebar subviews
  container.querySelectorAll('.sidebar-item[data-subview]').forEach(item => {
    item.addEventListener('click', (e) => {
      const subView = e.currentTarget.getAttribute('data-subview');
      renderFarmerPortal(container, subView);
    });
  });

  // Top buttons
  const btnTopAdd = container.querySelector('#btn-top-add-produce');
  if (btnTopAdd) {
    btnTopAdd.addEventListener('click', () => {
      renderFarmerPortal(container, 'add-produce');
    });
  }

  const btnViewListings = container.querySelector('#btn-view-all-listings');
  if (btnViewListings) {
    btnViewListings.addEventListener('click', () => {
      renderFarmerPortal(container, 'listings');
    });
  }

  const btnListingsAddNew = container.querySelector('#btn-listings-add-new');
  if (btnListingsAddNew) {
    btnListingsAddNew.addEventListener('click', () => {
      renderFarmerPortal(container, 'add-produce');
    });
  }

  const btnViewMarketplace = container.querySelector('#btn-view-published-in-marketplace');
  if (btnViewMarketplace) {
    btnViewMarketplace.addEventListener('click', () => {
      store.navigate('browse-produce');
    });
  }

  // Camera Open Trigger
  const btnOpenCamera = container.querySelector('#btn-open-camera-modal');
  const triggerAddPhotos = container.querySelectorAll('.btn-trigger-add-photo');
  const cameraModal = container.querySelector('#camera-capture-modal');
  const videoElement = container.querySelector('#camera-stream-video');
  const canvasElement = container.querySelector('#camera-capture-canvas');
  const previewImg = container.querySelector('#camera-captured-preview');
  const liveControls = container.querySelector('#camera-live-controls');
  const previewControls = container.querySelector('#camera-preview-controls');
  const gridOverlay = container.querySelector('#camera-grid-overlay');

  const openCameraHandler = async () => {
    if (cameraModal) {
      cameraModal.style.display = 'flex';
      liveControls.style.display = 'flex';
      previewControls.style.display = 'none';
      if (previewImg) previewImg.style.display = 'none';
      if (videoElement) videoElement.style.display = 'block';
      if (gridOverlay) gridOverlay.style.display = 'block';

      try {
        // Modern MediaDevices API with rear-facing preference
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        activeCameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoElement) {
          videoElement.srcObject = activeCameraStream;
          videoElement.play();
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
        store.showToast('Camera Unavailable', 'Camera access was not granted. Falling back to Upload Photo.', 'info');
        closeCameraStream();
        if (cameraModal) cameraModal.style.display = 'none';
        const fileInput = container.querySelector('#inp-upload-produce-photo');
        if (fileInput) fileInput.click();
      }
    }
  };

  if (btnOpenCamera) btnOpenCamera.addEventListener('click', openCameraHandler);
  triggerAddPhotos.forEach(btn => btn.addEventListener('click', openCameraHandler));

  // Close Camera Modal
  const closeCameraStream = () => {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
  };

  const btnCloseCamera = container.querySelector('#btn-close-camera-modal');
  if (btnCloseCamera && cameraModal) {
    btnCloseCamera.addEventListener('click', () => {
      closeCameraStream();
      cameraModal.style.display = 'none';
    });
  }

  // Snap / Capture Photo
  const btnSnap = container.querySelector('#btn-snap-photo');
  if (btnSnap && videoElement && canvasElement && previewImg) {
    btnSnap.addEventListener('click', () => {
      canvasElement.width = videoElement.videoWidth || 640;
      canvasElement.height = videoElement.videoHeight || 480;
      const ctx = canvasElement.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

      currentCapturedPhotoData = canvasElement.toDataURL('image/jpeg', 0.85);
      previewImg.src = currentCapturedPhotoData;
      previewImg.style.display = 'block';
      videoElement.style.display = 'none';
      if (gridOverlay) gridOverlay.style.display = 'none';

      liveControls.style.display = 'none';
      previewControls.style.display = 'flex';

      // Check quality (size/resolution)
      if (canvasElement.width < 320 || canvasElement.height < 240) {
        isLowQualityDetected = true;
      } else {
        isLowQualityDetected = false;
      }
    });
  }

  // Retake Photo
  const btnRetake = container.querySelector('#btn-retake-photo');
  if (btnRetake && videoElement && previewImg) {
    btnRetake.addEventListener('click', () => {
      previewImg.style.display = 'none';
      videoElement.style.display = 'block';
      if (gridOverlay) gridOverlay.style.display = 'block';
      liveControls.style.display = 'flex';
      previewControls.style.display = 'none';
    });
  }

  // Confirm Use This Photo
  const btnConfirmUse = container.querySelector('#btn-confirm-use-photo');
  if (btnConfirmUse && cameraModal) {
    btnConfirmUse.addEventListener('click', () => {
      if (currentCapturedPhotoData) {
        if (uploadedPhotosList.length < 5) {
          uploadedPhotosList.push(currentCapturedPhotoData);
        }
        closeCameraStream();
        cameraModal.style.display = 'none';
        renderFarmerPortal(container, 'add-produce');
      }
    });
  }

  // Upload Photo File Handler
  const inpUpload = container.querySelector('#inp-upload-produce-photo');
  if (inpUpload) {
    inpUpload.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (uploadedPhotosList.length < 5) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            uploadedPhotosList.push(evt.target.result);
            renderFarmerPortal(container, 'add-produce');
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  // Remove Photo Button
  container.querySelectorAll('.btn-remove-photo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(e.currentTarget.getAttribute('data-index'));
      uploadedPhotosList.splice(idx, 1);
      renderFarmerPortal(container, 'add-produce');
    });
  });

  // Submit Add Produce Form
  const formAdd = container.querySelector('#form-add-produce');
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();

      const crop = container.querySelector('#inp-crop').value;
      const variety = container.querySelector('#inp-variety').value;
      const quantityKg = container.querySelector('#inp-quantity').value;
      const expectedPricePerKg = container.querySelector('#inp-price').value;
      const location = container.querySelector('#inp-location').value;
      const grade = container.querySelector('#inp-grade').value;
      const shelfLifeDays = container.querySelector('#inp-shelflife').value;
      const harvestDate = container.querySelector('#inp-harvest').value;

      const hasRealPhoto = uploadedPhotosList.length > 0;

      store.addListing({
        crop,
        variety,
        quantityKg,
        expectedPricePerKg,
        location,
        grade,
        shelfLifeDays,
        harvestDate,
        hasRealPhoto,
        photos: uploadedPhotosList
      });

      // Clear current photos for next upload
      uploadedPhotosList = [];
      renderFarmerPortal(container, 'add-produce');
    });
  }

  // Accept/Reject Orders
  container.querySelectorAll('.btn-farmer-accept').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-id');
      store.farmerAcceptOrder(orderId);
      renderFarmerPortal(container, 'orders');
    });
  });

  container.querySelectorAll('.btn-farmer-reject').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-order-id');
      store.farmerRejectOrder(orderId);
      renderFarmerPortal(container, 'orders');
    });
  });
}
