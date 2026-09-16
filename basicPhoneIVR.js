/**
 * AGRI MESH - Basic Phone Access (Interactive IVR Voice Simulator & SMS Notification Center)
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { store } from '../state/store.js';

export function renderBasicPhoneAccess(container) {
  const state = store.getState();
  
  // Local IVR State
  let ivrStep = 'lang'; // 'lang' | 'menu' | 'crop' | 'qty' | 'price' | 'confirm' | 'prices_view' | 'orders_view'
  let selectedLang = 'Telugu';
  let ivrCrop = 'Tomato';
  let ivrQty = 500;
  let ivrPrice = 18;
  let ivrLocation = 'Guntur';

  function renderInner() {
    container.innerHTML = `
      <div class="container section-py" style="padding-top:2rem;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div>
            <div class="badge badge-gold" style="font-size:0.8rem; margin-bottom:0.4rem;">NO SMARTPHONE REQUIRED</div>
            <h2 style="font-size:2rem;">Basic Phone Access — IVR (Toll-Free) & SMS System</h2>
            <p style="font-size:0.95rem; color:var(--text-muted);">
              For smallholder farmers with standard 2G feature phones (Nokia/JioBharat). Interactive Voice Response + automated SMS dispatch.
            </p>
          </div>

          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-sm btn-accent" id="btn-run-ivr-demo-flow">
              ⚡ 1-Click Basic Phone Demo
            </button>
          </div>
        </div>

        <div class="grid grid-2" style="align-items:start; gap:2rem;">
          <!-- Left Column: Interactive Nokia / Jio Feature Phone Mockup -->
          <div class="card" style="background:linear-gradient(135deg, #111827 0%, #1f2937 100%); color:#ffffff; border-radius:var(--radius-xl); padding:2rem; box-shadow:var(--shadow-lg); border:4px solid #374151;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:0.75rem;">
              <div style="font-weight:800; font-size:0.9rem; color:#9ca3af; letter-spacing:0.05em;">
                📞 1800-AGRI-MESH (TOLL FREE)
              </div>
              <span class="badge badge-success" style="font-size:0.7rem;">2G GSM ACTIVE</span>
            </div>

            <!-- Monochrome Green LCD Screen -->
            <div style="background:#0f3822; border:3px solid #134e32; border-radius:var(--radius-md); padding:1.25rem; font-family:var(--font-mono); color:#a7f3d0; min-height:220px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:inset 0 0 15px rgba(0,0,0,0.6); margin-bottom:1.5rem;">
              ${renderLCDScreen(ivrStep, selectedLang, ivrCrop, ivrQty, ivrPrice, ivrLocation, state)}
            </div>

            <!-- Interactive Keypad Buttons -->
            <div style="background:rgba(0,0,0,0.3); border-radius:var(--radius-lg); padding:1.25rem;">
              <div style="text-align:center; font-size:0.75rem; color:#9ca3af; margin-bottom:0.75rem; font-weight:700;">
                CLICK KEYPAD TO INTERACT WITH IVR
              </div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.6rem;">
                <button class="btn btn-secondary btn-keypad" data-key="1" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">1</button>
                <button class="btn btn-secondary btn-keypad" data-key="2" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">2</button>
                <button class="btn btn-secondary btn-keypad" data-key="3" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">3</button>
                <button class="btn btn-secondary btn-keypad" data-key="4" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">4</button>
                <button class="btn btn-secondary btn-keypad" data-key="5" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">5</button>
                <button class="btn btn-secondary btn-keypad" data-key="6" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">6</button>
                <button class="btn btn-secondary btn-keypad" data-key="*" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">* (Back)</button>
                <button class="btn btn-secondary btn-keypad" data-key="0" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;">0</button>
                <button class="btn btn-secondary btn-keypad" data-key="#" style="background:#374151; color:#ffffff; border-color:#4b5563; font-weight:900;"># (OK)</button>
              </div>

              <div style="margin-top:1rem; display:flex; justify-content:space-between; gap:0.5rem;">
                <button class="btn btn-sm btn-ghost" id="btn-ivr-restart" style="color:#f87171; font-size:0.78rem;">
                  🔴 Hang Up & Restart
                </button>
                <button class="btn btn-sm btn-accent" id="btn-ivr-complete-action" style="font-size:0.78rem;">
                  ⚡ Auto-Confirm Listing
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Simulated SMS Notification Center -->
          <div>
            <div class="card" style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:1.4rem;">💬</span>
                  <div>
                    <h3 style="font-size:1.25rem;">Farmer's SMS Inbox</h3>
                    <div style="font-size:0.8rem; color:var(--text-muted);">Real-time text updates sent to 2G handset</div>
                  </div>
                </div>
                <span class="badge badge-info">${state.smsInbox.length} Messages</span>
              </div>

              <!-- SMS Messages List -->
              <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:380px; overflow-y:auto;">
                ${state.smsInbox.map(sms => `
                  <div style="background:var(--bg-subtle); border-left:4px solid var(--primary-500); border-radius:var(--radius-md); padding:0.9rem 1.1rem; box-shadow:var(--shadow-xs);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; font-size:0.78rem;">
                      <strong style="color:var(--primary-700);">${sms.sender}</strong>
                      <span style="color:var(--text-muted);">${sms.time}</span>
                    </div>
                    <div style="font-size:0.88rem; color:var(--text-main); line-height:1.5; font-family:var(--font-mono);">
                      ${sms.message}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Explanation Card -->
            <div class="card" style="background:var(--primary-50); border:1px solid var(--primary-200);">
              <div style="font-weight:800; color:var(--primary-900); margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
                <span>💡</span> How IVR + SMS Bridges the Digital Divide
              </div>
              <p style="font-size:0.85rem; color:var(--primary-800); line-height:1.6;">
                Farmers without smartphones dial <strong>1800-AGRI-MESH</strong> in their mother tongue (Telugu/Hindi/English). They choose their crop and quantity using phone numbers. AgriMesh cloud AI matches buyers, allocates cluster transport, and delivers updates via instant SMS.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    attachIVRListeners();
  }

  function renderLCDScreen(step, lang, crop, qty, price, loc, state) {
    if (step === 'lang') {
      return `
        <div>
          <div style="text-align:center; font-weight:bold; border-bottom:1px dashed #34d399; padding-bottom:4px; margin-bottom:8px;">
            AGRIMESH IVR (నమస్కారం)
          </div>
          <div>Select Language:</div>
          <div>[1] తెలుగు (Telugu)</div>
          <div>[2] हिन्दी (Hindi)</div>
          <div>[3] English</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press 1, 2, or 3</div>
      `;
    } else if (step === 'menu') {
      return `
        <div>
          <div style="font-weight:bold; border-bottom:1px dashed #34d399; padding-bottom:4px; margin-bottom:6px;">
            AGRIMESH [${lang.toUpperCase()}]
          </div>
          <div>[1] Sell Produce (అమ్మకం)</div>
          <div>[2] APMC Mandi Prices</div>
          <div>[3] Check Buyer Matches</div>
          <div>[4] My Active Orders</div>
          <div>[5] Delivery Status</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press [1-5] | [*] Back</div>
      `;
    } else if (step === 'crop') {
      return `
        <div>
          <div style="font-weight:bold; margin-bottom:6px;">SELECT CROP TO SELL:</div>
          <div>[1] Tomato (టమాటా)</div>
          <div>[2] Onion (ఉల్లిపాయ)</div>
          <div>[3] Potato (ఆలూ)</div>
          <div>[4] Guntur Chilli (మిర్చి)</div>
          <div>[5] Other Vegetable</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press 1-5</div>
      `;
    } else if (step === 'qty') {
      return `
        <div>
          <div style="font-weight:bold; margin-bottom:6px;">ENTER QUANTITY FOR ${crop.toUpperCase()}:</div>
          <div>[1] 500 Kilograms</div>
          <div>[2] 1,000 Kilograms</div>
          <div>[3] 2,000 Kilograms</div>
          <div>[4] Custom Quantity</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press 1, 2 or 3</div>
      `;
    } else if (step === 'price') {
      return `
        <div>
          <div style="font-weight:bold; margin-bottom:6px;">EXPECTED RESERVE PRICE:</div>
          <div>Selected: ${qty} kg ${crop} in ${loc}</div>
          <div>[1] ₹18.00 / kg (Recommended)</div>
          <div>[2] ₹19.00 / kg</div>
          <div>[3] Current Mandi Spot Rate</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press 1, 2 or [#] OK</div>
      `;
    } else if (step === 'confirm') {
      return `
        <div>
          <div style="font-weight:bold; color:#6ee7b7; border-bottom:1px dashed #34d399; padding-bottom:4px; margin-bottom:6px;">
            ✓ LISTING CREATED SUCCESSFULLY
          </div>
          <div>Crop: ${crop} (${qty} kg)</div>
          <div>Location: ${loc}</div>
          <div>Price: ₹${price}/kg</div>
          <div style="margin-top:4px; font-size:0.75rem; color:#fef08a;">
            SMS sent! AI matching buyers.
          </div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press [*] Main Menu</div>
      `;
    } else if (step === 'prices_view') {
      return `
        <div>
          <div style="font-weight:bold; border-bottom:1px dashed #34d399; padding-bottom:4px; margin-bottom:6px;">
            TODAY APMC SPOT RATES:
          </div>
          <div>Tomato: ₹18.50/kg (+8%)</div>
          <div>Onion: ₹15.20/kg</div>
          <div>Guntur Chilli: ₹185.00/kg</div>
          <div>Potato: ₹13.80/kg</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press [*] Main Menu</div>
      `;
    } else if (step === 'orders_view') {
      const o = state.orders[0];
      return `
        <div>
          <div style="font-weight:bold; border-bottom:1px dashed #34d399; padding-bottom:4px; margin-bottom:6px;">
            ACTIVE ORDER STATUS:
          </div>
          <div>Order: #${o.id}</div>
          <div>Status: ${o.status}</div>
          <div>Reefer Temp: 4.2°C</div>
          <div>Payout: ₹${o.totalNetFarmerPayout.toLocaleString('en-IN')}</div>
        </div>
        <div style="font-size:0.75rem; text-align:right; opacity:0.8;">Press [*] Main Menu</div>
      `;
    }
  }

  function handleKey(key) {
    if (key === '*') {
      ivrStep = 'menu';
      renderInner();
      return;
    }

    if (ivrStep === 'lang') {
      if (key === '1') selectedLang = 'Telugu';
      else if (key === '2') selectedLang = 'Hindi';
      else selectedLang = 'English';
      ivrStep = 'menu';
    } else if (ivrStep === 'menu') {
      if (key === '1') ivrStep = 'crop';
      else if (key === '2') ivrStep = 'prices_view';
      else if (key === '3') ivrStep = 'crop';
      else if (key === '4' || key === '5') ivrStep = 'orders_view';
    } else if (ivrStep === 'crop') {
      if (key === '1') ivrCrop = 'Tomato';
      else if (key === '2') ivrCrop = 'Onion';
      else if (key === '3') ivrCrop = 'Potato';
      else if (key === '4') ivrCrop = 'Guntur Chilli';
      else ivrCrop = 'Brinjal';
      ivrStep = 'qty';
    } else if (ivrStep === 'qty') {
      if (key === '1') ivrQty = 500;
      else if (key === '2') ivrQty = 1000;
      else if (key === '3') ivrQty = 2000;
      else ivrQty = 750;
      ivrStep = 'price';
    } else if (ivrStep === 'price' || key === '#') {
      ivrStep = 'confirm';
      // Create listing in store
      store.addListing({
        crop: ivrCrop,
        quantityKg: ivrQty,
        expectedPricePerKg: ivrPrice,
        location: 'Guntur, Andhra Pradesh',
        grade: 'Grade A',
        shelfLifeDays: 5
      });
    }

    renderInner();
  }

  function attachIVRListeners() {
    container.querySelectorAll('.btn-keypad').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        handleKey(key);
      });
    });

    const restartBtn = container.querySelector('#btn-ivr-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        ivrStep = 'lang';
        renderInner();
      });
    }

    const completeBtn = container.querySelector('#btn-ivr-complete-action');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        ivrStep = 'confirm';
        store.addListing({
          crop: 'Tomato',
          quantityKg: 500,
          expectedPricePerKg: 18.00,
          location: 'Guntur, Andhra Pradesh',
          grade: 'Grade A'
        });
        renderInner();
      });
    }

    const demoFlowBtn = container.querySelector('#btn-run-demo-ivr-flow');
    if (demoFlowBtn) {
      demoFlowBtn.addEventListener('click', () => {
        ivrStep = 'lang';
        renderInner();
        setTimeout(() => handleKey('1'), 600); // Telugu
        setTimeout(() => handleKey('1'), 1200); // Sell Produce
        setTimeout(() => handleKey('1'), 1800); // Tomato
        setTimeout(() => handleKey('1'), 2400); // 500 kg
        setTimeout(() => handleKey('1'), 3000); // ₹18/kg
      });
    }
  }

  renderInner();
}
