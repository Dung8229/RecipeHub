const competitionsRouter = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

const { getAllCompetitions } = require('../services/competition'); // Giả định bạn có một service để lấy dữ liệu

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
});

module.exports = competitionsRouter;
