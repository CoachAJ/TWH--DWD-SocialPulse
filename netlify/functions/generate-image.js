const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, platform } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Demo mode: Image generation requires GEMINI_API_KEY',
          placeholder: true
        })
      };
    }

    // Initialize the new Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Enhanced prompt for health/wellness content
    const enhancedPrompt = `Create a professional, clean social media image. 
Style: Modern, health and wellness focused, vibrant but professional colors.
Theme: ${prompt}
Requirements: No text in image, suitable for health education content, inspiring and positive mood.`;

    // Use Gemini 3.0 Flash Image model (Nano Banana)
    const response = await ai.models.generateContent({
      model: 'gemini-3.0-flash-image',
      contents: enhancedPrompt,
      config: {
        responseModalities: ['Text', 'Image']
      }
    });

    // Extract image from response
    let imageData = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (imageData) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          image: `data:image/png;base64,${imageData}`,
          platform
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'No image generated',
          placeholder: true
        })
      };
    }

  } catch (error) {
    console.error('Error generating image:', error);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: error.message || 'Image generation failed',
        placeholder: true
      })
    };
  }
};
