const User = require('./models/user')
const Recipe = require('./models/recipe')
const RecipeIngredient = require('./models/recipe_ingredient')
const Ingredient = require('./models/ingredient')
const { Sequelize } = require('sequelize')

async function getRecipes() {
    try {
        const recipes = await Recipe.findAll({
            where: {
                id: {
                    [Sequelize.Op.between]: [100010, 100020] // Lấy các id từ 100010 đến 100020
                }
            },
            include: [{
                model: User, // Tham chiếu đến model User
                attributes: ['username'] // Chỉ lấy trường username
            }],
            attributes: ['readyInMinutes', 'summary'], // Chỉ lấy các trường cần thiết từ Recipe
        });

        // Chuyển đổi dữ liệu để trả về đúng định dạng
        const result = recipes.map(recipe => ({
            readyInMinutes: recipe.readyInMinutes,
            summary: recipe.summary,
            username: recipe.User.username // Truy cập username từ quan hệ
        }));

        return result;

    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

async function getIngredientsOfRecipe(recipeId) {
    try {
      const ingredients = await RecipeIngredient.findAll({
        where: { recipeId },
        include: [
          {
            model: Ingredient,
            attributes: ['name', 'image'], // Các thuộc tính của Ingredient mà bạn muốn lấy
          },
        ],
        attributes: ['amount', 'unit', 'original'], // Các thuộc tính của RecipeIngredient mà bạn muốn lấy
      });

      const result = ingredients.map(ingredient => ({
        amount: ingredient.amount,
        unit: ingredient.unit,
        original: ingredient.original,
        ingredient: {
          name: ingredient.Ingredient.name,
          image: ingredient.Ingredient.image,
        },
      }));
  
      return result;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }

// Gọi hàm và in ra kết quả
getIngredientsOfRecipe(100000).then(ingredients => {
    console.log(ingredients);
}).catch(err => {
    console.error(err);
});
