import React from 'react'
import { PaperProvider } from 'react-native-paper'
import AppNavigator from './navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
