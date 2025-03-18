import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import SpeakScreen from './screens/SpeakScreen'
import GoogleLensScreen from './screens/GoogleLensScreen'
import { StatusBar } from 'expo-status-bar'
import ResultScreen from './screens/ResultScreen'

const Stack = createStackNavigator()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Speak" component={SpeakScreen} />
        <Stack.Screen name="Lens" component={GoogleLensScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
