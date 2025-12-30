# SocialPulse AI Agent (Team Edition)

An AI-powered social media content generator for your team. Transform news stories and topics into engaging, platform-specific content in seconds.

## ✨ Features

- **AI Content Generation**: Uses Google Gemini to create platform-specific content
- **AI Image Generation**: Uses Gemini 3.0 Flash Image (Nano Banana) for social media images
- **6 Platforms**: Twitter/X, LinkedIn, Facebook, Instagram, TikTok, Reddit
- **Dr. Wallach & Ben Fuchs Philosophy**: Toggle to infuse content with 90 essential nutrients messaging
- **Call-to-Action**: Add custom CTAs to all generated posts
- **Character Limits**: Automatic enforcement of platform-specific limits (Twitter 280, etc.)
- **Per-User Storage**: Each team member stores their own API tokens locally
- **Google Drive Sync**: Save content to your personal Google Drive
- **Smart Scheduling**: Schedule posts for optimal engagement times

---

## 🚀 Quick Start (15 minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key (you'll need it for both content AND image generation)

### Step 2: Deploy to Netlify

**Option A: Deploy from GitHub**
1. Push this repo to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Add environment variable: `GEMINI_API_KEY` = your_key
6. Deploy!

**Option B: Manual Deploy**
```bash
npm run build
# Upload the 'dist' folder to Netlify
# Add GEMINI_API_KEY in Site Settings → Environment Variables
```

### Step 3: Team Member Setup

Each team member:
1. Opens the app URL
2. Goes to **Settings → API Tokens**
3. Enters their personal tokens for each platform they want to post to

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd socialpulse-agent

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Start development server
npm run dev
```

### Running with Netlify Functions (Recommended)

To test AI content and image generation locally:

```bash
# Install Netlify CLI globally (one time)
npm install -g netlify-cli

# Run with Netlify dev (loads .env and serverless functions)
netlify dev
```

This will start the app at `http://localhost:8888` with full function support.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Powers both content AND image generation |
| `GOOGLE_CLIENT_ID` | Optional | For server-side Google Drive |
| `GOOGLE_CLIENT_SECRET` | Optional | For server-side Google Drive |

### .env File Example

```env
# Required: Powers AI content + image generation
GEMINI_API_KEY=your_gemini_api_key_here
```

### Per-User Token Storage

Each team member enters their own API tokens in **Settings → API Tokens**:

| Platform | Where to Get Token |
|----------|-------------------|
| Twitter/X | https://developer.twitter.com/en/portal/dashboard |
| LinkedIn | https://www.linkedin.com/developers/ |
| Facebook | https://developers.facebook.com/tools/explorer |
| Instagram | Same as Facebook (requires Business account) |
| TikTok | https://developers.tiktok.com/ |
| Reddit | https://www.reddit.com/prefs/apps |

Tokens are stored in the browser's localStorage and never sent to servers.

## Platform Costs

| Platform | Free Tier |
|----------|-----------|
| **Twitter/X** | 1,500 posts/month (write-only) |
| **LinkedIn** | Unlimited |
| **Facebook** | Unlimited (requires Page) |
| **Instagram** | Unlimited (requires Business account) |
| **TikTok** | Varies (requires app approval) |
| **Reddit** | Unlimited (rate limited) |

## Usage

### Generating Content

1. Navigate to the Content Generator page
2. Paste your news story or topic
3. Select the desired tone (Professional, Casual, Witty, etc.)
4. Choose target platforms
5. Click "Generate Content"
6. Edit as needed and save posts

### Scheduling Posts

1. Save a generated post
2. Click the calendar icon
3. Select date and time
4. Confirm scheduling

### Connecting Platforms

1. Go to Integrations page
2. Click "Connect" for each platform
3. Authorize access via OAuth popup
4. Your credentials are stored securely

### Google Drive Sync

1. Connect Google Drive in Integrations
2. Generated content auto-saves to Docs
3. Schedule syncs to Google Sheets
4. Access all content from your Drive

## Project Structure

```
socialpulse-agent/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── ContentGenerator.jsx
│   │   ├── CalendarView.jsx
│   │   ├── Integrations.jsx
│   │   └── Settings.jsx
│   ├── services/        # API and service integrations
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS and Tailwind styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── netlify/
│   └── functions/       # Serverless functions
│       ├── generate-content.js
│       ├── auth-url.js
│       ├── auth-callback.js
│       ├── sync-drive.js
│       ├── scheduler.js
│       └── queue-post.js
├── public/              # Static assets
├── netlify.toml         # Netlify configuration
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json
```

## API Functions

### `generate-content`
Generates social media content using Google Gemini AI.

**Input:**
```json
{
  "topic": "Health and wellness tips",
  "tone": "professional",
  "platforms": ["twitter", "linkedin"]
}
```

**Output:**
```json
{
  "topic": "Health and wellness tips",
  "tone": "professional",
  "content": {
    "twitter": {
      "text": "...",
      "engagement": "..."
    },
    "linkedin": {
      "text": "...",
      "engagement": "..."
    }
  }
}
```

### `auth-url`
Generates OAuth URLs for platform authentication.

### `auth-callback`
Handles OAuth callback exchanges for access tokens.

### `sync-drive`
Syncs content to Google Drive (Docs) and Sheets.

### `scheduler`
Scheduled function that runs every 10 minutes to publish scheduled posts.

### `queue-post`
Adds posts to the scheduling queue.

## Troubleshooting

### Content Not Generating

1. Check that `GEMINI_API_KEY` is set
2. Verify API key has access to Gemini Pro
3. Check Netlify function logs

### OAuth Not Working

1. Verify redirect URIs match exactly
2. Ensure OAuth credentials are correct
3. Check that required scopes are enabled

### Posts Not Scheduling

1. Check scheduler function is enabled in netlify.toml
2. Verify posts have valid future dates
3. Check function logs for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the documentation
- Review troubleshooting section
- Open an issue on GitHub
