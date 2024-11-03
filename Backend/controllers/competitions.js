const competitionsRouter = require('express').Router()
const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

const { getAllCompetitions } = require('../services/competition'); // Giả định bạn có một service để lấy dữ liệu
const Competition = require('../models/competition');
const CompetitionEntry = require('../models/competition_entry')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const RecipeRating = require('../models/recipe_rating')

competitionsRouter.get('/', async (request, response) => {
    try {
        const { status } = request.query; // Lấy tham số status từ query
        let competitions;

        // Kiểm tra trạng thái và lấy dữ liệu tương ứng
        if (status === 'open') {
            competitions = await getAllCompetitions(true); // Lấy các cuộc thi đang mở
        } else if (status === 'closed') {
            competitions = await getAllCompetitions(false); // Lấy các cuộc thi đã đóng
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

    response.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    response.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu leaderboard.' });
  }
});

module.exports = competitionsRouter;
