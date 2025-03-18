import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

const SearchResults = ({ route }) => {
  const { query } = route.params;
  const results = [
    { id: '1', title: 'Result 1', description: 'Description 1' },
    { id: '2', title: 'Result 2', description: 'Description 2' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results for "{query}"</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} subtitle={item.description} />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { marginBottom: 10 },
});

export default SearchResults;
