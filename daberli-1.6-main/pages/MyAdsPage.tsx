import { MessageSquare, Pencil, Send, ShieldAlert, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Ad, AdMessage, User } from '../types';

interface MyAdsPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  adMessages: Record<string, AdMessage[]>;
  onSendReply: (adId: string, text: string) => void;
  onUpdateAd: (adId: string, updates: Partial<Ad>) => void;
  onDeleteAd: (adId: string) => void;
}

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700'
};

const MyAdsPage: React.FC<MyAdsPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  adMessages,
  onSendReply,
  onUpdateAd,
  onDeleteAd
}) => {
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [editAdId, setEditAdId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    title: '',
    price: '',
    currency: 'DZD',
    location: ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          onPostAd={onPostAdClick}
          selectedWilaya="All"
          onWilayaChange={() => {}}
        />

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
          <p className="text-gray-500 mt-2">Please sign in to view and manage your ads.</p>
        </div>
      </div>
    );
  }

  const myAds = ads.filter((ad) => ad.postedByUserId === user.id);

  const handleReplySubmit = (adId: string) => {
    const draft = (replyDrafts[adId] ?? '').trim();
    if (!draft) return;

    onSendReply(adId, draft);
    setReplyDrafts((prev) => ({ ...prev, [adId]: '' }));
  };

  const startEditing = (ad: Ad) => {
    setEditAdId(ad.id);
    setEditDraft({
      title: ad.title,
      price: ad.price.toString(),
      currency: ad.currency,
      location: ad.location
    });
  };

  const cancelEditing = () => {
    setEditAdId(null);
    setEditDraft({
      title: '',
      price: '',
      currency: 'DZD',
      location: ''
    });
  };

  const saveEditing = (adId: string) => {
    const priceValue = Number(editDraft.price);
    if (!editDraft.title.trim() || Number.isNaN(priceValue)) return;

    onUpdateAd(adId, {
      title: editDraft.title.trim(),
      price: priceValue,
      currency: editDraft.currency,
      location: editDraft.location.trim()
    });
    cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya="All"
        onWilayaChange={() => {}}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Ads</h1>
          <p className="text-gray-500 mt-2">Review your posts and reply to buyer messages.</p>
        </div>

        {myAds.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <MessageSquare className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-900">No ads posted yet</p>
            <p className="text-sm text-gray-500 mt-1">Post your first ad to start receiving messages.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myAds.map((ad) => {
              const messages = adMessages[ad.id] ?? [];
              const status = ad.approvalStatus ?? 'pending';

              return (
                <div key={ad.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
                    <div className="h-56 lg:h-full bg-gray-100">
                      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 uppercase">{ad.category}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? statusStyles.pending}`}>
                          {status}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(ad)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this ad?')) {
                                onDeleteAd(ad.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>

                      {editAdId === ad.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                            <input
                              type="text"
                              value={editDraft.title}
                              onChange={(e) => setEditDraft((prev) => ({ ...prev, title: e.target.value }))}
                              title="Edit title"
                              placeholder="Ad title"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                              <input
                                type="number"
                                min="0"
                                value={editDraft.price}
                                onChange={(e) => setEditDraft((prev) => ({ ...prev, price: e.target.value }))}
                                title="Edit price"
                                placeholder="0"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Unit</label>
                              <select
                                value={editDraft.currency}
                                onChange={(e) => setEditDraft((prev) => ({ ...prev, currency: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue bg-white"
                                title="Currency"
                              >
                                <option value="DZD">DZD</option>
                                <option value="Negotiable">Negotiable</option>
                                <option value="DZD/day">DZD/day</option>
                                <option value="DZD/month">DZD/month</option>
                                <option value="DZD/hour">DZD/hour</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                            <input
                              type="text"
                              value={editDraft.location}
                              onChange={(e) => setEditDraft((prev) => ({ ...prev, location: e.target.value }))}
                              title="Edit location"
                              placeholder="Location"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => saveEditing(ad.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-daberli-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                            >
                              <Pencil className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-bold text-gray-900">{ad.title}</h2>
                          <p className="text-sm text-gray-500 mt-1">{ad.location} • {ad.datePosted}</p>
                          <p className="text-base font-semibold text-gray-900 mt-2">{ad.price.toLocaleString()} {ad.currency}</p>
                        </>
                      )}

                      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Messages ({messages.length})</p>

                        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                          {messages.length === 0 ? (
                            <p className="text-sm text-gray-500">No messages yet for this ad.</p>
                          ) : (
                            messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`rounded-lg px-3 py-2 text-sm ${msg.senderRole === 'owner' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800 border border-gray-200'}`}
                              >
                                <p className="font-semibold text-xs mb-0.5">{msg.senderName}</p>
                                <p>{msg.text}</p>
                                <p className="text-[11px] opacity-70 mt-1">{msg.timestamp}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={replyDrafts[ad.id] ?? ''}
                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [ad.id]: e.target.value }))}
                            placeholder="Write a reply..."
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue text-sm"
                          />
                          <button
                            onClick={() => handleReplySubmit(ad.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-daberli-blue hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdsPage;
