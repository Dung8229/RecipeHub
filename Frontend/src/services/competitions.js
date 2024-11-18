import axios from 'axios'
import imageService from './image'

const baseUrl = '/api/competitions'

const getAll = async (status) => {
  try {
      // Gửi yêu cầu GET tới backend với query parameter status
      const response = await axios.get(baseUrl, {
          params: { status }
      });

      // Trả về danh sách các cuộc thi
      return response.data;
  } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

const getDetail = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}`)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

const getLeaderboard = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}/leaderboard`)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition leaderboard id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

// Hàm tạo competition mới
const create = async (title, imageFile = null, imageURL = "", description, detailDescription, startDate, endDate, prize) => {
    try {
      // Kiểm tra nếu có file ảnh thì upload và lấy đường dẫn ảnh
      let image;
      if (imageFile) {
        // Gọi API để upload ảnh và lấy đường dẫn
        image = await imageService.postImage(imageFile); // Giả sử imageService.postImage là hàm upload ảnh
        image = 'http://localhost:3000/' + image
        image = image.replace('\\', '/')
      } else if (imageURL) {
        // Nếu không có file, sử dụng imageURL đã được cung cấp
        image = imageURL;
      } else {
        // Nếu không có cả file ảnh và imageURL, trả về lỗi
        throw new Error("Image is required.");
      }
  
      // Tạo dữ liệu competition
      const competitionData = {
        title,
        image, // Đường dẫn ảnh đã được upload hoặc URL ảnh
        description,
        detailDescription,
        startDate,
        endDate,
        prize,
      };
  
      // Gửi yêu cầu tạo competition lên server
      const response = await axios.post(baseUrl, competitionData);
      console.log('Competition created successfully:', response.data);

      return response.data
    } catch (error) {
      console.error('Error creating competition:', error);
    }
};

// Hàm update 1 competition
const update = async (id, title, imageFile = null, imageURL = "", description, detailDescription, startDate, endDate, prize) => {
  try {
    // Kiểm tra nếu có file ảnh thì upload và lấy đường dẫn ảnh
    let image;
    if (imageFile) {
      // Gọi API để upload ảnh và lấy đường dẫn
      image = await imageService.postImage(imageFile); // Giả sử imageService.postImage là hàm upload ảnh
      image = 'http://localhost:3000/' + image
      image = image.replace('\\', '/')
    } else if (imageURL) {
      // Nếu không có file, sử dụng imageURL đã được cung cấp
      image = imageURL;
    } else {
      // Nếu không có cả file ảnh và imageURL, trả về lỗi
      throw new Error("Image is required.");
    }

    // Tạo dữ liệu competition
    const competitionData = {
      title,
      image, // Đường dẫn ảnh đã được upload hoặc URL ảnh
      description,
      detailDescription,
      startDate,
      endDate,
      prize,
    };

    // Gửi yêu cầu update competition lên server
    const response = await axios.put(`${baseUrl}/${id}`, competitionData);
    console.log('Competition updated successfully:', response.data);

    return response.data
  } catch (error) {
    console.error('Error creating competition:', error);
  }
}

// Hàm xóa 1 competition
const deleteCompetition = async (id) => {
    const token = window.localStorage.getItem('authToken');
    // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra xem có phải admin không
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    }

    try {
        const response = await axios.delete(`${baseUrl}/${id}`, config); // Gửi thêm token qua config
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Lấy người dự thi competition 
// Theo pagination: page là trang hiện tại, limit là số bản ghi của trang đó
// VD: page 1: 1-10, page 2: 11-20...
export const getParticipants = async (competitionId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${baseUrl}/${competitionId}/participants`, {
      params: { page, limit },
    });

    // Format lại participants
    const participants = response.data.participants;
    const formattedParticipants = participants.map((participant) => ({
      userId: participant.id,
      username: participant.username,
      recipeTitle:
        participant.CompetitionEntries.length > 0
          ? participant.CompetitionEntries[0]?.Recipe?.title
          : null, // Recipe có thể null
    }));

    return {
      participants: formattedParticipants,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

// Xóa người dự thi
const deleteParticipant = async (competitionId, userId) => {
  try {
    const response = await axios.delete(`${baseUrl}/${competitionId}/participants/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Lấy tất bài dự thi
const getSubmissions = async (competitionId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${baseUrl}/${competitionId}/submissions`, {
      params: { page, limit },
    });

    return response.data;
  } catch (error) {
    console.log('blah')
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// Xóa bài dự thi
const deleteSubmission = async (competitionId, submissionId) => {
  try {
    await axios.delete(`${baseUrl}/${competitionId}/submissions/${submissionId}`);
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

export default { 
  getAll, 
  getDetail, 
  getLeaderboard, 
  create, 
  update, 
  deleteCompetition,
  getParticipants,
  deleteParticipant,
  getSubmissions,
  deleteSubmission,
}