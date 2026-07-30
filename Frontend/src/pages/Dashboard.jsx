import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Search, Plus, MapPin, Calendar, Filter, X, Eye } from 'lucide-react';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modal Creation Form State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [itemCategory, setItemCategory] = useState('Electronics');
  const [itemLocation, setItemLocation] = useState('');
  const [itemDate, setItemDate] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [identifyingQuestions, setIdentifyingQuestions] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        type,
        category,
        location,
        startDate,
        endDate,
        page,
        limit: 9,
      };
      // Clean undefined params
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const res = await api.get('/items', { params });
      setItems(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, type, category, location, startDate, endDate, page]);

  // Image Selection Handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Add Verification Question Handler
  const addQuestion = () => {
    if (newQuestion.trim()) {
      setIdentifyingQuestions([...identifyingQuestions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const removeQuestion = (index) => {
    setIdentifyingQuestions(identifyingQuestions.filter((_, i) => i !== index));
  };

  // Create Listing Submission
  const handleCreateItem = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', itemType);
      formData.append('category', itemCategory);
      formData.append('location', itemLocation);
      formData.append('date', itemDate);
      
      if (identifyingQuestions.length > 0) {
        formData.append('identifyingQuestions', JSON.stringify(identifyingQuestions));
      }

      images.forEach((img) => {
        formData.append('images', img);
      });

      await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear Form & Close Modal
      setTitle('');
      setDescription('');
      setItemType('lost');
      setItemCategory('Electronics');
      setItemLocation('');
      setItemDate('');
      setImages([]);
      setImagePreviews([]);
      setIdentifyingQuestions([]);
      setShowModal(false);
      
      // Refresh feed
      fetchItems();
    } catch (err) {
      setCreateError(err.response?.data?.message || err.message || 'Error occurred while creating item listing');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-6 self-start space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Filter size={18} className="text-indigo-400" />
            <h2 className="text-md font-bold text-white">Filter Listings</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-850 focus:border-indigo-500 transition text-sm outline-none text-white"
              />
              <Search className="absolute left-3 top-3 text-slate-500" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Listing Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-sm outline-none text-white focus:border-indigo-500 transition"
            >
              <option value="">All Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-sm outline-none text-white focus:border-indigo-500 transition"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Bags & Purses">Bags & Purses</option>
              <option value="Books">Books</option>
              <option value="Keys">Keys</option>
              <option value="Clothing">Clothing</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Location</label>
            <input
              type="text"
              placeholder="e.g. Library"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-sm outline-none text-white focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase">Date Range</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-sm text-slate-300 outline-none focus:border-indigo-500 transition"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setPage(1) || setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-sm text-slate-300 outline-none focus:border-indigo-500 transition"
            />
          </div>
        </aside>

        {/* Listings Feed */}
        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Browse Listings</h1>
              <p className="text-slate-400 text-xs mt-1">Found something? Report it to help its owner.</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl font-semibold text-sm text-white"
            >
              <Plus size={16} />
              <span>Report Item</span>
            </button>
          </div>

          {loading ? (
            <div className="flex-grow flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              <p className="text-slate-500 text-sm mb-2 font-medium">No items matched your search filters</p>
              <button onClick={() => { setSearch(''); setType(''); setCategory(''); setLocation(''); setStartDate(''); setEndDate(''); }} className="text-xs text-indigo-400 hover:underline">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-slate-900 border border-slate-800 hover:border-slate-750 transition duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-950">
                      <img
                        src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide text-white ${
                        item.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase">
                        <span>{item.category}</span>
                        <span className={`px-2 py-0.5 rounded-md ${
                          item.status === 'returned' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' : 'bg-slate-950 text-slate-400 border border-slate-850'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <h3 className="text-md font-bold text-white line-clamp-1">{item.title}</h3>
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-850/50 mt-4 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex flex-col space-y-1.5">
                      <span className="flex items-center space-x-1.5">
                        <MapPin size={12} className="text-indigo-400" />
                        <span>{item.location}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Calendar size={12} className="text-indigo-400" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </span>
                    </div>
                    
                    <Link
                      to={`/items/${item._id}`}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-indigo-400 hover:text-indigo-300 hover:bg-slate-850 transition"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400 font-medium">Page {page} of {pagination.pages}</span>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:bg-slate-850 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Creation Modal Form Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">Report Lost or Found Item</h2>
            {createError && (
              <div className="mb-4 p-4 bg-red-950/50 border border-red-800/50 rounded-xl text-red-200 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateItem} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Item Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500 transition text-sm"
                    placeholder="Black Leather Wallet"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-855 text-white outline-none focus:border-indigo-500 transition text-sm"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Bags & Purses">Bags & Purses</option>
                    <option value="Books">Books</option>
                    <option value="Keys">Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="Provide dynamic descriptions to help people identify..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Listing Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-855 text-white outline-none focus:border-indigo-500 transition text-sm"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={itemLocation}
                    onChange={(e) => setItemLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-855 text-white outline-none focus:border-indigo-500 transition text-sm"
                    placeholder="e.g. Science Lab"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={itemDate}
                    onChange={(e) => setItemDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-855 text-slate-300 outline-none focus:border-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Upload Images (Max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-950 file:text-indigo-400 hover:file:bg-slate-850 cursor-pointer"
                />
                
                {imagePreviews.length > 0 && (
                  <div className="flex space-x-2 mt-3 overflow-x-auto py-1">
                    {imagePreviews.map((url, i) => (
                      <img key={i} src={url} alt="preview" className="h-14 w-14 object-cover rounded-lg border border-slate-800" />
                    ))}
                  </div>
                )}
              </div>

              {/* Identifying Verification Questions */}
              {itemType === 'found' && (
                <div className="border-t border-slate-850 pt-4">
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase">Identifying Verification Questions</label>
                  <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
                    Add questions the owner must answer to prove ownership (e.g. "What sticker is on the laptop lid?").
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Add question..."
                      className="flex-grow px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-855 text-white outline-none focus:border-indigo-500 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm text-white"
                    >
                      Add
                    </button>
                  </div>

                  {identifyingQuestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {identifyingQuestions.map((q, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-855 text-xs">
                          <span>{q}</span>
                          <button type="button" onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-300">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition text-sm text-white disabled:opacity-50"
              >
                {createLoading ? 'Submitting...' : 'Post Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
