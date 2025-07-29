// // Tokenization: supports commas and the word "and"
// const tokenizeIngredients = (query) => {
//   return query
//     .toLowerCase()
//     .replace(/[^a-z0-9,\sand]/gi, '')         // keep letters, numbers, commas, and "and"
//     .split(/\s*(?:,|\band\b)\s*/i)            // split on comma or "and"
//     .filter(Boolean);                         // remove empty values
// };
import axios from 'axios';
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_KEY;
// const X_API_KEY = process.env.X_API_KEY;
// Tokenization: only tokenize when query includes commas, "and" or "or"
const tokenizeIngredients = (query) => {
  const shouldTokenize = /,|\band\b|\bor\b/i.test(query);
  if (!shouldTokenize) return [query.trim().toLowerCase()];
  
  return query
    .toLowerCase()
    .replace(/[^a-z0-9,\sandor]/gi, '') // keep letters, numbers, comma, and/or
    .split(/\s*(?:,|\band\b|\bor\b)\s*/i) // split by comma, 'and', or 'or'
    .filter(Boolean);
};

const formatAPIRecipe = (data, sourceName) =>
  data?.filter(r => r.instructions?.trim()).map(r => ({
    id: r.id || r.idMeal || r._id || Math.random(),
    name: r.name || r.title || r.strMeal,
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : typeof r.ingredients === 'string' ? r.ingredients.split(',').map(i => i.trim()) : [],
    instructions: r.instructions || r.strInstructions,
    image: r.image || r.strMealThumb || r.thumbnail || '',
    video: r.video || r.strYoutube || '',
    source: sourceName
  })) || [];

const fetchAllRecipes = async (query, token = '') => {
  const ingredients = tokenizeIngredients(query);
  console.log('[DEBUG] Tokenized Ingredients:', ingredients);
  const jQuery = ingredients.join(',');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let found = false;
  let finalRecipes = [];
  let sourceUsed = '';

  const tryAPI = async (fn) => {
    if (found) return;
    try {
      const result = await fn();
      if (result.recipes.length > 0) {
        found = true;
        finalRecipes = result.recipes;
        sourceUsed = result.source;
      }
    } catch (err) {
      console.warn('API fetch error:', err.message);
    }
  };

  // 1. Tasty API (localhost)
  // await tryAPI(async () => {
  //   const res = await axios.get(`http://localhost:5000/search?q=${jQuery}`, { headers });
  //   return {
  //     recipes: formatAPIRecipe(res.data.recipes, 'Tasty API (Localhost)'),
  //     source: 'Tasty API (Localhost)'
  //   };
  // });

  // 1. Tasty API (localhost)
// await tryAPI(async () => {
//   const res = await axios.get(`http://localhost:5000/search?q=${jQuery}`, { headers });

//   // Optional: Format only if you want consistent structure across APIs
//   const formattedRecipes = res.data.recipes.map(recipe => ({
//     title: recipe.title,
//     ingredients: recipe.ingredients || [],
//     directions: recipe.directions || [],
//     link: recipe.link,
//     source: recipe.source || 'Tasty API (Localhost)',
//     NER: recipe.NER || []
//   }));

//   return {
//     recipes: formattedRecipes,
//     source: 'Tasty API (Localhost)'
//   };
// });
    // 1. Tasty API (localhost)
await tryAPI(async () => {
  const res = await axios.get(`http://localhost:5000/search?q=${jQuery}`, { headers });

  // Format to match standard structure
  const formattedRecipes = res.data.recipes.map((recipe, index) => ({
    id: recipe._id || index + 1, // fallback index if no ID
    name: recipe.title || 'Untitled',
    // ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients || '',
    ingredients: Array.isArray(recipe.ingredients)? recipe.ingredients: typeof recipe.ingredients === 'string'? recipe.ingredients.split(',').map(i => i.trim()): [],
    instructions: Array.isArray(recipe.directions) ? recipe.directions.join(' ') : recipe.directions || '',
    image: recipe.image || '', // Add if Tasty API has image
    video: recipe.video || '', // Add if Tasty API has video
    source: 'Tasty API (Localhost)'
  })).filter(r => r.instructions?.trim());

  return {
    recipes: formattedRecipes,
    source: 'Tasty API (Localhost)'
  };
});



  // 2. DummyJSON
  await tryAPI(async () => {
    const res = await axios.get(`https://dummyjson.com/recipes/search?q=${jQuery}`);
    return {
      recipes: formatAPIRecipe(res.data.recipes, 'DummyJSON API'),
      source: 'DummyJSON API'
    };
  });

  // 3. TheMealDB (by name)
  await tryAPI(async () => {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${jQuery}`);
    return {
      recipes: formatAPIRecipe(res.data.meals, 'TheMealDB (by name)'),
      source: 'TheMealDB (by name)'
    };
  });

  // 4. TheMealDB (by ingredient)
  await tryAPI(async () => {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${jQuery}`);
    const meals = res.data.meals || [];
    const detailed = await Promise.all(meals.map(async (meal) => {
      try {
        const detail = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const d = detail.data.meals?.[0];
        return d?.strInstructions ? {
          id: d.idMeal,
          name: d.strMeal,
          instructions: d.strInstructions,
          image: d.strMealThumb,
          video: d.strYoutube,
          source: 'TheMealDB (by ingredient)'
        } : null;
      } catch {
        return null;
      }
    }));
    return {
      recipes: detailed.filter(Boolean),
      source: 'TheMealDB (by ingredient)'
    };
  });

  // 5. Zestful API fallback
  await tryAPI(async () => {
    // const res = await axios.get(`https://zestfulapi.vercel.app/api/recipes?q=${jQuery}`);
    const res = await axios.get(`https://cors-anywhere.herokuapp.com/https://zestfulapi.vercel.app/api/recipes?q=${jQuery}`);
    return {
      recipes: formatAPIRecipe(res.data.recipes, 'Zestful API'),
      source: 'Zestful API'
    };
  });

  //6. TheCocktailDB
  // await tryAPI(async () => {
  //   const res = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${jQuery}`);
  //   return {
  //     recipes: formatAPIRecipe(res.data.drinks, 'TheCocktailDB'),
  //     source: 'TheCocktailDB'
  //   };
  // });

  // 6. TheCocktailDB (by drink name)
await tryAPI(async () => {
  const res = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${jQuery}`);
  const drinks = res.data.drinks || [];

  const formatted = drinks.map(drink => ({
    id: drink.idDrink,
    name: drink.strDrink,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
    video: drink.strVideo || '', // strVideo is usually null, fallback to empty
    source: 'TheCocktailDB'
  })).filter(r => r.instructions?.trim());
  return {
    recipes: formatted,
    source: 'TheCocktailDB'
  };
});

// 7. Spoonacular API
  await tryAPI(async () => {
    if (!SPOONACULAR_API_KEY) throw new Error('Missing Spoonacular API key');
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          includeIngredients: jQuery,
          number: 10,
          instructionsRequired: true,
          apiKey: SPOONACULAR_API_KEY,
          addRecipeInformation: true
        }
      }
    );

    const recipes = res.data.results.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      instructions: recipe.instructions || '',
      image: recipe.image || '',
      video: '', // Spoonacular doesn't include videos by default
      source: 'Spoonacular API'
    }));

    return {
      recipes: recipes.filter(r => r.instructions?.trim()),
      source: 'Spoonacular API'
    };
  });

   // 8. Ninja Recipe API
  // await tryAPI(async () => {
  //   if (!X_API_KEY) throw new Error('Missing Ninja API Key');
    
  //   const res = await axios.get(
  //     `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(jQuery)}`,
  //     {
  //       headers: { 'X-Api-Key': X_API_KEY }
  //     }
  //   );

  //   const formatted = res.data.map((r, index) => ({
  //     id: r.id || r._id || index + 1000,
  //     name: r.title || 'Untitled',
  //     instructions: r.instructions || '',
  //     image: '',
  //     video: '',
  //     source: 'Ninja API'
  //   })).filter(r => r.instructions?.trim());

  //   return {
  //     recipes: formatted,
  //     source: 'Ninja API'
  //   };
  // });
  // Not working at all, so commenting out for now
  // https://api-ninjas.com/profile 

  return { recipes: finalRecipes, source: sourceUsed, found };
};

export { fetchAllRecipes };
