import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Link2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    postsCreated: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    driveSyncs: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('socialpulse_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Load recent activity
    const activity = localStorage.getItem('socialpulse_activity');
    if (activity) {
      setRecentActivity(JSON.parse(activity).slice(0, 5));
    }

    // Load pending posts
    const posts = localStorage.getItem('socialpulse_posts');
    if (posts) {
      const allPosts = JSON.parse(posts);
      const pending = allPosts.filter(post => post.status === 'scheduled');
      setPendingPosts(pending.slice(0, 3));
    }
  }, []);

  const statCards = [
    {
      label: 'Posts Created',
      value: stats.postsCreated,
      icon: Sparkles,
      color: 'primary',
      change: '+12%'
    },
    {
      label: 'Scheduled',
      value: stats.scheduledPosts,
      icon: Calendar,
      color: 'secondary',
      change: '+5%'
    },
    {
      label: 'Published',
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: 'green',
      change: '+23%'
    },
    {
      label: 'Drive Syncs',
      value: stats.driveSyncs,
      icon: Link2,
      color: 'blue',
      change: '+8%'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your content overview.</p>
        </div>
        <a href="/generator" className="btn-primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Create Content
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'create' ? 'bg-primary-100' :
                    activity.type === 'schedule' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    {activity.type === 'create' ? (
                      <Sparkles className="w-4 h-4 text-primary-600" />
                    ) : activity.type === 'schedule' ? (
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
              <a href="/generator" className="text-primary-600 text-sm font-medium mt-2 inline-block">
                Create your first post
              </a>
            </div>
          )}
        </div>

        {/* Pending posts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
            <a href="/calendar" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View Calendar
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {pendingPosts.length > 0 ? (
            <div className="space-y-4">
              {pendingPosts.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {post.platforms?.map((platform, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                          platform === 'twitter' ? 'bg-black' :
                          platform === 'linkedin' ? 'bg-blue-600' :
                          platform === 'facebook' ? 'bg-blue-800' :
                          'bg-gradient-to-br from-purple-600 to-pink-500'
                        }`}>
                          {platform[0].toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {post.topic?.substring(0, 40)}...
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No scheduled posts</p>
              <a href="/generator" className="text-primary-600 text-sm font-medium mt-2 inline-block">
                Schedule a post
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/generator"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-colors"
          >
            <div className="p-2 bg-primary-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate Content</p>
              <p className="text-sm text-gray-600">AI-powered creation</p>
            </div>
          </a>
          <a
            href="/integrations"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg hover:from-secondary-100 hover:to-secondary-200 transition-colors"
          >
            <div className="p-2 bg-secondary-600 rounded-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Connect Platforms</p>
              <p className="text-sm text-gray-600">Social & Drive</p>
            </div>
          </a>
          <a
            href="/calendar"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors"
          >
            <div className="p-2 bg-green-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Calendar</p>
              <p className="text-sm text-gray-600">Manage schedule</p>
            </div>
          </a>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="p-2 bg-orange-600 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Get Support</p>
              <p className="text-sm text-gray-600">Documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
