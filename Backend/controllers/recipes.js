const express = require('express');
const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const recipeRouter = express.Router();
// const recipesRouter = require('express').Router()
const defineAssociations = require('../models/defineAssociations')
const RecipeTag = require('../models/recipe_tag')
const RecipeRating = require('../models/recipe_rating')
const RecipeComment = require('../models/recipe_comment')
const RecipeAverageRating = require('../models/recipe_averagerating')
const RecipeIngredient = require('../models/recipe_ingredient')
const RecipeIngredientCategory = require('../models/ingredient_category')
const ShoppinglistRecipe = require('../models/shoppinglist_recipe')
const Ingredient = require('../models/ingredient')
const { Sequelize } = require('sequelize')
const RecipeInstruction = require('../models/recipe_instruction');
const CompetitionEntry = require('../models/competition_entry')
const middleware = require('../utils/middleware')
const db = require('../db')

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

    // const difficulties = ['beginner', 'intermediate', 'advanced', 'expert', 'masterchef'];

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
      // difficulties,
      cookingTimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hàm tìm kiếm công thức
const searchRecipes = async ({ searchTerm, category, ingredient, cookingTime }) => {
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
          // {
          //   '$Ingredients.name$': {
          //     [Op.like]: `%${term}%`
          //   }
          // },
          {
            '$RecipeIngredients->Ingredient.name$': {
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
      // '$Ingredients.name$': {
      //   [Op.like]: `%${ingredient}%`
      // }
      '$RecipeIngredients->Ingredient.name$': {
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

  // Truy vấn công thức với JOIN
  const recipes = await Recipe.findAll({
    where: whereClause,
    include: [
      {
        model: User, // Tham chiếu đến model User
        attributes: ['username'] // Chỉ lấy trường username
      },
      {
        model: RecipeTag, // Tham chiếu đến model RecipeTag
        attributes: ['tag'] // Chỉ lấy trường tag
      },
      // {
      //   model: Ingredient,
      //   attributes: ['name']
      // },
      {
        model: RecipeIngredient,
        include: [
          {
            model: Ingredient,
            attributes: ['name'],
          },
        ],
        attributes: [],
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
    // group: ['Recipe.id', 'User.id', 'RecipeTags.id', 'Ingredients.id'],
    group: ['Recipe.id', 'User.id', 'RecipeTags.id', 'RecipeIngredients.id', 'RecipeIngredients->Ingredient.id'],
    // order: order
  });

  // // Thêm giá trị difficulty vào từng công thức
  // const recipesWithDifficulty = recipes.map(recipe => ({
  //   ...recipe.get(), // Lấy tất cả các thuộc tính của recipe
  //   difficulty: calculateDifficulty(recipe.readyInMinutes, recipe.servings) || 'unknown' // Thêm difficulty, mặc định là 'unknown' nếu không có
  // }));

  // Lọc theo độ khó nếu có
  // if (difficulty) {
  //   return recipesWithDifficulty.filter(recipe => recipe.difficulty === difficulty);
  // }

  // return recipesWithDifficulty;
  return recipes
};

// Route tìm kiếm công thức
recipeRouter.get('/search', async (req, res) => {
  const { searchTerm, category, ingredient, cookingTime} = req.query;

  console.log('Search parameters:', { searchTerm, category, ingredient, cookingTime});

  try {
    const recipes = await searchRecipes({ searchTerm, category, ingredient, cookingTime});
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
      where: { 
        '$RecipeTags.tag$': 'dinner' 
      },
      include: [
        {
          model: RecipeTag,
          attributes: ['tag']
        },
        {
          model: User,
          attributes: ['username']
        },
        {
          model: RecipeAverageRating,
          attributes: ['averageUserRating']
        }
      ],
      attributes: [
        'id', 
        'title', 
        'image', 
        'readyInMinutes', 
        'servings'
      ]
    });

    if (!dinnerRecipes.length) {
      return res.status(404).json({ message: 'Không tìm thấy công thức dinner nào' });
    }

    res.json(dinnerRecipes);
  } catch (error) {
    console.error('Error fetching dinner recipes:', error);
    res.status(500).json({ error: 'Lỗi khi lấy công thức dinner' });
  }
};

recipeRouter.get('/dinner', getDinnerRecipes);

// GET /api/recipes/:recipeId - Lấy thông tin công thức, đánh giá và bình luận
recipeRouter.get('/:recipeId', async (req, res) => {
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
recipeRouter.post('/:recipeId/rating', async (req, res) => {
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
recipeRouter.post('/:recipeId/comment', async (req, res) => {
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
recipeRouter.get('/highlighted', async (req, res) => {
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

// GET /api/recipes/ingredients - Lấy tất cả nguyên liệu
recipeRouter.get('/ingredients', async (req, res) => {
  try {
      // Lấy danh sách ingredients và số lượng công thức sử dụng
      const ingredients = await Ingredient.findAll({
          include: [{
              model: RecipeIngredient,
              attributes: []  // Không lấy thông tin chi tiết của RecipeIngredient
          }],
          attributes: [
              'id',
              'name',
              'image',
              [sequelize.fn('COUNT', sequelize.col('RecipeIngredients.id')), 'recipeCount']
          ],
          group: ['Ingredient.id'],
          order: [
              ['name', 'ASC']  // Sắp xếp theo tên
          ]
      });

      res.json(ingredients);
  } catch (error) {
      console.error('Lỗi khi lấy danh sách nguyên liệu:', error);
      res.status(500).json({ 
          error: 'Lỗi khi lấy danh sách nguyên liệu',
          details: error.message 
      });
  }
});

// POST /api/recipes - Tạo công thức mới
recipeRouter.post('/', middleware.authenticateJWT, async (req, res) => {
  console.log('this runs')
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  console.log("userId post: ", userId)

  const {
    title,
    image,
    summary,
    readyInMinutes,
    servings,
    ingredients,
    instructions,
    tags,
  } = req.body;

  if (!title || !readyInMinutes || !servings) {
    return res.status(400).json({ error: 'Title, readyInMinutes, and servings are required' });
  }

  try {
    // Tạo mới công thức
    const newRecipe = await Recipe.create({
      userId,
      title,
      image,
      summary,
      readyInMinutes,
      servings,
    });

    const recipeId = newRecipe.id;
    console.log('new recipe Id: ', recipeId)

    // Thêm các nguyên liệu vào RecipeIngredient
    if (Array.isArray(ingredients)) {
      const ingredientData = ingredients.map((ingredient) => ({
        recipeId,
        ingredientId: ingredient.id,
        amount: ingredient.amount,
        unit: ingredient.unit,
        original: "whatever",
      }));
      await RecipeIngredient.bulkCreate(ingredientData);
    }

    // Thêm các bước hướng dẫn vào RecipeInstruction
    if (Array.isArray(instructions)) {
      const instructionData = instructions.map((instruction, index) => ({
        recipeId: recipeId,
        stepNumber: instruction.stepNumber,
        content: instruction.content,
      }));
      console.log("Ins:", instructionData)
      await RecipeInstruction.bulkCreate(instructionData);
    }

    // Thêm các tag vào RecipeTag
    if (Array.isArray(tags)) {
      const tagData = tags.map((tag) => ({
        recipe_id: recipeId,
        tag,
      }));
      await RecipeTag.bulkCreate(tagData);
    }

    return res.status(201).json({ message: 'Recipe created successfully', recipeId });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ error: 'An error occurred while creating the recipe' });
  }
});

// PUT /api/recipes/:id - Edit công thức đã tạo
recipeRouter.put('/:id', middleware.authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { id } = req.params;
  const {
    title,
    image,
    summary,
    readyInMinutes,
    servings,
    ingredients,
    instructions,
    tags,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!title || !readyInMinutes || !servings) {
    return res.status(400).json({ error: 'Title, readyInMinutes, and servings are required' });
  }

  try {
    const recipe = await Recipe.findByPk(id);
    // Kiểm tra công thức có tồn tại không
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    // Kiểm tra quyền sở hữu
    if (recipe.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe' });
    }
    
    // Cập nhật thông tin chung của công thức
    await recipe.update({
      title,
      image,
      summary,
      readyInMinutes,
      servings,
    });

    // Cập nhật nguyên liệu
    if (ingredients && ingredients.length > 0) {
      const ingredientIds = ingredients.map(ingredient => ingredient.id);

      // Xóa nguyên liệu cũ không còn trong danh sách mới
      await RecipeIngredient.destroy({
        where: {
          recipeId: recipe.id,
          ingredientId: { [Op.notIn]: ingredientIds },
        },
      });

      // Cập nhật hoặc thêm mới nguyên liệu
      const ingredientPromises = ingredients.map(async (ingredient) => {
        try {
          const { id: ingredientId, amount, unit } = ingredient;
          const existingIngredient = await RecipeIngredient.findOne({
            where: { recipeId: recipe.id, ingredientId },
          });

          if (existingIngredient) {
            await existingIngredient.update({ amount, unit });
          } else {
            await RecipeIngredient.create({
              recipeId: recipe.id,
              ingredientId,
              amount,
              unit,
            });
          }
        } catch (error) {
          console.error(`Error processing ingredient ${ingredient.id}:`, error);
        }
      });

      await Promise.all(ingredientPromises);
    }

    // Cập nhật bước công thức
    if (instructions && instructions.length > 0) {
      const instructionPromises = instructions.map(async (step) => {
        const { stepNumber, content } = step;

        // Kiểm tra và cập nhật hoặc tạo mới bước công thức
        const existingStep = await RecipeInstruction.findOne({
          where: {
            recipeId: recipe.id,
            stepNumber: stepNumber,
          },
        });

        if (existingStep) {
          return existingStep.update({ content });
        } else {
          return RecipeInstruction.create({
            recipeId: recipe.id,
            stepNumber,
            content,
          });
        }
      });

      await Promise.all(instructionPromises);
    }

    // Cập nhật tags
    if (tags && tags.length > 0) {
      // Xóa tất cả các tag hiện tại trước khi thêm mới
      await RecipeTag.destroy({ where: { recipe_id: recipe.id } });

      // Thêm các tag mới
      const tagData = tags.map(tag => ({
        recipe_id: recipe.id,
        tag,
      }));
      await RecipeTag.bulkCreate(tagData);
    }

    res.status(200).json({ message: 'Recipe updated successfully' });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
});

// POST /api/recipes/competition-entry
recipeRouter.post('/competition-entry', middleware.authenticateJWT, async (req, res) => {
  const userId = req.user.id

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const {
      title,
      image,
      summary,
      readyInMinutes,
      servings,
      ingredients,
      instructions,
      tags,
      competitionId
  } = req.body;

  try {
      const result = await db.transaction(async (t) => {
          // 1. Tạo recipe mới với isSubmission = true
          const recipe = await Recipe.create({
              userId,
              title,
              image,
              summary,
              readyInMinutes,
              servings,
              isSubmission: true
          }, { transaction: t });

          // 2. Tạo các thành phần phụ của recipe
          const ingredientPromises = ingredients.map(async (ing) => {
              let ingredient;
              if (ing.id) {
                  ingredient = await Ingredient.findByPk(ing.id, { transaction: t });
              }
              
              if (!ingredient) {
                  [ingredient] = await Ingredient.findOrCreate({
                      where: { name: ing.name },
                      defaults: { name: ing.name },
                      transaction: t
                  });
              }

              return RecipeIngredient.create({
                  recipeId: recipe.id,
                  ingredientId: ingredient.id,
                  amount: ing.amount,
                  unit: ing.unit,
                  original: `${ing.amount} ${ing.unit} ${ing.name}`
              }, { transaction: t });
          });

          const instructionPromises = instructions.map((inst) => 
              RecipeInstruction.create({
                  recipeId: recipe.id,
                  stepNumber: inst.stepNumber,
                  content: inst.content
              }, { transaction: t })
          );

          const tagPromises = tags.map((tag) =>
              RecipeTag.create({
                  recipe_id: recipe.id,
                  tag: tag.trim()
              }, { transaction: t })
          );

          await Promise.all([
              Promise.all(ingredientPromises),
              Promise.all(instructionPromises),
              Promise.all(tagPromises)
          ]);

          // 3. Tạo competition entry
          const existingEntry = await CompetitionEntry.findOne({
            where: {
              competitionId,
              userId,
            }
          });
          
          if (existingEntry) {
            existingEntry.submissionId = recipe.id;
            await existingEntry.save();
          } else {
            await CompetitionEntry.create({
              competitionId,
              userId,
              submissionId: recipe.id, // Đặt submissionId là recipeId
            });
          }

          // 4. Lấy recipe đầy đủ để trả về
          const fullRecipe = await Recipe.findByPk(recipe.id, {
              include: [
                  {
                      model: RecipeIngredient,
                      include: [Ingredient]
                  },
                  {
                      model: RecipeInstruction,
                      order: [['stepNumber', 'ASC']]
                  },
                  {
                      model: RecipeTag
                  }
              ],
              transaction: t
          });

          return fullRecipe;
      });

      res.status(201).json(result);
  } catch (error) {
      console.error('Lỗi khi tạo bài dự thi:', error);
      res.status(500).json({ 
          error: 'Lỗi khi tạo bài dự thi',
          details: error.message 
      });
  }
});

// GET /api/recipes/my-recipe/:id - Lấy công thức của người dùng cụ thể
recipeRouter.get('/my-recipe/:id', middleware.authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Middleware đã lưu thông tin user vào req.user
  console.log('api get my recipe id:', id, userId)

  try {
    const recipe = await Recipe.findOne({
      where: { 
        id,
        userId // Đảm bảo chỉ lấy công thức thuộc về user đang đăng nhập
      },
      include: [
        {
          model: RecipeIngredient,
          include: [Ingredient],
        },
        {
          model: RecipeInstruction,
        },
        {
          model: RecipeTag,
        },
      ],
      order: [[RecipeInstruction, 'stepNumber', 'ASC']], // Sắp xếp bước hướng dẫn
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or unauthorized' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching user recipe:', error);
    res.status(500).json({ 
      error: 'Error fetching user recipe' 
    });
  }
});

// Thêm API endpoint tìm kiếm nguyên liệu
recipeRouter.get('/ingredients/search', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Query cannot be empty.' });
  }

  try {
    const ingredients = await Ingredient.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('name')),
        'LIKE',
        `%${query.toLowerCase()}%`
      ),
      attributes: ['id', 'name', 'image'],
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/////////////APi endpoint cho admin////////////
// Tạo router riêng cho admin

// Lấy tất cả công thức (Admin)
recipeRouter.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        { model: RecipeTag },
        { model: RecipeIngredient, include: [Ingredient] },
        { model: RecipeInstruction }
      ]
    });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Xóa công thức (Admin)
recipeRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Xóa các bản ghi liên quan
    // Xóa các bản ghi liên quan
    await RecipeInstruction.destroy({ where: { recipeId: id } });
    await RecipeIngredient.destroy({ where: { recipeId: id } });
    await RecipeTag.destroy({ where: { recipe_id: id } });
    await RecipeComment.destroy({ where: { recipeId: id } });
    await RecipeAverageRating.destroy({ where: { recipeId: id } })
    await RecipeRating.destroy({ where: { recipeId: id } });
    await ShoppinglistRecipe.destroy({ where: { recipeId: id } });
    
    await recipe.destroy();
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

///////////////////////////////////////////////

module.exports = recipeRouter;
