import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [myGigs, setMyGigs] = useState([]);

  useEffect(() => {
    const fetchMyGigs = async () => {
        try {
            const { data } = await axios.get('/api/gigs/mygigs');
            setMyGigs(data);
        } catch (error) {
            console.error(error);
        }
    };
    if (userInfo) fetchMyGigs();
  }, [userInfo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Client Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/post-gig" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Post New Gig
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {myGigs.map((gig) => (
            <li key={gig._id}>
              <Link to={`/gigs/${gig._id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{gig.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gig.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Budget: ${gig.budget}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Posted on {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {myGigs.length === 0 && (
              <li className="px-4 py-4 text-center text-gray-500">You haven't posted any gigs yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
