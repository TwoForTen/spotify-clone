import axios, { AxiosInstance } from 'axios';

export interface Options {
  url: string;
  method: 'get' | 'put' | 'post';
  position_ms?: number;
  context_uri?: string;
  position?: number;
}

const axiosInstance = (access_token: string): AxiosInstance =>
  axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

export default axiosInstance;
