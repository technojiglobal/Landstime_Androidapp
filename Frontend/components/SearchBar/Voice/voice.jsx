//Voice.jsx (src/components/searchBar/Voice/voice.jsx)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useResponsive } from '../../../utils/responsive';

const VoiceScreen = () => {
  const router = useRouter();
  const { scaleWidth, scaleHeight } = useResponsive();
  const [status, setStatus] = useState('tryAgain'); // 'tryAgain', 'listening', 'didntHear'
  const [micColor, setMicColor] = useState('#9CA3AF'); // gray initially
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    // After 5 seconds, turn mic green and start listening
    const greenTimer = setTimeout(() => {
      setMicColor('#22C55E');
      setStatus('listening');
      startPulseAnimation();
    }, 5000);

    // After 35 seconds total (5s + 30s), show "Didn't hear that"
    const didntHearTimer = setTimeout(() => {
      setStatus('didntHear');
      stopPulseAnimation();
    }, 35000);

    return () => {
      clearTimeout(greenTimer);
      clearTimeout(didntHearTimer);
    };
  }, []);

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

  const renderContent = () => {
    switch (status) {
      case 'tryAgain':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: scaleWidth(20), fontWeight: 'bold', color: '#1F2937', marginBottom: scaleHeight(8) }}>
              Try Saying
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
              "Show me Plots in Vizag"
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(4) }}>
              "Flats under 50 lakhs in Madhurawada"
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center' }}>
              "Find houses for rent near me"
            </Text>
          </View>
        );

      case 'listening':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: scaleWidth(20), fontWeight: 'bold', color: '#1F2937', marginBottom: scaleHeight(8) }}>
              Listening...
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center', marginBottom: scaleHeight(8) }}>
              Try Saying
            </Text>
            <Text style={{ fontSize: scaleWidth(14), color: '#6B7280', textAlign: 'center' }}>
              "Show me Plots in Vizag"
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

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleWidth(16), paddingVertical: scaleHeight(12) }}>
        <TouchableOpacity onPress={() => router.back()}>
          <X color="black" size={scaleWidth(24)} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#22C55E', paddingHorizontal: scaleWidth(12), paddingVertical: scaleHeight(6), borderRadius: scaleWidth(20) }}>
          <Mic color="white" size={scaleWidth(16)} />
          <Text style={{ color: 'white', fontWeight: '600', marginLeft: scaleWidth(4) }}>Voice</Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: scaleWidth(32) }}>
        {renderContent()}

        {/* Microphone Button */}
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