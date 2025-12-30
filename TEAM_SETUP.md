# SocialPulse AI Agent - Team Setup Guide

A simplified guide for your team to get started with SocialPulse.

## Quick Start (15 minutes)

### Step 1: Deploy to Netlify

1. Push this code to a GitHub repository
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Add ONE environment variable:
   - `GEMINI_API_KEY` = Your Google Gemini API key
   - Get it from: https://aistudio.google.com/app/apikey
6. Click "Deploy"

That's it! Your app is live.

---

## Step 2: Team Member Setup

Each team member needs to:

### 1. Open the App
Navigate to your Netlify URL (e.g., `https://your-app.netlify.app`)

### 2. Go to Settings → API Tokens
Enter your personal API tokens for each platform you want to use.

### 3. Platform Token Setup

#### Twitter/X (Free Tier - 1,500 posts/month)
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new project/app (or use existing)
3. Generate a **Bearer Token**
4. Paste it in Settings → API Tokens → Twitter

#### LinkedIn
1. Go to https://www.linkedin.com/developers/
2. Create an app
3. Get your Access Token
4. Paste it in Settings → API Tokens → LinkedIn

#### Facebook
1. Go to https://developers.facebook.com/tools/explorer
2. Select your app and page
3. Generate a **Page Access Token**
4. Paste it in Settings → API Tokens → Facebook

#### Instagram
1. Requires a Facebook Page linked to Instagram Business account
2. Use the same process as Facebook
3. Get an Instagram-scoped token from Graph API Explorer

#### TikTok
1. Go to https://developers.tiktok.com/
2. Create an app and get approved
3. Generate Access Token
4. Paste it in Settings → API Tokens → TikTok

#### Reddit
1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app..."
3. Select **"script"** type (for personal use)
4. Fill in:
   - Name: SocialPulse
   - Redirect URI: http://localhost
5. Copy the **Client ID** (under the app name)
6. Copy the **Client Secret**
7. Enter your Reddit username and password
8. Paste all in Settings → API Tokens → Reddit

---

## Step 3: Google Drive Setup (Optional)

Each team member can connect their own Google Drive:

1. Go to Settings → Google Drive
2. Enter your Google Drive API token
3. Content will be saved to a "SocialPulse" folder in your Drive

---

## How to Use

### Generate Content
1. Go to **Content Generator**
2. Paste your news story or topic
3. Select tone (Professional, Casual, Witty, etc.)
4. Choose platforms (Twitter, LinkedIn, Facebook, Instagram, TikTok, Reddit)
5. Click **Generate Content**
6. Edit as needed
7. Copy to clipboard or save for later

### Schedule Posts
1. Save a generated post
2. Click the calendar icon
3. Select date and time
4. Confirm scheduling

### Sync to Google Drive
1. Click the save icon on any post
2. Content is saved to your personal Google Drive

---

## Platform Limits & Costs

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Twitter/X** | 1,500 posts/month | Write-only (no reading) |
| **LinkedIn** | Unlimited | Free for personal posting |
| **Facebook** | Unlimited | Requires Facebook Page |
| **Instagram** | Unlimited | Requires Business account |
| **TikTok** | Varies | Requires app approval |
| **Reddit** | Unlimited | Rate limited (10 posts/min) |

---

## Security Notes

- **Tokens are stored locally** in each user's browser
- Tokens are **never sent to our servers**
- Each team member manages their own credentials
- Clear your browser data to remove tokens

---

## Troubleshooting

### Content Not Generating
- Check that `GEMINI_API_KEY` is set in Netlify environment variables
- Verify the API key is valid at https://aistudio.google.com

### Can't Post to Platform
- Verify your token is correct in Settings → API Tokens
- Check that your token hasn't expired
- Ensure you have the right permissions

### Posts Not Scheduling
- Check that the scheduled time is in the future
- Verify the scheduler function is enabled in Netlify

---

## Support

For issues:
1. Check browser console for errors (F12 → Console)
2. Verify API tokens are saved correctly
3. Test with a simple post first

---

## File Structure

```
socialpulse-agent/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Overview and stats
│   │   ├── ContentGenerator.jsx # AI content creation
│   │   ├── CalendarView.jsx   # Scheduling calendar
│   │   ├── Integrations.jsx   # Platform connections
│   │   └── Settings.jsx       # User settings & tokens
│   └── App.jsx
├── netlify/
│   └── functions/             # Serverless backend
│       ├── generate-content.js # Gemini AI integration
│       └── ...
├── .env.example               # Environment template
└── TEAM_SETUP.md             # This file
```

---

## Updating the App

1. Make changes to the code
2. Push to GitHub
3. Netlify auto-deploys

No downtime, no manual steps!
