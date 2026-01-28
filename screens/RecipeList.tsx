import { View, FlatList, Modal, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { RECIPES, Recipe } from '../data/recipes';

function RecipeList({ onBack }: { onBack?: () => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable style={styles.back} onPress={onBack}>
          <Text style={styles.backText}>⬅ Back</Text>
        </Pressable>
      )}

      <FlatList
        data={RECIPES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelectedRecipe(item)}>
            <RecipeCard recipe={item} />
          </Pressable>
        )}
      />

      <Modal visible={!!selectedRecipe} animationType="slide">
        <View style={styles.modal}>
          {selectedRecipe && (
            <>
              <Text style={styles.title}>{selectedRecipe.title}</Text>
              <Text>⏱️ {selectedRecipe.cookTime} min</Text>
              <Text>Difficulty: {selectedRecipe.difficulty}</Text>
              <Text>⭐ {selectedRecipe.rating}</Text>
            </>
          )}

          <Pressable
            style={styles.close}
            onPress={() => setSelectedRecipe(null)}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
   back: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  backText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modal: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  close: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  closeText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default RecipeList;