exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const url = new URL(event.url);
  const provider = url.searchParams.get('provider');

  if (!provider) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Provider is required' }),
    };
  }

  // Get base URL for redirect
  const baseUrl = process.env.URL || 'http://localhost:8888';
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback?provider=${provider}`;

  let authUrl;

  switch (provider) {
    case 'googleDrive':
    case 'googleSheets':
      authUrl = generateGoogleAuthUrl(redirectUri);
      break;
    case 'twitter':
      authUrl = generateTwitterAuthUrl(redirectUri);
      break;
    case 'linkedin':
      authUrl = generateLinkedInAuthUrl(redirectUri);
      break;
    case 'facebook':
      authUrl = generateFacebookAuthUrl(redirectUri);
      break;
    case 'instagram':
      authUrl = generateInstagramAuthUrl(redirectUri);
      break;
    case 'tiktok':
      authUrl = generateTikTokAuthUrl(redirectUri);
      break;
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unknown provider' }),
      };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ authUrl }),
  };
};

function generateGoogleAuthUrl(redirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function generateTwitterAuthUrl(redirectUri) {
  const clientId = process.env.TWITTER_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'tweet.read tweet.write users.read offline.access',
    state: generateState(),
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

function generateLinkedInAuthUrl(redirectUri) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'r_liteprofile w_member_social',
    state: generateState(),
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

function generateFacebookAuthUrl(redirectUri) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'pages_manage_posts,pages_read_engagement,publish_to_groups,public_profile',
    state: generateState(),
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
}

function generateInstagramAuthUrl(redirectUri) {
  // Instagram uses Facebook's OAuth since it's owned by Meta
  const clientId = process.env.FACEBOOK_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_basic,instagram_content_publish,pages_show_list',
    state: generateState(),
  });

  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

function generateTikTokAuthUrl(redirectUri) {
  const clientId = process.env.TIKTOK_CLIENT_ID;

  const params = new URLSearchParams({
    client_key: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user.info.basic,video.list',
    state: generateState(),
  });

  return `https://www.tiktok.com/auth/authorize/?${params.toString()}`;
}

function generateState() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
