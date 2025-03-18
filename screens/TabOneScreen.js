import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function TabOneScreen() {
  // ref
  const bottomSheetRef = useRef(null)

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index)
  }, [])

  // renders
  return (
    <BottomSheet ref={bottomSheetRef}>
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
})
