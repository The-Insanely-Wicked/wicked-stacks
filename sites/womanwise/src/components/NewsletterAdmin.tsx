import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Subscriber {
  email: string;
  first_name: string | null;
  subscribed_at: string;
  is_active: boolean;
}

interface Broadcast {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  recipient_count: number;
  status: string;
}

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  recentSubscribers: number;
  unsubscribed: number;
}

interface AdminData {
  stats: Stats;
  recentSubscribers: Subscriber[];
  broadcasts: Broadcast[];
}

const NewsletterAdmin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'broadcast' | 'subscribers'>('dashboard');
  
  // Broadcast form
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; message: string } | null>(null);

  // All subscribers
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-admin', {
        body: { action: 'getStats', adminPassword: password }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setAdminData(data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-admin', {
        body: { action: 'getSubscribers', adminPassword: password }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setAllSubscribers(data.subscribers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleSendPreview = async () => {
    if (!previewEmail || !broadcastSubject || !broadcastContent) {
      setBroadcastResult({ success: false, message: 'Please fill in all fields and preview email' });
      return;
    }

    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-broadcast', {
        body: {
          adminPassword: password,
          subject: broadcastSubject,
          content: broadcastContent,
          previewEmail
        }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setBroadcastResult({ success: true, message: data.message });
    } catch (err: any) {
      setBroadcastResult({ success: false, message: err.message || 'Failed to send preview' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastSubject || !broadcastContent) {
      setBroadcastResult({ success: false, message: 'Please fill in subject and content' });
      return;
    }

    if (!confirm(`Are you sure you want to send this email to ${adminData?.stats.activeSubscribers || 0} subscribers?`)) {
      return;
    }

    setSendingBroadcast(true);
    setBroadcastResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('newsletter-broadcast', {
        body: {
          adminPassword: password,
          subject: broadcastSubject,
          content: broadcastContent
        }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setBroadcastResult({ success: true, message: data.message });
      setBroadcastSubject('');
      setBroadcastContent('');

      // Refresh stats
      const { data: refreshData } = await supabase.functions.invoke('newsletter-admin', {
        body: { action: 'getStats', adminPassword: password }
      });
      if (refreshData && !refreshData.error) {
        setAdminData(refreshData);
      }
    } catch (err: any) {
      setBroadcastResult({ success: false, message: err.message || 'Failed to send broadcast' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subscribers' && isAuthenticated && allSubscribers.length === 0) {
      loadSubscribers();
    }
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-800">Admin Login</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-stone-500 text-center">
            Default password: womanwise-admin-2024
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-rose-600 to-rose-700">
          <h2 className="text-xl font-bold text-white">Newsletter Admin Panel</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-stone-200 flex gap-4">
          {(['dashboard', 'broadcast', 'subscribers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && adminData && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl">
                  <p className="text-sm text-rose-600 font-medium">Total Subscribers</p>
                  <p className="text-3xl font-bold text-rose-700">{adminData.stats.totalSubscribers}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">Active</p>
                  <p className="text-3xl font-bold text-green-700">{adminData.stats.activeSubscribers}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium">Last 7 Days</p>
                  <p className="text-3xl font-bold text-blue-700">{adminData.stats.recentSubscribers}</p>
                </div>
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-xl">
                  <p className="text-sm text-stone-600 font-medium">Unsubscribed</p>
                  <p className="text-3xl font-bold text-stone-700">{adminData.stats.unsubscribed}</p>
                </div>
              </div>

              {/* Recent Subscribers */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200">
                  <h3 className="font-semibold text-stone-800">Recent Subscribers</h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {adminData.recentSubscribers.length === 0 ? (
                    <p className="px-6 py-8 text-center text-stone-500">No subscribers yet</p>
                  ) : (
                    adminData.recentSubscribers.map((sub, index) => (
                      <div key={index} className="px-6 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-stone-800">{sub.email}</p>
                          {sub.first_name && <p className="text-sm text-stone-500">{sub.first_name}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            sub.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {sub.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <p className="text-xs text-stone-400 mt-1">
                            {new Date(sub.subscribed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Broadcast History */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200">
                  <h3 className="font-semibold text-stone-800">Broadcast History</h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {adminData.broadcasts.length === 0 ? (
                    <p className="px-6 py-8 text-center text-stone-500">No broadcasts sent yet</p>
                  ) : (
                    adminData.broadcasts.map((broadcast) => (
                      <div key={broadcast.id} className="px-6 py-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-stone-800">{broadcast.subject}</p>
                          <span className="text-sm text-stone-500">
                            {broadcast.recipient_count} recipients
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          {new Date(broadcast.sent_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Email Content</label>
                <textarea
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  placeholder="Write your email content here..."
                />
              </div>

              <div className="bg-stone-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">Send Preview To</label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={previewEmail}
                    onChange={(e) => setPreviewEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="your@email.com"
                  />
                  <button
                    onClick={handleSendPreview}
                    disabled={sendingBroadcast}
                    className="px-6 py-2 bg-stone-600 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
                  >
                    Send Preview
                  </button>
                </div>
              </div>

              {broadcastResult && (
                <div className={`p-4 rounded-lg ${
                  broadcastResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {broadcastResult.message}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <p className="text-sm text-stone-500">
                  This will be sent to <strong>{adminData?.stats.activeSubscribers || 0}</strong> active subscribers
                </p>
                <button
                  onClick={handleSendBroadcast}
                  disabled={sendingBroadcast || !broadcastSubject || !broadcastContent}
                  className="px-8 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                >
                  {sendingBroadcast ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">All Subscribers</h3>
                <button
                  onClick={loadSubscribers}
                  disabled={loadingSubscribers}
                  className="px-4 py-2 text-sm bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  {loadingSubscribers ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingSubscribers ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading...</td>
                      </tr>
                    ) : allSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-stone-500">No subscribers yet</td>
                      </tr>
                    ) : (
                      allSubscribers.map((sub, index) => (
                        <tr key={index} className="hover:bg-stone-50">
                          <td className="px-6 py-4 text-sm text-stone-800">{sub.email}</td>
                          <td className="px-6 py-4 text-sm text-stone-600">{sub.first_name || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              sub.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {sub.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-500">
                            {new Date(sub.subscribed_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin;
