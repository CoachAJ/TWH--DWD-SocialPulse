import { useState, useEffect } from 'react';
import {
  Link2,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Shield,
  Database,
  HardDrive,
  Globe,
  AlertTriangle,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

function Integrations() {
  const [integrations, setIntegrations] = useState({
    googleDrive: { connected: false, status: 'disconnected' },
    googleSheets: { connected: false, status: 'disconnected' },
    twitter: { connected: false, status: 'disconnected' },
    linkedin: { connected: false, status: 'disconnected' },
    facebook: { connected: false, status: 'disconnected' },
    instagram: { connected: false, status: 'disconnected' },
    tiktok: { connected: false, status: 'disconnected' },
    reddit: { connected: false, status: 'disconnected' }
  });
  const [isConnecting, setIsConnecting] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  useEffect(() => {
    // Load integration status from localStorage
    const stored = localStorage.getItem('socialpulse_integrations');
    if (stored) {
      setIntegrations(JSON.parse(stored));
    }
  }, []);

  const saveIntegrations = (newIntegrations) => {
    setIntegrations(newIntegrations);
    localStorage.setItem('socialpulse_integrations', JSON.stringify(newIntegrations));
  };

  const handleConnect = async (platform) => {
    setIsConnecting(platform);

    try {
      // Simulate OAuth flow
      const response = await fetch(`/api/auth-url?provider=${platform}`);
      const data = await response.json();

      if (data.authUrl) {
        // In production, this would redirect to the OAuth provider
        // For demo, we'll simulate a successful connection
        setTimeout(() => {
          const newIntegrations = {
            ...integrations,
            [platform]: { connected: true, status: 'connected', lastSync: new Date().toISOString() }
          };
          saveIntegrations(newIntegrations);
          setIsConnecting(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error connecting:', error);
      // Simulate successful connection for demo
      setTimeout(() => {
        const newIntegrations = {
          ...integrations,
          [platform]: { connected: true, status: 'connected', lastSync: new Date().toISOString() }
        };
        saveIntegrations(newIntegrations);
        setIsConnecting(null);
      }, 2000);
    }
  };

  const handleDisconnect = (platform) => {
    const newIntegrations = {
      ...integrations,
      [platform]: { connected: false, status: 'disconnected', lastSync: null }
    };
    saveIntegrations(newIntegrations);
  };

  const handleSync = async (platform) => {
    setIsConnecting(platform);

    // Simulate sync
    setTimeout(() => {
      const newIntegrations = {
        ...integrations,
        [platform]: { ...integrations[platform], lastSync: new Date().toISOString() }
      };
      saveIntegrations(newIntegrations);
      setIsConnecting(null);
    }, 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms = [
    {
      id: 'googleDrive',
      name: 'Google Drive',
      icon: HardDrive,
      color: 'blue',
      description: 'Save generated content as Docs and sync your content library',
      features: ['Auto-save generated content', 'Create organized folders', 'Backup your posts']
    },
    {
      id: 'googleSheets',
      name: 'Google Sheets',
      icon: Database,
      color: 'green',
      description: 'Maintain your content calendar and track post performance',
      features: ['Schedule tracking', 'Analytics logging', 'Content inventory']
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Globe,
      color: 'black',
      description: 'Post short-form content and engage with your audience',
      maxLength: 280,
      features: ['Thread support', 'Media uploads', 'Analytics']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Globe,
      color: 'blue',
      description: 'Share professional content and build thought leadership',
      maxLength: 3000,
      features: ['Article posting', 'Document sharing', 'Profile engagement']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Globe,
      color: 'blue',
      description: 'Connect with community and share multimedia content',
      maxLength: 63206,
      features: ['Page posting', 'Group sharing', 'Event creation']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Globe,
      color: 'pink',
      description: 'Share visual content and engage with followers',
      maxLength: 2200,
      features: ['Image posts', 'Stories', 'Reels descriptions']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Globe,
      color: 'purple',
      description: 'Create trend-aware content for younger audiences',
      maxLength: 2200,
      features: ['Video descriptions', 'Hashtag strategies', 'Trend tracking']
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: Globe,
      color: 'orange',
      description: 'Share informative content and engage in discussions',
      maxLength: 40000,
      features: ['Subreddit posting', 'Discussion threads', 'Community engagement']
    }
  ];

  const connectedCount = Object.values(integrations).filter(i => i.connected).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your social media platforms and cloud storage.</p>
        </div>
        <button
          onClick={() => setShowApiKeySetup(!showApiKeySetup)}
          className="btn-outline"
        >
          <Shield className="w-4 h-4 mr-2" />
          API Configuration
        </button>
      </div>

      {/* API Configuration */}
      {showApiKeySetup && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Gemini API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter your Gemini API key"
                  className="input flex-1"
                />
                <button className="btn-primary">
                  <Check className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Netlify Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-3">
                Add these environment variables in your Netlify dashboard:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span>GEMINI_API_KEY=your_api_key_here</span>
                  <button
                    onClick={() => copyToClipboard('GEMINI_API_KEY=your_api_key_here')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied === 'GEMINI_API_KEY' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>GOOGLE_CLIENT_ID=your_client_id</span>
                  <button
                    onClick={() => copyToClipboard('GOOGLE_CLIENT_ID=your_client_id')}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied === 'GOOGLE_CLIENT_ID' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection status summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{connectedCount}</p>
              <p className="text-sm text-gray-500">Connected</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Link2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{platforms.length - connectedCount}</p>
              <p className="text-sm text-gray-500">Available</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(integrations).filter(i => i.lastSync).length}
              </p>
              <p className="text-sm text-gray-500">Synced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Google integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Cloud Storage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.slice(0, 2).map((platform) => {
            const integration = integrations[platform.id];
            const Icon = platform.icon;

            return (
              <div key={platform.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-${platform.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${platform.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">{platform.description}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    integration.connected ? 'badge-success' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {platform.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {integration.connected ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSync(platform.id)}
                      disabled={isConnecting === platform.id}
                      className="btn-outline flex-1"
                    >
                      {isConnecting === platform.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Sync Now
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting === platform.id}
                    className="btn-primary w-full"
                  >
                    {isConnecting === platform.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </button>
                )}

                {integration.lastSync && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Social media integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Social Media Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.slice(2).map((platform) => {
            const integration = integrations[platform.id];
            const Icon = platform.icon;

            return (
              <div key={platform.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-${platform.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${platform.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">{platform.maxLength ? `Max ${platform.maxLength} chars` : ''}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    integration.connected ? 'badge-success' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {platform.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {integration.connected ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSync(platform.id)}
                      disabled={isConnecting === platform.id}
                      className="btn-outline flex-1"
                    >
                      {isConnecting === platform.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Sync
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting === platform.id}
                    className="btn-primary w-full"
                  >
                    {isConnecting === platform.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </button>
                )}

                {integration.lastSync && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Setup guide */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">OAuth Setup Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              To enable full functionality, you'll need to configure OAuth credentials for each platform.
              This requires creating apps in each platform's developer portal.
            </p>
            <div className="space-y-2">
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Google Cloud Console (for Drive/Sheets)
              </a>
              <a
                href="https://developer.twitter.com/en/portal/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Twitter Developer Portal
              </a>
              <a
                href="https://developers.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Meta for Developers
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Integrations;
