import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCategories } from '../../../hooks/useCategories';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';

export default function CategoriesScreen() {
  const { categories, loading } = useCategories();

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <CategoryIcon icon={item.icon as any} color={item.color} size={20} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>{item.type.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 12, elevation: 1 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 16 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  type: { fontSize: 12, color: '#888', marginTop: 2 },
});
