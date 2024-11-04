const axios = require('axios');
const Ingredient = require('./models/ingredient')
const IngredientCategory = require('./models/ingredient_category')
const IngredientNutrition = require('./models/ingredient_nutrition')
const IngredientCaloricbreakdown = require('./models/ingredient_caloricbreakdown')

const API_KEY = '22dbdb3252d3488fa93c58cb226f78e4';

async function fetchAndStoreIngredient(id) {
    try {
        const response = await axios.get(`https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${API_KEY}&amount=1`);
        const ingredientData = response.data;

        // // Kiểm tra nếu ingredient đã tồn tại trong database
        // const existingIngredient = await Ingredient.findOne({ where: { id: ingredientData.id } });
        // if (existingIngredient) {
        //     // console.log(`Ingredient with ID ${ingredientData.id} already exists.`);

        //     // Lưu nutrition vào bảng ingredient_nutrition
        //     const weightPerServing = ingredientData.nutrition.weightPerServing
        //     const servingAmount = weightPerServing.amount;
        //     const servingUnit = weightPerServing.unit;

        //     ingredientData.nutrition.nutrients.forEach(async (nutrient) => {
        //         await IngredientNutrition.create({
        //             ingredientId: id,
        //             name: nutrient.name,
        //             amount: nutrient.amount,
        //             unit: nutrient.unit,
        //             percentOfDailyNeeds: nutrient.percentOfDailyNeeds,
        //             servingAmount,
        //             servingUnit,
        //         });
        //     });

        //     console.log('Nutrition updated successfully.');
        //     return;
        // }

        // Lưu ingredient vào bảng ingredient
        const ingredient = await Ingredient.create({
            id: ingredientData.id,
            name: ingredientData.name,
            image: ingredientData.image,
        });

        // Lưu nutrition vào bảng ingredient_nutrition
        const weightPerServing = ingredientData.nutrition.weightPerServing
        const servingAmount = weightPerServing.amount;
        const servingUnit = weightPerServing.unit;

        ingredientData.nutrition.nutrients.forEach(async (nutrient) => {
            await IngredientNutrition.create({
                ingredientId: ingredientData.id,
                name: nutrient.name,
                amount: nutrient.amount,
                unit: nutrient.unit,
                percentOfDailyNeeds: nutrient.percentOfDailyNeeds,
                servingAmount,
                servingUnit,
            });
        });

        // Lưu caloric breakdown vào bảng ingredient_caloricbreakdown
        const caloricBreakdown = ingredientData.nutrition.caloricBreakdown;
        await IngredientCaloricbreakdown.create({
            ingredientId: ingredient.id,
            percentProtein: caloricBreakdown.percentProtein,
            percentFat: caloricBreakdown.percentFat,
            percentCarbs: caloricBreakdown.percentCarbs,
        });

        // Lưu category path vào bảng ingredient_category
        ingredientData.categoryPath.forEach(async (category) => {
            await IngredientCategory.create({
                ingredientId: ingredient.id,
                category,
            });
        });

        console.log(`Ingredient with ID ${ingredientData.id} has been saved.`);
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log('Rate limit exceeded, waiting for 30s...');
            // Đợi 1 phút (60000 ms) trước khi gọi lại API
            await new Promise(resolve => setTimeout(resolve, 30000));
            return fetchAndStoreIngredient(id); // Thử lại API với cùng id sau khi chờ
        } else if (error.response && error.response.status === 402) {
            console.error('Payment required (402). Stopping execution.');
            process.exit(1); // Thoát chương trình với mã lỗi 1
        } else {
            console.error(`Error fetching ingredient ${id}:`, error.message);
        }
    }
}

async function fetchAndStoreIngredients() {
    for (let id = 11001; id <= 12000; id++) {
        await fetchAndStoreIngredient(id);
    }
}