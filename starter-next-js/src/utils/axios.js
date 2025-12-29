import axios from 'axios';

import { CONFIG } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  // Garder uniquement les catégories
  categories: {
    list: '/categories',
    create: '/categories',
    details: (id) => `/categories/${id}`,
    update: (id) => `/categories/${id}`,
    delete: (id) => `/categories/${id}`,
  },
};


