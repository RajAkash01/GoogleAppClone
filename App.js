import React, { useEffect, useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import AppNavigator from './navigation'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

const SplashScreenComponent = ({ onAnimationFinish }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LottieView
        source={require('./assets/lottie/googlelogo.json')}
        autoPlay
        loop={false}
        style={{
          width: 200,
          height: 200,
        }}
        duration={2500}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  )
}
export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true)

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync()
      setSplashVisible(false)
    }

    setTimeout(hideSplash, 2500)
  }, [])

  return isSplashVisible ? (
    <SplashScreenComponent onAnimationFinish={() => setSplashVisible(false)} />
  ) : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2125',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
