import axios from 'axios';

export const customInstance = axios.create({
  baseURL: '/api'
});

customInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('tma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customFetch = async <T>(config: any, options?: any): Promise<T> => {
  const { data } = await customInstance({ ...config, ...options });
  return data;
};
