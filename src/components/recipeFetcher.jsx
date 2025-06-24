import React, { useState } from 'react';
import axios from 'axios';

const RecipeFetcher = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 🔀 Use backend route if token exists (Tasty API proxy), else DummyJSON
      const apiUrl = token
        ? `http://localhost:5000/recipes/search?q=${query}` // 🔐 Backend proxy for Tasty API
        : `https://dummyjson.com/recipes/search?q=${query}`; // 🌐 Public API

      const response = await axios.get(apiUrl, { headers });

      // Handle structure difference based on API
      const data = response.data;
      const recipeList = data.recipes || data.results || [];

      setRecipes(recipeList);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) fetchRecipes();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Recipe Search</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter recipe name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Search
        </button>
      </form>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id || recipe.name} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
              <h4>{recipe.name || recipe.title}</h4>
              <p>
                {Array.isArray(recipe.instructions)
                  ? recipe.instructions.join(' ').substring(0, 150)
                  : typeof recipe.instructions === 'string'
                  ? recipe.instructions.substring(0, 150)
                  : 'No instructions available.'}
              </p>
            </div>
          ))
        ) : (
          !loading && <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeFetcher;
