import axios from 'axios'

const baseUrl = '/api/image'

export const postImage = async (file) => {
  try {
    // Tạo một đối tượng FormData để chứa file ảnh
    const formData = new FormData();
    formData.append('file', file); // 'file' là tên trường giống với backend

    // Gửi request POST tới endpoint /api/image
    const response = await axios.post(baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Xử lý phản hồi từ server
    console.log('File uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default {
  postImage
}