const Recipe = require('./models/recipe');  // Đảm bảo import model Recipe
const RecipeRating = require('./models/recipe_rating')
const User = require('./models/user')
const RecipeAverageRating = require('./models/recipe_averagerating')
const sequelize = require('./db')

// Hàm async để tính toán và cập nhật rating trung bình cho mỗi công thức
async function updateRecipeAverageRatings() {
  // Lấy tất cả các recipeId từ bảng recipes
  const recipes = await Recipe.findAll({ attributes: ['id'] });

  for (let i = 0; i < recipes.length; i++) {
    const recipeId = recipes[i].id;

    // Tính toán tổng số rating và rating trung bình cho mỗi công thức
    const ratings = await RecipeRating.findAll({
      where: { recipeId: recipeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'], // Tính trung bình rating
        [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings'] // Tính tổng số lượt đánh giá
      ],
    });

    if (ratings.length > 0) {
      const averageRating = ratings[0].dataValues.averageRating || 0;
      const totalRatings = ratings[0].dataValues.totalRatings || 0;

      // Kiểm tra nếu công thức đã có bản ghi trong bảng RecipeAverageRating, nếu có thì cập nhật, nếu không thì tạo mới
      const existingRating = await RecipeAverageRating.findOne({ where: { recipeId: recipeId } });

      if (existingRating) {
        // Cập nhật rating trung bình và tổng số lượt đánh giá
        await existingRating.update({
          averageUserRating: averageRating,
          totalUserRatings: totalRatings,
        });
      } else {
        // Tạo mới bản ghi trong RecipeAverageRating
        await RecipeAverageRating.create({
          recipeId: recipeId,
          averageUserRating: averageRating,
          totalUserRatings: totalRatings,
        });
      }
    }
  }

  console.log('Recipe average ratings updated.');
}

// Gọi hàm async để thực hiện
updateRecipeAverageRatings().catch((err) => console.error('Error updating ratings:', err));
