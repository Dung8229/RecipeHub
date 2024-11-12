const Competition = require('../models/competition'); // Giả định bạn đã định nghĩa mô hình Competition
const { Sequelize } = require('sequelize');

async function getAllCompetitions(status = null) {
    const currentDate = new Date(); // Thời gian hiện tại
    const options = {};

    // Tùy thuộc vào giá trị của `status`, thêm điều kiện vào query
    if (status !== null) {
        if (status === 'upcoming') { // Các cuộc thi sắp mở
            options.where = { startDate: { [Sequelize.Op.gt]: currentDate } };
        } else if (status === 'open') { // Các cuộc thi đang mở
            options.where = {
                startDate: { [Sequelize.Op.lte]: currentDate },
                endDate: { [Sequelize.Op.gt]: currentDate }
            };
        } else if (status === 'closed') { // Các cuộc thi đã đóng
            options.where = { endDate: { [Sequelize.Op.lt]: currentDate } };
        }
    }

    // Lấy các cuộc thi từ cơ sở dữ liệu
    const competitions = await Competition.findAll(options);
    return competitions;
}

module.exports = {
    getAllCompetitions,
};
