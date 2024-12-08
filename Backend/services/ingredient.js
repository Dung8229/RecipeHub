// Ví dụ API tìm kiếm nguyên liệu
const Ingredient = require('../models/ingredient'); // Đảm bảo đã import model Ingredient

// Hàm tìm kiếm nguyên liệu từ cơ sở dữ liệu
// const searchIngredients = async (query) => {
//   try {
//     const results = await Ingredient.findAll({
//       where: {
//         name: {
//           [Sequelize.Op.iLike]: `%${query}%` // Tìm kiếm không phân biệt chữ hoa/thường
//         }
//       },
//       limit: 10 // Giới hạn số lượng kết quả trả về
//     });
//     return results;
//   } catch (error) {
//     console.error('Error fetching ingredients:', error);
//     return [];
//   }
// };

module.exports = { searchIngredients };