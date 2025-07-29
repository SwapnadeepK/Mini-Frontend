import React, { useState } from 'react';
import {fetchAllRecipes} from '../components/utils/fetchFromAPIs';
import  formatInstructions  from '../components/utils/formatInstructions';
import TypewriterBlock from '../components/TypewriterText';
import Pagination from '../components/Pagination';

const RecipeFetcher = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const recipesPerPage = 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setRecipes([]);
    setSource('');
    setCurrentPage(1);

    try {
  const { recipes, source, found } = await fetchAllRecipes(query);
  if (found && recipes.length > 0) {
    setRecipes(recipes);
    setSource(source);
  } else {
    setError(`No recipes found for "${query}". Try broader or alternate terms.`);
  }
} catch (err) {
  setError('Failed to fetch recipes. Please try again later.');
  console.error('Fetch error:', err);
}


    setLoading(false);
  };

  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <div style={{ padding: '20px', fontFamily: 'Calibri, Times New Roman, serif', fontSize: '14px' }}>
      <h2>Recipe Ingredient Search</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter ingredient(s)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '250px', fontSize: '14px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '14px' }}>Search</button>
      </form>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {source && <p><strong>Source:</strong> {source}</p>}

      {currentRecipes.map((recipe, index) => (
        <div key={recipe.id || index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <h4>{recipe.name}</h4>
          {recipe.image && (
            <img src={recipe.image} alt={recipe.name} style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }} />
          )}
          {recipe.video && (
            <div style={{ marginBottom: '10px' }}>
              <a href={recipe.video} target="_blank" rel="noopener noreferrer">Watch Video</a>
            </div>
          )}
          {recipe.ingredients?.length > 0 && (
  <div style={{ marginBottom: '10px' }}>
    <strong>Ingredients:</strong>
    <ul style={{ paddingLeft: '20px' }}>
      {Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
        : recipe.ingredients.split(',').map((ing, i) => <li key={i}>{ing.trim()}</li>)
      }
    </ul>
  </div>
)}
          <TypewriterBlock lines={formatInstructions(recipe.instructions)} />
        </div>
      ))}

      {recipes.length > recipesPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default RecipeFetcher;