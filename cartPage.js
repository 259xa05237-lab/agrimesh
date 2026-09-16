/**
 * AGRI MESH - Full Shopping Cart & Order Review Component
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderCartPage(container, viewMode = 'cart') {
  const state = store.getState();
  const cart = state.cart;
  const summary = store.getCartSummary();

  if (viewMode === 'review') {
    renderOrderReviewView(container, state, summary);
    return;
  }

  // Cart View
  container.innerHTML = `
    <div class="container section-py" style="padding-top:2rem;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
        <div>
          <span class="badge badge-success">DIRECT FARMER PROCUREMENT</span>
          <h2 style="font-size:2rem; margin-top:0.25rem;">Shopping Cart</h2>
          <p style="font-size:0.95rem; color:var(--text-muted);">
            Review and adjust quantities across multiple farmers before placing your consolidated order.
          </p>
        </div>

        <button class="btn btn-outline" data-nav="browse-produce">
          ← Continue Shopping
        </button>
      </div>

      ${cart.length === 0 ? renderEmptyCart() : renderActiveCart(cart, summary)}
    </div>
  `;

  attachCartListeners(container);
}

function renderEmptyCart() {
  return `
    <div class="card" style="text-align:center; padding:4rem 2rem;">
      <div style="font-size:4rem; margin-bottom:1rem;">🛒</div>
      <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">Your Cart is Empty</h3>
      <p style="font-size:0.95rem; color:var(--text-muted); max-width:450px; margin:0 auto 1.75rem;">
        Explore fresh vegetables and fruits directly from verified smallholder farmers across Andhra Pradesh and Telangana.
      </p>
      <button class="btn btn-primary btn-lg" data-nav="browse-produce">
        🥬 Browse Produce Marketplace ➔
      </button>
    </div>
  `;
}

function renderActiveCart(cart, summary) {
  return `
    <div class="grid grid-3" style="align-items:start; gap:2rem;">
      <!-- Left Column: Items grouped by Farmer (2 Columns Span) -->
      <div style="grid-column:span 2; display:flex; flex-direction:column; gap:1.5rem;">
        ${Object.keys(summary.farmerGroups).map(farmerName => {
          const farmerItems = summary.farmerGroups[farmerName];
          const farmerLocation = farmerItems[0].farmerLocation;

          return `
            <div class="card" style="border-top:4px solid var(--primary-500); padding:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
                <div>
                  <div style="font-size:0.75rem; color:var(--primary-600); font-weight:800; text-transform:uppercase;">
                    👨‍🌾 DIRECT FARM GATE
                  </div>
                  <h4 style="font-size:1.15rem; margin-top:2px;">${farmerName}</h4>
                  <div style="font-size:0.8rem; color:var(--text-muted);">📍 ${farmerLocation}</div>
                </div>
                <span class="badge badge-success">Verified Direct Farmer</span>
              </div>

              <!-- Farmer's Produce Items in Cart -->
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${farmerItems.map(item => `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:0.9rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md); flex-wrap:wrap; gap:1rem;">
                    <div style="display:flex; align-items:center; gap:0.9rem;">
                      <img src="${item.image}" alt="${item.crop}" style="width:55px; height:55px; border-radius:var(--radius-md); object-fit:cover;">
                      <div>
                        <div style="font-weight:800; font-size:1rem;">${item.crop}</div>
                        <div style="font-size:0.85rem; color:var(--primary-700); font-weight:700;">
                          ₹${item.pricePerKg.toFixed(2)}/kg <span class="badge badge-info" style="font-size:0.65rem;">${item.grade}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Quantity Plus/Minus Selector -->
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                      <div style="display:flex; align-items:center; border:1.5px solid var(--border-light); border-radius:var(--radius-md); background:var(--bg-surface); overflow:hidden;">
                        <button class="btn btn-sm btn-ghost btn-cart-minus" data-cart-id="${item.id}" style="padding:0.35rem 0.75rem; font-weight:900; font-size:1.1rem; border-radius:0;">
                          −
                        </button>
                        <span style="padding:0.35rem 0.9rem; font-weight:800; font-size:0.95rem; min-width:45px; text-align:center;">
                          ${item.quantityKg} kg
                        </span>
                        <button class="btn btn-sm btn-ghost btn-cart-plus" data-cart-id="${item.id}" style="padding:0.35rem 0.75rem; font-weight:900; font-size:1.1rem; border-radius:0;">
                          +
                        </button>
                      </div>

                      <div style="min-width:80px; text-align:right;">
                        <div style="font-size:0.75rem; color:var(--text-muted);">Subtotal</div>
                        <div style="font-size:1.15rem; font-weight:900; color:var(--text-main); font-family:var(--font-heading);">
                          ₹${(item.pricePerKg * item.quantityKg).toFixed(2)}
                        </div>
                      </div>

                      <button class="btn btn-sm btn-ghost btn-cart-remove" data-cart-id="${item.id}" title="Remove Item" style="color:#ef4444; padding:0.4rem;">
                        ✕
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Right Column: Cart Financial & Clustered Logistics Summary -->
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div class="card" style="border-top:4px solid var(--accent-gold);">
          <h3 style="font-size:1.25rem; margin-bottom:1.25rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
            Order Summary
          </h3>

          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.9rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Total Produce Items:</span>
              <strong>${summary.totalItems} distinct crops</strong>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Total Weight:</span>
              <strong>${summary.totalQuantityKg} kg</strong>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Participating Farmers:</span>
              <strong>${summary.farmersCount} Farmers</strong>
            </div>

            <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-light); padding-top:0.75rem;">
              <span style="color:var(--text-muted);">Produce Subtotal:</span>
              <strong style="font-size:1.05rem;">₹${summary.subtotal.toLocaleString('en-IN')}</strong>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Raw Transport Freight:</span>
              <span>₹${summary.estimatedTransport}</span>
            </div>

            <div style="display:flex; justify-content:space-between; color:var(--primary-600);">
              <span>- Clustered Reefer Savings:</span>
              <span>-₹${summary.clusterSaving}</span>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Net Clustered Freight:</span>
              <strong style="color:var(--primary-700);">₹${summary.netLogistics}</strong>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">AgriMesh Platform Fee (1.5%):</span>
              <span>₹${summary.platformFee}</span>
            </div>

            <div style="border-top:2px solid var(--border-light); padding-top:0.9rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:0.78rem; color:var(--text-muted);">ESTIMATED TOTAL</div>
                <div style="font-size:1.75rem; font-weight:900; color:var(--primary-700); font-family:var(--font-heading);">
                  ₹${summary.estimatedTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <!-- Cluster Logistics Callout Badge -->
          <div style="background:var(--primary-50); border:1px dashed var(--primary-300); border-radius:var(--radius-md); padding:0.75rem 1rem; margin-bottom:1.5rem; font-size:0.82rem; color:var(--primary-800);">
            ✓ <strong>AgriMesh Clustered Logistics Active:</strong> 40% transport savings applied by aggregating nearby farm pickups into a single 4.2°C reefer vehicle.
          </div>

          <button class="btn btn-primary btn-lg" id="btn-goto-order-review" style="width:100%;">
            Review Order ➔
          </button>
        </div>

        <div class="card" style="background:var(--bg-subtle); padding:1rem; font-size:0.82rem; line-height:1.5; color:var(--text-muted);">
          🛡️ <strong>100% Escrow Protection:</strong> Funds are locked digitally upon order review and released to farmers only upon verified barcode scan at your warehouse dock.
        </div>
      </div>
    </div>
  `;
}

function renderOrderReviewView(container, state, summary) {
  const buyer = state.registeredBuyers[0];

  container.innerHTML = `
    <div class="container section-py" style="max-width:960px; padding-top:2rem;">
      <div style="margin-bottom:1.5rem;">
        <span class="badge badge-gold">STEP 2 OF 2: FINAL CONFIRMATION</span>
        <h2 style="font-size:2rem; margin-top:0.25rem;">Review & Place Clustered Order</h2>
        <p style="font-size:0.95rem; color:var(--text-muted);">
          Please review the produce items, pickup farmer gates, and delivery parameters before confirming the digital escrow contract.
        </p>
      </div>

      <div class="grid grid-3" style="align-items:start; gap:2rem;">
        <!-- Left: Order Details & Pickup List -->
        <div style="grid-column:span 2; display:flex; flex-direction:column; gap:1.5rem;">
          <div class="card">
            <h3 style="font-size:1.25rem; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              Produce Items to be Sourced (${summary.totalQuantityKg} kg Total)
            </h3>

            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${state.cart.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0.9rem; background:var(--bg-subtle); border-radius:var(--radius-md);">
                  <div>
                    <strong style="font-size:0.95rem;">${item.crop}</strong> (${item.quantityKg} kg)
                    <div style="font-size:0.78rem; color:var(--text-muted);">Farmer: ${item.farmerName} • 📍 ${item.farmerLocation}</div>
                  </div>
                  <div style="font-weight:800; font-size:1rem; color:var(--primary-700);">
                    ₹${(item.pricePerKg * item.quantityKg).toFixed(2)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pickup & Delivery Corridors -->
          <div class="card">
            <h3 style="font-size:1.25rem; margin-bottom:1rem;">Delivery & Reefer Route Specifications</h3>
            
            <div class="grid grid-2" style="font-size:0.88rem; gap:1rem;">
              <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md);">
                <div style="font-weight:800; color:var(--primary-700); margin-bottom:0.25rem;">📍 Farm Gate Pickups</div>
                <div>Guntur & Kurnool Clustered Hubs</div>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Expected Pickup: Tomorrow 10:00 AM</div>
              </div>

              <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md);">
                <div style="font-weight:800; color:var(--primary-700); margin-bottom:0.25rem;">🏢 Delivery Destination</div>
                <div>${buyer.companyName}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">${buyer.location}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Order Financials & Action -->
        <div class="card" style="border-top:4px solid var(--primary-500);">
          <h3 style="font-size:1.25rem; margin-bottom:1rem;">Payment & Escrow Summary</h3>
          
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Produce Value:</span>
              <strong>₹${summary.subtotal}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Clustered Logistics:</span>
              <strong>₹${summary.netLogistics}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Platform Fee (1.5%):</span>
              <strong>₹${summary.platformFee}</strong>
            </div>
            <div style="border-top:2px solid var(--border-light); padding-top:0.75rem; display:flex; justify-content:space-between;">
              <span style="font-weight:800;">Total Payable:</span>
              <strong style="font-size:1.5rem; color:var(--primary-700); font-family:var(--font-heading);">
                ₹${summary.estimatedTotal}
              </strong>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <button class="btn btn-primary btn-lg" id="btn-final-confirm-order">
              ✓ Confirm Order & Lock Escrow
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-back-to-cart">
              ← Edit Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back-to-cart').addEventListener('click', () => {
    renderCartPage(container, 'cart');
  });

  container.querySelector('#btn-final-confirm-order').addEventListener('click', () => {
    store.createOrderFromCart();
  });
}

function attachCartListeners(container) {
  // Plus Button
  container.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartId = btn.getAttribute('data-cart-id');
      const item = store.getState().cart.find(c => c.id === cartId);
      if (item) {
        store.updateCartQuantity(cartId, item.quantityKg + 1);
        renderCartPage(container, 'cart');
      }
    });
  });

  // Minus Button
  container.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartId = btn.getAttribute('data-cart-id');
      const item = store.getState().cart.find(c => c.id === cartId);
      if (item && item.quantityKg > 1) {
        store.updateCartQuantity(cartId, item.quantityKg - 1);
        renderCartPage(container, 'cart');
      }
    });
  });

  // Remove Button
  container.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartId = btn.getAttribute('data-cart-id');
      store.removeFromCart(cartId);
      renderCartPage(container, 'cart');
    });
  });

  // Review Order Button
  const reviewBtn = container.querySelector('#btn-goto-order-review');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      renderCartPage(container, 'review');
    });
  }

  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      store.navigate(el.getAttribute('data-nav'));
    });
  });
}
