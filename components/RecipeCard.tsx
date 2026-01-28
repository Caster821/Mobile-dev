import { View, Text, Image, StyleSheet } from 'react-native';
import Tag from './Tag';
import { Recipe } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const stars = '⭐'.repeat(Math.round(recipe.rating));

  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.row}>
          <Text style={styles.meta}>⏱️ {recipe.cookTime} min</Text>
          <Text style={styles.difficulty}>{recipe.difficulty}</Text>
        </View>

        <Text style={styles.rating}>
          {stars} ({recipe.rating})
        </Text>

        <View style={styles.tags}>
          {recipe.tags.map(tag => (
            <Tag key={tag} text={tag} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meta: {
    color: '#555',
  },
  difficulty: {
    fontWeight: '600',
    color: '#007AFF',
  },
  rating: {
    marginBottom: 8,
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default RecipeCard;
