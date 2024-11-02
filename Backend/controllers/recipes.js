// api liên quan công thức
const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')
const RecipeRating = require('../models/recipeRating')
const RecipeComment = require('../models/recipeComment')
const RecipeAverageRating = require('../models/recipe_averagerating')
const middleware = require('../utils/middleware')

// Lấy các công thức dinner
// const getDinnerRecipes = async (req, res) => {
//     try {
//       const dinnerRecipes = await Recipe.findAll({
//         where: { category: 'dinner' }
//       });
//       res.json(dinnerRecipes);
//     } catch (error) {
//       console.error('Error fetching dinner recipes:', error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   };

// recipesRouter.get('/dinner', getDinnerRecipes);


// GET /api/recipes/:recipeId - Lấy thông tin công thức, đánh giá và bình luận
recipesRouter.get('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  try {
      // Lấy thông tin công thức và xếp hạng trung bình
      const recipe = await Recipe.findByPk(recipeId, {
          include: [{ model: RecipeAverageRating, as: 'averageRating' }]
      });

      if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found' });
      }

      // Lấy đánh giá và bình luận
      const ratings = await RecipeRating.findAll({ where: { recipeId } });
      const comments = await RecipeComment.findAll({ where: { recipeId } });

      res.json({ recipe, ratings, comments });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes/:recipeId/rating - Thêm đánh giá và cập nhật xếp hạng trung bình
// Thêm một đánh giá mới và cập nhật RecipeAverageRating với xếp hạng trung bình.
recipesRouter.post('/:recipeId/rating', async (req, res) => {
  const { recipeId } = req.params;
  const { userId, rating } = req.body;

  try {
      if (rating < 1 || rating > 5) {
          return res.status(400).json({ error: 'Rating should be between 1 and 5' });
      }

      // Thêm đánh giá mới
      await RecipeRating.create({ recipeId, userId, rating });

      // Tính và cập nhật xếp hạng trung bình
      const { count, rows } = await RecipeRating.findAndCountAll({ where: { recipeId } });
      const averageRating = rows.reduce((sum, item) => sum + item.rating, 0) / count;

      // Tạo hoặc cập nhật bản ghi RecipeAverageRating
      const [averageRatingRecord, created] = await RecipeAverageRating.findOrCreate({
          where: { recipeId },
          defaults: { averageUserRating: averageRating, totalUserRatings: count }
      });

      if (!created) {
          averageRatingRecord.averageUserRating = averageRating;
          averageRatingRecord.totalUserRatings = count;
          await averageRatingRecord.save();
      }

      res.status(201).json({ message: 'Rating added successfully', averageRating });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes/:recipeId/comment - Thêm bình luận cho công thức
recipesRouter.post('/:recipeId/comment', async (req, res) => {
  const { recipeId } = req.params;
  const { userId, commentText } = req.body;

  try {
      const newComment = await RecipeComment.create({ recipeId, userId, commentText });
      res.status(201).json(newComment);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/highlighted - Lấy các công thức nổi bật dựa trên xếp hạng trung bình
// Trả về danh sách các công thức nổi bật, sắp xếp theo averageUserRating từ cao đến thấp, với giới hạn 10 công thức.
recipesRouter.get('/highlighted', async (req, res) => {
  try {
      const highlightedRecipes = await RecipeAverageRating.findAll({
          order: [['averageUserRating', 'DESC']],
          limit: 10,
          include: [{
              model: Recipe,
              as: 'recipeDetails' // Bao gồm thông tin chi tiết công thức
          }]
      });

      res.json(highlightedRecipes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});


module.exports = recipesRouter
