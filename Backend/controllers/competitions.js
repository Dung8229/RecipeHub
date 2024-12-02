const competitionsRouter = require('express').Router()
const Sequelize = require('sequelize')
const axios = require('axios')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

const { getAllCompetitions, unregisterParticipant } = require('../services/competition');
const Competition = require('../models/competition');
const CompetitionEntry = require('../models/competition_entry')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const RecipeRating = require('../models/recipe_rating');
const { response } = require('express');

competitionsRouter.get('/', async (request, response) => {
    try {
        const { status } = request.query; // Lấy tham số status từ query
        let competitions;

        // Kiểm tra trạng thái và lấy dữ liệu tương ứng
        if (status === 'open') {
          competitions = await getAllCompetitions('open'); // Lấy các cuộc thi đang mở
        } else if (status === 'closed') {
            competitions = await getAllCompetitions('closed'); // Lấy các cuộc thi đã đóng
        } else if (status === 'upcoming') {
            competitions = await getAllCompetitions('upcoming'); // Lấy các cuộc thi sắp mở
        } else {
            competitions = await getAllCompetitions(); // Lấy tất cả các cuộc thi
        }

        const now = new Date()
        // Tính toán timeLeft và thêm vào từng cuộc thi
        const competitionsWithTimeLeft = competitions.map(comp => {
          const selectionDate = new Date(comp.winnerSelectionStartDate);
          const timeLeft = Math.max(0, Math.ceil((selectionDate - now) / (1000 * 60 * 60 * 24))); // Tính số ngày còn lại

          return {
            ...comp.toJSON(), // Chuyển đổi mô hình Sequelize sang đối tượng JSON
            timeLeft
          };
        });

        response.json(competitionsWithTimeLeft);
    } catch (error) {
        console.error('Error fetching competitions:', error);
        response.status(500).json({ message: 'Internal Server Error' });
    }
})

// Route để tạo một competition mới
competitionsRouter.post('/', async (req, res) => {
  const {
    title,
    image, // Đã có đường dẫn ảnh từ frontend
    description,
    detailDescription,
    startDate,
    winnerSelectionStartDate,
    endDate,
    prize,
  } = req.body;

  try {
    // Tạo một bản ghi mới trong database
    const newCompetition = await Competition.create({
      title,
      image, // Lưu đường dẫn ảnh vào trường image
      description,
      detailDescription,
      startDate: new Date(startDate),
      winnerSelectionStartDate: new Date(winnerSelectionStartDate),
      endDate: new Date(endDate),
      prize,
    });

    // Thêm thông tin về timeLeft
    const now = new Date()
    const timeLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))); // Tính số ngày còn lại
    // Thêm thông tin về timeLeft vào đối tượng trả về
    const newCompetitionWithTimeLeft = {
      ...newCompetition.toJSON(), // Chuyển đối tượng Sequelize thành đối tượng JSON
      timeLeft, // Thêm timeLeft vào response
    };

    // Trả về response thành công với thông tin competition mới
    res.status(201).json(newCompetitionWithTimeLeft);
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

competitionsRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params
        const competition = await Competition.findOne({ where: { id } })
    
        if (!competition) {
          return response.status(404).json({ error: 'Competition not found' })
        }
    
        response.json(competition)
    } catch (error) {
        response.status(500).json({ error: 'An error occurred' })
    }
})

// Route cập nhật thông tin cuộc thi
competitionsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { title, image, description, detailDescription, startDate, winnerSelectionStartDate, endDate, prize } = request.body;

  try {
    // Kiểm tra xem cuộc thi có tồn tại không
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return response.status(404).json({ error: 'Competition not found' });
    }

    // Cập nhật thông tin cuộc thi
    await competition.update({
      title,
      image,
      description,
      detailDescription,
      startDate,
      winnerSelectionStartDate,
      endDate,
      prize,
    });

    // Trả về phản hồi thành công cùng với dữ liệu cuộc thi đã cập nhật
    response.status(200).json(competition);
  } catch (error) {
    console.error('Error updating competition:', error);
    response.status(500).json({ error: 'Failed to update competition' });
  }
});

competitionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params; // Lấy id từ URL params

  try {
    // Tìm kiếm cuộc thi với ID tương ứng
    const competition = await Competition.findByPk(id);

    // Nếu không tìm thấy cuộc thi
    if (!competition) {
      return response.status(404).json({ message: 'Competition not found' });
    }

    // Xóa cuộc thi
    await competition.destroy();

    // Trả về phản hồi thành công
    response.status(200).json({ message: 'Competition deleted successfully' });
  } catch (error) {
    console.error('Error deleting competition:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// API cho admin sửa thứ tự các bài thi khi điểm bằng nhau
competitionsRouter.post('/:id/tiebreaker', async (req, res) => {
  try {
    const { id } = req.params;
    const { entries } = req.body; // Dạng [{ entryId: 1, tieBreakerRank: 1 }, ...]

    const updatePromises = entries.map(entry =>
      CompetitionEntry.update(
        { tieBreakerRank: entry.tieBreakerRank },
        { where: { id: entry.entryId, competitionId: id } }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Cập nhật thứ tự tie-breaker thành công.' });
  } catch (error) {
    console.error('Error updating tieBreakerRank:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật tie-breaker.' });
  }
});

competitionsRouter.get('/:id/leaderboard', async (request, response) => {
  try {
    const { id } = request.params;
    console.log(`Fetching leaderboard for competition ID: ${id}`);

    // Lấy tất cả các entries cho cuộc thi với ID tương ứng
    const competitionEntries = await CompetitionEntry.findAll({
      where: { competitionId: id },
      include: [
        {
          model: User,
          attributes: ['username', 'image'],
        },
        {
          model: Recipe,
          attributes: ['title', 'image', 'id'], // Thêm id để dùng trong truy vấn
          required: true
        },
      ],
    });

    if (!competitionEntries.length) {
      return response.status(404).json({ message: 'Không tìm thấy dữ liệu cho cuộc thi này.' });
    }

    // Duyệt qua các entry để tính toán tổng số vote và score
    const leaderboard = await Promise.all(competitionEntries.map(async entry => {
      // Lấy tổng số vote từ bảng recipe_rating
      const totalVotes = await RecipeRating.count({
        where: { recipeId: entry.Recipe.id },
      });

      // Tính trung bình rating
      const averageRating = await RecipeRating.findOne({
        where: { recipeId: entry.Recipe.id },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
        raw: true,
      });

      const average = averageRating ? parseFloat(averageRating.averageRating) : 0;

      // Tính score với công thức trung bình * log(1 + totalVotes)
      const score = totalVotes === 0 ? 0 : average * Math.log(1 + totalVotes);

      return {
        id: entry.id,
        username: entry.User.username,
        userImage: entry.User.image,
        recipeId: entry.Recipe.id,
        recipeTitle: entry.Recipe.title,
        recipeImage: entry.Recipe.image,
        totalVotes,
        score: score.toFixed(2), // Làm tròn đến 2 chữ số thập phân
        tieBreakerRank: entry.tieBreakerRank, // Thêm tieBreakerRank
      };
    }));

    // Nếu bằng điểm nhau thì so tieBreakRank nếu có
    leaderboard.sort((a, b) => {
      if (b.score === a.score) {
        return (a.tieBreakerRank || Infinity) - (b.tieBreakerRank || Infinity); // Ưu tiên tieBreakerRank
      }
      return b.score - a.score;
    });

    const winner = leaderboard[0] // Người chiến thắng

    response.json({
      winner: winner,
      leaderboard: leaderboard
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    response.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu leaderboard.' });
  }
});

// Lấy danh sách người tham gia một cuộc thi (pagination)
competitionsRouter.get('/:id/participants', async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query; // Mặc định page = 1, limit = 10

  try {
    const offset = (page - 1) * limit; // Tính toán vị trí bắt đầu

    // Truy vấn lấy participants
    const { count, rows: participants } = await User.findAndCountAll({
      attributes: ['id', 'username'],
      include: [
        {
          model: CompetitionEntry,
          required: true,
          where: { competitionId: id },
          include: [
            {
              model: Recipe,
              attributes: ['id', 'title'],
            },
          ],
        },
      ],
      limit: parseInt(limit, 10), // Số lượng participant trên 1 trang
      offset: parseInt(offset, 10), // Bắt đầu từ participant nào
    });

    res.status(200).json({
      participants,
      total: count, // Tổng số participants
      totalPages: Math.ceil(count / limit), // Tổng số trang
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'An error occurred while fetching participants.' });
  }
});

// Thêm người tham gia
competitionsRouter.post('/:id/participants', middleware.authenticateJWT, async (req, res) => {
  const { id } = req.params; // competitionId từ URL
  const { id: userId } = req.user; // userId từ middleware (thông tin người dùng đã giải mã từ token)

  try {
    // Kiểm tra xem người dùng đã đăng ký chưa
    const existingEntry = await CompetitionEntry.findOne({
      where: { competitionId: id, userId },
    });

    if (existingEntry) {
      // Nếu đã có bản ghi, trả về lỗi
      return res.status(409).json({ message: 'User has already registered for this competition.' });
    }

    // Nếu chưa có bản ghi, thêm người tham gia vào cuộc thi
    const entry = await CompetitionEntry.create({
      competitionId: id,
      userId,
    });

    res.status(201).json(entry); // Trả về bản ghi vừa tạo
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding participant');
  }
});

// Kiểm tra xem người dùng đã đăng ký chưa
competitionsRouter.get('/:competitionId/isRegister', middleware.authenticateJWT, async (req, res) => {
  const { competitionId } = req.params; // competitionId từ URL
  const userId = req.user.id; // Lấy userId từ JWT (middleware đã giải mã)

  try {
    // Tìm bản ghi đăng ký với competitionId và userId
    const existingEntry = await CompetitionEntry.findOne({
      where: { competitionId, userId },
    });

    if (existingEntry) {
      // Nếu đã đăng ký, trả về true
      return res.status(200).json({ registered: true });
    } else {
      // Nếu chưa đăng ký, trả về false
      return res.status(200).json({ registered: false });
    }
  } catch (error) {
    console.error('Error checking registration status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Xóa người tham gia
competitionsRouter.delete('/:id/participants/:userId', middleware.authenticateJWT, async (req, res) => {
  const { id, userId } = req.params;

  try {
    await CompetitionEntry.destroy({
      where: { competitionId: id, userId },
    });

    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting participant');
  }
});

// Route: Hủy đăng ký tham gia cuộc thi
competitionsRouter.delete('/:id/unregister-participant', middleware.authenticateJWT, async (req, res) => {
  const competitionId = req.params.id; // Lấy competitionId từ URL
  const userId = req.user.id; // Lấy userId từ JWT middleware (đã giải mã)
  console.log('hi')

  try {
    console.log('hi')
    const isUnregistered = await unregisterParticipant(competitionId, userId);
    console.log(isUnregistered)

    if (isUnregistered) {
      return res.status(200).json({ message: 'Successfully unregistered from the competition.' });
    } else {
      return res.status(400).json({ error: 'Failed to unregister. You may not be registered or the competition does not exist.' });
    }
  } catch (error) {
    console.error('Error during unregistration:', error.message);
    return res.status(500).json({ error: 'An error occurred while unregistering.' });
  }
});

// Lấy bài thi (pagination)
competitionsRouter.get('/:id/submissions', async (req, res) => {
  const { id } = req.params; // ID của cuộc thi
  const { page = 1, limit = 10 } = req.query; // Mặc định page = 1, limit = 10

  try {
    const offset = (page - 1) * limit; // Tính toán vị trí bắt đầu

    // Truy vấn lấy submissions
    const { count, rows: submissions } = await CompetitionEntry.findAndCountAll({
      where: { competitionId: id },
      limit: parseInt(limit, 10), // Số lượng bài thi trên 1 trang
      offset: parseInt(offset, 10), // Bắt đầu từ bài thi nào
      include: [
        {
          model: Recipe, // Thông tin về công thức
          attributes: ['id', 'image', 'title'], // Chỉ lấy id, image, và title của Recipe
          required: true,
        },
        {
          model: User, // Thông tin về người tham gia
          attributes: ['id', 'username'], // Lấy id và username của người dùng
        },
      ],
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      submissions: submissions.map(submission => ({
        submissionId: submission.Recipe.id,
        image: submission.Recipe.image,
        recipeTitle: submission.Recipe.title,
        username: submission.User.username,
      })),
      total: count, // Tổng số submissions
      totalPages, // Tổng số trang
      currentPage: parseInt(page, 10), // Trang hiện tại
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'An error occurred while fetching submissions.' });
  }
});

// Xóa bài thi khỏi cuộc thi
competitionsRouter.delete('/:id/submissions/:submissionId', async (req, res) => {
  const { id, submissionId } = req.params;

  try {
    const entry = await CompetitionEntry.findOne({
      where: { competitionId: id, submissionId },
    });

    if (!entry) {
      return res.status(404).send('Submission not found');
    }

    entry.submissionId = null; // Hủy liên kết bài thi
    await entry.save();

    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting submission');
  }
});

// Set winner
competitionsRouter.patch('/:competitionId/winner', async (req, res) => {
  const { competitionId } = req.params;
  const { submissionId } = req.body;

  try {
    // Kiểm tra cuộc thi có tồn tại không
    const competition = await Competition.findByPk(competitionId);
    if (!competition) {
      return res.status(404).json({ message: 'Cuộc thi không tồn tại.' });
    }

    // Kiểm tra bài thi có tồn tại trong cuộc thi không
    const entry = await CompetitionEntry.findOne({
      where: {
        competitionId,
        submissionId, // Điều kiện đúng
      },
      include: [
        { model: User, attributes: ['username'] },
        { model: Recipe, attributes: ['title'] },
      ],
    });

    if (!entry) {
      return res.status(404).json({ message: 'Bài dự thi không tồn tại hoặc không thuộc cuộc thi này.' });
    }

    // Cập nhật winnerRecipeId cho cuộc thi
    competition.winnerRecipeId = submissionId;
    await competition.save();

    // Trả về thông tin cuộc thi đã cập nhật
    return res.status(200).json({
      message: 'Cập nhật người chiến thắng thành công.',
      winner: {
        submissionId,
        username: entry.User.username,
        recipeTitle: entry.Recipe.title,
      },
    });
  } catch (error) {
    console.error('Error updating winner:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật người chiến thắng.' });
  }
});

// Lấy id recipe winner (nếu đã được chọn bởi admin)
competitionsRouter.get('/:competitionId/winner', async (req, res) => {
  const { competitionId } = req.params;

  try {
    const competition = await Competition.findByPk(competitionId);
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    if (!competition.winnerRecipeId) {
      return res.status(404).json({ message: 'Winner not yet decided for this competition' });
    }

    res.status(200).json({
      recipeId: competition.winnerRecipeId
    });
  } catch (error) {
    console.error('Error fetching winner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = competitionsRouter;
