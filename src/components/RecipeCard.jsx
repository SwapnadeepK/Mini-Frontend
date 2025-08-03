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
    // <Card sx={{ width: '100%', marginBottom: 3 }}>
    //   {recipe.image && (
    //     <CardMedia
    //       component="img"
    //       height="250"
    //       image={recipe.image}
    //       alt={recipe.name}
    //     />
    //   )}
     <Card
      sx={{
        maxWidth: '100%',
        marginBottom: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
    >
      {recipe.image && (
        <CardMedia
          component="img"
          image={recipe.image}
          alt={recipe.name}
          sx={{
            height: 200,
            objectFit: 'cover',
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 0.95,
            },
          }}
        />
      )}
        <Box sx={{ padding: 2 }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{recipe.name}</h2>

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
    </Box>
    </Card>
  );
};

export default RecipeCard;