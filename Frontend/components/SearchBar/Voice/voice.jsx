// components/SearchBar/Voice/voice.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Mic } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useResponsive } from '../../../utils/responsive';

const VoiceScreen = () => {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsive();
  
  // ✅ Get parameters from calling screen
  const { returnScreen, districtKey, searchType } = useLocalSearchParams();
  
  const [status, setStatus] = useState('tryAgain');
  const [micColor, setMicColor] = useState('#9CA3AF');
  const [recognizedText, setRecognizedText] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => {
          setStatus('listening');
          setMicColor('#22C55E');
          startPulseAnimation();
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setRecognizedText(transcript);
          setStatus('processing');
          stopPulseAnimation();
          
          setTimeout(() => {
            // ✅ Smart routing - go back to calling screen
            const params = { voiceText: transcript.toLowerCase() };
            
            // ✅ Pass districtKey if it exists (for SelectSite screen)
            if (districtKey) {
              params.districtKey = districtKey;
            }
            
            router.push({
              pathname: returnScreen || '/home/screens/Flats/SelectSite',
              params: params
            });
          }, 1000);
        };

        recognitionRef.current.onend = () => {
          if (status === 'listening' && !recognizedText) {
            setStatus('didntHear');
            setMicColor('#9CA3AF');
            stopPulseAnimation();
          }
        };

        recognitionRef.current.onerror = (event) => {
          setStatus('didntHear');
          setMicColor('#9CA3AF');
          stopPulseAnimation();
        };

        const startTimer = setTimeout(() => {
          startListening();
        }, 2000);

        return () => {
          clearTimeout(startTimer);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        };
      }
    }
  }, [returnScreen, districtKey]);

  const startListening = () => {
    if (recognitionRef.current && Platform.OS === 'web') {
      try {
        setRecognizedText('');
        recognitionRef.current.start();
      } catch (error) {
        setStatus('didntHear');
      }
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  };

  const handleMicPress = () => {
    if (status === 'didntHear' || status === 'tryAgain') {
      setStatus('tryAgain');
      setMicColor('#9CA3AF');
      startListening();
    }
  };

  // ✅ Dynamic examples based on search type
  const renderExamples = () => {
    if (searchType === 'district') {
      return (
        <>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
            "Visakhapatnam district"
          </Text>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
            "Properties in Guntur"
          </Text>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center' }}>
            "Krishna district"
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
            "Akkayapalem properties"
          </Text>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
            "Gajuwaka area"
          </Text>
          <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center' }}>
            "Find houses in Kommadi"
          </Text>
        </>
      );
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'tryAgain':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: scaleWidth(20), fontWeight: 'bold', color: '#1F2937', marginBottom: scaleHeight(8) }}>
              Try Saying
            </Text>
            {renderExamples()}
          </View>
        );

      case 'listening':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: scaleWidth(20), fontWeight: 'bold', color: '#1F2937', marginBottom: scaleHeight(8) }}>
              Listening...
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center' }}>
              Speak now...
            </Text>
          </View>
        );

      case 'processing':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: scaleWidth(20), fontWeight: 'bold', color: '#22C55E', marginBottom: scaleHeight(8) }}>
              Got it!
            </Text>
            <Text style={{ fontSize: scaleWidth(16), color: '#1F2937', textAlign: 'center', fontWeight: '600' }}>
              "{recognizedText}"
            </Text>
          </View>
        );

      case 'didntHear':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 }}>
              Didn't hear that. Try again
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleWidth(16), paddingVertical: scaleHeight(12) }}>
        <TouchableOpacity onPress={() => router.back()}>
          <X color="black" size={scaleWidth(24)} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#22C55E', paddingHorizontal: scaleWidth(12), paddingVertical: scaleHeight(6), borderRadius: scaleWidth(20) }}>
          <Mic color="white" size={scaleWidth(16)} />
          <Text style={{ color: 'white', fontWeight: '600', marginLeft: scaleWidth(4) }}>Voice</Text>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: scaleWidth(32) }}>
        {renderContent()}

        <Animated.View style={{ marginTop: scaleHeight(60), transform: [{ scale: status === 'listening' ? scaleAnim : 1 }] }}>
          <TouchableOpacity
            style={{
              width: scaleWidth(100),
              height: scaleHeight(100),
              borderRadius: scaleWidth(50),
              backgroundColor: micColor,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: micColor,
              shadowOffset: { width: 0, height: scaleHeight(4) },
              shadowOpacity: 0.3,
              shadowRadius: scaleWidth(8),
              elevation: 8,
            }}
            activeOpacity={0.8}
            onPress={handleMicPress}
          >
            <Mic color="white" size={scaleWidth(40)} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={{ marginTop: scaleHeight(20), fontSize: scaleWidth(14), color: '#9CA3AF' }}>
          Tap microphone to try again
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default VoiceScreen;