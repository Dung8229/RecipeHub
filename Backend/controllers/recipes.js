const express = require('express');
const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const recipeRouter = express.Router();
const recipesRouter = require('express').Router()
const defineAssociations = require('../models/defineAssociations')
const RecipeTag = require('../models/recipe_tag')
const RecipeRating = require('../models/recipe_rating')
const RecipeComment = require('../models/recipe_comment')
const RecipeAverageRating = require('../models/recipe_averagerating')
const RecipeIngredientCategory = require('../models/ingredient_category')
const RecipeIngredient = require('../models/recipe_ingredient')
const Ingredient = require('../models/ingredient')
const { Sequelize } = require('sequelize')

defineAssociations()
// Hàm để xác định độ khó dựa trên readyInMinutes và servings
const calculateDifficulty = (readyInMinutes, servings) => {
  if (readyInMinutes <= 15 && servings <= 2) {
    return 'beginner';
  } else if (readyInMinutes <= 30 && servings <= 4) {
    return 'intermediate';
  } else if (readyInMinutes <= 45 && servings <= 6) {
    return 'advanced';
  } else if (readyInMinutes <= 60 && servings <= 8) {
    return 'expert';
  } else {
    return 'masterchef';
  }
};

// Route để lấy dữ liệu cho bộ lọc
recipeRouter.get('/filter-data', async (req, res) => {
  try {
    const categories = await RecipeTag.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('tag')), 'tag']],
    });

    const ingredients = await RecipeIngredientCategory.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
    });

    const difficulties = ['beginner', 'intermediate', 'advanced', 'expert', 'masterchef'];

    const cookingTimes = [
      { label: '0-15 minutes', value: '0-15' },
      { label: '15-30 minutes', value: '15-30' },
      { label: '30-45 minutes', value: '30-45' },
      { label: '45-60 minutes', value: '45-60' },
      { label: '60+ minutes', value: '60-9999' }
    ];

    res.json({
      categories: categories.map(c => c.tag),
      ingredients: ingredients.map(i => i.category),
      difficulties,
      cookingTimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hàm tìm kiếm công thức
const searchRecipes = async ({ searchTerm, category, ingredient, cookingTime, difficulty, sortBy }) => {
  const whereClause = {
    [Op.and]: [] // Sử dụng Op.and để kết hợp các điều kiện
  };

  // Tách searchTerm thành mảng các từ khóa
  if (searchTerm) {
    const searchTerms = searchTerm.split(/[\s,]+/).filter(Boolean); // Tách bằng dấu cách hoặc dấu phẩy

    // Thêm điều kiện tìm kiếm cho từng từ khóa
    searchTerms.forEach(term => {
      whereClause[Op.and].push({
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${term}%`
            }
          },
          {
            '$RecipeTags.tag$': {
              [Op.like]: `%${term}%`
            }
          },
          {
            '$Ingredients.name$': {
              [Op.like]: `%${term}%`
            }
          }
        ]
      });
    });
  }

  // Nếu có tham số category, thêm vào whereClause
  if (category) {
    whereClause[Op.and].push({
      '$RecipeTags.tag$': {
        [Op.like]: `%${category}%`
      }
    });
  }

  // Nếu có tham số ingredient, thêm vào whereClause
  if (ingredient) {
    whereClause[Op.and].push({
      '$Ingredients.name$': {
        [Op.like]: `%${ingredient}%`
      }
    });
  }

  // Nếu có tham số cookingTime, thêm vào whereClause
  if (cookingTime) {
    const [min, max] = cookingTime.split('-').map(Number);
    whereClause[Op.and].push({
      readyInMinutes: {
        [Op.between]: [min, max]
      }
    });
  }

  // Thêm order cho truy vấn
  let order = [];
  switch (sortBy) {
    case 'newest':
      order.push(['created_at', 'DESC']);
      break;
    case 'oldest':
      order.push(['created_at', 'ASC']);
      break;
    case 'rating':
      order.push(['rating', 'DESC']);
      break;
    case 'az':
      order.push(['title', 'ASC']);
      break;
    case 'za':
      order.push(['title', 'DESC']);
      break;
    default:
      order.push(['created_at', 'DESC']);
  }

  // Truy vấn công thức với JOIN và order
  const recipes = await Recipe.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        attributes: []
      },
      {
        model: RecipeTag,
        attributes: ['tag']
      },
      {
        model: Ingredient,
        attributes: ['name']
      },
      {
        model: RecipeRating,
        attributes: [],
        required: false
      }
    ],
    attributes: [
      'id', 
      'title', 
      'image', 
      'readyInMinutes', 
      'servings', 
      'created_at',
      [Sequelize.col('User.username'), 'username'],
      [
        Sequelize.fn(
          'COALESCE',
          Sequelize.fn('AVG', Sequelize.col('RecipeRatings.rating')),
          0
        ),
        'rating'
      ]
    ],
    group: ['Recipe.id', 'User.id', 'RecipeTags.id', 'Ingredients.id'],
    order: order
  });

  // Thêm giá trị difficulty vào từng công thức
  const recipesWithDifficulty = recipes.map(recipe => ({
    ...recipe.get(),
    difficulty: calculateDifficulty(recipe.readyInMinutes, recipe.servings) || 'unknown'
  }));

  // Lọc theo độ khó nếu có
  if (difficulty) {
    return recipesWithDifficulty.filter(recipe => recipe.difficulty === difficulty);
  }

  return recipesWithDifficulty;

};

// Route tìm kiếm công thức
recipeRouter.get('/search', async (req, res) => {
  const { searchTerm, category, ingredient, cookingTime, difficulty, sortBy } = req.query;

  console.log('Search parameters:', { searchTerm, category, ingredient, cookingTime, difficulty, sortBy });

  try {
    const recipes = await searchRecipes({ searchTerm, category, ingredient, cookingTime, difficulty, sortBy });
    return res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Lấy các công thức dinner
const getDinnerRecipes = async (req, res) => {
    try {
      const dinnerRecipes = await Recipe.findAll({
        where: { category: 'dinner' }
      });
      res.json(dinnerRecipes);
    } catch (error) {
      console.error('Error fetching dinner recipes:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

recipesRouter.get('/dinner', getDinnerRecipes);

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

module.exports = recipeRouter;
