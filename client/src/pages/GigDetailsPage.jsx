import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../slices/gigSlice';
import axios from 'axios';

const GigDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGig: gig, loading } = useSelector((state) => state.gig);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [bidMessage, setBidMessage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    dispatch(fetchGigById(id));
  }, [dispatch, id]);

  const isOwner = userInfo && gig && userInfo._id === gig.ownerId._id;
  
  useEffect(() => {
      // If owner, fetch bids
      if (isOwner) {
          axios.get(`/api/bids/${id}`)
               .then(res => setBids(res.data))
               .catch(err => console.error(err));
      }
  }, [isOwner, id]);

  const handlePlaceBid = async (e) => {
      e.preventDefault();
      try {
          await axios.post('/api/bids', { gigId: id, message: bidMessage, amount: bidAmount });
          alert('Bid placed successfully!');
          setBidMessage('');
          setBidAmount('');
      } catch (error) {
          alert(error.response?.data?.message || 'Error placing bid');
      }
  };

  const handleHire = async (bidId) => {
      try {
          await axios.patch(`/api/bids/${bidId}/hire`);
          alert('Freelancer hired!');
          // Refresh data
          dispatch(fetchGigById(id));
          // Refresh bids
          axios.get(`/api/bids/${id}`).then(res => setBids(res.data));
      } catch (error) {
          alert(error.response?.data?.message || 'Error hiring');
      }
  };

  if (loading || !gig) return <div className="text-center py-10">Loading...</div>;

  return (

    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl leading-6 font-medium text-gray-900 dark:text-white">{gig.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Posted by {gig.ownerId.name}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2 uppercase">{gig.status}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">${gig.budget}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">{gig.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Bid Section */}
      {userInfo && !isOwner && gig.status === 'open' && (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 border border-gray-200 dark:border-gray-700 w-full md:w-2/3 md:mx-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Place a Bid</h3>
          <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proposal</label>
                  <textarea required value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3}></textarea>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bid Amount ($)</label>
                  <input type="number" required value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <button type="submit" className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform active:scale-95">
                  Submit Bid
              </button>
          </form>
        </div>
      )}

      {/* Owner View - Bids */}
      {isOwner && (
          <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bids ({bids.length})</h3>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-200 dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {bids.map(bid => (
                          <li key={bid._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                      {bid.freelancerId.name} (${bid.amount})
                                  </div>
                                  <div className="ml-2 flex-shrink-0 flex">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          bid.status === 'hired' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                          bid.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      }`}>
                                          {bid.status}
                                      </span>
                                  </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                  <div className="sm:flex">
                                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                          {bid.message}
                                      </p>
                                  </div>
                                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                                      {bid.status === 'pending' && gig.status === 'open' && (
                                          <button onClick={() => handleHire(bid._id)} className="ml-2 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                              Hire
                                          </button>
                                      )}
                                  </div>
                              </div>
                          </li>
                      ))}
                      {bids.length === 0 && <li className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">No bids yet.</li>}
                  </ul>
              </div>
          </div>
      )}
    </div>
  );
};

export default GigDetailsPage;
