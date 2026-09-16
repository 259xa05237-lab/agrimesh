/**
 * AGRI MESH - Reactive State Store (Location Engine, Proximity Matching & Cart Management)
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

import { INITIAL_DATA } from '../data/initialData.js';
import { MathEngine } from '../data/mathEngine.js';

const STORAGE_KEY = 'agrimeesh_app_state_v4';

class AppStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
    this.initNetworkListeners();
    // Initialize distances based on default user location
    this.recalculateAllDistances();
  }

  initNetworkListeners() {
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
    });
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_DATA,
          ...parsed,
          userLocation: parsed.userLocation || INITIAL_DATA.userLocation,
          selectedDistanceFilter: parsed.selectedDistanceFilter || 'all',
          selectedSort: parsed.selectedSort || 'nearest',
          selectedProduceForInspection: null,
          cart: parsed.cart || INITIAL_DATA.cart || [],
          currentPage: parsed.currentPage || 'landing',
          theme: parsed.theme || 'light',
          isOnline: parsed.isOnline !== undefined ? parsed.isOnline : navigator.onLine,
          isSyncing: false,
          offlineQueue: parsed.offlineQueue || [],
          smsInbox: parsed.smsInbox || INITIAL_DATA.smsInbox,
          villageAgent: parsed.villageAgent || INITIAL_DATA.villageAgent,
          lastSyncedMarketTime: '2 hours ago',
          selectedOrderForTracking: parsed.orders?.[0] || INITIAL_DATA.orders[0]
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial data', e);
    }

    return {
      ...INITIAL_DATA,
      userLocation: INITIAL_DATA.userLocation,
      selectedDistanceFilter: 'all',
      selectedSort: 'nearest',
      selectedProduceForInspection: null,
      cart: INITIAL_DATA.cart || [],
      currentPage: 'landing',
      theme: 'light',
      isOnline: navigator.onLine,
      isSyncing: false,
      offlineQueue: [],
      smsInbox: INITIAL_DATA.smsInbox,
      villageAgent: INITIAL_DATA.villageAgent,
      lastSyncedMarketTime: '2 hours ago',
      selectedOrderForTracking: INITIAL_DATA.orders[0]
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentUser: this.state.currentUser,
        userLocation: this.state.userLocation,
        selectedDistanceFilter: this.state.selectedDistanceFilter,
        selectedSort: this.state.selectedSort,
        cart: this.state.cart,
        registeredBuyers: this.state.registeredBuyers,
        listings: this.state.listings,
        orders: this.state.orders,
        marketIntelligence: this.state.marketIntelligence,
        theme: this.state.theme,
        currentPage: this.state.currentPage,
        isOnline: this.state.isOnline,
        offlineQueue: this.state.offlineQueue,
        smsInbox: this.state.smsInbox,
        villageAgent: this.state.villageAgent
      }));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState() {
    return this.state;
  }

  // ==========================================
  // LOCATION & GEOSPATIAL PROXIMITY ENGINE
  // ==========================================

  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10; // 1 decimal place
  }

  recalculateAllDistances() {
    const userLat = this.state.userLocation.lat || 16.3067;
    const userLng = this.state.userLocation.lng || 80.4365;

    // Recalculate for all listings
    this.state.listings.forEach(item => {
      if (item.lat && item.lng) {
        item.distanceKm = this.calculateDistance(userLat, userLng, item.lat, item.lng);
      }
    });

    // Recalculate for nearby shops
    if (this.state.nearbyShops) {
      this.state.nearbyShops.forEach(shop => {
        if (shop.lat && shop.lng) {
          shop.distanceKm = this.calculateDistance(userLat, userLng, shop.lat, shop.lng);
        }
      });
    }
  }

  setUserLocation(cityName) {
    const preset = this.state.locationPresets.find(p => p.city.toLowerCase() === cityName.toLowerCase());
    if (preset) {
      this.state.userLocation = {
        name: preset.label,
        city: preset.city,
        state: preset.state,
        lat: preset.lat,
        lng: preset.lng,
        isDetected: false,
        permissionDenied: false
      };
      this.recalculateAllDistances();
      this.showToast('📍 Location Changed', `Marketplace centered to ${preset.label}`, 'success');
      this.notify();
    }
  }

  detectUserLocation() {
    if (!navigator.geolocation) {
      this.state.userLocation.permissionDenied = true;
      this.showToast('Location API Unavailable', 'Browser does not support geolocation. Please choose a city manually.', 'warning');
      this.notify();
      return;
    }

    this.showToast('📍 Requesting Location', 'Detecting nearby AgriMesh farming clusters...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;

        // Match to closest demo city preset or create localized regional label
        let closestPreset = this.state.locationPresets[0];
        let minDiff = 999999;

        this.state.locationPresets.forEach(preset => {
          const dist = this.calculateDistance(uLat, uLng, preset.lat, preset.lng);
          if (dist < minDiff) {
            minDiff = dist;
            closestPreset = preset;
          }
        });

        // Set readable location without exposing exact private domestic coordinates
        this.state.userLocation = {
          name: `${closestPreset.city}, ${closestPreset.state} (Nearby Region)`,
          city: closestPreset.city,
          state: closestPreset.state,
          lat: uLat,
          lng: uLng,
          isDetected: true,
          permissionDenied: false
        };

        this.recalculateAllDistances();
        this.showToast('📍 Location Detected', `Connected to nearest agricultural grid in ${closestPreset.city}`, 'success');
        this.notify();
      },
      (error) => {
        console.warn('Geolocation access denied or timed out:', error);
        this.state.userLocation.permissionDenied = true;
        this.showToast('Location Access Not Enabled', 'Showing default regional agricultural grid (Guntur). You can change location manually.', 'info');
        this.notify();
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }

  setDistanceFilter(distanceKm) {
    this.state.selectedDistanceFilter = distanceKm;
    this.notify();
  }

  setSortBy(sortKey) {
    this.state.selectedSort = sortKey;
    this.notify();
  }

  setSelectedProduceForInspection(produce) {
    this.state.selectedProduceForInspection = produce;
    this.notify();
  }

  closeProduceInspection() {
    this.state.selectedProduceForInspection = null;
    this.notify();
  }

  // ==========================================
  // CART OPERATIONS (Full Marketplace System)
  // ==========================================

  addToCart(listing, quantityKg = 1) {
    const qty = Math.max(1, Number(quantityKg) || 1);
    const existingIndex = this.state.cart.findIndex(item => item.listingId === listing.id);

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantityKg += qty;
    } else {
      this.state.cart.push({
        id: `cart-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        listingId: listing.id,
        crop: listing.crop,
        category: listing.category || 'vegetable',
        farmerId: listing.farmerId,
        farmerName: listing.farmerName,
        farmerLocation: listing.location,
        pricePerKg: listing.pricePerKg || listing.expectedPricePerKg,
        quantityKg: qty,
        grade: listing.grade,
        distanceKm: listing.distanceKm || 2.4,
        image: listing.image,
        backupImage: listing.backupImage
      });
    }

    this.showToast('✓ Added to Cart', `${qty} kg of ${listing.crop} added to your cart.`, 'success');
    this.notify();
  }

  updateCartQuantity(cartItemId, newQty) {
    const item = this.state.cart.find(c => c.id === cartItemId);
    if (item) {
      if (newQty <= 0) {
        this.removeFromCart(cartItemId);
        return;
      }
      item.quantityKg = Math.max(1, Number(newQty));
      this.notify();
    }
  }

  removeFromCart(cartItemId) {
    const item = this.state.cart.find(c => c.id === cartItemId);
    const cropName = item ? item.crop : 'Item';
    this.state.cart = this.state.cart.filter(c => c.id !== cartItemId);
    this.showToast('Item Removed', `${cropName} removed from cart.`, 'info');
    this.notify();
  }

  clearCart() {
    this.state.cart = [];
    this.notify();
  }

  getCartSummary() {
    const items = this.state.cart;
    const totalItems = items.length;
    const totalQuantityKg = items.reduce((sum, i) => sum + i.quantityKg, 0);
    const subtotal = items.reduce((sum, i) => sum + (i.pricePerKg * i.quantityKg), 0);

    // Distinct farmers
    const farmerMap = {};
    items.forEach(item => {
      farmerMap[item.farmerName] = farmerMap[item.farmerName] || [];
      farmerMap[item.farmerName].push(item);
    });
    const farmersCount = Object.keys(farmerMap).length;

    // Clustered logistics calculation
    const rawTransport = totalQuantityKg > 0 ? (20 + (totalQuantityKg * 1.5) + (farmersCount * 8)) : 0;
    const clusterSaving = farmersCount > 1 ? Math.round(rawTransport * 0.4) : 0;
    const netLogistics = Math.max(15, rawTransport - clusterSaving);
    const platformFee = Math.max(5, Math.round(subtotal * 0.015)); // 1.5%
    const estimatedTotal = subtotal + netLogistics + platformFee;

    return {
      totalItems,
      totalQuantityKg,
      subtotal: Math.round(subtotal),
      estimatedTransport: Math.round(rawTransport),
      clusterSaving: Math.round(clusterSaving),
      netLogistics: Math.round(netLogistics),
      platformFee,
      estimatedTotal: Math.round(estimatedTotal),
      farmersCount,
      farmerGroups: farmerMap
    };
  }

  // Order Creation from Shopping Cart
  createOrderFromCart() {
    if (this.state.cart.length === 0) return null;

    const summary = this.getCartSummary();
    const orderId = `AGM-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const itemsSummary = this.state.cart.map(i => ({
      crop: i.crop,
      farmerName: i.farmerName,
      farmerLocation: i.farmerLocation,
      quantityKg: i.quantityKg,
      pricePerKg: i.pricePerKg,
      subtotal: i.pricePerKg * i.quantityKg
    }));

    const cropSummaryText = this.state.cart.map(i => `${i.crop} (${i.quantityKg} kg)`).join(', ');

    const newOrder = {
      id: orderId,
      crop: cropSummaryText,
      items: itemsSummary,
      farmersCount: summary.farmersCount,
      totalQuantityKg: summary.totalQuantityKg,
      farmerId: this.state.cart[0].farmerId || 'farmer-01',
      farmerName: `${summary.farmersCount} Farmers (${Object.keys(summary.farmerGroups).join(', ')})`,
      farmerLocation: this.state.cart[0].farmerLocation,
      buyerId: 'buyer-01',
      buyerName: 'FreshMart Retail Pvt. Ltd.',
      buyerLocation: `${this.state.userLocation.city} Distribution Center`,
      subtotalAmount: summary.subtotal,
      transportCost: summary.estimatedTransport,
      clusterSaving: summary.clusterSaving,
      netLogistics: summary.netLogistics,
      platformFee: summary.platformFee,
      totalAmount: summary.estimatedTotal,
      grossPricePerKg: summary.subtotal / Math.max(1, summary.totalQuantityKg),
      transportCostPerKg: summary.netLogistics / Math.max(1, summary.totalQuantityKg),
      platformFeePerKg: summary.platformFee / Math.max(1, summary.totalQuantityKg),
      netRealizationPerKg: summary.subtotal / Math.max(1, summary.totalQuantityKg),
      totalNetFarmerPayout: summary.subtotal,
      status: 'Pending Confirmation',
      truckNumber: 'AP 07 TJ 8942 (Reefer Smart Fleet)',
      driverName: 'Balaram Naidu',
      driverPhone: '+91 94401 88320',
      currentLocation: `${this.state.userLocation.city} Cluster Hub Gate 1`,
      temperatureCelsius: 4.2,
      humidityPercent: 88,
      eta: 'Tomorrow, 04:00 PM',
      pickupTime: 'Tomorrow, 10:00 AM',
      route: `${this.state.userLocation.city} Cluster -> Shared Reefer Hub -> Buyer DC`,
      timeline: [
        { title: 'Multi-Item Order Created & Escrow Locked', time: 'Just Now', status: 'completed' },
        { title: 'Farmer Confirmation Pending', time: 'Awaiting Farmer Approval', status: 'in-progress' },
        { title: 'Clustered Cold-Chain Reefer Pickup', time: 'Tomorrow 10:00 AM', status: 'pending' },
        { title: 'Delivered at Buyer Central DC', time: 'Tomorrow 04:00 PM', status: 'pending' }
      ]
    };

    this.state.orders.unshift(newOrder);
    this.state.selectedOrderForTracking = newOrder;

    // Clear cart after successful checkout
    this.clearCart();

    // Add SMS confirmation
    this.addSmsMessage({
      sender: 'AGRIMESH',
      message: `AgriMesh: Order ${orderId} created for ${newOrder.totalQuantityKg} kg produce across ${summary.farmersCount} farmers. Estimated Total: ₹${newOrder.totalAmount}.`,
      type: 'order'
    });

    this.showToast('Order Confirmed!', `Multi-produce order ${orderId} placed successfully.`, 'success');
    this.navigate('order-confirmation', { selectedOrderForTracking: newOrder });
    return newOrder;
  }

  // Farmer Order Actions
  farmerAcceptOrder(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Confirmed';
      order.timeline[1].title = 'Farmer Confirmed ✓';
      order.timeline[1].status = 'completed';
      order.timeline[2].status = 'in-progress';
      this.showToast('Order Accepted', `Order ${orderId} confirmed. Reefer scheduled.`, 'success');
      this.notify();
    }
  }

  farmerRejectOrder(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Cancelled';
      this.showToast('Order Rejected', `Order ${orderId} has been rejected.`, 'info');
      this.notify();
    }
  }

  // ==========================================
  // NAVIGATION & THEME
  // ==========================================

  setOnlineStatus(online) {
    this.state.isOnline = online;
    if (online) {
      this.showToast('🟢 Connection Restored', 'Internet network available. Synchronizing offline queue...', 'success');
      this.syncOfflineQueue();
    } else {
      this.showToast('🔴 Offline Mode Active', 'Operating offline. All produce listings will be stored securely on device.', 'info');
      this.notify();
    }
  }

  toggleNetwork() {
    this.setOnlineStatus(!this.state.isOnline);
  }

  navigate(pageId, extraData = {}) {
    this.state.currentPage = pageId;
    if (extraData) {
      Object.assign(this.state, extraData);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.notify();
  }

  setRole(role) {
    this.state.currentUser.role = role;
    if (role === 'farmer') {
      this.state.currentUser.fullName = 'Ramesh Kumar';
    } else if (role === 'buyer') {
      this.state.currentUser.fullName = 'Anand Verma (FreshMart)';
    } else if (role === 'agent' || role === 'village-agent') {
      this.state.currentUser.role = 'agent';
      this.state.currentUser.fullName = 'Kondal Rao (Village Agent)';
    } else if (role === 'admin') {
      this.state.currentUser.fullName = 'Platform Administrator (AgriMesh)';
    }
    this.showToast('Role Switched', `Active role changed to ${role.toUpperCase()}`, 'info');
    this.notify();
  }

  addListing(newListingData) {
    const newId = `list-${Date.now().toString().slice(-4)}`;
    
    // Prepare photos & gallery
    const photos = Array.isArray(newListingData.photos) && newListingData.photos.length > 0
      ? newListingData.photos
      : (newListingData.image ? [newListingData.image] : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600']);

    const primaryImage = photos[0];
    const galleryLabels = ["Main Produce", "Close-Up View", "Quality Grade", "Packaging", "Farm Batch"];
    const gallery = photos.map((url, i) => ({
      label: galleryLabels[i] || `Photo ${i+1}`,
      url: url
    }));

    const listing = {
      id: newId,
      farmerId: this.state.currentUser.id,
      farmerName: newListingData.farmerName || this.state.currentUser.fullName,
      crop: newListingData.crop || 'Tomato',
      category: newListingData.category || (['Apple','Banana','Mango','Orange','Papaya','Pomegranate','Watermelon','Muskmelon','Guava','Grapes','Black Grapes','Green Grapes','Pineapple','Sapota / Chikoo','Sweet Lime','Lemon','Coconut','Jackfruit','Custard Apple','Strawberry','Dragon Fruit','Kiwi','Blueberry','Peach / Aadu','Fig / Anjeer','Dates / Khajoor','Lychee','Plum / Aloo Bukhara'].includes(newListingData.crop) ? 'fruit' : 'vegetable'),
      variety: newListingData.variety || 'Desi Hybrid',
      quantityKg: Number(newListingData.quantityKg) || 1000,
      pricePerKg: Number(newListingData.expectedPricePerKg) || 18.00,
      expectedPricePerKg: Number(newListingData.expectedPricePerKg) || 18.00,
      location: newListingData.location || this.state.userLocation.name,
      lat: this.state.userLocation.lat + (Math.random() * 0.04 - 0.02),
      lng: this.state.userLocation.lng + (Math.random() * 0.04 - 0.02),
      distanceKm: 2.5,
      grade: newListingData.grade || 'Grade A',
      freshnessPercent: newListingData.freshnessPercent || 96,
      shelfLifeDays: Number(newListingData.shelfLifeDays) || 5,
      harvestDate: newListingData.harvestDate || 'Today, Morning',
      status: this.state.isOnline ? 'Active - Available in Marketplace' : 'Waiting to Sync',
      isOfflinePending: !this.state.isOnline,
      isVerified: true,
      hasRealPhoto: Boolean(newListingData.hasRealPhoto),
      photos: photos,
      image: primaryImage,
      backupImage: photos[1] || primaryImage,
      gallery: gallery,
      createdAt: new Date().toISOString()
    };

    if (this.state.isOnline) {
      this.state.listings.unshift(listing);
      this.showToast('✓ Produce Live', `${listing.crop} (${listing.quantityKg} kg) is now live in the marketplace!`, 'success');
    } else {
      this.state.offlineQueue.push({
        id: `sync-${Date.now()}`,
        type: 'CREATE_LISTING',
        payload: listing,
        createdAt: new Date().toLocaleTimeString()
      });
      this.state.listings.unshift(listing);
      this.showToast('Saved Offline', `${listing.crop} — Waiting to Sync. Saved locally on device.`, 'info');
    }

    this.state.newlyPublishedListing = listing;
    this.notify();
    return listing;
  }

  syncOfflineQueue() {
    if (this.state.offlineQueue.length === 0) return;
    this.state.isSyncing = true;
    this.notify();

    setTimeout(() => {
      const count = this.state.offlineQueue.length;
      this.state.listings.forEach(l => {
        if (l.isOfflinePending) {
          l.isOfflinePending = false;
          l.status = '✓ Synced — Now Live';
        }
      });
      this.state.offlineQueue = [];
      this.state.isSyncing = false;
      this.state.lastSyncedMarketTime = 'Just Now';
      this.showToast('⚡ Sync Complete', `✓ Synced ${count} offline produce listings. Now Live!`, 'success');
      this.notify();
    }, 1200);
  }

  addVillageAgentFarmerListing(agentData) {
    const newId = `agnt-${Date.now().toString().slice(-4)}`;
    const listing = {
      id: newId,
      farmerId: `assisted-${Date.now().toString().slice(-4)}`,
      farmerName: agentData.farmerName,
      farmerPhone: agentData.farmerPhone,
      assistedByAgent: this.state.villageAgent.name,
      crop: agentData.crop || 'Tomato',
      variety: agentData.variety || 'Desi Grade A',
      quantityKg: Number(agentData.quantityKg) || 500,
      pricePerKg: Number(agentData.expectedPricePerKg) || 18.00,
      expectedPricePerKg: Number(agentData.expectedPricePerKg) || 18.00,
      location: agentData.location || this.state.userLocation.name,
      lat: this.state.userLocation.lat + (Math.random() * 0.05 - 0.025),
      lng: this.state.userLocation.lng + (Math.random() * 0.05 - 0.025),
      distanceKm: 3.8,
      grade: agentData.grade || 'Grade A',
      freshnessPercent: 94,
      shelfLifeDays: 5,
      harvestDate: agentData.harvestDate || 'Today',
      status: 'Active - Assisted Farmer (No Smartphone)',
      isVerified: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date().toISOString()
    };

    this.state.listings.unshift(listing);
    this.state.villageAgent.farmersAssisted += 1;
    this.state.villageAgent.todayRequests += 1;

    this.addSmsMessage({
      sender: 'AGRIMESH',
      message: `AgriMesh: Village Agent ${this.state.villageAgent.name} created your ${listing.quantityKg} kg ${listing.crop} listing. You will receive SMS when buyer confirms.`,
      type: 'assisted'
    });

    this.showToast('Farmer Listing Created', `Assisted listing created for ${agentData.farmerName}. SMS dispatched!`, 'success');
    this.notify();
    return listing;
  }

  addSmsMessage(sms) {
    this.state.smsInbox.unshift({
      id: `sms-${Date.now().toString().slice(-4)}`,
      sender: sms.sender || 'AGRIMESH',
      time: 'Just Now',
      message: sms.message,
      type: sms.type || 'info'
    });
  }

  updateOrderStatus(orderId, status) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'In Transit') {
        order.currentLocation = `${this.state.userLocation.city} Bypass NH-16 (Speed 48 km/h)`;
        order.temperatureCelsius = 4.1;
      } else if (status === 'Arrived' || status === 'Delivered') {
        order.currentLocation = order.buyerLocation;
      }
      this.showToast('Telemetry Updated', `Order ${orderId} is now ${status}`, 'info');
      this.notify();
    }
  }

  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.state.cart = JSON.parse(JSON.stringify(INITIAL_DATA.cart || []));
    this.state.currentPage = 'landing';
    this.state.theme = 'light';
    this.state.isOnline = true;
    this.state.isSyncing = false;
    this.state.offlineQueue = [];
    this.state.selectedDistanceFilter = 'all';
    this.state.selectedSort = 'nearest';
    this.state.selectedProduceForInspection = null;
    this.recalculateAllDistances();
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.setAttribute('data-theme', 'light');
    this.showToast('Demo Data Reset', 'Loaded fresh marketplace scenario with populated cart', 'success');
    this.notify();
  }

  showToast(title, message, type = 'info') {
    const toastEvent = new CustomEvent('agrimeesh-toast', {
      detail: { title, message, type, id: Date.now() }
    });
    window.dispatchEvent(toastEvent);
  }
}

export const store = new AppStore();
