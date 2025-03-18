import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  Linking,
} from 'react-native'
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera'
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'

const GoogleLensScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back')
  const cameraRef = useRef(null)
  const { hasPermission, requestPermission } = useCameraPermission()
  const [state, setstate] = useState({
    torch: 'off',
    photoUri: null,
    progress: 0,
  })

  // Get the device camera (back or front)
  const device = useCameraDevice(facing)

  // Animated search button effect
  const scale = useSharedValue(0.8)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) }),
      },
    ],
  }))

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [])

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    )
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No camera found</Text>
      </View>
    )
  }
  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({ quality: 100 })
      const imagePath = 'file://' + photo.path
      openCropper(imagePath)
    }
  }
  function toggleFlash() {
    setstate(prevs => ({
      ...prevs,
      torch: prevs.torch == 'off' ? 'on' : 'off',
    }))
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  const uploadImageToFirebase = async uri => {
    console.log('Uploading image...')

    try {
      const filename = `images/${Date.now()}.jpg`
      const reference = storage().ref(filename)

      const task = reference.putFile(uri)

      task.on('state_changed', snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        setstate(prevs => ({ ...prevs, progress: progress }))
      })

      await task
      const url = await reference.getDownloadURL()
      navigation.replace('Result', { url })
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const searchImageOnGoogle = async imageUri => {
    try {
      const googleLensURL = `https://lens.google.com/uploadbyurl?url=${imageUri}`
      console.log('logging lens url', googleLensURL)
      await Linking.openURL(googleLensURL)
    } catch (error) {
      console.error('Error opening Google Lens:', error)
    }
  }

  const openCropper = imagePath => {
    ImagePicker.openCropper({
      path: imagePath,
      width: 900,
      height: 900,
      cropping: true,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
    })
      .then(croppedImage => {
        setstate(prevs => ({ ...prevs, photoUri: croppedImage.path }))
        uploadImageToFirebase(croppedImage.path)
      })
      .catch(error => console.log('Crop error:', error))
  }

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      {!state.photoUri ? (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          device={device}
          isActive={true}
          torch={state.torch}
          photo={true}
        />
      ) : (
        <Image source={{ uri: state.photoUri }} style={{ flex: 1 }} />
      )}

      {/* Flip Camera Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>
      {facing == 'back' && (
        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => toggleFlash()}>
          <MaterialIcons
            name={state.torch == 'off' ? 'flash-off' : 'flash-on'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>
      {state.progress > 0 && (
        <View style={styles.progresstext}>
          <Text style={{ color: 'white' }}>
            {`Showing\nProgress:` + state.progress}
          </Text>
        </View>
      )}

      {/* Overlay Scan Area */}
      {/* <View style={styles.scanOverlay}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View> */}

      {/* Floating Search Button */}
      <Animated.View style={[styles.searchButton, buttonStyle]}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => capturePhoto()}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="language-outline" size={20} color="white" />
          <Text style={styles.optionText}>Translate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, styles.active]}>
          <FontAwesome name="search" size={16} color="white" />
          <Text style={styles.optionText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="school-outline" size={20} color="white" />
          <Text style={styles.optionText}>Homework</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  // Flip Camera Button
  flipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderRadius: 50,
  },
  flashButton: {
    position: 'absolute',
    top: 50,
    left: 100,
    borderRadius: 50,
  },
  progresstext: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    borderRadius: 50,
  },

  // Scan Overlay
  scanOverlay: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '25%',
    borderColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },

  // Floating Search Button
  searchButton: { position: 'absolute', bottom: '18%', alignSelf: 'center' },
  buttonInner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 50,
    elevation: 5,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  active: { backgroundColor: '#2C3E50' },
  optionText: { color: 'white', marginLeft: 5 },
})

export default GoogleLensScreen
