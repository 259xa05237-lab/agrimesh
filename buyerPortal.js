/**
 * AGRI MESH - Buyer Portal & Location-Based Produce Marketplace
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

// Global image fallback helper for produce cards
if (!window.handleAgriImageError) {
  window.handleAgriImageError = function(imgElement, backupUrl, cropName) {
    if (backupUrl && imgElement.src !== backupUrl) {
      imgElement.src = backupUrl;
    } else {
      // SVG Fallback Pattern
      const bgColors = ['#059669', '#10b981', '#047857', '#15803d', '#166534'];
      const color = bgColors[Math.abs(cropName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % bgColors.length];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="${color}"/>
        <circle cx="200" cy="130" r="60" fill="rgba(255,255,255,0.15)"/>
        <text x="200" y="140" font-family="system-ui, sans-serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">🌱</text>
        <text x="200" y="210" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">Fresh ${cropName}</text>
        <text x="200" y="235" font-family="system-ui, sans-serif" font-size="13" fill="rgba(255,255,255,0.85)" text-anchor="middle">Verified Direct Farm Gate</text>
      </svg>`;
      imgElement.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
  };
}

let activeCategory = 'all';
let searchQuery = '';
let selectedGrade = 'all';

export function renderBuyerPortal(container, subView = 'browse') {
  const state = store.getState();
  const userLoc = state.userLocation || { name: 'Guntur, Andhra Pradesh', city: 'Guntur', lat: 16.3067, lng: 80.4365 };
  const vegCount = state.listings.filter(l => l.category === 'vegetable').length;
  const fruitCount = state.listings.filter(l => l.category === 'fruit').length;

  // Filter listings by category, search query, grade, and distance
  let filteredListings = state.listings.filter(item => {
    // Category match
    const matchCategory = 
      activeCategory === 'all' ||
      (activeCategory === 'vegetables' && item.category === 'vegetable') ||
      (activeCategory === 'fruits' && item.category === 'fruit') ||
      (activeCategory === 'verified' && item.isVerified) ||
      (activeCategory === 'nearest' && (item.distanceKm || 0) <= 10);

    // Search query match
    const matchSearch = 
      !searchQuery ||
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.variety && item.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

    // Grade match
    const matchGrade = selectedGrade === 'all' || item.grade === selectedGrade;

    // Distance filter
    let matchDistance = true;
    if (state.selectedDistanceFilter && state.selectedDistanceFilter !== 'all') {
      const maxKm = Number(state.selectedDistanceFilter);
      matchDistance = (item.distanceKm || 0) <= maxKm;
    }

    return matchCategory && matchSearch && matchGrade && matchDistance;
  });

  // Sorting
  const sortKey = state.selectedSort || 'nearest';
  if (sortKey === 'nearest') {
    filteredListings.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (sortKey === 'price_asc') {
    filteredListings.sort((a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0));
  } else if (sortKey === 'freshness') {
    filteredListings.sort((a, b) => (b.freshnessPercent || 0) - (a.freshnessPercent || 0));
  } else if (sortKey === 'match') {
    filteredListings.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));
  }

  // Top Nearest Farmers (Sorted by distance)
  const nearestFarmers = [...state.listings]
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    .slice(0, 6);

  // Nearby Shops & Buyers
  const nearbyShops = state.nearbyShops || [];

  container.innerHTML = `
    <!-- Top Location Strip & Proximity Bar -->
    <div class="location-top-bar">
      <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div class="location-pin-pulse">
            <span style="font-size:1.25rem;">📍</span>
          </div>
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:var(--text-muted); letter-spacing:0.05em;">
              Your Active Location
            </div>
            <div style="font-weight:800; font-size:1.05rem; color:var(--text-main); display:flex; align-items:center; gap:0.4rem;">
              ${userLoc.name}
              ${userLoc.isDetected ? '<span class="badge badge-success" style="font-size:0.65rem; padding:0.15rem 0.4rem;">GPS DETECTED</span>' : ''}
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-sm btn-outline-primary" id="btn-use-my-location" style="border-radius:var(--radius-full);">
            🎯 Use My Location
          </button>
          
          <div style="position:relative;">
            <select id="select-change-location" class="form-control" style="font-size:0.85rem; padding:0.4rem 0.8rem; border-radius:var(--radius-full); cursor:pointer;">
              <option value="" disabled selected>📍 Change City / Region</option>
              ${(state.locationPresets || []).map(p => `
                <option value="${p.city}" ${p.city.toLowerCase() === (userLoc.city || '').toLowerCase() ? 'selected' : ''}>
                  ${p.label}
                </option>
              `).join('')}
            </select>
          </div>

          <button class="btn btn-sm btn-ghost" id="btn-toggle-map-view" style="font-size:0.85rem;">
            🗺️ Proximity Radar
          </button>
        </div>
      </div>
    </div>

    <!-- Geolocation Permission Denied Notice (if triggered) -->
    ${userLoc.permissionDenied ? `
      <div class="container" style="padding-top:1rem;">
        <div class="alert alert-info" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <strong>📍 Location Access Not Enabled:</strong> Using default regional agricultural hub (${userLoc.name}).
          </div>
          <button class="btn btn-sm btn-primary" id="btn-manual-location-picker">
            Select City Manually
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Interactive Proximity Radar / Map Modal Area (Collapsible) -->
    <div id="agrimeesh-radar-container" class="container" style="display:none; margin-top:1.5rem;">
      <div class="card" style="background:linear-gradient(135deg, var(--bg-card) 0%, rgba(16,185,129,0.05) 100%); border:2px solid var(--primary-500); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div>
            <span class="badge badge-primary">GEOSPATIAL PROXIMITY ENGINE</span>
            <h3 style="margin-top:0.25rem;">Live Regional Farm & Buyer Corridor Radar</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">
              Visualizing verified farm gates, cold-chain aggregation hubs, and buyer distribution points around <strong>${userLoc.name}</strong>.
            </p>
          </div>
          <button class="btn btn-sm btn-ghost" id="btn-close-radar">✕ Close Radar</button>
        </div>

        <!-- Radar SVG Graphic -->
        <div style="background:var(--bg-main); border-radius:var(--radius-lg); padding:2rem; text-align:center; border:1px solid var(--border-light); position:relative; overflow:hidden;">
          <svg viewBox="0 0 800 320" style="width:100%; max-height:300px; display:block; margin:0 auto;">
            <!-- Radar concentric circles -->
            <circle cx="400" cy="160" r="140" fill="none" stroke="rgba(16,185,129,0.15)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <circle cx="400" cy="160" r="95" fill="none" stroke="rgba(16,185,129,0.25)" stroke-width="1.5"/>
            <circle cx="400" cy="160" r="50" fill="none" stroke="rgba(16,185,129,0.35)" stroke-width="1.5"/>
            
            <!-- Radar Sweep Line -->
            <line x1="400" y1="160" x2="520" y2="60" stroke="rgba(16,185,129,0.4)" stroke-width="2"/>

            <!-- Center: User Location -->
            <circle cx="400" cy="160" r="12" fill="#10b981"/>
            <circle cx="400" cy="160" r="6" fill="#ffffff"/>
            <text x="400" y="190" font-size="12" font-weight="bold" fill="var(--text-main)" text-anchor="middle">📍 You (${userLoc.city})</text>

            <!-- Nearby Farmers Pins -->
            <g transform="translate(360, 105)" style="cursor:pointer;">
              <circle cx="0" cy="0" r="8" fill="#059669"/>
              <text x="0" y="4" font-size="9" fill="#ffffff" text-anchor="middle">👨‍🌾</text>
              <text x="0" y="-12" font-size="11" font-weight="700" fill="var(--text-main)" text-anchor="middle">Ramesh (2.4 km) - 🍅 Tomato</text>
            </g>

            <g transform="translate(470, 125)" style="cursor:pointer;">
              <circle cx="0" cy="0" r="8" fill="#059669"/>
              <text x="0" y="4" font-size="9" fill="#ffffff" text-anchor="middle">👨‍🌾</text>
              <text x="0" y="-12" font-size="11" font-weight="700" fill="var(--text-main)" text-anchor="middle">Suresh (4.8 km) - 🧅 Onion</text>
            </g>

            <g transform="translate(330, 205)" style="cursor:pointer;">
              <circle cx="0" cy="0" r="8" fill="#059669"/>
              <text x="0" y="4" font-size="9" fill="#ffffff" text-anchor="middle">👨‍🌾</text>
              <text x="0" y="-12" font-size="11" font-weight="700" fill="var(--text-main)" text-anchor="middle">Lakshmi FPO (7.2 km) - 🥔 Potato</text>
            </g>

            <!-- Nearby Buyer Shops Pins -->
            <g transform="translate(440, 210)" style="cursor:pointer;">
              <circle cx="0" cy="0" r="8" fill="#2563eb"/>
              <text x="0" y="4" font-size="9" fill="#ffffff" text-anchor="middle">🏪</text>
              <text x="0" y="20" font-size="11" font-weight="700" fill="#2563eb" text-anchor="middle">FreshMart (3.1 km)</text>
            </g>

            <g transform="translate(485, 185)" style="cursor:pointer;">
              <circle cx="0" cy="0" r="8" fill="#2563eb"/>
              <text x="0" y="4" font-size="9" fill="#ffffff" text-anchor="middle">🏪</text>
              <text x="0" y="20" font-size="11" font-weight="700" fill="#2563eb" text-anchor="middle">GreenBasket (5.7 km)</text>
            </g>
          </svg>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem;">
            🟢 Green Pins: Direct Farm Gates • 🔵 Blue Pins: Retail Buyers & Aggregation Hubs • 🚚 Corridors: Clustered 4.2°C Cold-Chain Reefer
          </div>
        </div>
      </div>
    </div>

    <div class="container section-py" style="padding-top:1.5rem;">

      <!-- ======================================================= -->
      <!-- SECTION 1: FARMERS NEAR YOU (Horizontally Scrollable Mobile) -->
      <!-- ======================================================= -->
      <div style="margin-bottom:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <span class="badge badge-success">📍 LOCAL DIRECT FARM GATES</span>
            <h2 style="font-size:1.6rem; margin-top:0.25rem;">Farmers Near You</h2>
            <p style="font-size:0.875rem; color:var(--text-muted);">
              Direct doorstep produce from verified farmers near <strong>${userLoc.city}</strong> sorted by shortest logistics transit.
            </p>
          </div>
          <span style="font-size:0.85rem; color:var(--text-muted);">
            Showing ${nearestFarmers.length} nearby farm gates
          </span>
        </div>

        <div class="nearby-farmers-carousel">
          ${nearestFarmers.map(farmer => `
            <div class="card nearby-farmer-card" style="min-width:270px; flex:0 0 auto; padding:1.25rem; border-top:4px solid var(--primary-500); position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <div>
                  <h4 style="font-size:1.05rem; margin-bottom:0.15rem;">${farmer.farmerName}</h4>
                  <div style="font-size:0.8rem; color:var(--text-muted);">${farmer.location}</div>
                </div>
                <span class="badge badge-success" style="font-size:0.7rem;">✓ Verified</span>
              </div>

              <!-- Distance Badge -->
              <div style="display:inline-flex; align-items:center; gap:0.35rem; background:rgba(16,185,129,0.1); color:var(--primary-600); font-weight:800; font-size:0.825rem; padding:0.25rem 0.6rem; border-radius:var(--radius-full); margin-bottom:0.75rem;">
                📍 ${farmer.distanceKm} km away
              </div>

              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
                <img 
                  src="${farmer.image}" 
                  alt="Fresh ${farmer.crop}" 
                  class="nearby-farmer-thumb"
                  onerror="window.handleAgriImageError(this, '${farmer.backupImage || ''}', '${farmer.crop}')"
                />
                <div>
                  <div style="font-weight:700; font-size:0.95rem;">${farmer.crop}</div>
                  <div style="font-size:1.15rem; font-weight:900; color:var(--primary-600);">
                    ₹${farmer.pricePerKg.toFixed(2)}<span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">/kg</span>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Avail: ${farmer.quantityKg} kg (${farmer.grade})</div>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:0.5rem;">
                <button class="btn btn-sm btn-ghost btn-view-produce-inspection" data-produce-id="${farmer.id}" style="font-size:0.75rem; padding:0.35rem 0.5rem;">
                  🔍 Inspect
                </button>
                <button class="btn btn-sm btn-primary btn-quick-add-farmer-cart" data-produce-id="${farmer.id}" style="font-size:0.75rem; padding:0.35rem 0.5rem;">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- SECTION 2: NEARBY SHOPS & BUYERS -->
      <!-- ======================================================= -->
      <div style="margin-bottom:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <span class="badge badge-primary">🏪 LOCAL DEMAND HUBS</span>
            <h2 style="font-size:1.6rem; margin-top:0.25rem;">Nearby Shops & Buyers</h2>
            <p style="font-size:0.875rem; color:var(--text-muted);">
              Active retail grocers, supermarkets and B2B buyers procuring direct produce around <strong>${userLoc.city}</strong>.
            </p>
          </div>
        </div>

        <div class="grid grid-3">
          ${nearbyShops.map(shop => `
            <div class="card" style="padding:1.25rem; border-left:4px solid #2563eb; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <div>
                    <h4 style="font-size:1.05rem; margin-bottom:0.15rem;">${shop.name}</h4>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${shop.category}</span>
                  </div>
                  <span class="badge badge-primary" style="font-size:0.75rem;">
                    📍 ${shop.distanceKm} km
                  </span>
                </div>

                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
                  📍 ${shop.address}
                </div>

                <div style="margin-bottom:0.75rem;">
                  <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.35rem;">
                    Immediate Buying Needs:
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
                    ${shop.requiredCrops.map(c => `
                      <span style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:#2563eb; padding:0.2rem 0.5rem; border-radius:var(--radius-full); font-weight:600;">
                        ${c}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div style="border-top:1px solid var(--border-light); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                <span style="font-size:0.75rem; color:var(--text-muted);">
                  Daily Demand: <strong>${shop.dailyDemandKg} kg</strong>
                </span>
                <button class="btn btn-sm btn-ghost btn-view-shop-details" data-shop-id="${shop.id}" style="font-size:0.75rem;">
                  View Needs ➔
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- SECTION 3: PRODUCE MARKETPLACE BROWSER -->
      <!-- ======================================================= -->
      <div id="produce-marketplace-catalog">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 style="font-size:1.85rem; margin-bottom:0.25rem;">Marketplace Produce Catalog</h2>
            <p style="font-size:0.9rem; color:var(--text-muted);">
              ${vegCount} Vegetables & ${fruitCount} Fruits with live distance, farmer verification, and cart quantity selectors.
            </p>
          </div>

          <!-- Quick Cart Shortcut Button -->
          <button class="btn btn-secondary btn-sm" id="btn-quick-goto-cart" style="display:flex; align-items:center; gap:0.5rem;">
            🛒 Open Shopping Cart (${state.cart.length})
          </button>
        </div>

        <!-- Filter & Search Controls Bar -->
        <div class="card" style="padding:1.25rem; margin-bottom:2rem; background:var(--bg-subtle);">
          <div style="display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr; gap:1rem; align-items:center;">
            
            <!-- Search Input -->
            <div style="position:relative;">
              <input 
                type="text" 
                id="search-produce-input" 
                class="form-control" 
                placeholder="🔍 Search produce (e.g. Tomato, Onion, Mango, Dragon Fruit)..."
                value="${searchQuery}"
                style="padding-left:1rem;"
              />
            </div>

            <!-- Distance Filter -->
            <div>
              <select id="filter-distance-select" class="form-control" style="font-size:0.85rem;">
                <option value="all" ${state.selectedDistanceFilter === 'all' ? 'selected' : ''}>📏 Distance: All Locations</option>
                <option value="5" ${state.selectedDistanceFilter === '5' ? 'selected' : ''}>Within 5 km (Hyperlocal)</option>
                <option value="10" ${state.selectedDistanceFilter === '10' ? 'selected' : ''}>Within 10 km (Suburban)</option>
                <option value="25" ${state.selectedDistanceFilter === '25' ? 'selected' : ''}>Within 25 km (District)</option>
                <option value="50" ${state.selectedDistanceFilter === '50' ? 'selected' : ''}>Within 50 km (Regional)</option>
              </select>
            </div>

            <!-- Sort By Selector -->
            <div>
              <select id="sort-produce-select" class="form-control" style="font-size:0.85rem;">
                <option value="nearest" ${state.selectedSort === 'nearest' ? 'selected' : ''}>⚡ Sort: Nearest First</option>
                <option value="price_asc" ${state.selectedSort === 'price_asc' ? 'selected' : ''}>💰 Lowest Price</option>
                <option value="freshness" ${state.selectedSort === 'freshness' ? 'selected' : ''}>🌱 Highest Freshness</option>
                <option value="match" ${state.selectedSort === 'match' ? 'selected' : ''}>⭐ Best Verified Match</option>
              </select>
            </div>

            <!-- Quality Grade Filter -->
            <div>
              <select id="filter-grade-select" class="form-control" style="font-size:0.85rem;">
                <option value="all" ${selectedGrade === 'all' ? 'selected' : ''}>All Quality Grades</option>
                <option value="Grade A" ${selectedGrade === 'Grade A' ? 'selected' : ''}>Grade A (Premium)</option>
                <option value="Grade B+" ${selectedGrade === 'Grade B+' ? 'selected' : ''}>Grade B+ (Standard)</option>
              </select>
            </div>
          </div>

          <!-- Category Pill Buttons -->
          <div style="display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap; align-items:center;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-right:0.25rem;">Category:</span>
            <button class="btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-ghost'} filter-category-btn" data-category="all">
              All Produce (${state.listings.length})
            </button>
            <button class="btn btn-sm ${activeCategory === 'vegetables' ? 'btn-primary' : 'btn-ghost'} filter-category-btn" data-category="vegetables">
              🍅 Vegetables (${vegCount})
            </button>
            <button class="btn btn-sm ${activeCategory === 'fruits' ? 'btn-primary' : 'btn-ghost'} filter-category-btn" data-category="fruits">
              🍎 Fruits (${fruitCount})
            </button>
            <button class="btn btn-sm ${activeCategory === 'verified' ? 'btn-primary' : 'btn-ghost'} filter-category-btn" data-category="verified">
              ✓ Verified Farmers
            </button>
            <button class="btn btn-sm ${activeCategory === 'nearest' ? 'btn-primary' : 'btn-ghost'} filter-category-btn" data-category="nearest">
              📍 Nearby (≤10 km)
            </button>
          </div>
        </div>

        <!-- Product Cards Grid -->
        ${filteredListings.length > 0 ? `
          <div class="grid grid-3" style="margin-bottom:2.5rem;">
            ${filteredListings.map(listing => renderProduceCardHTML(listing, userLoc)).join('')}
          </div>
        ` : `
          <!-- Empty State Handling -->
          <div class="card" style="text-align:center; padding:3.5rem 2rem; margin-bottom:2.5rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">🌾</div>
            <h3 style="font-size:1.4rem; margin-bottom:0.5rem;">No farmers found within this distance</h3>
            <p style="color:var(--text-muted); max-width:500px; margin:0 auto 1.5rem;">
              We couldn't find any direct farm listings matching your criteria within <strong>${state.selectedDistanceFilter} km</strong> of ${userLoc.city}.
            </p>
            <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" id="btn-increase-distance">
                📏 Increase Distance (Show All)
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-empty-change-location">
                📍 Change Location
              </button>
            </div>
          </div>
        `}
      </div>
    </div>

    <!-- Produce Inspection Gallery Modal -->
    ${renderProduceInspectionModalHTML(state.selectedProduceForInspection)}
  `;

  // Attach Event Handlers
  attachBuyerPortalEventListeners(container);
}

function renderProduceCardHTML(listing, userLoc) {
  const distanceText = listing.distanceKm ? `📍 ${listing.distanceKm} km away` : '📍 Nearby';
  const hasRealPhoto = Boolean(listing.hasRealPhoto);

  return `
    <div class="card produce-card" style="padding:0; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
      
      <!-- Top Image with Inspection Trigger & 3-tier Fallback -->
      <div style="position:relative; height:190px; overflow:hidden; cursor:pointer;" class="btn-inspect-produce-trigger" data-produce-id="${listing.id}">
        <img 
          src="${listing.image}" 
          alt="Fresh ${listing.crop}" 
          class="produce-card-img"
          loading="lazy"
          onerror="window.handleAgriImageError(this, '${listing.backupImage || ''}', '${listing.crop}')"
        />
        <div style="position:absolute; top:10px; left:10px; display:flex; gap:0.4rem; flex-wrap:wrap;">
          <span class="badge ${listing.category === 'fruit' ? 'badge-warning' : 'badge-success'}" style="font-size:0.7rem; text-transform:uppercase;">
            ${listing.category || 'vegetable'}
          </span>
          <span class="badge badge-primary" style="font-size:0.7rem;">⭐ ${listing.grade}</span>
          ${hasRealPhoto ? '<span class="badge badge-gold" style="font-size:0.65rem; background:#fef3c7; color:#92400e; border:1px solid #fcd34d;">📷 Real Photo</span>' : ''}
        </div>
        
        <div style="position:absolute; top:10px; right:10px;">
          <span style="background:rgba(0,0,0,0.65); color:#ffffff; font-size:0.7rem; font-weight:700; padding:0.2rem 0.5rem; border-radius:var(--radius-full); backdrop-filter:blur(4px);">
            ${distanceText}
          </span>
        </div>

        <div class="produce-inspect-overlay">
          <span>🔍 View Photos & Inspection Details</span>
        </div>
      </div>

      <!-- Card Body -->
      <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.25rem;">
            <h3 style="font-size:1.25rem; font-weight:800; margin:0;">${listing.crop}</h3>
            <div style="font-size:1.35rem; font-weight:900; color:var(--primary-600);">
              ₹${listing.pricePerKg.toFixed(2)}<span style="font-size:0.8rem; font-weight:500; color:var(--text-muted);">/kg</span>
            </div>
          </div>

          <div style="font-size:0.825rem; color:var(--text-muted); margin-bottom:0.75rem;">
            ${listing.variety} • Harvest: ${listing.harvestDate || 'Fresh Cut'}
          </div>

          <!-- Farmer & Location Info -->
          <div style="background:var(--bg-subtle); padding:0.65rem 0.8rem; border-radius:var(--radius-md); margin-bottom:1rem; border:1px solid var(--border-light);">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.825rem; margin-bottom:0.25rem;">
              <span style="font-weight:700; color:var(--text-main); display:flex; align-items:center; gap:0.25rem;">
                👨‍🌾 ${listing.farmerName}
              </span>
              <span style="color:#059669; font-size:0.75rem; font-weight:700;">✓ Verified Farmer</span>
            </div>
            
            <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
              <span>📍 ${listing.location} • ${listing.distanceKm || 2.5} km away</span>
              <span>🌱 Fresh (${listing.freshnessPercent || 96}%)</span>
            </div>

            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">
              📦 <strong>${listing.quantityKg} kg</strong> available
            </div>
          </div>
        </div>

        <!-- Quantity Plus / Minus & Add to Cart Controls -->
        <div style="border-top:1px solid var(--border-light); padding-top:0.75rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Quantity (kg):</span>
            
            <div class="quantity-controller" data-produce-id="${listing.id}">
              <button class="btn-qty-minus" data-id="${listing.id}">−</button>
              <input type="number" id="qty-input-${listing.id}" class="qty-display" value="1" min="1" max="${listing.quantityKg}" readonly />
              <button class="btn-qty-plus" data-id="${listing.id}">+</button>
            </div>
          </div>

          <!-- Add to Cart Action (No Buy Now) -->
          <button class="btn btn-primary btn-add-produce-cart" data-produce-id="${listing.id}" style="width:100%; border-radius:var(--radius-md); padding:0.55rem 1rem; font-weight:700;">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProduceInspectionModalHTML(produce) {
  if (!produce) return '';

  const gallery = produce.gallery && produce.gallery.length > 0 ? produce.gallery : [
    { label: "Main Produce", url: produce.image },
    { label: "Quality Grading", url: produce.backupImage || produce.image },
    { label: "Crate Packaging", url: produce.image },
    { label: "Farm Batch", url: produce.backupImage || produce.image }
  ];

  return `
    <div class="modal-backdrop" id="produce-inspection-modal" style="display:flex;">
      <div class="modal-card" style="max-width:760px; width:95%; max-height:90vh; overflow-y:auto; padding:2rem;">
        
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
          <div>
            <div style="display:flex; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
              <span class="badge badge-success">✓ AGRIMESH CERTIFIED QUALITY</span>
              <span class="badge badge-primary">⭐ ${produce.grade}</span>
              ${produce.hasRealPhoto ? '<span class="badge badge-gold" style="background:#fef3c7; color:#92400e; border:1px solid #fcd34d;">📷 Real Farmer Upload</span>' : ''}
            </div>
            <h2 style="font-size:1.75rem; margin:0;">${produce.crop} — ${produce.variety}</h2>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Farm Batch #AGM-${produce.id.toUpperCase()} • Direct Gate: ${produce.location} (${produce.distanceKm} km away)
            </div>
          </div>
          <button class="btn btn-sm btn-ghost" id="btn-close-inspection-modal" style="font-size:1.25rem; line-height:1;">✕</button>
        </div>

        <!-- Inspection Photo Gallery -->
        <div style="margin-bottom:1.5rem;">
          <!-- Big Preview Image -->
          <div style="height:320px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:0.75rem; background:var(--bg-subtle);">
            <img 
              id="gallery-main-preview"
              src="${gallery[0].url}" 
              alt="${produce.crop}" 
              style="width:100%; height:100%; object-fit:cover;"
              onerror="window.handleAgriImageError(this, '${produce.backupImage || ''}', '${produce.crop}')"
            />
          </div>

          <!-- Thumbnails (Up to 5 photos) -->
          <div style="display:grid; grid-template-columns:repeat(${gallery.length}, 1fr); gap:0.5rem;">
            ${gallery.map((g, idx) => `
              <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-url="${g.url}" style="cursor:pointer; border-radius:var(--radius-md); overflow:hidden; border:2px solid ${idx === 0 ? 'var(--primary-500)' : 'var(--border-light)'};">
                <img src="${g.url}" alt="${g.label}" style="width:100%; height:60px; object-fit:cover;" onerror="window.handleAgriImageError(this, '', '${produce.crop}')"/>
                <div style="font-size:0.65rem; text-align:center; padding:0.2rem; background:var(--bg-subtle); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Specifications Grid -->
        <div class="grid grid-3" style="margin-bottom:1.5rem;">
          <div class="card" style="padding:0.75rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Freshness Score</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--primary-600);">${produce.freshnessPercent || 96}%</div>
          </div>
          <div class="card" style="padding:0.75rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Distance from You</div>
            <div style="font-size:1.25rem; font-weight:800;">📍 ${produce.distanceKm} km</div>
          </div>
          <div class="card" style="padding:0.75rem; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Available Lot</div>
            <div style="font-size:1.25rem; font-weight:800;">${produce.quantityKg} kg</div>
          </div>
        </div>

        <!-- Add to Cart Controls Inside Modal -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:1rem 1.25rem; border-radius:var(--radius-lg); flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Direct Farmer Price:</div>
            <div style="font-size:1.5rem; font-weight:900; color:var(--primary-600);">
              ₹${produce.pricePerKg.toFixed(2)}<span style="font-size:0.85rem; font-weight:500; color:var(--text-muted);">/kg</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="quantity-controller">
              <button class="btn-qty-minus" data-id="${produce.id}">−</button>
              <input type="number" id="qty-modal-input-${produce.id}" class="qty-display" value="1" min="1" max="${produce.quantityKg}" readonly />
              <button class="btn-qty-plus" data-id="${produce.id}">+</button>
            </div>

            <button class="btn btn-primary btn-modal-add-cart" data-produce-id="${produce.id}" style="padding:0.65rem 1.5rem; font-weight:800;">
              🛒 Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function attachBuyerPortalEventListeners(container) {
  // Geolocation trigger
  const btnUseLocation = container.querySelector('#btn-use-my-location');
  if (btnUseLocation) {
    btnUseLocation.addEventListener('click', () => {
      store.detectUserLocation();
    });
  }

  // City Selector Dropdown
  const selectLocation = container.querySelector('#select-change-location');
  if (selectLocation) {
    selectLocation.addEventListener('change', (e) => {
      if (e.target.value) {
        store.setUserLocation(e.target.value);
      }
    });
  }

  // Toggle Proximity Radar
  const btnToggleRadar = container.querySelector('#btn-toggle-map-view');
  const radarContainer = container.querySelector('#agrimeesh-radar-container');
  if (btnToggleRadar && radarContainer) {
    btnToggleRadar.addEventListener('click', () => {
      radarContainer.style.display = radarContainer.style.display === 'none' ? 'block' : 'none';
      if (radarContainer.style.display === 'block') {
        radarContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const btnCloseRadar = container.querySelector('#btn-close-radar');
  if (btnCloseRadar && radarContainer) {
    btnCloseRadar.addEventListener('click', () => {
      radarContainer.style.display = 'none';
    });
  }

  // Distance Filter
  const distanceSelect = container.querySelector('#filter-distance-select');
  if (distanceSelect) {
    distanceSelect.addEventListener('change', (e) => {
      store.setDistanceFilter(e.target.value);
    });
  }

  // Sort By
  const sortSelect = container.querySelector('#sort-produce-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.setSortBy(e.target.value);
    });
  }

  // Grade Filter
  const gradeSelect = container.querySelector('#filter-grade-select');
  if (gradeSelect) {
    gradeSelect.addEventListener('change', (e) => {
      selectedGrade = e.target.value;
      store.notify();
    });
  }

  // Search Input
  const searchInput = container.querySelector('#search-produce-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      store.notify();
    });
  }

  // Category Buttons
  container.querySelectorAll('.filter-category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeCategory = e.currentTarget.getAttribute('data-category');
      store.notify();
    });
  });

  // Quantity [+] and [−] buttons
  container.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const produceId = e.currentTarget.getAttribute('data-id');
      const input = container.querySelector(`#qty-input-${produceId}`) || container.querySelector(`#qty-modal-input-${produceId}`);
      if (input) {
        input.value = Number(input.value) + 1;
      }
    });
  });

  container.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const produceId = e.currentTarget.getAttribute('data-id');
      const input = container.querySelector(`#qty-input-${produceId}`) || container.querySelector(`#qty-modal-input-${produceId}`);
      if (input && Number(input.value) > 1) {
        input.value = Number(input.value) - 1;
      }
    });
  });

  // Add to Cart Buttons
  container.querySelectorAll('.btn-add-produce-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produceId = e.currentTarget.getAttribute('data-produce-id');
      const listing = store.getState().listings.find(l => l.id === produceId);
      const qtyInput = container.querySelector(`#qty-input-${produceId}`);
      const qty = qtyInput ? Number(qtyInput.value) : 1;
      if (listing) {
        store.addToCart(listing, qty);
      }
    });
  });

  // Quick Add from Nearest Farmers Carousel
  container.querySelectorAll('.btn-quick-add-farmer-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produceId = e.currentTarget.getAttribute('data-produce-id');
      const listing = store.getState().listings.find(l => l.id === produceId);
      if (listing) {
        store.addToCart(listing, 1);
      }
    });
  });

  // Modal Add to Cart
  const btnModalAdd = container.querySelector('.btn-modal-add-cart');
  if (btnModalAdd) {
    btnModalAdd.addEventListener('click', (e) => {
      const produceId = e.currentTarget.getAttribute('data-produce-id');
      const listing = store.getState().listings.find(l => l.id === produceId);
      const qtyInput = container.querySelector(`#qty-modal-input-${produceId}`);
      const qty = qtyInput ? Number(qtyInput.value) : 1;
      if (listing) {
        store.addToCart(listing, qty);
        store.closeProduceInspection();
      }
    });
  }

  // Inspection Modal Triggers
  container.querySelectorAll('.btn-inspect-produce-trigger, .btn-view-produce-inspection').forEach(el => {
    el.addEventListener('click', (e) => {
      const produceId = e.currentTarget.getAttribute('data-produce-id');
      const listing = store.getState().listings.find(l => l.id === produceId);
      if (listing) {
        store.setSelectedProduceForInspection(listing);
      }
    });
  });

  // Close Inspection Modal
  const btnCloseModal = container.querySelector('#btn-close-inspection-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      store.closeProduceInspection();
    });
  }

  // Modal Gallery Thumbnail switching
  container.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      const url = e.currentTarget.getAttribute('data-url');
      const mainPreview = container.querySelector('#gallery-main-preview');
      if (mainPreview) {
        mainPreview.src = url;
      }
      container.querySelectorAll('.gallery-thumb').forEach(t => t.style.borderColor = 'var(--border-light)');
      e.currentTarget.style.borderColor = 'var(--primary-500)';
    });
  });

  // Quick Cart navigation
  const btnQuickCart = container.querySelector('#btn-quick-goto-cart');
  if (btnQuickCart) {
    btnQuickCart.addEventListener('click', () => {
      store.navigate('cart');
    });
  }

  // Empty state buttons
  const btnIncreaseDist = container.querySelector('#btn-increase-distance');
  if (btnIncreaseDist) {
    btnIncreaseDist.addEventListener('click', () => {
      store.setDistanceFilter('all');
    });
  }

  const btnEmptyLoc = container.querySelector('#btn-empty-change-location');
  if (btnEmptyLoc) {
    btnEmptyLoc.addEventListener('click', () => {
      if (selectLocation) selectLocation.focus();
    });
  }
}
