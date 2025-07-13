import React, { useState } from 'react';
import axios from 'axios';
import TypewriterBlock from '../components/TypewriterText';

const RecipeFetcher = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    setRecipes([]);
    setSource('');

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let found = false;

    // 1. Localhost Tasty API
    try {
      const tastyRes = await axios.get(`http://localhost:5000/recipes/search?q=${query}`, { headers });
      const validRecipes = tastyRes.data.recipes?.filter(r => r.instructions?.trim()) || [];
      if (validRecipes.length > 0) {
        setRecipes(validRecipes);
        setSource('Tasty API (Localhost)');
        found = true;
      }
    } catch (err) {
      console.warn('Tasty API failed:', err.message);
    }
    if (found) return setLoading(false);

    // 2. DummyJSON
    try {
      const dummyRes = await axios.get(`https://dummyjson.com/recipes/search?q=${query}`);
      const validRecipes = dummyRes.data.recipes?.filter(r => r.instructions?.trim()) || [];
      if (validRecipes.length > 0) {
        setRecipes(validRecipes);
        setSource('DummyJSON API');
        found = true;
      }
    } catch (err) {
      console.warn('DummyJSON API failed:', err.message);
    }
    if (found) return setLoading(false);

    // 3. TheMealDB name search
    try {
      const mealRes = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const validRecipes = (mealRes.data.meals || []).map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        instructions: meal.strInstructions
      })).filter(r => r.instructions?.trim());
      if (validRecipes.length > 0) {
        setRecipes(validRecipes);
        setSource('TheMealDB');
        found = true;
      }
    } catch (err) {
      console.warn('TheMealDB name search failed:', err.message);
    }
    if (found) return setLoading(false);

    // 4. TheMealDB ingredient filter search with lookup details
    try {
      const incRes = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
      if (Array.isArray(incRes.data.meals) && incRes.data.meals.length > 0) {
        const detailPromises = incRes.data.meals.map(async meal => {
          try {
            const detailRes = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const detail = detailRes.data.meals?.[0];
            return {
              id: meal.idMeal,
              name: meal.strMeal,
              instructions: detail?.strInstructions || ''
            };
          } catch {
            return null;
          }
        });
        const fullRecipes = (await Promise.all(detailPromises)).filter(r => r && r.instructions?.trim());
        if (fullRecipes.length > 0) {
          setRecipes(fullRecipes);
          setSource('TheMealDB (by ingredient)');
          found = true;
        }
      }
    } catch (err) {
      console.warn('TheMealDB ingredient filter failed:', err.message);
    }
    if (found) return setLoading(false);

    // 5. Zestful API (simulated)
    try {
      const zestRes = await axios.get(`https://zestfulapi.vercel.app/api/recipes?q=${query}`);
      const validRecipes = zestRes.data.recipes?.filter(r => r.instructions?.trim()) || [];
      if (validRecipes.length > 0) {
        setRecipes(validRecipes);
        setSource('Zestful API');
        found = true;
      }
    } catch (err) {
      console.warn('Zestful API failed:', err.message);
    }
    if (found) return setLoading(false);

    setError(`No recipes found for "${query}". Try using broader dish names like "curry" or "soup".`);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) fetchRecipes();
  };

  const formatInstructions = (text) => {
    if (typeof text !== 'string') return ['No instructions available.'];
    return text
      .split('.')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => `${s}.`);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Calibri, Times New Roman, serif',
        fontSize: '14px',
      }}
    >
      <h2>Recipe Ingredient Search</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter ingredient(s)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '8px',
            marginRight: '10px',
            width: '250px',
            fontSize: '14px',
          }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '14px' }}>
          Search
        </button>
      </form>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {source && <p><strong>Source:</strong> {source}</p>}

      <div>
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id || index}
            style={{
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
              marginBottom: '10px',
            }}
          >
            <h4>{recipe.name || recipe.title}</h4>

            {formatInstructions(recipe.instructions).length > 0 && (
              <TypewriterBlock
                lines={formatInstructions(recipe.instructions)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeFetcher;
