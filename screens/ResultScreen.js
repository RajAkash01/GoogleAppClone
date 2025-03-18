import { StatusBar } from 'expo-status-bar'
import React, { useState, useRef } from 'react'
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native'
// import storage from '@react-native-firebase/storage';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import WebView from 'react-native-webview'
import { MasonryFlashList } from '@shopify/flash-list'
import { Avatar, Divider } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather'

const ResultScreen = ({ route }) => {
  const uploaded_url = route?.params?.url || null
  const { height, width } = useWindowDimensions()
  const [imageUri, setImageUri] = useState(null)
  const [firebaseUrl, setFirebaseUrl] = useState(uploaded_url)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const webViewRef = useRef(null)

  const googleLensURL = url =>
    `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`

  const injectJS = `
  setTimeout(() => {
    let results = [];
    let elements = document.querySelectorAll('div[aria-label]'); 

    elements.forEach(div => {
      let description = div.getAttribute('aria-label') || 'No Description Available';
      
      let imageDiv = div.querySelector('div div img');
      let img = imageDiv ? imageDiv.src : null;

      if (img) { 
        results.push({
          description: description.trim(),
          img: img
        });
      }
    });

    window.ReactNativeWebView.postMessage(JSON.stringify(results));
  }, 5000);
`

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#1f1f1f' }}>
      {/* <Button title="Pick Image from Gallery" onPress={pickImage} />
      <Button title="Capture Image with Camera" onPress={captureImage} />
      
      {loading && <ActivityIndicator size="large" color="blue" />}
      
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      {firebaseUrl && <Text>Firebase URL: {firebaseUrl}</Text>} */}

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#2f3133',
          marginTop: 30,
          paddingVertical: 10,
          paddingHorizontal: 13,
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: 'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw',
            }}
            style={{ width: 24, height: 24, marginRight: 13 }}
          />
          <Image
            source={{ uri: firebaseUrl }}
            style={{ width: 45, height: 45, borderRadius: 8 }}
          />
          <Text style={{ color: 'white', fontSize: 13, marginLeft: 10 }}>
            Add to search
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 1,
              height: '100%',
              backgroundColor: 'white',
              borderRadius: 8,
              marginRight: 10,
            }}
          />
          <Avatar.Text size={30} label="A" />
        </View>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            marginLeft: 10,
            borderBottomWidth: 3,
            borderBottomColor: 'white',
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
            alignSelf: 'flex-start',
            marginTop: 20,
          }}>
          All
        </Text>
      </TouchableOpacity>
      <Divider
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 0.2,
          marginTop: 10,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Feather name="info" size={17} color="white" />
        <Text style={{ color: 'white', fontSize: 13, marginLeft: 5 }}>
          Results for people are limited
        </Text>
      </View>
      <Divider
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 0.3,
          marginTop: 13,
          marginBottom: 5,
        }}
      />

      {/* Display Extracted Search Results */}
      {searchResults?.length == 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 190,
          }}>
          <ActivityIndicator size={'large'} color={'#456ff9'} />
        </View>
      ) : (
        <View style={{ height: height, width: width }}>
          <MasonryFlashList
            data={searchResults}
            contentContainerStyle={{ paddingBottom: 140 }}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View key={index} style={{ width: '100%', padding: 5 }}>
                {item?.img ? (
                  <Image
                    source={{ uri: item?.img }}
                    style={{
                      width: 150,
                      height: Math.random() > 0.5 ? 150 : 250,
                      borderRadius: 12,
                    }}
                  />
                ) : null}
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    marginTop: 8,
                    maxWidth: '90%',
                  }}>
                  {item?.description}
                </Text>
              </View>
            )}
            estimatedItemSize={50}
          />
        </View>
      )}

      {firebaseUrl != null && (
        <WebView
          ref={webViewRef}
          source={{ uri: googleLensURL(firebaseUrl) }}
          injectedJavaScript={injectJS}
          onMessage={event => {
            try {
              const data = JSON.parse(event.nativeEvent.data)
              setSearchResults(data)
            } catch (error) {
              console.error('Error parsing results:', error)
            }
          }}
          style={{ width: 0, height: 0, position: 'absolute', opacity: 0 }}
        />
      )}
    </View>
  )
}

export default ResultScreen
