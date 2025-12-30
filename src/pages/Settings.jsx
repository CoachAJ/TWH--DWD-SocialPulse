import { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Clock,
  Database,
  Trash2,
  Download,
  Upload,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  HardDrive
} from 'lucide-react';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
    company: '',
    timezone: 'America/New_York'
  });
  const [notifications, setNotifications] = useState({
    emailNewPost: true,
    emailScheduled: true,
    emailPublished: true,
    pushAll: true,
    pushScheduled: true
  });
  const [preferences, setPreferences] = useState({
    defaultTone: 'professional',
    autoSave: true,
    autoSync: false,
    darkMode: false,
    language: 'en'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [showTokens, setShowTokens] = useState({});
  const [apiTokens, setApiTokens] = useState({
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    reddit: '',
    redditSecret: '',
    redditUsername: '',
    redditPassword: '',
    googleDriveToken: ''
  });

  useEffect(() => {
    // Load user settings
    const storedUser = localStorage.getItem('socialpulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedNotifications = localStorage.getItem('socialpulse_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    const storedPreferences = localStorage.getItem('socialpulse_preferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }

    const storedTokens = localStorage.getItem('socialpulse_api_tokens');
    if (storedTokens) {
      setApiTokens(JSON.parse(storedTokens));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('socialpulse_user', JSON.stringify(user));
      localStorage.setItem('socialpulse_notifications', JSON.stringify(notifications));
      localStorage.setItem('socialpulse_preferences', JSON.stringify(preferences));
      localStorage.setItem('socialpulse_api_tokens', JSON.stringify(apiTokens));

      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      posts: JSON.parse(localStorage.getItem('socialpulse_posts') || '[]'),
      integrations: JSON.parse(localStorage.getItem('socialpulse_integrations') || '{}'),
      user,
      notifications,
      preferences,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'socialpulse-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleTokenVisibility = (key) => {
    setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tokens', label: 'API Tokens', icon: Key },
    { id: 'drive', label: 'Google Drive', icon: HardDrive },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Shield }
  ];

  const getTokenStatus = () => {
    const configured = Object.entries(apiTokens)
      .filter(([key, value]) => value && !key.includes('reddit') || (key === 'reddit' && apiTokens.reddit))
      .length;
    return configured;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success/Error message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          {saveMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Enter your name"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    value={user.company}
                    onChange={(e) => setUser({ ...user, company: e.target.value })}
                    placeholder="Enter your company"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select
                    value={user.timezone}
                    onChange={(e) => setUser({ ...user, timezone: e.target.value })}
                    className="input"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* API Tokens Tab */}
          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Your API Tokens</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Enter your personal API tokens for each platform. These are stored securely in your browser only.
                </p>
                
                <div className="space-y-6">
                  {/* Twitter */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">X</span>
                        </div>
                        <span className="font-medium">X (Twitter)</span>
                      </div>
                      <a
                        href="https://developer.twitter.com/en/portal/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Get Token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showTokens.twitter ? 'text' : 'password'}
                        value={apiTokens.twitter}
                        onChange={(e) => setApiTokens({ ...apiTokens, twitter: e.target.value })}
                        placeholder="Bearer Token (Free tier: 1,500 posts/month)"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility('twitter')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showTokens.twitter ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">in</span>
                        </div>
                        <span className="font-medium">LinkedIn</span>
                      </div>
                      <a
                        href="https://www.linkedin.com/developers/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Get Token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showTokens.linkedin ? 'text' : 'password'}
                        value={apiTokens.linkedin}
                        onChange={(e) => setApiTokens({ ...apiTokens, linkedin: e.target.value })}
                        placeholder="Access Token"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility('linkedin')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showTokens.linkedin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">f</span>
                        </div>
                        <span className="font-medium">Facebook</span>
                      </div>
                      <a
                        href="https://developers.facebook.com/tools/explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Get Token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showTokens.facebook ? 'text' : 'password'}
                        value={apiTokens.facebook}
                        onChange={(e) => setApiTokens({ ...apiTokens, facebook: e.target.value })}
                        placeholder="Page Access Token"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility('facebook')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showTokens.facebook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">IG</span>
                        </div>
                        <span className="font-medium">Instagram</span>
                      </div>
                      <a
                        href="https://developers.facebook.com/docs/instagram-api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Get Token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showTokens.instagram ? 'text' : 'password'}
                        value={apiTokens.instagram}
                        onChange={(e) => setApiTokens({ ...apiTokens, instagram: e.target.value })}
                        placeholder="Instagram Business Account Token"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility('instagram')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showTokens.instagram ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Requires Facebook Page linked to Instagram Business account</p>
                  </div>

                  {/* TikTok */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">TT</span>
                        </div>
                        <span className="font-medium">TikTok</span>
                      </div>
                      <a
                        href="https://developers.tiktok.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Get Token <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showTokens.tiktok ? 'text' : 'password'}
                        value={apiTokens.tiktok}
                        onChange={(e) => setApiTokens({ ...apiTokens, tiktok: e.target.value })}
                        placeholder="Access Token"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility('tiktok')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showTokens.tiktok ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Reddit */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">R</span>
                        </div>
                        <span className="font-medium">Reddit</span>
                      </div>
                      <a
                        href="https://www.reddit.com/prefs/apps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        Create App <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type={showTokens.reddit ? 'text' : 'password'}
                          value={apiTokens.reddit}
                          onChange={(e) => setApiTokens({ ...apiTokens, reddit: e.target.value })}
                          placeholder="Client ID"
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleTokenVisibility('reddit')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showTokens.reddit ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <input
                        type="password"
                        value={apiTokens.redditSecret}
                        onChange={(e) => setApiTokens({ ...apiTokens, redditSecret: e.target.value })}
                        placeholder="Client Secret"
                        className="input"
                      />
                      <input
                        type="text"
                        value={apiTokens.redditUsername}
                        onChange={(e) => setApiTokens({ ...apiTokens, redditUsername: e.target.value })}
                        placeholder="Reddit Username"
                        className="input"
                      />
                      <input
                        type="password"
                        value={apiTokens.redditPassword}
                        onChange={(e) => setApiTokens({ ...apiTokens, redditPassword: e.target.value })}
                        placeholder="Reddit Password"
                        className="input"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Create a "script" type app for personal use</p>
                  </div>
                </div>
              </div>

              <div className="card bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Security Note</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your API tokens are stored locally in your browser and are never sent to our servers. 
                      They are only used to post content directly to your social media accounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Google Drive Tab */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Google Drive Integration</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Connect your personal Google Drive to save generated content to Docs and sync schedules to Sheets.
                </p>
                
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Google Drive</p>
                      <p className="text-sm text-gray-600">Save content directly to your Drive</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type={showTokens.googleDrive ? 'text' : 'password'}
                      value={apiTokens.googleDriveToken}
                      onChange={(e) => setApiTokens({ ...apiTokens, googleDriveToken: e.target.value })}
                      placeholder="Google Drive API Token (optional)"
                      className="input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleTokenVisibility('googleDrive')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showTokens.googleDrive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      Get credentials from Google Cloud Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">How it works:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Generated content is saved as Google Docs in a "SocialPulse" folder
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Scheduled posts are tracked in a Google Sheet
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Each team member has their own Drive folder
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNewPost', label: 'New content generated', description: 'Get notified when AI generates new content' },
                      { key: 'emailScheduled', label: 'Post scheduled', description: 'Receive confirmation when posts are scheduled' },
                      { key: 'emailPublished', label: 'Post published', description: 'Get notified when posts are successfully published' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Push Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'pushAll', label: 'All notifications', description: 'Receive all push notifications' },
                      { key: 'pushScheduled', label: 'Scheduled posts only', description: 'Only notify for scheduled post events' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="label">Default Content Tone</label>
                  <select
                    value={preferences.defaultTone}
                    onChange={(e) => setPreferences({ ...preferences, defaultTone: e.target.value })}
                    className="input"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="witty">Witty</option>
                    <option value="urgent">Urgent</option>
                    <option value="empathetic">Empathetic</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">The default tone used when generating new content</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'autoSave', label: 'Auto-save drafts', description: 'Automatically save generated content as drafts' },
                    { key: 'autoSync', label: 'Auto-sync to Drive', description: 'Automatically save content to Google Drive' },
                    { key: 'darkMode', label: 'Dark mode', description: 'Use dark theme (coming soon)' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[item.key]}
                          onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                          disabled={item.key === 'darkMode'}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${item.key === 'darkMode' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="label">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Download className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Export Your Data</p>
                        <p className="text-sm text-gray-500">Download all your posts, settings, and integrations</p>
                      </div>
                    </div>
                    <button onClick={handleExportData} className="btn-outline">
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900">Clear All Data</p>
                        <p className="text-sm text-red-600">Permanently delete all local data</p>
                      </div>
                    </div>
                    <button onClick={handleClearData} className="btn bg-red-600 text-white hover:bg-red-700">
                      Clear Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Storage Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-medium">{JSON.parse(localStorage.getItem('socialpulse_posts') || '[]').length} items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Generated Content</span>
                    <span className="font-medium">{JSON.parse(localStorage.getItem('socialpulse_generated_posts') || '[]').length} items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Activity Log</span>
                    <span className="font-medium">{JSON.parse(localStorage.getItem('socialpulse_activity') || '[]').length} items</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-semibold text-gray-900">Pro Plan</p>
                  <p className="text-sm text-gray-600 mt-1">Unlimited content generation and scheduling</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50 w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
