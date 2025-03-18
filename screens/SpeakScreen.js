import { Feather, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition'

function SpeakScreen({ navigation }) {
  const animation = useRef(null)
  const [recognizing, setRecognizing] = useState(false)
  const [transcript, setTranscript] = useState('')
  useSpeechRecognitionEvent('start', () => {
    console.log('started'), setRecognizing(true)
  })
  useSpeechRecognitionEvent('result', event => {
    setTranscript(event.results[0]?.transcript)
  })
  useSpeechRecognitionEvent('end', () => {
    console.log('ended'),
      setRecognizing(false),
      navigation.replace('Search', { transcript })
  })
  useSpeechRecognitionEvent('error', event => {
    console.log('error code:', event.error, 'error message:', event.message)
  })

  const startSpeechRecognition = async () => {
    setRecognizing(false)
    setTranscript('')
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (!result.granted) {
      console.warn('Permissions not granted', result)
      return
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ['Carlsen', 'Nepomniachtchi', 'Praggnanandhaa'],
      androidIntentOptions: {
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 3000,
        EXTRA_MASK_OFFENSIVE_WORDS: false,
      },
    })
  }
  useEffect(() => {
    startSpeechRecognition()
    return () => ExpoSpeechRecognitionModule.stop()
  }, [])

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 30,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#434746',
            padding: 10,
            borderRadius: 30,
            alignSelf: 'flex-start',
          }}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#434746',
            padding: 10,
            borderRadius: 30,
            alignSelf: 'flex-start',
          }}
          onPress={() => navigation.navigate('Search')}>
          <Feather name="globe" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'white' }}>
          {recognizing ? 'Listening' : 'Speak Now'}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: 'lightblue',
            marginTop: 20,
            maxWidth: '60%',
          }}>
          {transcript}
        </Text>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#2f3133',
          }}
          source={require('../assets/lottie/googlespeak2.json')}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    //  alignItems: 'center',
    padding: 10,
    backgroundColor: '#2f3133',
  },
})
export default SpeakScreen
