/**
 * AGRI MESH - AI Matching & Optimization Mathematical Engine
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

export const MathEngine = {
  PLATFORM_FEE_RATE: 0.015, // alpha = 1.5%
  BASE_TRANSPORT_COST: 250, // C_base in INR
  DISTANCE_RATE_PER_KM: 6.0, // R_dist in INR/km
  COOLING_RATE_PER_KM: 2.5,  // R_cool in INR/km for reefer cold-chain
  CLUSTER_DISCOUNT_FACTOR: 0.42, // Up to 42-60% savings on shared cluster fleet

  /**
   * Formula 2: Logistics Cost Calculation
   * C_transport = C_base + d(f,b) * (R_dist + R_cool) * (1 - clusterDiscount)
   */
  calculateLogisticsCost(distanceKm, quantityKg, isColdChain = true, isClustered = true) {
    const baseCost = this.BASE_TRANSPORT_COST;
    const ratePerKm = isColdChain 
      ? (this.DISTANCE_RATE_PER_KM + this.COOLING_RATE_PER_KM) 
      : this.DISTANCE_RATE_PER_KM;
    
    let totalFreight = baseCost + (distanceKm * ratePerKm);
    
    if (isClustered) {
      totalFreight = totalFreight * (1 - this.CLUSTER_DISCOUNT_FACTOR);
    }
    
    // Convert to per kg cost for this batch
    const costPerKg = Math.max(0.60, totalFreight / Math.max(quantityKg, 1));
    return {
      totalTransportCost: Math.round(totalFreight),
      costPerKg: parseFloat(costPerKg.toFixed(2))
    };
  },

  /**
   * Formula 1: Net Realization Per Unit
   * P_net = P_b * (1 - alpha) - (C_transport / Q_match)
   */
  calculateNetRealization(buyerGrossPrice, transportCostPerKg, alpha = 0.015) {
    const platformFeePerKg = buyerGrossPrice * alpha;
    const netPerKg = buyerGrossPrice - platformFeePerKg - transportCostPerKg;
    return {
      grossPrice: buyerGrossPrice,
      platformFeePerKg: parseFloat(platformFeePerKg.toFixed(2)),
      transportCostPerKg: parseFloat(transportCostPerKg.toFixed(2)),
      netRealizationPerKg: parseFloat(netPerKg.toFixed(2))
    };
  },

  /**
   * Formula 4: Ranking Score
   * Evaluates: 40% Net Realization, 20% Distance, 15% Quality Match, 15% Buyer Reliability, 10% Shelf Life
   */
  calculateMatchScore(params) {
    const {
      netRealization,
      benchmarkPrice = 18.0,
      distanceKm,
      buyerReliability = 98.0,
      shelfLifeDays = 5,
      transitHours = 4,
      qualityMatchScore = 95
    } = params;

    // 1. Net Realization Sub-score (40% weight)
    // Normalized against benchmark mandi price
    const netRatio = Math.min(1.3, Math.max(0.6, netRealization / benchmarkPrice));
    const netScore = (netRatio / 1.3) * 100 * 0.40;

    // 2. Distance Proximity Sub-score (20% weight) - shorter distance = higher score
    const distFactor = Math.max(0, 1 - (distanceKm / 400));
    const distanceScore = distFactor * 100 * 0.20;

    // 3. Quality & Grade Match Sub-score (15% weight)
    const qualityScore = (qualityMatchScore / 100) * 100 * 0.15;

    // 4. Buyer Reliability Sub-score (15% weight)
    const reliabilityScore = (buyerReliability / 100) * 100 * 0.15;

    // 5. Freshness / Shelf-life decay tolerance (10% weight)
    // (1 - t_transit / S_rem)^gamma
    const shelfLifeHours = shelfLifeDays * 24;
    const freshnessRemaining = Math.max(0, 1 - (transitHours / shelfLifeHours));
    const freshnessScore = Math.pow(freshnessRemaining, 1.2) * 100 * 0.10;

    const totalScore = Math.min(99.4, Math.round(netScore + distanceScore + qualityScore + reliabilityScore + freshnessScore));
    return totalScore;
  },

  /**
   * Evaluates all registered buyers against a farmer's produce listing
   */
  rankBuyersForProduce(listing, registeredBuyers) {
    const cropName = listing.crop || "Tomato";
    const benchmarkPrice = listing.expectedPricePerKg || 18.0;

    const ranked = registeredBuyers.map(buyer => {
      const grossPrice = buyer.offeredGrossPricePerKg[cropName] || (benchmarkPrice * 1.02);
      const logistics = this.calculateLogisticsCost(buyer.distanceKm, listing.quantityKg, true, true);
      const netCalc = this.calculateNetRealization(grossPrice, logistics.costPerKg, this.PLATFORM_FEE_RATE);
      
      const transitHours = Math.round((buyer.distanceKm / 40) + 1); // 40km/h average rural road speed + 1hr loading
      const score = this.calculateMatchScore({
        netRealization: netCalc.netRealizationPerKg,
        benchmarkPrice,
        distanceKm: buyer.distanceKm,
        buyerReliability: buyer.reliabilityRating,
        shelfLifeDays: listing.shelfLifeDays || 5,
        transitHours,
        qualityMatchScore: 96
      });

      return {
        buyerId: buyer.id,
        companyName: buyer.companyName,
        type: buyer.type,
        location: buyer.location,
        distanceKm: buyer.distanceKm,
        grossPricePerKg: grossPrice,
        logisticsCostPerKg: logistics.costPerKg,
        platformFeePerKg: netCalc.platformFeePerKg,
        netRealizationPerKg: netCalc.netRealizationPerKg,
        totalNetPayout: Math.round(netCalc.netRealizationPerKg * listing.quantityKg),
        reliabilityRating: buyer.reliabilityRating,
        paymentTerms: buyer.paymentTerms,
        transitHours,
        matchScore: score,
        isBestMatch: false
      };
    });

    // Sort descending by Net Realization first, then matchScore
    ranked.sort((a, b) => b.netRealizationPerKg - a.netRealizationPerKg);
    if (ranked.length > 0) {
      ranked[0].isBestMatch = true;
    }

    return ranked;
  }
};
