import axiosInstance from '../utils/axiosInstance';

const API_URL = '/settings';

export interface Settings {
  id?: number;
  logoUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  countdownDate?: string;
  contactInfo?: {
    address?: string;
    email?: string;
    phone?: string;
  };
}

export const getSettings = async (): Promise<Settings> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const updateSettings = async (data: Settings): Promise<Settings> => {
  const response = await axiosInstance.post(API_URL, data);
  return response.data;
};
