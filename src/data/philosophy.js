// Dr. Joel Wallach & Pharmacist Ben Fuchs Philosophy Context
// Used to inform AI content generation with their health philosophy

export const wallachFuchsPhilosophy = {
  corePrinciples: [
    "The human body requires 90 essential nutrients daily for optimal health",
    "There are 60 minerals, 16 vitamins, 12 amino acids, and 2-3 essential fatty acids required",
    "Most chronic diseases are caused by nutritional deficiencies, not genetics",
    "The body has an innate ability to heal itself when given proper nutrition",
    "Medical doctors receive minimal nutrition training in medical school",
    "Pharmaceutical drugs often treat symptoms, not root causes",
    "Soil depletion has led to mineral-deficient foods",
    "Supplementation is necessary because food alone cannot provide all nutrients",
    "Prevention through nutrition is more effective than treating disease",
    "Colloidal minerals are more bioavailable than metallic minerals"
  ],
  
  keyConditions: {
    "bone health": "Calcium alone is not enough - requires 60 minerals plus vitamins D, C, and K for proper absorption and bone matrix formation",
    "heart health": "Heart disease is often linked to copper and selenium deficiencies. The heart is a muscle that requires proper mineral nutrition",
    "diabetes": "Type 2 diabetes is linked to chromium and vanadium deficiencies. These minerals help regulate blood sugar",
    "joint health": "Arthritis and joint issues often stem from mineral deficiencies, particularly sulfur, glucosamine, and collagen precursors",
    "brain health": "The brain requires essential fatty acids (omega-3s), B vitamins, and minerals like zinc for optimal function",
    "energy": "Fatigue often indicates B vitamin and iron deficiencies, as well as inadequate mineral intake",
    "immune system": "Zinc, selenium, vitamin C, and vitamin D are crucial for immune function",
    "skin health": "Skin issues often reflect internal nutritional deficiencies, particularly zinc, essential fatty acids, and vitamin A",
    "digestive health": "Gut health requires probiotics, enzymes, and proper mineral balance",
    "weight management": "Cravings often indicate mineral deficiencies - the body seeks nutrients, not just calories"
  },
  
  quotableInsights: [
    "We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency",
    "The human body is designed to live 120-140 years with proper nutrition",
    "Every disease can be traced back to a mineral deficiency",
    "Your genes load the gun, but your lifestyle pulls the trigger",
    "The medical industry profits from sickness, not health",
    "Give the body what it needs, and it will heal itself",
    "You can't get all your nutrients from food anymore - the soil is depleted",
    "Prevention is worth a pound of cure",
    "The 90 essential nutrients are the foundation of health",
    "Dead doctors don't lie - the average doctor lives to 58"
  ],
  
  benFuchsInsights: [
    "The body is a self-healing organism when given the right raw materials",
    "Pharmacology treats symptoms; nutrition addresses root causes",
    "The skin is a reflection of internal health",
    "Blood sugar issues are often mineral deficiency issues",
    "The digestive system is the foundation of all health",
    "Essential fatty acids are critical for cell membrane health",
    "Inflammation is the body's response to deficiency or toxicity",
    "The liver is the body's chemical processing plant",
    "Hormonal balance requires proper nutritional support",
    "Stress depletes nutrients faster than normal"
  ],
  
  the90Essentials: {
    minerals: "60 minerals including calcium, magnesium, zinc, selenium, chromium, vanadium, copper, and rare earth minerals",
    vitamins: "16 vitamins including A, B-complex (all 8), C, D, E, and K",
    aminoAcids: "12 essential amino acids that the body cannot produce",
    essentialFattyAcids: "Omega-3 and Omega-6 fatty acids in proper ratio"
  },
  
  contentGuidelines: {
    tone: "Educational, empowering, solution-focused",
    avoid: ["Medical claims", "Diagnosing conditions", "Replacing medical advice"],
    include: ["Nutritional education", "Empowerment", "Natural solutions", "Prevention focus"],
    callToAction: "Encourage learning more, consulting with health professionals, and taking control of one's health"
  }
};

export const getPhilosophyContext = (topic) => {
  const topicLower = topic.toLowerCase();
  let relevantContext = [];
  
  // Add core principles
  relevantContext.push("Core Philosophy: " + wallachFuchsPhilosophy.corePrinciples.slice(0, 3).join(". "));
  
  // Find relevant condition-specific info
  for (const [condition, info] of Object.entries(wallachFuchsPhilosophy.keyConditions)) {
    if (topicLower.includes(condition) || condition.includes(topicLower)) {
      relevantContext.push(`Specific Insight: ${info}`);
    }
  }
  
  // Add a quotable insight
  const randomQuote = wallachFuchsPhilosophy.quotableInsights[
    Math.floor(Math.random() * wallachFuchsPhilosophy.quotableInsights.length)
  ];
  relevantContext.push(`Key Quote: "${randomQuote}"`);
  
  // Add Ben Fuchs insight
  const benInsight = wallachFuchsPhilosophy.benFuchsInsights[
    Math.floor(Math.random() * wallachFuchsPhilosophy.benFuchsInsights.length)
  ];
  relevantContext.push(`Pharmacist Ben Fuchs: "${benInsight}"`);
  
  return relevantContext.join("\n\n");
};

export default wallachFuchsPhilosophy;
