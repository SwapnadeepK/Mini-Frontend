import axios from 'axios';

const formatAPIRecipe = (data, sourceName) =>
  data?.filter(r => r.instructions?.trim()).map(r => ({
    id: r.id || r.idMeal || r._id || Math.random(),
    name: r.name || r.title || r.strMeal,
    instructions: r.instructions || r.strInstructions,
    image: r.image || r.strMealThumb || r.thumbnail || '',
    video: r.video || r.strYoutube || '',
    source: sourceName
  })) || [];

const fetchAllRecipes = async (query, token = '') => {
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
  await tryAPI(async () => {
    const res = await axios.get(`http://localhost:5000/recipes/search?q=${query}`, { headers });
    return {
      recipes: formatAPIRecipe(res.data.recipes, 'Tasty API (Localhost)'),
      source: 'Tasty API (Localhost)'
    };
  });

  // 2. DummyJSON
  await tryAPI(async () => {
    const res = await axios.get(`https://dummyjson.com/recipes/search?q=${query}`);
    return {
      recipes: formatAPIRecipe(res.data.recipes, 'DummyJSON API'),
      source: 'DummyJSON API'
    };
  });

  // 3. TheMealDB (by name)
  await tryAPI(async () => {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    return {
      recipes: formatAPIRecipe(res.data.meals, 'TheMealDB (by name)'),
      source: 'TheMealDB (by name)'
    };
  });

  // 4. TheMealDB (by ingredient)
  await tryAPI(async () => {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
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
    const res = await axios.get(`https://zestfulapi.vercel.app/api/recipes?q=${query}`);
    return {
      recipes: formatAPIRecipe(res.data.recipes, 'Zestful API'),
      source: 'Zestful API'
    };
  });

  return { recipes: finalRecipes, source: sourceUsed, found };
};

export { fetchAllRecipes };
