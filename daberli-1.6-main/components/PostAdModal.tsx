import { AlignLeft, DollarSign, Image as ImageIcon, Loader2, MapPin, Tag, Type, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { WILAYAS } from '../constants';
import { Category } from '../types';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adData: any) => void;
}

const PostAdModal: React.FC<PostAdModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'auto' as Category,
    price: '',
    currency: 'DZD',
    location: '',
    image: '',
    listingType: '' as '' | 'rent' | 'buy' | 'sale' | 'exchange',
    propertyType: '' as '' | 'apartment' | 'house' | 'villa' | 'studio' | 'land' | 'shop',
    jobType: '' as '' | 'full-time' | 'part-time' | 'contract' | 'remote',
    serviceType: '' as '' | 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'cleaning' | 'moving' | 'mechanics',
    description: ''
  });

  useEffect(() => {
    return () => {
      if (formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
      }
    };
  }, [formData.image]);

  if (!isOpen) return null;

  const resetForm = () => {
    if (formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }

    setFormData({
      title: '',
      category: 'auto',
      price: '',
      currency: 'DZD',
      location: '',
      image: '',
      listingType: '',
      propertyType: '',
      jobType: '',
      serviceType: '',
      description: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API network delay
    setTimeout(() => {
      onSubmit({
        ...formData,
        price: Number(formData.price),
        // For demo purposes, we map description to a detail field or just pass it
        details: { 
            Description: formData.description.substring(0, 30) + (formData.description.length > 30 ? '...' : ''),
            Posted: 'Just now'
        }
      });
      setIsLoading(false);
      onClose();
      resetForm();
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-gray-100">
          
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Post a New Ad</h3>
            <button 
                type="button"
                title="Close modal"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm"
                    placeholder="e.g., Apartment for rent in Oran"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        aria-label="Select category"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm appearance-none bg-white"
                    >
                      <option value="auto">Vehicle</option>
                      <option value="real-estate">Real Estate</option>
                        <option value="jobs">Careers (Jobs)</option>
                      <option value="services">Services</option>
                    </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Wilaya</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        aria-label="Select Wilaya"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm appearance-none bg-white"
                    >
                        <option value="">Select Wilaya</option>
                        {WILAYAS.map((w) => (
                        <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                        ))}
                    </select>
                    </div>
                </div>
              </div>

              {(formData.category === 'auto' || formData.category === 'real-estate') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Type</label>
                  <select
                    name="listingType"
                    required
                    value={formData.listingType}
                    onChange={handleChange}
                    title="Listing type"
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                    <option value="exchange">Exchange</option>
                  </select>
                </div>
              )}

              {formData.category === 'real-estate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Building Type</label>
                  <select
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleChange}
                    title="Building type"
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm bg-white"
                  >
                    <option value="">Select building type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="land">Land</option>
                    <option value="shop">Shop</option>
                  </select>
                </div>
              )}

              {formData.category === 'jobs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                  <select
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    title="Job type"
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm bg-white"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              )}

              {formData.category === 'services' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Type</label>
                  <select
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleChange}
                    title="Service type"
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm bg-white"
                  >
                    <option value="">Select service type</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="painter">Painter</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="moving">Moving</option>
                    <option value="mechanics">Mechanics</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm"
                        placeholder="0.00"
                    />
                    </div>
                </div>
                {/* Currency/Unit (Simplified for demo) */}
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        aria-label="Select currency or unit"
                        className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm bg-white"
                     >
                         <option value="DZD">DZD (Fixed)</option>
                       <option value="Negotiable">Negotiable</option>
                         <option value="DZD/day">DZD/day</option>
                         <option value="DZD/month">DZD/month</option>
                         <option value="DZD/hour">DZD/hour</option>
                     </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="ad-image-upload" className="block text-sm font-medium text-gray-700 mb-1.5">Upload Image</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="ad-image-upload"
                    type="file"
                    name="image"
                    required
                    accept="image/*"
                    title="Upload ad image"
                    aria-label="Upload ad image"
                    onChange={handleImageUpload}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm"
                  />
                </div>
                {formData.image && (
                  <div className="mt-3 relative h-48 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm group">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image'}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                         <span className="text-white text-xs font-semibold">Image Preview</span>
                    </div>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">Upload any image file type from your device.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <AlignLeft className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue transition-all sm:text-sm"
                    placeholder="Describe your service or item..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-daberli-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-daberli-blue disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Publishing...
                    </>
                    ) : (
                    <>
                        Post Ad
                    </>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAdModal;