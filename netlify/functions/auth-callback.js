const { google } = require('googleapis');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const url = new URL(event.url);
  const provider = url.searchParams.get('provider');
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `OAuth error: ${error}` }),
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code not provided' }),
    };
  }

  try {
    let tokens;

    switch (provider) {
      case 'googleDrive':
      case 'googleSheets':
        tokens = await exchangeGoogleCode(code, provider);
        break;
      case 'twitter':
        tokens = await exchangeTwitterCode(code, provider);
        break;
      case 'linkedin':
        tokens = await exchangeLinkedInCode(code, provider);
        break;
      case 'facebook':
        tokens = await exchangeFacebookCode(code, provider);
        break;
      case 'instagram':
        tokens = await exchangeInstagramCode(code, provider);
        break;
      case 'tiktok':
        tokens = await exchangeTikTokCode(code, provider);
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unknown provider' }),
        };
    }

    // In production, you would store these tokens securely
    // For demo, we'll return them to be stored in localStorage
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        provider,
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date,
        },
        message: 'Authentication successful! You can now close this window.',
      }),
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function exchangeGoogleCode(code, provider) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

async function exchangeTwitterCode(code, provider) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: 'challenge', // In production, use PKCE
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Token exchange failed');
  }

  return response.json();
}

async function exchangeLinkedInCode(code, provider) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Token exchange failed');
  }

  return response.json();
}

async function exchangeFacebookCode(code, provider) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    client_secret: clientSecret,
    code,
  });

  const fullUrl = `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`;
  const tokenResponse = await fetch(fullUrl);

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    throw new Error(error.error?.message || 'Token exchange failed');
  }

  return tokenResponse.json();
}

async function exchangeInstagramCode(code, provider) {
  // Instagram uses Facebook's API
  return exchangeFacebookCode(code, provider);
}

async function exchangeTikTokCode(code, provider) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  const response = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Token exchange failed');
  }

  const data = await response.json();
  return {
    access_token: data.data.access_token,
    expires_in: data.data.expires_in,
    open_id: data.data.open_id,
  };
}
