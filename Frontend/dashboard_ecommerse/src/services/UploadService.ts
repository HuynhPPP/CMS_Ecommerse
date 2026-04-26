import axiosInstance from '../utils/axiosInstance';

const UploadService = {
  uploadSingle: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // { imageUrl, publicId }
  },
  
  deleteImage: async (publicId: string) => {
    const res = await axiosInstance.delete('/upload', {
      data: { publicId }
    });
    return res.data;
  }
};

export default UploadService;
