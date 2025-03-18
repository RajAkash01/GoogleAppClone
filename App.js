import React from 'react';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './navigation';


export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
