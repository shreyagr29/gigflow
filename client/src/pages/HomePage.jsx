import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../slices/gigSlice';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { gigs, loading, error } = useSelector((state) => state.gig);
  const [keyword, setKeyword] = React.useState('');
  const [status, setStatus] = React.useState('open');

  useEffect(() => {
    dispatch(fetchGigs({ keyword, status }));
  }, [dispatch, status, keyword]); 

  const handleSearch = (e) => {
      e.preventDefault();
      dispatch(fetchGigs({ keyword, status }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Find your next <span className="text-indigo-600 dark:text-indigo-400">Gig</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Browse through hundreds of opportunities.
        </p>

        <div className="mt-8 flex justify-center w-full max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2 w-full items-center">
                {/* Search Input */}
                <div className="relative flex-grow w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search gigs by title..." 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:text-sm bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition-colors"
                    />
                </div>

                {/* Status Dropdown */}
                <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 right-0 top-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="block w-full pl-4 pr-10 py-3 text-base border-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:text-sm rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition-colors appearance-none cursor-pointer text-gray-700 dark:text-gray-200 font-medium"
                    >
                        <option value="">All Status</option>
                        <option value="open">Open Gigs</option>
                        <option value="assigned">Assigned</option>
                    </select>
                </div>

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Search
                </button>
            </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading gigs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    <Link to={`/gigs/${gig._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      {gig.title}
                    </Link>
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    gig.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {gig.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {gig.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">Budget: ${gig.budget}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Posted by {gig.ownerId?.name || 'Unknown'}
                  </div>
                </div>
                <div className="mt-4">
                    <Link to={`/gigs/${gig._id}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-center transition-colors">
                        View Details
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
