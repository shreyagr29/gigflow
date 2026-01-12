import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGig } from '../slices/gigSlice';
import { useNavigate } from 'react-router-dom';

const PostGigPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createGig({ title, description, budget }));
    navigate('/');
  };

  return (

    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Post a New Gig</h1>
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 md:mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget ($)</label>
          <input type="number" required value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
        <button type="submit" className="w-full flex justify-center py-3 md:py-4 px-4 border border-transparent rounded-lg shadow-sm text-base md:text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform active:scale-95">
          Post Gig
        </button>
      </form>
    </div>
  );
};

export default PostGigPage;
