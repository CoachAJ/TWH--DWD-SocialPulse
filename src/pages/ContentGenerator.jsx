import { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Save,
  Calendar,
  Globe,
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  Trash2,
  Edit3,
  Download,
  Image,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  BookOpen,
  Megaphone
} from 'lucide-react';

function ContentGenerator() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copiedPlatform, setCopiedPlatform] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    twitter: true,
    linkedin: true,
    facebook: true,
    instagram: false,
    tiktok: false,
    reddit: false
  });
  const [callToAction, setCallToAction] = useState('');
  const [usePhilosophy, setUsePhilosophy] = useState(false);
  const [generatingImage, setGeneratingImage] = useState({});
  const [generatedImages, setGeneratedImages] = useState({});

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'witty', label: 'Witty' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'empathetic', label: 'Empathetic' }
  ];

  const platforms = [
    { id: 'twitter', name: 'X/Twitter', maxLength: 280, color: 'black' },
    { id: 'linkedin', name: 'LinkedIn', maxLength: 3000, color: 'blue-600' },
    { id: 'facebook', name: 'Facebook', maxLength: 63206, color: 'blue-800' },
    { id: 'instagram', name: 'Instagram', maxLength: 2200, color: 'pink-600' },
    { id: 'tiktok', name: 'TikTok', maxLength: 2200, color: 'black' },
    { id: 'reddit', name: 'Reddit', maxLength: 40000, color: 'orange-600' }
  ];

  useEffect(() => {
    // Load saved posts from localStorage
    const saved = localStorage.getItem('socialpulse_generated_posts');
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Call the generate content function
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: input,
          tone: tone,
          platforms: Object.keys(selectedPlatforms).filter(key => selectedPlatforms[key]),
          callToAction: callToAction,
          usePhilosophy: usePhilosophy
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);

      // Update stats
      const stats = JSON.parse(localStorage.getItem('socialpulse_stats') || '{}');
      stats.postsCreated = (stats.postsCreated || 0) + 1;
      localStorage.setItem('socialpulse_stats', JSON.stringify(stats));

      // Add to activity
      const activity = JSON.parse(localStorage.getItem('socialpulse_activity') || '[]');
      activity.unshift({
        type: 'create',
        title: `Generated content for: ${input.substring(0, 30)}...`,
        time: new Date().toLocaleString()
      });
      localStorage.setItem('socialpulse_activity', JSON.stringify(activity));

    } catch (error) {
      console.error('Error generating content:', error);
      // For demo purposes, generate sample content
      const sampleContent = generateSampleContent(input, tone, callToAction, usePhilosophy);
      setGeneratedContent(sampleContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSampleContent = (topic, tone, cta = '', philosophy = false) => {
    // Platform character limits
    const limits = {
      twitter: 280,
      linkedin: 3000,
      facebook: 63206,
      instagram: 2200,
      tiktok: 2200,
      reddit: 40000
    };

    // Helper to truncate text to limit
    const truncate = (text, limit) => {
      if (text.length <= limit) return text;
      return text.substring(0, limit - 3) + '...';
    };

    // Short topic for Twitter (max 30 chars)
    const shortTopic = topic.length > 30 ? topic.substring(0, 27) + '...' : topic;

    // Build Twitter content carefully under 280 chars
    let twitterText;
    if (philosophy) {
      // Philosophy version - keep it short!
      twitterText = `${shortTopic}: 90 nutrients daily = better health. #90ForLife #Nutrition`;
      if (cta && twitterText.length + cta.length + 2 <= 280) {
        twitterText += `\n${cta}`;
      }
    } else {
      twitterText = `${shortTopic}: What most miss 👇 #health #wellness`;
      if (cta && twitterText.length + cta.length + 2 <= 280) {
        twitterText += `\n${cta}`;
      }
    }
    twitterText = truncate(twitterText, 280);

    const ctaText = cta ? `\n\n${cta}` : '';

    return {
      topic,
      tone,
      content: {
        twitter: {
          text: twitterText,
          engagement: 'High engagement expected'
        },
        linkedin: {
          text: philosophy
            ? `I've been studying ${topic} through the lens of nutritional science, and the findings align with what Dr. Joel Wallach has taught for decades.\n\nHere's what the research shows:\n\n🔑 The human body requires 90 essential nutrients daily\n🔑 Most chronic conditions stem from nutritional deficiencies\n🔑 The body has an incredible capacity to heal itself\n\nAs Pharmacist Ben Fuchs says: "The body is a self-healing organism when given the right raw materials."\n\nWhat's your experience with nutritional approaches to health? 👇${ctaText}`
            : `I've been studying ${topic} and the findings are remarkable.\n\nHere's what the data tells us:\n\n🔑 Key Insight #1: Most people approach this incorrectly\n🔑 Key Insight #2: The solution is simpler than you think\n🔑 Key Insight #3: Early action leads to better outcomes\n\nWhat's your experience with this? 👇${ctaText}`,
          engagement: 'Professional engagement expected'
        },
        facebook: {
          text: philosophy
            ? `Hey community! 👋\n\nI wanted to share something important about ${topic}.\n\nMany of us have been told certain health challenges are "just genetic" or "part of aging." But here's what I've learned from Dr. Wallach and Pharmacist Ben Fuchs:\n\n✨ Your body needs 90 essential nutrients every single day\n✨ Most of us are deficient without knowing it\n✨ The body wants to heal - we just need to give it the right tools\n\n"We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency."\n\nWhat are your thoughts? Let's discuss below 👇${ctaText}`
            : `Hey community! 👋\n\nI wanted to share something important about ${topic}.\n\nMany of us have been told certain things are "just the way it is." But here's what I've learned:\n\nThe human body is remarkably resilient.\n\nWhat are your thoughts? Let's discuss below 👇${ctaText}`,
          engagement: 'Community engagement expected'
        },
        instagram: {
          text: philosophy
            ? `✨ ${topic.charAt(0).toUpperCase() + topic.slice(1)} ✨\n\nThe truth about health that changes everything...\n\nYour body needs 90 essential nutrients DAILY:\n• 60 minerals\n• 16 vitamins\n• 12 amino acids\n• 2-3 essential fatty acids\n\n"Give the body what it needs, and it will heal itself."\n\nYour body WANTS to thrive. 🌱${ctaText}\n\n#90ForLife #DrWallach #NutritionalHealth #Wellness`
            : `✨ ${topic.charAt(0).toUpperCase() + topic.slice(1)} ✨\n\nThe truth that most people never hear...\n\nYour body wants to heal. It wants to thrive.\n\nSwipe for more ➡️${ctaText}\n\n#HealthJourney #Wellness #NaturalHealth`,
          engagement: 'Visual engagement expected'
        },
        tiktok: {
          text: philosophy
            ? `POV: You just learned about the 90 essential nutrients 🧠\n\nDr. Wallach has been saying this for 50+ years:\n\nYour body needs 90 nutrients DAILY.\n\n60 minerals. 16 vitamins. 12 amino acids. Essential fatty acids.\n\nMost people are deficient and don't even know it.\n\nGive your body what it needs. Watch what happens. ✨${ctaText}`
            : `POV: You just learned the truth about ${topic} 🧠\n\nMost people have been lied to about their health.\n\nYour body is like a high-performance machine.\n\nFull breakdown 👇${ctaText}`,
          engagement: 'Viral potential'
        },
        reddit: {
          text: philosophy
            ? `**${topic.charAt(0).toUpperCase() + topic.slice(1)}: A Nutritional Perspective (Dr. Wallach/Ben Fuchs Philosophy)**\n\nI've been researching this topic through the lens of nutritional science.\n\n**Core Concept:**\nThe human body requires 90 essential nutrients daily - 60 minerals, 16 vitamins, 12 amino acids, and 2-3 essential fatty acids.\n\n**Key Points:**\n- Modern soil depletion means our food is less nutrient-dense\n- The body has an innate ability to heal when given proper nutrition\n- Many conditions labeled as "genetic" may be nutritional deficiencies\n\n**Quote:** "We're not sick because we have a drug deficiency - we're sick because we have a nutritional deficiency."\n\nWhat has been your experience?${ctaText}`
            : `**${topic.charAt(0).toUpperCase() + topic.slice(1)}: What the research actually shows**\n\nI've been diving deep into this topic.\n\n**Key Points:**\n- Most mainstream advice overlooks crucial factors\n- The science supports a more nuanced approach\n- Small changes can lead to significant improvements\n\nWhat has been your experience?${ctaText}`,
          engagement: 'Discussion-focused'
        }
      }
    };
  };

  const handleGenerateImage = async (platform) => {
    setGeneratingImage(prev => ({ ...prev, [platform]: true }));
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${input} - health and wellness themed`,
          platform: platform
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.image) {
        setGeneratedImages(prev => ({ ...prev, [platform]: data.image }));
      } else {
        // Silently set placeholder - image generation is optional feature
        setGeneratedImages(prev => ({ 
          ...prev, 
          [platform]: 'placeholder' 
        }));
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Silently handle - image generation is optional
      setGeneratedImages(prev => ({ 
        ...prev, 
        [platform]: 'placeholder' 
      }));
    } finally {
      setGeneratingImage(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleCopy = (platform) => {
    if (generatedContent?.content?.[platform]) {
      navigator.clipboard.writeText(generatedContent.content[platform].text);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    }
  };

  const handleSave = (platform) => {
    if (!generatedContent?.content?.[platform]) return;

    const postData = {
      id: Date.now().toString(),
      platform,
      content: generatedContent.content[platform].text,
      topic: input,
      tone,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    const updatedPosts = [...savedPosts, postData];
    setSavedPosts(updatedPosts);
    localStorage.setItem('socialpulse_generated_posts', JSON.stringify(updatedPosts));

    // Update stats
    const stats = JSON.parse(localStorage.getItem('socialpulse_stats') || '{}');
    stats.driveSyncs = (stats.driveSyncs || 0) + 1;
    localStorage.setItem('socialpulse_stats', JSON.stringify(stats));
  };

  const handleDelete = (postId) => {
    const updatedPosts = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updatedPosts);
    localStorage.setItem('socialpulse_generated_posts', JSON.stringify(updatedPosts));
  };

  const handleSchedule = (post) => {
    setEditingPost(post);
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!editingPost || !scheduleDate || !scheduleTime) return;

    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    const updatedPost = {
      ...editingPost,
      status: 'scheduled',
      scheduledFor,
      platforms: [editingPost.platform]
    };

    // Save to posts queue
    const posts = JSON.parse(localStorage.getItem('socialpulse_posts') || '[]');
    posts.push(updatedPost);
    localStorage.setItem('socialpulse_posts', JSON.stringify(posts));

    // Update saved posts
    const updatedSaved = savedPosts.map(p =>
      p.id === editingPost.id ? { ...p, status: 'scheduled', scheduledFor } : p
    );
    setSavedPosts(updatedSaved);
    localStorage.setItem('socialpulse_generated_posts', JSON.stringify(updatedSaved));

    // Update stats
    const stats = JSON.parse(localStorage.getItem('socialpulse_stats') || '{}');
    stats.scheduledPosts = (stats.scheduledPosts || 0) + 1;
    localStorage.setItem('socialpulse_stats', JSON.stringify(stats));

    // Add to activity
    const activity = JSON.parse(localStorage.getItem('socialpulse_activity') || '[]');
    activity.unshift({
      type: 'schedule',
      title: `Scheduled ${editingPost.platform} post`,
      time: new Date().toLocaleString()
    });
    localStorage.setItem('socialpulse_activity', JSON.stringify(activity));

    setShowScheduleModal(false);
    setEditingPost(null);
    setScheduleDate('');
    setScheduleTime('');
  };

  const handleDriveSync = async (post) => {
    try {
      const response = await fetch('/api/sync-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post,
          topic: input
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync to Drive');
      }

      // Update stats
      const stats = JSON.parse(localStorage.getItem('socialpulse_stats') || '{}');
      stats.driveSyncs = (stats.driveSyncs || 0) + 1;
      localStorage.setItem('socialpulse_stats', JSON.stringify(stats));

      alert('Content synced to Google Drive!');
    } catch (error) {
      console.error('Error syncing to Drive:', error);
      alert('Demo mode: Content would sync to Google Drive');
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const activePlatforms = Object.entries(selectedPlatforms).filter(([_, value]) => value);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
          <p className="text-gray-600 mt-1">Transform news and topics into engaging social media content.</p>
        </div>
        <button
          onClick={() => setShowSavedPosts(!showSavedPosts)}
          className="btn-outline"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {showSavedPosts ? 'Hide Saved' : 'View Saved'}
        </button>
      </div>

      {/* Saved posts drawer */}
      {showSavedPosts && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Saved Posts</h2>
            <span className="text-sm text-gray-600">{savedPosts.length} posts</span>
          </div>
          {savedPosts.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {savedPosts.map((post) => (
                <div key={post.id} className="flex items-start justify-between p-3 bg-white rounded-lg">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white bg-${
                        post.platform === 'twitter' ? 'black' :
                        post.platform === 'linkedin' ? 'blue-600' :
                        post.platform === 'facebook' ? 'blue-800' :
                        post.platform === 'instagram' ? 'pink-600' :
                        'black'
                      }`}>
                        {post.platform}
                      </span>
                      <span className={`text-xs ${
                        post.status === 'scheduled' ? 'text-yellow-600' :
                        post.status === 'published' ? 'text-green-600' :
                        'text-gray-500'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSchedule(post)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Schedule"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDriveSync(post)}
                      className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                      title="Sync to Drive"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No saved posts yet. Generate content to get started!</p>
          )}
        </div>
      )}

      {/* Input section */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Input */}
          <div className="flex-1">
            <label className="label">News Story or Topic</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your news story, article, or topic here..."
              className="input min-h-[120px] resize-none"
            />
            
            {/* Call to Action Input */}
            <div className="mt-4">
              <label className="label flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary-600" />
                Call to Action (optional)
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g., 'Learn more at dailywithdoc.com' or 'DM me for details'"
                className="input"
              />
            </div>

            {/* Philosophy Toggle */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Dr. Wallach & Ben Fuchs Philosophy</p>
                    <p className="text-xs text-gray-600">Include 90 essential nutrients & nutritional health context</p>
                  </div>
                </div>
                <button
                  onClick={() => setUsePhilosophy(!usePhilosophy)}
                  className={`p-1 rounded-full transition-colors ${usePhilosophy ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {usePhilosophy ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
              {usePhilosophy && (
                <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Content will include:</p>
                  <ul className="space-y-1">
                    <li>• 90 essential nutrients messaging</li>
                    <li>• Nutritional deficiency insights</li>
                    <li>• Body's self-healing capacity</li>
                    <li>• Dr. Wallach & Ben Fuchs quotes</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
              <div>
                <label className="label text-sm">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        tone === t.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label text-sm">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedPlatforms[p.id]
                          ? `bg-${p.color} text-white`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating || activePlatforms.length === 0}
              className="btn-primary w-full mt-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content ({activePlatforms.length} platforms)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated content */}
      {generatedContent && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(generatedContent.content)
              .filter(([platform]) => selectedPlatforms[platform])
              .map(([platform, data]) => {
                const platformInfo = platforms.find(p => p.id === platform);
                const charCount = data.text.length;
                const isOverLimit = charCount > platformInfo?.maxLength;

                return (
                  <div key={platform} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium bg-${
                          platformInfo?.color || 'gray-600'
                        }`}>
                          {platform[0].toUpperCase()}
                        </span>
                        <span className="font-medium text-gray-900">{platformInfo?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(platform)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedPlatform === platform ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSave(platform)}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                          title="Save post"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={data.text}
                      readOnly
                      className="input min-h-[120px] resize-none text-sm"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs flex items-center gap-1 ${
                        isOverLimit ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {isOverLimit && <AlertCircle className="w-3 h-3" />}
                        {charCount}/{platformInfo?.maxLength} characters
                      </span>
                      <button
                        onClick={() => {
                          const newText = prompt('Edit your content:', data.text);
                          if (newText) {
                            generatedContent.content[platform].text = newText;
                            setGeneratedContent({ ...generatedContent });
                          }
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                    
                    {/* Image Generation */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {generatedImages[platform] && generatedImages[platform] !== 'placeholder' ? (
                        <div className="space-y-2">
                          <img 
                            src={generatedImages[platform]} 
                            alt={`Generated for ${platform}`}
                            className="w-full rounded-lg"
                          />
                          <button
                            onClick={() => handleGenerateImage(platform)}
                            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Regenerate Image
                          </button>
                        </div>
                      ) : generatedImages[platform] === 'placeholder' ? (
                        <div className="text-xs text-gray-400 text-center py-2">
                          <Image className="w-4 h-4 mx-auto mb-1 opacity-50" />
                          Image generation requires Gemini Imagen 3 API
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateImage(platform)}
                          disabled={generatingImage[platform]}
                          className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2 transition-colors"
                        >
                          {generatingImage[platform] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating Image...
                            </>
                          ) : (
                            <>
                              <Image className="w-4 h-4" />
                              Generate Image (Imagen 3)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        💡 {data.engagement}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Schedule modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Post</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingPost(null);
                  setScheduleDate('');
                  setScheduleTime('');
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmSchedule}
                disabled={!scheduleDate || !scheduleTime}
                className="btn-primary flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips section */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Better Results</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Provide detailed context in your input for more relevant content
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Match the tone to your target audience for better engagement
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Edit generated content to add your personal touch before posting
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            Connect Google Drive to automatically save and sync your content
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContentGenerator;
