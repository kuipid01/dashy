import { Filter } from '../types';

export const filters: Filter[] = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'all', label: 'All Categories' },
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Accessories', label: 'Accessories' },
      { value: 'Home', label: 'Home' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: 'all', label: 'All Prices' },
      { value: 'under-50', label: 'Under $50' },
      { value: '50-100', label: '$50 - $100' },
      { value: '100-200', label: '$100 - $200' },
      { value: 'over-200', label: 'Over $200' },
    ],
  },
  {
    id: 'rating',
    name: 'Rating',
    options: [
      { value: 'all', label: 'All Ratings' },
      { value: '4-up', label: '4 Stars & Up' },
      { value: '3-up', label: '3 Stars & Up' },
      { value: '2-up', label: '2 Stars & Up' },
    ],
  },
];