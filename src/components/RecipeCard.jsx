import React from 'react';
import { Card, CardContent, CardMedia, CardActions, Link, Box } from '@mui/material';
import TypewriterBlock from './TypewriterText';
import YouTubeIcon from '@mui/icons-material/YouTube';

const RecipeCard = ({ recipe }) => {
  const ingredientsLines = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients?.split(',').map(i => i.trim()) || [];

  const instructionLines = recipe.instructions
    ? recipe.instructions.split(/\.|\n|•|-/).map(step => step.trim()).filter(Boolean)
    : [];

  return (
    <Card sx={{ width: '100%', marginBottom: 3 }}>
      {recipe.image && (
        <CardMedia
          component="img"
          height="250"
          image={recipe.image}
          alt={recipe.name}
        />
      )}

      <CardContent>
        <Box mb={2}>
          <h3><strong>🍽️ Recipe:</strong></h3>
          <TypewriterBlock lines={[recipe.name]} />
        </Box>

        {ingredientsLines.length > 0 && (
          <Box mb={2}>
            <h3><strong>🧂 Ingredients:</strong></h3>
            <TypewriterBlock lines={ingredientsLines} />
          </Box>
        )}

        {instructionLines.length > 0 && (
          <Box>
            <h3><strong>👨‍🍳 Cooking Steps:</strong></h3>
            <TypewriterBlock lines={instructionLines} />
          </Box>
        )}
      </CardContent>

      {recipe.video && (
  <CardActions>
    <Link
      href={recipe.video}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
    >
      <YouTubeIcon color="error" />
      <strong>Watch Video</strong>
    </Link>
  </CardActions>
)}

    </Card>
  );
};

export default RecipeCard;