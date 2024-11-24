const Competition = require('../models/competition');
const CompetitionEntry = require('../models/competition_entry');
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

async function unregisterParticipant(competitionId, userId) {
    // Tìm bản ghi của người dùng trong bảng competition_entry
    const entry = await CompetitionEntry.findOne({
      where: {
        competitionId,
        userId,
      },
    });
  
    if (!entry) {
      // Không tìm thấy bản ghi tham gia
      console.log('No entry found')
      return false;
    }
  
    // Xóa bản ghi
    await CompetitionEntry.destroy({
      where: {
        competitionId,
        userId,
      },
    });

    console.log("entry found")
  
    return true; // Hủy đăng ký thành công
}

module.exports = {
    getAllCompetitions,
    unregisterParticipant,
};
