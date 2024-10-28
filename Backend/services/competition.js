const Competition = require('../models/competition'); // Giả định bạn đã định nghĩa mô hình Competition
const { Sequelize } = require('sequelize');

async function getAllCompetitions(isOpen = null) {
    const currentDate = new Date(); // Lấy thời gian hiện tại
    const options = {};

    // Nếu isOpen được chỉ định, thêm điều kiện vào query
    if (isOpen !== null) {
        if (isOpen) {
            options.where = { endDate: { [Sequelize.Op.gt]: currentDate } }; // Lấy các cuộc thi chưa kết thúc
        } else {
            options.where = { endDate: { [Sequelize.Op.lt]: currentDate } }; // Lấy các cuộc thi đã kết thúc
        }
    }

    // Lấy các cuộc thi từ cơ sở dữ liệu
    const competitions = await Competition.findAll(options);
    return competitions;
}

module.exports = {
    getAllCompetitions,
};
