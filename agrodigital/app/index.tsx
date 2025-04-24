import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  Dimensions,
  Animated
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, Href } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const videoSource = require('../assets/video/background.mp4');

export default function WelcomeScreen() {
  const ref = useRef<VideoView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    // Fade in animation for content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      <View style={styles.gradientOverlay}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        />
      </View>
      <SafeAreaView style={styles.contentWrapper} edges={['right', 'left', 'bottom']}>
        <View style={styles.flexSpacer} />
        <Animated.View 
          style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <ThemedText style={styles.slogan} type="title">
              Sembramos Confianza
            </ThemedText>
            <ThemedText style={styles.sloganSecondary} type="title">
              ¡Cosechamos Progreso!
            </ThemedText>
            <View style={styles.taglineContainer}>
              <Text style={styles.tagline}>
                Buscamos Impulsar la Agricultura en México
              </Text>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleIniciarSesion}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#3E8E41']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleRegistrarse}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Crear una cuenta</Text>
          </TouchableOpacity>
        </Animated.View>
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
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  flexSpacer: {
    flex: 0.15,
  },
  contentContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 0,
  },
  logo: {
    width: width * 0.85,
    height: height * 0.22,
    marginBottom: height * 0.04,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  slogan: {
    color: '#ffffff',
    fontSize: Math.min(width * 0.08, 36),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
    marginBottom: height * 0.01,
  },
  sloganSecondary: {
    color: '#ffffff',
    fontSize: Math.min(width * 0.07, 34),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  taglineContainer: {
    marginTop: height * 0.03,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    maxWidth: width * 0.85,
  },
  tagline: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: height * 0.05,
  },
  primaryButton: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 