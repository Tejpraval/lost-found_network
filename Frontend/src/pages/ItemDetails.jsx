import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, Calendar, CheckCircle2, XCircle, Trash2, ArrowLeft, Send } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [userClaim, setUserClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments State
  const [commentContent, setCommentContent] = useState('');

  // Claim Submission State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimAnswers, setClaimAnswers] = useState([]);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  const isOwner = item && user && item.reporter?._id === user._id;

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1) Fetch Item Details
      const itemRes = await api.get(`/items/${id}`);
      setItem(itemRes.data.data.item);

      // 2) Fetch Comments
      const commentsRes = await api.get(`/comments/item/${id}`);
      setComments(commentsRes.data.data.comments);

      // 3) Conditional Claims Fetches
      if (user) {
        if (itemRes.data.data.item.reporter?._id === user._id) {
          // If Owner, fetch incoming claims
          const claimsRes = await api.get(`/claims/item/${id}`);
          setClaims(claimsRes.data.data.claims);
        } else {
          // If regular user, check if already claimed
          const myClaimsRes = await api.get('/claims/my-claims');
          const existing = myClaimsRes.data.data.claims.find((c) => c.item?._id === id);
          setUserClaim(existing);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  // Comment Submission Handler
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const res = await api.post('/comments', {
        item: id,
        content: commentContent.trim()
      });
      setComments([...comments, res.data.data.comment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    }
  };

  // Comment Deletion Handler
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  // Claim Submission Handler
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimLoading(true);
    setClaimError('');

    try {
      const res = await api.post('/claims', {
        item: id,
        answers: claimAnswers,
        message: claimMessage
      });
      setUserClaim(res.data.data.claim);
      setShowClaimForm(false);
      fetchData();
    } catch (err) {
      setClaimError(err.response?.data?.message || err.message || 'Failed to submit claim request');
    } finally {
      setClaimLoading(false);
    }
  };

  // Claim Processing (Approve / Reject) Handler
  const handleProcessClaim = async (claimId, status) => {
    try {
      await api.patch(`/claims/${claimId}/process`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Listing handler
  const handleDeleteItem = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/items/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Listing not found</h2>
        <Link to="/dashboard" className="text-indigo-400 mt-4 hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow flex flex-col gap-8">
        
        {/* Navigation Toolbar */}
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          
          {isOwner && (
            <button
              onClick={handleDeleteItem}
              className="px-4 py-2 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition rounded-xl text-xs font-bold border border-red-950"
            >
              Delete Listing
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Images and Metadata */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gallery card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-6">
                <img
                  src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wide text-white ${
                  item.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {item.type}
                </span>
                
                <span className="text-xs text-slate-500 font-bold uppercase">{item.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{item.title}</h1>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 text-sm text-slate-400 border-y border-slate-850 py-4">
                <span className="flex items-center space-x-2">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>{item.location}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar size={16} className="text-indigo-400" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-white mb-2">Description</h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>
            </div>

            {/* Discussion / Comments Board */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Discussion Board</h3>
              
              {/* Write Comment */}
              {user ? (
                <form onSubmit={handlePostComment} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    required
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Ask a question or offer details..."
                    className="flex-grow px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500 transition text-sm"
                  />
                  <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition">
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <p className="text-slate-500 text-xs mb-6">Log in to write a comment.</p>
              )}

              {/* List Comments */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-slate-500 text-xs py-4 text-center">No comments posted yet</p>
                ) : (
                  comments.map((comment) => {
                    const isCommentAuthor = user && comment.author?._id === user._id;
                    const isItemReporter = user && item.reporter?._id === user._id;
                    const canDelete = isCommentAuthor || isItemReporter || (user && user.role === 'admin');

                    return (
                      <div key={comment._id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 flex justify-between items-start">
                        <div className="text-left">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold text-white">{comment.author?.name}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">{comment.content}</p>
                        </div>

                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-400 hover:text-red-300 p-1.5 transition rounded-lg hover:bg-red-950/20"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Claims Handler */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
              
              {/* IF FINDER/OWNER: List incoming claims */}
              {isOwner ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Ownership Claims</h3>
                  
                  {item.status === 'returned' ? (
                    <div className="p-4 bg-indigo-950/20 border border-indigo-900 rounded-xl text-center">
                      <CheckCircle2 className="text-indigo-400 mx-auto mb-2" size={24} />
                      <p className="text-xs font-semibold text-white">Returned & Closed</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        This item listing is resolved.
                      </p>
                    </div>
                  ) : claims.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">No claim requests submitted yet</p>
                  ) : (
                    <div className="space-y-4">
                      {claims.map((claim) => (
                        <div key={claim._id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-left space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                              {claim.claimer?.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{claim.claimer?.name}</p>
                              <span className="text-[10px] text-slate-500">{claim.claimer?.email}</span>
                            </div>
                          </div>

                          {claim.message && (
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850/50 text-[11px] text-slate-400 italic">
                              "{claim.message}"
                            </div>
                          )}

                          {/* Verification Q&A mappings */}
                          {item.identifyingQuestions && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Verification Answers</p>
                              {item.identifyingQuestions.map((q, qIdx) => (
                                <div key={qIdx} className="text-[11px] border-l-2 border-indigo-500 pl-2 py-0.5">
                                  <p className="text-slate-500 font-medium">Q: {q}</p>
                                  <p className="text-slate-300 font-bold mt-0.5">A: {claim.answers?.[qIdx] || 'No Answer'}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {claim.status === 'pending' ? (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleProcessClaim(claim._id, 'approved')}
                                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[11px] font-semibold text-white transition"
                              >
                                <CheckCircle2 size={12} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleProcessClaim(claim._id, 'rejected')}
                                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 bg-red-950/20 text-red-400 border border-red-950 rounded-lg text-[11px] font-semibold transition"
                              >
                                <XCircle size={12} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <div className="pt-2 text-center text-xs font-semibold">
                              <span className={claim.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>
                                {claim.status === 'approved' ? 'Claim Approved' : 'Claim Rejected'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                
                // IF VIEWER: Display Claim submission box
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Item Recovery</h3>
                  
                  {item.status === 'returned' ? (
                    <div className="p-4 bg-indigo-950/20 border border-indigo-900 rounded-xl text-center">
                      <CheckCircle2 className="text-indigo-400 mx-auto mb-2" size={24} />
                      <p className="text-xs font-semibold text-white">Listing Closed</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        This item has already been returned to its owner.
                      </p>
                    </div>
                  ) : item.type === 'lost' ? (
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-center">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        This is a lost report. If you have found this item, please write a comment in the board to coordinate handover.
                      </p>
                    </div>
                  ) : userClaim ? (
                    
                    // User already has claim
                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-center space-y-3">
                      <p className="text-xs font-semibold text-white">Claim Request Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        userClaim.status === 'approved' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900' :
                        userClaim.status === 'rejected' ? 'bg-red-950/20 text-red-400 border border-red-950' :
                        'bg-yellow-950/20 text-yellow-400 border border-yellow-900'
                      }`}>
                        {userClaim.status}
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                        {userClaim.status === 'pending' ? 'Your answers have been forwarded to the finder. Awaiting response.' :
                         userClaim.status === 'approved' ? 'Congratulations! Your claim is approved. Coordinate return details on comment board.' :
                         'Your claim request was rejected. If you think this is a mistake, you can write a comment.'}
                      </p>
                    </div>
                  ) : showClaimForm ? (
                    
                    // Submit Questionnaire Form
                    <form onSubmit={handleClaimSubmit} className="space-y-4 text-left">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Verification Questions</h4>
                      {claimError && (
                        <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-200 text-xs">
                          {claimError}
                        </div>
                      )}

                      {item.identifyingQuestions?.map((q, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">{q}</label>
                          <input
                            type="text"
                            required
                            value={claimAnswers[idx] || ''}
                            onChange={(e) => {
                              const updated = [...claimAnswers];
                              updated[idx] = e.target.value;
                              setClaimAnswers(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500 transition text-xs"
                            placeholder="Your answer..."
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Message (Optional)</label>
                        <textarea
                          rows={2}
                          value={claimMessage}
                          onChange={(e) => setClaimMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-white outline-none focus:border-indigo-500 transition text-xs"
                          placeholder="Provide other details..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={claimLoading}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs text-white disabled:opacity-50"
                        >
                          Submit Claim
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClaimForm(false)}
                          className="px-3 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    
                    // Show Button to open form
                    <button
                      onClick={() => user ? setShowClaimForm(true) : navigate('/login')}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-sm text-white transition shadow-lg shadow-indigo-950/40"
                    >
                      {user ? 'Claim this Item' : 'Log in to Claim'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ItemDetails;
