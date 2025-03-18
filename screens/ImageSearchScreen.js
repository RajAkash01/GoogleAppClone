import React, { useState } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'

const ImageSearchScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    if (!result.canceled) setSelectedImage(result.assets[0].uri)
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={pickImage}>
        Pick Image
      </Button>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200, marginTop: 10 },
})

export default ImageSearchScreen
