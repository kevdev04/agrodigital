import React, { useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, Href } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const videoSource = require('../assets/video/background.mp4');

export default function WelcomeScreen() {
  const ref = useRef<VideoView>(null);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const handleRegistrarse = () => {
    player.pause();
    router.push('/screens/RegistroUsuarioScreen' as any);
  };

  const handleIniciarSesion = () => {
    player.pause();
    router.push('/screens/IniciarSesionScreen' as any);
  };

  React.useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => {
      if (!isPlaying) {
        player.play();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="cover"
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.slogan} type="title">
            Sembramos Confianza
          </ThemedText>
          <ThemedText style={styles.slogan} type="title">
            ¡Cosechamos Progreso!
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleIniciarSesion}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#006400' }]} onPress={handleRegistrarse}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: '80%',
    height: 200,
    marginBottom: 40,
  },
  slogan: {
    color: '#ffff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 