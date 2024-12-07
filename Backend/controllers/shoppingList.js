const shoppingListRouter = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
const ShoppinglistRecipe = require('../models/shoppinglist_recipe')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const Ingredient = require('../models/ingredient')
const RecipeIngredient = require('../models/recipe_ingredient')

// Conversion factors from various units to grams (g)
const UNIT_CONVERSIONS = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  lb: 453.592,
  lbs: 453.592,
  ounce: 28.3495,
  ounces: 28.3495,
  oz: 28.3495,
  cup: 240, // giả sử 1 cup = 240g (dựa trên nước hoặc nguyên liệu lỏng tiêu chuẩn)
  cups: 240,
  tbsp: 15, // giả sử 1 tablespoon = 15g
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5, // giả sử 1 teaspoon = 5g
  teaspoon: 5,
  teaspoons: 5,
  small: 50, // giả sử một đơn vị nhỏ = 50g
  medium: 100, // giả sử một đơn vị trung bình = 100g
  large: 200, // giả sử một đơn vị lớn = 200g
  clove: 10, // giả sử một tép tỏi = 10g
  cloves: 10,
  pint: 473, // giả sử 1 pint = 473g (dựa trên nước)
  piece: 100,
  pieces: 100,
  '': 200,
};

const convertToGram = (amount, unit) => {
  const conversionFactor = UNIT_CONVERSIONS[unit.toLowerCase()] || 1;
  return parseFloat(amount) * conversionFactor;
};

// Lấy danh sách công thức trong shopping list
shoppingListRouter.get('/recipes', middleware.authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Lấy userId từ req.user (đã được middleware authenticateJWT gán vào)

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Truy vấn danh sách công thức từ shoppinglist_recipe, kết hợp với thông tin recipe từ bảng recipes
    const shoppingListRecipes = await ShoppinglistRecipe.findAll({
      where: { userId },
      include: [{
        model: Recipe,
        attributes: ['id', 'userId', 'title', 'image', 'summary', 'servings'],
        include: [{
          model: User,
          attributes: ['username'],
        }],
      }],
    });

    if (shoppingListRecipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found in shopping list.' });
    }

    const recipes = shoppingListRecipes.map(item => {
      const recipe = item.Recipe;
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        servings: recipe.servings,
        username: recipe.User.username,
      };
    })

    return res.json({ recipes });

  } catch (error) {
    console.error('Error fetching shopping list recipes:', error);
    return res.status(500).json({ error: 'Failed to fetch shopping list recipes.' });
  }
});

// Thêm công thức vào shopping list
shoppingListRouter.post('/recipes', (req, res) => {

  try {
    const { userId, recipeId } = req.body;
    console.log('ADD LIST:', req.body);
    ShoppinglistRecipe.create({ userId: userId, recipeId: recipeId });
    res.status(201).json({ message: 'Recipe added to shopping list' });
  } catch (error) {
    logger.error('Error adding recipe to shopping list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Xóa công thức khỏi shopping list
shoppingListRouter.delete('/recipes/:recipeId/user/:userId', async (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;
  try {
    // Thực hiện xóa công thức khỏi danh sách trong database
    const deleted = await ShoppinglistRecipe.destroy({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Recipe not found in shopping list' });
    }

    // Thành công
    return res.status(204).send(); // No Content
  } catch (error) {
    logger.error('Error removing recipe from shopping list:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Xóa toàn bộ recipe khỏi shopping list
shoppingListRouter.delete('/recipes', middleware.authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Lấy userId từ token

  try {
    // Xóa tất cả các recipe của user khỏi shopping list
    const deletedCount = await ShoppinglistRecipe.destroy({
      where: { userId },
    });

    // Kiểm tra xem có dữ liệu nào bị xóa không
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No recipes found in the shopping list to delete.' });
    }

    res.status(200).json({ message: 'All recipes removed from shopping list successfully.' });
  } catch (error) {
    console.error('Error deleting recipes from shopping list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

shoppingListRouter.post('/ingredients', middleware.authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Lấy userId từ middleware xác thực
  const { servings } = req.body; // Lấy danh sách servings từ body yêu cầu

  if (!servings || !Array.isArray(servings)) {
    return res.status(400).json({ message: 'Invalid servings format. Expecting an array of { recipeId, servings }.' });
  }

  try {
    const shoppingListRecipes = await ShoppinglistRecipe.findAll({
      where: { userId },
      include: [{
        model: Recipe,
        attributes: ['id', 'servings'], // Lấy số khẩu phần của công thức
        include: [{
          model: RecipeIngredient,
          attributes: ['ingredientId', 'amount', 'unit'],
          include: [{
            model: Ingredient,
            attributes: ['name', 'image'],
          }],
        }],
      }],
    });

    if (!shoppingListRecipes || shoppingListRecipes.length === 0) {
      return res.status(404).json({ message: 'No ingredients found in shopping list.' });
    }

    // Tạo map từ recipeId sang servings được cung cấp
    const servingsMap = Object.fromEntries(servings.map(s => [s.recipeId, s.servings]));

    const ingredients = shoppingListRecipes.flatMap((item) => {
      const targetServings = servingsMap[item.Recipe.id]; // Lấy servings cho công thức này
      if (!targetServings) return []; // Nếu không có servings cho công thức này, bỏ qua

      return item.Recipe.RecipeIngredients.map((ri) => {
        const originalAmount = parseFloat(ri.amount);
        let adjustedAmount = originalAmount;

        // Điều chỉnh số lượng nguyên liệu theo servings của từng công thức
        if (item.Recipe.servings) {
          adjustedAmount = (originalAmount / item.Recipe.servings) * targetServings; // Điều chỉnh theo servings
        }

        return {
          id: ri.ingredientId,
          name: ri.Ingredient.name,
          image: 'https://img.spoonacular.com/ingredients_100x100/' + ri.Ingredient.image,
          amount: adjustedAmount,
          unit: ri.unit || '', // Xử lý trường hợp unit là null hoặc undefined
        };
      });
    });

    // Gộp các nguyên liệu giống nhau (cùng tên)
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      const existingIngredient = acc.find((i) => i.name === ingredient.name);

      if (existingIngredient) {
        // Nếu đã có nguyên liệu cùng tên, kiểm tra đơn vị
        if (existingIngredient.unit === ingredient.unit) {
          // Cùng đơn vị, cộng dồn trực tiếp
          existingIngredient.amount += ingredient.amount;
        } else {
          // Khác đơn vị, quy đổi sang gram để cộng dồn
          const existingAmountInGram = convertToGram(existingIngredient.amount, existingIngredient.unit);
          const newAmountInGram = convertToGram(ingredient.amount, ingredient.unit);
          const totalAmountInGram = existingAmountInGram + newAmountInGram;

          // Cập nhật lại amount và unit của nguyên liệu hiện có
          existingIngredient.amount = totalAmountInGram;
          existingIngredient.unit = 'g'; // Đơn vị chuẩn
        }
      } else {
        // Nếu chưa có nguyên liệu này, thêm mới
        acc.push({ ...ingredient });
      }
      return acc;
    }, []);

    res.json({ ingredients: groupedIngredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

shoppingListRouter.get('/check', async (req, res) => {
  try {
    //const { userId } = req.params; // Corrected destructuring
    const { userId, recipeId } = req.query; // Extract from query
    const isInList = await ShoppinglistRecipe.findOne({ where: { userId, recipeId } });
    if (isInList) {
      res.json({ isInList: true });
    } else {
      res.json({ isInList: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});

module.exports = shoppingListRouter;