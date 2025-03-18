import React, { useEffect, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Feather, Ionicons, EvilIcons } from '@expo/vector-icons'
import { Divider } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import Animated, {
  Easing,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { getData, setData } from '../helpers/storageHelper'
import GoogleLens from '../assets/svg/googlelens.svg'
import GoogleMic from '../assets/svg/googlemic.svg'

const RECENT_SEARCHES_KEY = 'recentSearches'

const SearchScreen = ({ navigation, route }) => {
  const scale = useSharedValue(0.2)
  const opacity = useSharedValue(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [state, setstate] = useState({
    googlesearcheddata: [],
    suggestions: [],
    loading: false,
  })

  const searchTranscriptData = () => {
    const transcript_data = route?.params?.transcript || ''
    if (transcript_data?.length > 0) {
      setSearchQuery(transcript_data)
      performSearch(transcript_data)
    }
  }
  useEffect(() => {
    textInputAnimation()
    loadRecentSearches()
    searchTranscriptData()
  }, [])

  useEffect(() => {
    if (searchQuery.length < 2) {
      setstate(prev => ({ ...prev, suggestions: [] }))
      return
    }

    const fetchSuggestions = async () => {
      console.log('Fetching search suggestions...')
      setstate(prev => ({ ...prev, loading: true }))

      try {
        const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(searchQuery)}`
        const response = await fetch(url)
        const result = await response.json()
        console.log('loggin suggestion result', result)

        setstate(prev => ({
          ...prev,
          suggestions: Array.isArray(result[1]) ? result[1] : [],
        }))
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }

      setstate(prev => ({ ...prev, loading: false }))
    }

    const debounceTimer = setTimeout(fetchSuggestions, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const textInputAnimation = () => {
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
  }

  const textInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const loadRecentSearches = async () => {
    console.log('i have been called load recent')
    const storedSearches = await getData(RECENT_SEARCHES_KEY)
    console.log(' loaded recent', storedSearches)
    if (storedSearches) {
      setRecentSearches(storedSearches)
    }
  }

  const fetchSearchResults = async query => {
    setstate(prevs => ({ ...prevs, loading: true }))
    const url = `https://google-search74.p.rapidapi.com/?query=${query}&limit=10&related_keywords=true`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'c0ef9dc3bfmsh6aa63718c1b0555p1ab0e5jsn2f9b2096151d',
        'x-rapidapi-host': 'google-search74.p.rapidapi.com',
      },
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()
      setstate(prevs => ({ ...prevs, loading: false }))
      // console.log(result);
      return result
    } catch (error) {
      console.error(error)
    }
  }

  const performSearch = async query => {
    if (!query.trim()) return

    const googleSearchUrl = await fetchSearchResults(query)

    setstate(prevs => ({
      ...prevs,
      googlesearcheddata: googleSearchUrl?.results,
    }))

    setRecentSearches(prevs => {
      const updatedSearches = [
        query,
        ...prevs.filter(item => item !== query),
      ].slice(0, 10)
      setData(RECENT_SEARCHES_KEY, updatedSearches)
      return updatedSearches
    })
  }

  const removeSearchData = async itemname => {
    const newData = recentSearches.filter(item => item !== itemname)
    Alert.alert(
      'Delete Search',
      'Are you sure you want to delete this search?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setRecentSearches(newData)
            await setData(RECENT_SEARCHES_KEY, newData)
          },
        },
      ],
    )
  }

  const handleOnPress = item => {
    setSearchQuery(item)
    performSearch(item)
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Animated.View style={[styles.searchBar, textInputStyle]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={20}
            color="#888"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search or type URL"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          cursorColor="#456ff9"
          onSubmitEditing={() => performSearch(searchQuery)}
        />
        <TouchableOpacity
          style={{ padding: 6 }}
          onPress={() => navigation.navigate('Speak')}>
          <GoogleMic width={25} height={25} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 3, marginLeft: 8, marginRight: 2 }}
          onPress={() => navigation.navigate('Lens')}>
          <GoogleLens width={25} height={25} />
        </TouchableOpacity>
      </Animated.View>

      {/* Recent Searches */}
      <View style={styles.section}>
        {state.suggestions?.length == 0 && (
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Recent searches</Text>
            <TouchableOpacity>
              <Text style={styles.manageHistory}>MANAGE HISTORY</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={{ marginBottom: 70 }}>
          {state.loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'large'} color={'#456ff9'} />
            </View>
          ) : state.googlesearcheddata?.length > 0 ? (
            state.googlesearcheddata.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item?.url)
                }}
                key={index}>
                <View style={styles.searchItem}>
                  <Text
                    style={[
                      styles.searchText,
                      { fontSize: 22, marginBottom: 8, color: '#456ff9' },
                    ]}>
                    {item?.title}
                  </Text>
                  <Text style={styles.searchText}>{item?.description}</Text>
                </View>
                <Divider style={styles.divider} />
              </TouchableOpacity>
            ))
          ) : state.suggestions?.length > 0 ? (
            state.suggestions.map((item, index) => (
              <TouchableOpacity onPress={() => handleOnPress(item)} key={index}>
                <View style={[styles.searchItem, { flexDirection: 'row' }]}>
                  <EvilIcons name="search" size={18} color="gray" />
                  <Text style={styles.searchText}>{item}</Text>
                </View>
                <Divider style={styles.divider} />
              </TouchableOpacity>
            ))
          ) : (
            recentSearches.map((search, index) => (
              <TouchableOpacity
                onPress={() => handleOnPress(search)}
                onLongPress={() => removeSearchData(search)}
                key={index}>
                <Animated.View
                  style={[styles.searchItem, { flexDirection: 'row' }]}
                  entering={FadeInRight.duration(800 + index * 100)}>
                  <Feather name="clock" size={18} color="gray" />
                  <Text style={styles.searchText}>{search}</Text>
                </Animated.View>
                <Divider style={styles.divider} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#1f2125',
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f3133',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
  },
  section: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'gray',
    fontSize: 14,
  },
  manageHistory: {
    color: 'gray',
    fontSize: 14,
  },
  searchItem: {
    paddingVertical: 10,
  },
  searchText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#444',
    height: 1,
  },
  incognitoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  incognitoText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
})
