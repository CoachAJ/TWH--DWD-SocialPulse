const { GoogleGenerativeAI } = require('@google/generative-ai');

// Dr. Wallach & Ben Fuchs Philosophy Context
const philosophyContext = {
  corePrinciples: [
    "The human body requires 90 essential nutrients daily for optimal health",
    "Most chronic diseases are caused by nutritional deficiencies, not genetics",
    "The body has an innate ability to heal itself when given proper nutrition",
    "Supplementation is necessary because food alone cannot provide all nutrients"
  ],
  keyInsights: {
    "bone": "Calcium alone is not enough - requires 60 minerals plus vitamins D, C, and K",
    "heart": "Heart disease is often linked to copper and selenium deficiencies",
    "diabetes": "Type 2 diabetes is linked to chromium and vanadium deficiencies",
    "joint": "Joint issues often stem from mineral deficiencies, particularly sulfur",
    "brain": "The brain requires essential fatty acids and B vitamins",
    "energy": "Fatigue often indicates B vitamin and mineral deficiencies",
    "immune": "Zinc, selenium, vitamin C, and vitamin D are crucial for immunity",
    "skin": "Skin issues reflect internal nutritional deficiencies",
    "digest": "Gut health requires probiotics, enzymes, and proper minerals",
    "weight": "Cravings often indicate mineral deficiencies"
  },
  quotes: [
    "We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency",
    "Every disease can be traced back to a mineral deficiency",
    "Give the body what it needs, and it will heal itself",
    "The body is a self-healing organism when given the right raw materials"
  ]
};

// Platform character limits
const platformLimits = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200,
  reddit: 40000
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { topic, tone, platforms, callToAction, usePhilosophy } = JSON.parse(event.body);

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return sample content for demo purposes
      return generateSampleContent(topic, tone, platforms, callToAction, usePhilosophy);
    }

    // Build philosophy context if enabled
    let philosophyPrompt = '';
    if (usePhilosophy) {
      const topicLower = topic.toLowerCase();
      let relevantInsight = '';
      for (const [key, insight] of Object.entries(philosophyContext.keyInsights)) {
        if (topicLower.includes(key)) {
          relevantInsight = insight;
          break;
        }
      }
      const randomQuote = philosophyContext.quotes[Math.floor(Math.random() * philosophyContext.quotes.length)];
      
      philosophyPrompt = `
PHILOSOPHY CONTEXT (Dr. Joel Wallach & Pharmacist Ben Fuchs):
- Core Belief: ${philosophyContext.corePrinciples[0]}
- Key Principle: ${philosophyContext.corePrinciples[1]}
${relevantInsight ? `- Relevant Insight: ${relevantInsight}` : ''}
- Quotable: "${randomQuote}"

Incorporate this nutritional health philosophy naturally into the content. Focus on empowerment, natural solutions, and the body's ability to heal with proper nutrition.
`;
    }

    // Build CTA section
    const ctaPrompt = callToAction ? `
CALL TO ACTION: Include this call to action naturally at the end: "${callToAction}"
` : '';

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create prompt for social media content generation
    const prompt = `You are an expert social media content creator specializing in health and wellness content. Create engaging, platform-specific content based on the following:

TOPIC: ${topic}
TONE: ${tone}
PLATFORMS: ${platforms.join(', ')}
${philosophyPrompt}${ctaPrompt}
STRICT CHARACTER LIMITS (must be followed exactly):
- Twitter: MAXIMUM ${platformLimits.twitter} characters (this is critical!)
- LinkedIn: MAXIMUM ${platformLimits.linkedin} characters
- Facebook: MAXIMUM ${platformLimits.facebook} characters
- Instagram: MAXIMUM ${platformLimits.instagram} characters
- TikTok: MAXIMUM ${platformLimits.tiktok} characters
- Reddit: MAXIMUM ${platformLimits.reddit} characters

Requirements:
- Create content specifically tailored for each platform
- STRICTLY enforce character limits - count characters carefully
- Twitter: Max 280 characters total including hashtags, engaging hook
- LinkedIn: Professional tone, include insights or questions for engagement
- Facebook: Community-focused, conversational
- Instagram: Visual description suggestion, engaging caption, hashtag block
- TikTok: Trend-aware, casual, younger audience
- Reddit: Informative, discussion-focused, subreddit-appropriate tone

For each requested platform, provide:
1. The post text (within character limit)
2. A brief note about expected engagement style

Format your response as a JSON object with this structure:
{
  "topic": "${topic}",
  "tone": "${tone}",
  "content": {
    "twitter": {
      "text": "post content here (max 280 chars)",
      "engagement": "brief engagement note"
    },
    "linkedin": { ... },
    "facebook": { ... },
    "instagram": { ... },
    "tiktok": { ... },
    "reddit": { ... }
  }
}

Only include platforms that were requested. Return valid JSON only, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.parse(jsonString)),
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return generateSampleContent(
      JSON.parse(event.body?.topic || 'Demo Topic'),
      JSON.parse(event.body?.tone || 'professional'),
      JSON.parse(event.body?.platforms || ['twitter'])
    );
  }
};

function generateSampleContent(topic, tone, platforms, callToAction = '', usePhilosophy = false) {
  const sampleContent = {
    topic,
    tone,
    content: {}
  };

  // Helper to truncate text to a specific limit
  const truncate = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + '...';
  };

  // Short topic for Twitter (max 25 chars to leave room)
  const shortTopic = topic.length > 25 ? topic.substring(0, 22) + '...' : topic;
  
  const cta = callToAction ? `\n\n${callToAction}` : '';
  
  // Philosophy-infused content variations
  const philosophyInsight = usePhilosophy
    ? "The body has an innate ability to heal when given proper nutrition. "
    : "";

  if (platforms.includes('twitter')) {
    // Twitter: STRICT 280 character limit - build carefully
    let twitterText;
    if (usePhilosophy) {
      twitterText = `${shortTopic}: 90 nutrients daily = better health. #90ForLife #Nutrition`;
    } else {
      twitterText = `${shortTopic}: What most miss 👇 #health #wellness`;
    }
    
    // Only add CTA if it fits
    if (callToAction && twitterText.length + callToAction.length + 2 <= 280) {
      twitterText += `\n\n${callToAction}`;
    }
    
    // Final safety truncation
    twitterText = truncate(twitterText, 280);
    
    sampleContent.content.twitter = {
      text: twitterText,
      engagement: 'High engagement expected with this hook format'
    };
  }

  if (platforms.includes('linkedin')) {
    const linkedinText = usePhilosophy
      ? `I've been studying ${topic} through the lens of nutritional science, and the findings align with what Dr. Joel Wallach has taught for decades.

Here's what the research shows:

🔑 The human body requires 90 essential nutrients daily
🔑 Most chronic conditions stem from nutritional deficiencies
🔑 The body has an incredible capacity to heal itself

${philosophyInsight}

As Pharmacist Ben Fuchs says: "The body is a self-healing organism when given the right raw materials."

What's your experience with nutritional approaches to health? 👇${cta}`
      : `I've been studying ${topic} and the findings are remarkable.

Here's what the data tells us:

🔑 Key Insight #1: Most people approach this incorrectly
🔑 Key Insight #2: The solution is simpler than you think
🔑 Key Insight #3: Early action leads to better outcomes

What's your experience with this? 👇${cta}`;
    
    sampleContent.content.linkedin = {
      text: linkedinText,
      engagement: 'Professional engagement with questions drives comments'
    };
  }

  if (platforms.includes('facebook')) {
    const facebookText = usePhilosophy
      ? `Hey community! 👋

I wanted to share something important about ${topic}.

Many of us have been told certain health challenges are "just genetic" or "part of aging." But here's what I've learned from Dr. Wallach and Pharmacist Ben Fuchs:

✨ Your body needs 90 essential nutrients every single day
✨ Most of us are deficient without knowing it
✨ The body wants to heal - we just need to give it the right tools

"We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency."

What are your thoughts? Have you explored nutritional approaches? Let's discuss below 👇${cta}`
      : `Hey community! 👋

I wanted to share something important about ${topic}.

Many of us have been told certain things are "just the way it is." But here's what I've learned:

The human body is remarkably resilient.

What are your thoughts? Let's discuss below 👇${cta}`;
    
    sampleContent.content.facebook = {
      text: facebookText,
      engagement: 'Community engagement expected with open questions'
    };
  }

  if (platforms.includes('instagram')) {
    const instagramText = usePhilosophy
      ? `✨ ${topic.charAt(0).toUpperCase() + topic.slice(1)} ✨

The truth about health that changes everything...

Your body needs 90 essential nutrients DAILY:
• 60 minerals
• 16 vitamins  
• 12 amino acids
• 2-3 essential fatty acids

"Give the body what it needs, and it will heal itself."

Your body WANTS to thrive. It just needs the right raw materials. 🌱${cta}

#90ForLife #DrWallach #NutritionalHealth #Wellness #HealthJourney #NaturalHealth #Minerals #Vitamins`
      : `✨ ${topic.charAt(0).toUpperCase() + topic.slice(1)} ✨

The truth that most people never hear...

Your body wants to heal. It wants to thrive.

Swipe for more ➡️${cta}

#HealthJourney #Wellness #NaturalHealth`;
    
    sampleContent.content.instagram = {
      text: instagramText,
      engagement: 'Visual content drives engagement on Instagram'
    };
  }

  if (platforms.includes('tiktok')) {
    const tiktokText = usePhilosophy
      ? `POV: You just learned about the 90 essential nutrients 🧠

Dr. Wallach has been saying this for 50+ years:

Your body needs 90 nutrients DAILY to function properly.

60 minerals. 16 vitamins. 12 amino acids. Essential fatty acids.

Most people are deficient and don't even know it.

That's why you feel tired. That's why things aren't working.

Give your body what it needs. Watch what happens. ✨${cta}`
      : `POV: You just learned the truth about ${topic} 🧠

Most people have been lied to about their health.

Your body is like a high-performance machine.

Full breakdown 👇${cta}`;
    
    sampleContent.content.tiktok = {
      text: tiktokText,
      engagement: 'Viral potential with trend-aware content'
    };
  }

  if (platforms.includes('reddit')) {
    const redditText = usePhilosophy
      ? `**${topic.charAt(0).toUpperCase() + topic.slice(1)}: A Nutritional Perspective (Dr. Wallach/Ben Fuchs Philosophy)**

I've been researching this topic through the lens of nutritional science, specifically the work of Dr. Joel Wallach and Pharmacist Ben Fuchs.

**Core Concept:**
The human body requires 90 essential nutrients daily - 60 minerals, 16 vitamins, 12 amino acids, and 2-3 essential fatty acids. Most chronic health issues can be traced back to nutritional deficiencies.

**Key Points:**
- Modern soil depletion means our food is less nutrient-dense than ever
- The body has an innate ability to heal when given proper nutrition
- Many conditions labeled as "genetic" may actually be nutritional deficiencies passed through generations

**Relevant Quote:**
"We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency." - Dr. Joel Wallach

What has been your experience with nutritional approaches? I'd love to hear different perspectives.

*Disclaimer: This is for educational discussion. Always consult with healthcare professionals for personalized advice.*${cta}`
      : `**${topic.charAt(0).toUpperCase() + topic.slice(1)}: What the research actually shows**

I've been diving deep into this topic and wanted to share some insights with the community.

**Key Points:**
- Most mainstream advice overlooks crucial factors
- The science supports a more nuanced approach
- Small changes can lead to significant improvements

What has been your experience? I'd love to hear different perspectives.

*Note: This is for discussion purposes. Always consult with professionals for personalized advice.*${cta}`;
    
    sampleContent.content.reddit = {
      text: redditText,
      engagement: 'Discussion-focused content works well on Reddit'
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sampleContent),
  };
}
