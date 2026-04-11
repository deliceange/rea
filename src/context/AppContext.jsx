import { createContext, useContext, useState, useCallback } from 'react';
import { initialMovies, initialCustomers, initialRentals } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [movies, setMovies] = useState(initialMovies);
  const [customers, setCustomers] = useState(initialCustomers);
  const [rentals, setRentals] = useState(initialRentals);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addMovie = useCallback((movie) => {
    const newMovie = {
      ...movie,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMovies((prev) => [...prev, newMovie]);
    return newMovie;
  }, []);

  const updateMovie = useCallback((id, updates) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === id ? { ...movie, ...updates } : movie))
    );
  }, []);

  const deleteMovie = useCallback((id) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  }, []);

  const addCustomer = useCallback((customer) => {
    const newCustomer = {
      ...customer,
      id: Date.now(),
      joinedDate: new Date().toISOString().split('T')[0],
      totalRentals: 0,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id, updates) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
  }, []);

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }, []);

  const createRental = useCallback((rental) => {
    const newRental = {
      ...rental,
      id: Date.now(),
      status: 'active',
      lateFee: 0,
    };
    setRentals((prev) => [...prev, newRental]);
    
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === rental.customerId
          ? { ...c, totalRentals: c.totalRentals + 1 }
          : c
      )
    );
    
    return newRental;
  }, []);

  const returnRental = useCallback((id, actualReturnDate) => {
    const rental = rentals.find((r) => r.id === id);
    if (!rental) return;

    const expected = new Date(rental.expectedReturnDate);
    const actual = new Date(actualReturnDate);
    const diffDays = Math.floor((actual - expected) / (1000 * 60 * 60 * 24));
    const lateFee = diffDays > 0 ? diffDays * 500 : 0;

    setRentals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              actualReturnDate,
              status: 'returned',
              lateFee,
            }
          : r
      )
    );
  }, [rentals]);

  const deleteRental = useCallback((id) => {
    setRentals((prev) => prev.filter((rental) => rental.id !== id));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

 const getMovieRentals = useCallback((movieId) => {
    return rentals
      .filter((r) => r.movieId === movieId)
      .map((r) => {
        const customer = customers.find((c) => c.id === r.customerId);
        return { ...r, customerName: customer?.name || 'Unknown' };
      });
  }, [rentals, customers]);

  const getCustomerRentals = useCallback((customerId) => {
    return rentals
      .filter((r) => r.customerId === customerId)
      .map((r) => {
        const movie = movies.find((m) => m.id === r.movieId);
        return { ...r, movieTitle: movie?.title || 'Unknown' };
      });
  }, [rentals, movies]);

  const value = {
    movies,
    customers,
    rentals,
    sidebarOpen,
    addMovie,
    updateMovie,
    deleteMovie,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    createRental,
    returnRental,
    deleteRental,
    toggleSidebar,
    getMovieRentals,
    getCustomerRentals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};