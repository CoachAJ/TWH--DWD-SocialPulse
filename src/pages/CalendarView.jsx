import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Filter,
  Download
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Load posts from localStorage
    const storedPosts = localStorage.getItem('socialpulse_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: 'bg-black text-white',
      linkedin: 'bg-blue-600 text-white',
      facebook: 'bg-blue-800 text-white',
      instagram: 'bg-pink-600 text-white',
      tiktok: 'bg-purple-600 text-white'
    };
    return colors[platform] || 'bg-gray-600 text-white';
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      published: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(post => post.status === filter);

  const getPostsForDate = (date) => {
    return filteredPosts.filter(post => {
      const postDate = parseISO(post.scheduledFor);
      return isSameDay(postDate, date);
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -30))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 30))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayPosts = getPostsForDate(currentDay);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const today = isToday(day);

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(currentDay)}
            className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-colors ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
            } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className={`text-sm font-medium mb-1 ${
              today ? 'bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''
            }`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayPosts.slice(0, 3).map((post, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(post);
                    setShowPostModal(true);
                  }}
                  className={`text-xs px-1.5 py-0.5 rounded truncate ${getPlatformColor(post.platform)}`}
                >
                  {post.platform} - {format(parseISO(post.scheduledFor), 'HH:mm')}
                </div>
              ))}
              {dayPosts.length > 3 && (
                <div className="text-xs text-gray-500 px-1.5">
                  +{dayPosts.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="border border-gray-200 rounded-lg overflow-hidden">{rows}</div>;
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('socialpulse_posts', JSON.stringify(updatedPosts));
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const handlePublishNow = (post) => {
    // Simulate publishing
    const updatedPosts = posts.map(p =>
      p.id === post.id ? { ...p, status: 'published', publishedAt: new Date().toISOString() } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('socialpulse_posts', JSON.stringify(updatedPosts));

    // Update stats
    const stats = JSON.parse(localStorage.getItem('socialpulse_stats') || '{}');
    stats.publishedPosts = (stats.publishedPosts || 0) + 1;
    localStorage.setItem('socialpulse_stats', JSON.stringify(stats));

    // Add to activity
    const activity = JSON.parse(localStorage.getItem('socialpulse_activity') || '[]');
    activity.unshift({
      type: 'publish',
      title: `Published ${post.platform} post`,
      time: new Date().toLocaleString()
    });
    localStorage.setItem('socialpulse_activity', JSON.stringify(activity));

    setShowPostModal(false);
    setSelectedPost(null);
  };

  const upcomingPosts = filteredPosts
    .filter(post => post.status === 'scheduled' && parseISO(post.scheduledFor) >= new Date())
    .sort((a, b) => parseISO(a.scheduledFor) - parseISO(b.scheduledFor))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Manage and schedule your social media posts.</p>
        </div>
        <a href="/generator" className="btn-primary">
          <Calendar className="w-4 h-4 mr-2" />
          Create New Post
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Platforms:</span>
              {['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'].map(platform => (
                <span key={platform} className={`text-xs px-2 py-1 rounded ${getPlatformColor(platform)}`}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filter */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Status
            </h3>
            <div className="space-y-2">
              {['all', 'scheduled', 'published', 'draft', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === status
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {status === 'all' ? 'All Posts' : status}
                  <span className="float-right text-gray-400">
                    {status === 'all' ? posts.length : posts.filter(p => p.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming posts */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Posts</h3>
            {upcomingPosts.length > 0 ? (
              <div className="space-y-3">
                {upcomingPosts.map((post, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowPostModal(true);
                    }}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getPlatformColor(post.platform)}`}>
                        {post.platform}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{post.topic}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(post.scheduledFor), 'MMM d, HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming posts</p>
            )}
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'scheduled').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Published</span>
                <span className="font-semibold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{posts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post detail modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getPlatformColor(selectedPost.platform)}`}>
                  {selectedPost.platform}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getStatusColor(selectedPost.status)}`}>
                  {selectedPost.status}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowPostModal(false);
                  setSelectedPost(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Topic</h4>
              <p className="text-gray-900">{selectedPost.topic}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Scheduled For</h4>
              <p className="text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {format(parseISO(selectedPost.scheduledFor), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-gray-900 flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                {format(parseISO(selectedPost.scheduledFor), 'h:mm a')}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Content</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedPost.status === 'scheduled' && (
                <button
                  onClick={() => handlePublishNow(selectedPost)}
                  className="btn-primary flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Now
                </button>
              )}
              <button className="btn-outline flex-1">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedPost.id)}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
