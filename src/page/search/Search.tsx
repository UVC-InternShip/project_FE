import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_URL} from '../../config';

const SearchPage = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/contents/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: searchText, purpose: ''}),
      });
      const data = await response.json();
      if (data.state === 'success') {
        setSearchResults(data.result);
        setRecentSearches([...recentSearches, searchText]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductPress = (id: number) => {
    navigation.navigate('ProductDetail', {productId: id});
  };

  const handleDelete = item => {
    setRecentSearches(recentSearches.filter(search => search !== item));
  };

  const renderRecentSearch = ({item}) => (
    <View style={styles.recentItem}>
      <Icon name="time-outline" size={20} />
      <Text style={styles.recentText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Icon name="close" size={20} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchResult = ({item}) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleProductPress(item.contentsId)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="제품을 검색"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>최근 검색</Text>
        <TouchableOpacity onPress={() => setRecentSearches([])}>
          <Text style={styles.headerText}>모두 삭제</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentSearches}
        renderItem={renderRecentSearch}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
      />

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={item => item.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentText: {
    marginLeft: 10,
    flex: 1,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchPage;
