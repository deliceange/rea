import theLove from '../images/the love.webp';
import theVoice from '../images/the voice.webp';
import house from '../images/house.webp';
import supernatural from '../images/supernatural.webp';
import spiderman from '../images/spiderman.webp';
import fromImg from '../images/from.webp';
import projectCrown from '../images/project_crown.webp';
import thrash from '../images/thrash.webp';
import theBoys from '../images/the boys.webp';

export const initialMovies = [

  {
    id: 1,
    title: 'The Love',
    genre: 'Romance',
    releaseYear: 2024,
    rentalPrice: 150,
    totalDvds: 5,
    availableDvds: 3,
    coverImage: theLove,
    description: 'A heartfelt journey of love and redemption.',
    createdAt: '2026-01-15',
  },

  {
    id: 2,
    title: 'The Voice',
    genre: 'Drama',
    releaseYear: 2023,
    rentalPrice: 200,
    totalDvds: 4,
    availableDvds: 1,
    coverImage: theVoice,
    description: 'A singing competition that changes lives.',
    createdAt: '2026-01-20',
  },

  {
    id: 3,
    title: 'House',
    genre: 'Horror',
    releaseYear: 2023,
    rentalPrice: 180,
    totalDvds: 6,
    availableDvds: 4,
    coverImage: house,
    description: 'A family moves into a house with a dark past.',
    createdAt: '2026-02-01',
  },

  {
    id: 4,
    title: 'Supernatural',
    genre: 'Horror',
    releaseYear: 2023,
    rentalPrice: 160,
    totalDvds: 3,
    availableDvds: 2,
    coverImage: supernatural,
    description: 'Two brothers fight against supernatural forces.',
    createdAt: '2026-02-05',
  },

  {
    id: 5,
    title: 'Spiderman',
    genre: 'Action',
    releaseYear: 2024,
    rentalPrice: 220,
    totalDvds: 8,
    availableDvds: 6,
    coverImage: spiderman,
    description: 'Spider-man must protect New York from dangerous villains.',
    createdAt: '2026-02-10',
  },

  {
    id: 6,
    title: 'From',
    genre: 'Thriller',
    releaseYear: 2024,
    rentalPrice: 150,
    totalDvds: 4,
    availableDvds: 4,
    coverImage: fromImg,
    description: 'A mysterious town where nothing is what it seems.',
    createdAt: '2026-02-15',
  },

  {
    id: 7,
    title: 'Project Crown',
    genre: 'Action',
    releaseYear: 2024,
    rentalPrice: 170,
    totalDvds: 7,
    availableDvds: 2,
    coverImage: projectCrown,
    description: 'An elite team takes on a dangerous mission.',
    createdAt: '2026-02-20',
  },

  {
    id: 8,
    title: 'Thrash',
    genre: 'Action',
    releaseYear: 2024,
    rentalPrice: 250,
    totalDvds: 5,
    availableDvds: 0,
    coverImage: thrash,
    description: 'A warrior fights for freedom in an epic battle.',
    createdAt: '2026-03-01',
  },

  {
    id: 9,
    title: 'The Boys',
    genre: 'Action',
    releaseYear: 2024,
    rentalPrice: 200,
    totalDvds: 10,
    availableDvds: 5,
    coverImage: theBoys,
    description: 'A group of vigilantes takes on corrupt superheroes.',
    createdAt: '2026-03-05',
  },
];

export const initialCustomers = [
  {
    id: 1,
    name: 'Jean Doe',
    email: 'jean.doe@email.com',
    phone: '+250 788 123 456',
    address: 'Kigali, Rwanda',
    joinedDate: '2025-06-15',
    totalRentals: 12,
  },
  {
    id: 2,
    name: 'Marie Mukamana',
    email: 'marie.mukamana@email.com',
    phone: '+250 788 234 567',
    address: 'Butare, Rwanda',
    joinedDate: '2025-07-20',
    totalRentals: 8,
  },
  {
    id: 3,
    name: 'Paul Bizimana',
    email: 'paul.bizimana@email.com',
    phone: '+250 788 345 678',
    address: 'Musanze, Rwanda',
    joinedDate: '2025-08-10',
    totalRentals: 15,
  },
  {
    id: 4,
    name: 'Grace Uwilingiyimana',
    email: 'grace.uwilingiyimana@email.com',
    phone: '+250 788 456 789',
    address: 'Rubavu, Rwanda',
    joinedDate: '2025-09-05',
    totalRentals: 6,
  },
  {
    id: 5,
    name: 'David Habimana',
    email: 'david.habimana@email.com',
    phone: '+250 788 567 890',
    address: 'Huye, Rwanda',
    joinedDate: '2025-10-12',
    totalRentals: 10,
  },
];

export const initialRentals = [
  {
    id: 1,
    movieId: 1,
    customerId: 1,
    rentalDate: '2026-03-01',
    expectedReturnDate: '2026-03-08',
    actualReturnDate: '2026-03-07',
    status: 'returned',
    lateFee: 0,
  },
  {
    id: 2,
    movieId: 2,
    customerId: 2,
    rentalDate: '2026-03-05',
    expectedReturnDate: '2026-03-12',
    actualReturnDate: '2026-03-15',
    status: 'returned',
    lateFee: 1500,
  },
  {
    id: 3,
    movieId: 5,
    customerId: 3,
    rentalDate: '2026-03-10',
    expectedReturnDate: '2026-03-17',
    actualReturnDate: null,
    status: 'active',
    lateFee: 0,
  },
  {
    id: 4,
    movieId: 3,
    customerId: 1,
    rentalDate: '2026-03-15',
    expectedReturnDate: '2026-03-22',
    actualReturnDate: null,
    status: 'active',
    lateFee: 0,
  },
  {
    id: 5,
    movieId: 8,
    customerId: 5,
    rentalDate: '2026-03-18',
    expectedReturnDate: '2026-03-25',
    actualReturnDate: null,
    status: 'active',
    lateFee: 0,
  },
];

export const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Crime',
  'Thriller',
  'Animation',
  'Documentary',
];

export const rentalStats = {
  popularGenres: [
    { name: 'Action', value: 35 },
    { name: 'Drama', value: 25 },
    { name: 'Sci-Fi', value: 20 },
    { name: 'Crime', value: 12 },
    { name: 'Comedy', value: 8 },
  ],
  rentalFrequency: [
    { month: 'Jan', rentals: 45 },
    { month: 'Feb', rentals: 52 },
    { month: 'Mar', rentals: 68 },
    { month: 'Apr', rentals: 55 },
  ],
  lateReturns: [
    { month: 'Jan', late: 5 },
    { month: 'Feb', late: 8 },
    { month: 'Mar', late: 3 },
    { month: 'Apr', late: 6 },
  ],
  customerActivity: [
    { name: 'Active', value: 78 },
    { name: 'Inactive', value: 22 },
  ],
};