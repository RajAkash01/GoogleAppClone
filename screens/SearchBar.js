import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';

const SearchBar = ({ navigation }) => {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Search Google"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <IconButton icon="magnify" onPress={() => navigation.navigate('SearchResults', { query })} />
      <IconButton icon="camera" onPress={() => navigation.navigate('ImageSearch')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  input: { flex: 1, marginRight: 10 },
});

export default SearchBar;
