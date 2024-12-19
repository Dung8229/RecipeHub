import axios from 'axios'
import imageService from './image'
import tokenService from './token'

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
        console.log('Competition: ', response.data)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

const getLeaderboard = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}/leaderboard`)
        console.log('leaderboard: ', response.data)

        return response.data
    } catch (error) {
        console.error(`Error fetching competition leaderboard id ${id}`, error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
}

const updateTieBreakerRanks = async (competitionId, updatedRanks) => {
  try {
    const response = await axios.post(`${baseUrl}/${competitionId}/tiebreaker`, {
      entries: updatedRanks,
    });

    console.log('updated tie break ranks: ', response.data)
    return response.data; // Trả về dữ liệu từ server nếu cần
  } catch (error) {
    console.error('Error updating tie-breaker ranks:', error);
    throw error; // Bắn lỗi để xử lý ở nơi gọi hàm
  }
};

// set bài thi chiến thắng 1 cuộc thi
const setWinner = async (competitionId, winnerRecipeId) => {
  try {
    const response = await axios.patch(`${baseUrl}/${competitionId}/winner`, {
      submissionId: winnerRecipeId, // ID của công thức chiến thắng
    });

    if (response.status === 200) {
      const { winner } = response.data;
      console.log('Người chiến thắng đã được cập nhật:', winner);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật người chiến thắng:', error);
    alert('Đã xảy ra lỗi khi cập nhật người chiến thắng.');
  }
};

// Lấy recipeId chiến thắng (nếu có)
const getWinner = async (competitionId) => {
  try {
    const response = await axios.get(`${baseUrl}/${competitionId}/winner`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi cập nhật người chiến thắng:', error);
    alert('Đã xảy ra lỗi khi cập nhật người chiến thắng.');
  }
}

// Hàm tạo competition mới
const create = async (title, imageFile = null, imageURL = "", description, detailDescription, startDate, winnerSelectionStartDate, endDate, prize) => {
    try {
      // Kiểm tra nếu có file ảnh thì upload và lấy đường dẫn ảnh
      let image;
      if (imageFile) {
        // Gọi API để upload ảnh và lấy đường dẫn
        image = await imageService.postImage(imageFile); // Giả sử imageService.postImage là hàm upload ảnh
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
        winnerSelectionStartDate,
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
const update = async (id, title, imageFile = null, imageURL = "", description, detailDescription, startDate, winnerSelectionStartDate, endDate, prize) => {
  try {
    // Kiểm tra nếu có file ảnh thì upload và lấy đường dẫn ảnh
    let image;
    if (imageFile) {
      // Gọi API để upload ảnh và lấy đường dẫn
      image = await imageService.postImage(imageFile); // Giả sử imageService.postImage là hàm upload ảnh
      // image = 'http://localhost:3000/' + image
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
      winnerSelectionStartDate,
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
    const token = tokenService.getToken();
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
  const token = tokenService.getToken();
  try {
    const response = await axios.delete(`${baseUrl}/${competitionId}/participants/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Hủy đăng ký (cho người dùng)
const unregister = async (competitionId) => {
  const token = tokenService.getToken();
  try {
    const response = await axios.delete(`${baseUrl}/${competitionId}/unregister-participant`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    })
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
    console.error('Error fetching submissions:', error);
    throw error;
  }
};

// Xóa bài dự thi
const deleteSubmission = async (competitionId, submissionId) => {
  try {
    const token = tokenService.getToken();
    await axios.delete(`${baseUrl}/${competitionId}/submissions/${submissionId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

const addParticipant = async (competitionId) => {
  const token = tokenService.getToken();
  // Tạo header cho token, token này sẽ được gửi đến backend để backend kiểm tra
  const config = {
      headers: { Authorization: `Bearer ${token}` },
  }

  try {
    const response = await axios.post(`${baseUrl}/${competitionId}/participants`, {}, config)
  } catch (error) {
    console.error('Error add new participant:', error);
    throw error;
  }
}

const checkIsRegistered = async (competitionId) => {
  try {
    const token = tokenService.getToken(); // Lấy token từ localStorage

    const response = await axios.get(`${baseUrl}/${competitionId}/isRegister`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });

    return response.data.registered; // Trả về trạng thái đăng ký (true/false)
  } catch (error) {
    console.error('Error checking registration status:', error);
    return false; // Nếu có lỗi, coi như chưa đăng ký
  }
};

const updatePrizeStatus = async (competitionId, prizeGiven=true) => {
  try {
    const response = await axios.patch(`${baseUrl}/${competitionId}/prizeGiven`, {
      prizeGiven,
    });
    console.log("Prize status updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update prize status:", error);
    throw error;
  }
};

const getEntryDetail = async (competitionId) => {
  const token = tokenService.getToken(); // Lấy token từ service

  try {
    // Gửi request đến API để lấy thông tin bài dự thi
    const response = await axios.get(`${baseUrl}/${competitionId}/entry`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header
      },
    });

    // Kiểm tra nếu không có bài dự thi
    if (response.status === 404) {
      return {
        isEntrySubmitted: false,
      };
    }

    // Xử lý thông tin bài dự thi và công thức (nếu có)
    const { submissionId } = response.data;

    console.log('Entry detail:', response.data);

    return response.data
  } catch (error) {
    console.error('Failed to get entry detail:', error);

    // Trường hợp API gặp lỗi
    if (error.response && error.response.status === 404) {
      return {
        isEntrySubmitted: false,
      };
    }

    throw error; // Ném lỗi để xử lý ở nơi gọi service
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
  addParticipant,
  checkIsRegistered,
  unregister,
  setWinner,
  getWinner,
  updateTieBreakerRanks,
  updatePrizeStatus,
  getEntryDetail,
}