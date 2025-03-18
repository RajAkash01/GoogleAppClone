import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native'
import { Avatar, Divider, IconButton } from 'react-native-paper'
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'
import GoogleLens from '../assets/svg/googlelens.svg'
import GoogleMic from '../assets/svg/googlemic.svg'
import BottomSheet from '@gorhom/bottom-sheet'

const API_KEY = 'fb4a94a21b9e4168a458d4d08657ff24'
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`
GoogleSignin.configure({
  webClientId:
    '339677469375-inrde1v4hrjjspfrj3n0lber1bkr41hj.apps.googleusercontent.com',
})

const HomeScreen = ({ navigation }) => {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)
  const screenopacity = useSharedValue(1)
  const sheetRef = React.useRef(null)
  const animatedHeight = useSharedValue(0)

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const hours = new Date().getHours()
  const isDay = hours >= 6 && hours < 18

  useEffect(() => {
    fetchNews()
  }, [])

  useFocusEffect(
    useCallback(() => {
      resetAnimation()
    }, []),
  )

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const userCredential = await auth().signInWithCredential(googleCredential)
      setUserInfo(userCredential.user)
      sheetRef.current?.expand()
      animatedHeight.value = withTiming(300, { duration: 500 })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await fetch(NEWS_URL)
      const data = await response.json()
      if (data.articles) {
        setNews(data.articles)
      } else {
        setNews([])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const fadeOutAnimation = () => {
    screenopacity.value = withTiming(0.8, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
  }
  const textInputAnimation = () => {
    translateY.value = withTiming(-130, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
    opacity.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
  }

  const resetAnimation = () => {
    translateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
    screenopacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  const screenAnimationStyle = useAnimatedStyle(() => ({
    opacity: screenopacity.value,
  }))

  const handleSearchNavigation = () => {
    textInputAnimation()
    fadeOutAnimation()
    setTimeout(() => {
      navigation.navigate('Search')
    }, 500)
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View
        style={[{ backgroundColor: '#1f2125' }, screenAnimationStyle]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}>
          {/* Top Section */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              marginHorizontal: 15,
            }}>
            <IconButton
              onPress={() => {}}
              icon="flask-outline"
              size={24}
              iconColor="#a8c7fb"
            />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E1E1E',
                padding: 10,
                borderRadius: 20,
              }}>
              <MaterialIcons name="search" size={18} color="#FFF" />
              <Text style={{ color: 'white', marginLeft: 5 }}>Search</Text>
            </TouchableOpacity>
            <Avatar.Text
              size={30}
              label="A"
              style={{ backgroundColor: '#3E3E3E' }}
            />
          </View>

          {/* Google Title */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 30,
              marginBottom: 20,
            }}>
            <Image
              source={{
                uri: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png',
              }}
              style={{ width: 140, height: 60, objectFit: 'contain' }}
            />
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#2f3133',
                padding: 8,
                borderRadius: 45,
                marginHorizontal: 15,
                paddingVertical: 18,
              },
              animatedStyle,
            ]}>
            <MaterialIcons
              name="search"
              size={24}
              color="gray"
              style={{ marginLeft: 15 }}
            />
            <TextInput
              cursorColor="#456ff9"
              onTouchStart={() => handleSearchNavigation()}
              placeholder="Search"
              placeholderTextColor="gray"
              style={{ flex: 1, color: 'white', marginLeft: 10, fontSize: 20 }}
            />
            <TouchableOpacity
              style={{ padding: 6 }}
              onPress={() => navigation.navigate('Speak')}>
              <GoogleMic width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 3, marginLeft: 12, marginRight: 20 }}
              onPress={() => navigation.navigate('Lens')}>
              <GoogleLens width={25} height={25} />
            </TouchableOpacity>
          </Animated.View>

          {/* Icon Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginHorizontal: 15,
            }}>
            {[
              { icon: 'image-search', color: '#4D4531', bg_color: '#EFD26D' },
              { icon: 'translate', color: '#363F4E', bg_color: '#7792C7' },
              { icon: 'school', color: '#33423A', bg_color: '#D2E6D8' },
              { icon: 'music-note', color: '#493034', bg_color: '#E2897F' },
            ].map((item, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Lens')}
                key={index}
                style={{
                  backgroundColor: item.color,
                  borderRadius: 50,
                  paddingHorizontal: 25,
                  paddingVertical: 15,
                }}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={item.bg_color}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={{ marginTop: 20, backgroundColor: '#404246' }} />

          {/* Weather & AQI Cards */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginHorizontal: 15,
            }}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: '#232323',
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                borderColor: '#404246',
                borderWidth: 1,
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>Gurugram</Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={{ color: 'white', fontSize: 20 }}>30° </Text>
                <Text style={{ color: 'white', fontSize: 20 }}>
                  {isDay ? '☀️' : '🌙'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                backgroundColor: '#232323',
                padding: 16,
                borderRadius: 12,
                flex: 1,
                marginLeft: 8,
                borderColor: '#404246',
                borderWidth: 1,
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                Air Quality: 170
              </Text>
              <Text style={{ color: 'yellow', fontSize: 20 }}>Moderate</Text>
            </TouchableOpacity>
          </View>

          {/* News Feed */}
          <View style={{ marginHorizontal: 15 }}>
            {loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : news.length > 0 ? (
              news.map((article, index) => (
                <TouchableOpacity
                  onPress={() => Linking.openURL(article?.url)}
                  key={index}
                  style={{
                    backgroundColor: '#1E1E1E',
                    marginTop: 20,
                    borderRadius: 15,
                    overflow: 'hidden',
                  }}>
                  {article?.urlToImage && (
                    <Image
                      source={{ uri: article.urlToImage }}
                      style={{ width: '100%', height: 200 }}
                    />
                  )}
                  <Text style={{ color: 'white', padding: 15 }}>
                    {article?.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                No news available
              </Text>
            )}
          </View>
        </ScrollView>

        <BottomSheet ref={sheetRef} snapPoints={['30%', '50%']}>
          {userInfo && (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Image
                source={{ uri: userInfo.photoURL }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {userInfo.displayName}
              </Text>
              <Text>{userInfo.email}</Text>
            </View>
          )}
        </BottomSheet>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default HomeScreen
