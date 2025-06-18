import axios from 'axios';

export const uploadImageToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'pacientes-app'); // el que creaste

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dxqhpochd/image/upload',
      data
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};
