const competitionsRouter = require('express').Router()
const Sequelize = require('sequelize')
const axios = require('axios')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

const { getAllCompetitions } = require('../services/competition');
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
          const endDate = new Date(comp.endDate);
          const timeLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))); // Tính số ngày còn lại

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
          attributes: ['username'],
        },
        {
          model: Recipe,
          attributes: ['title', 'image', 'id'], // Thêm id để dùng trong truy vấn
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

      // Tính score với công thức tùy chỉnh (vd: trung bình nhân với log(1 + totalVotes))
      const score = totalVotes === 0 ? 0 : average * Math.log(1 + totalVotes);

      return {
        id: entry.id,
        username: entry.User.username,
        recipeTitle: entry.Recipe.title,
        recipeImage: entry.Recipe.image,
        totalVotes,
        score: score.toFixed(2), // Làm tròn đến 2 chữ số thập phân
      };
    }));

    leaderboard.sort((a, b) => b.score - a.score);

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

module.exports = competitionsRouter;
