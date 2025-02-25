import { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Tab } from '@headlessui/react'; // You'll need to install @headlessui/react

const AdminDashboard = () => {
  const { isAdmin, updateAdminStatus } = useAuth();
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  // Fetch cars from Firestore
  const fetchCars = async () => {
    try {
      const carsQuery = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(carsQuery);
      const carList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setDashboardError(error.message);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setDashboardError(error.message);
    }
  };

  const fetchPurchaseRequests = async () => {
    if (!isAdmin) return;
    
    try {
      const requestsQuery = query(
        collection(db, 'purchaseRequests'), 
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(requestsQuery);
      const requestsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? new Date(doc.data().createdAt) : new Date()
      }));
      setPurchaseRequests(requestsList);
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
      setDashboardError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDashboardError(null);
      try {
        await Promise.all([fetchCars(), fetchUsers()]);
      } catch (error) {
        setDashboardError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'cars'), {
        ...newCar,
        createdAt: new Date().toISOString()
      });

      setNewCar({
        make: '',
        model: '',
        year: '',
        price: '',
        description: '',
        imageUrl: ''
      });

      fetchCars();
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePrice = async (carId, newPrice) => {
    try {
      await updateDoc(doc(db, 'cars', carId), {
        price: newPrice
      });
      fetchCars();
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await updateAdminStatus(userId, !currentStatus);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (dashboardError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Permission Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{dashboardError}</p>
                <p className="mt-2">This is likely due to missing Firebase permissions. Please make sure:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Your Firestore security rules are properly configured</li>
                  <li>Your account has admin privileges</li>
                  <li>You're signed in with the correct account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Cars
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Users
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Purchase Requests
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="make"
                      value={newCar.make}
                      onChange={handleInputChange}
                      placeholder="Make"
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="model"
                      value={newCar.model}
                      onChange={handleInputChange}
                      placeholder="Model"
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      name="year"
                      value={newCar.year}
                      onChange={handleInputChange}
                      placeholder="Year"
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      value={newCar.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="border p-2 rounded"
                      required
                    />
                  </div>
                  <textarea
                    name="description"
                    value={newCar.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="border p-2 rounded w-full"
                    rows="4"
                    required
                  />
                  <input
                    type="url"
                    name="imageUrl"
                    value={newCar.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Image URL (e.g., https://example.com/car.jpg)"
                    className="border p-2 rounded w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Car
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Car Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cars.map(car => (
                    <div key={car.id} className="border p-4 rounded">
                      <img
                        src={car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold">{car.make} {car.model}</h3>
                      <p className="text-gray-600">{car.year}</p>
                      <div className="flex items-center mt-2">
                        <input
                          type="number"
                          defaultValue={car.price}
                          className="border p-1 rounded w-24 mr-2"
                          onBlur={(e) => handleUpdatePrice(car.id, e.target.value)}
                        />
                        <span className="text-gray-700">USD</span>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{car.description}</p>
                    </div>
                  ))}
                </div>
                {cars.length === 0 && (
                  <p className="text-gray-500 text-center">No cars available. Add your first car!</p>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName || 'Anonymous User'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                            className={`px-3 py-1 rounded ${user.isAdmin ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                          >
                            {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <p className="text-gray-500 text-center py-4">No users found.</p>
              )}
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Purchase Requests</h2>
              <div id="requests-container">
                {/* This will be populated with purchase requests */}
                <p className="text-gray-500 text-center">No purchase requests yet.</p>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminDashboard;