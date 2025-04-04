import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Easing,
} from 'react-native';
import {
  Svg,
  Circle,
  G,
  Path,
  Text as SvgText,
  Polygon,
} from 'react-native-svg';
import { Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export interface WheelSection {
  key: number;
  label: string;
  color: string;
  icon: string;
  message: string;
}

export interface SpinningWheelProps {
  sections: WheelSection[];
  size?: number;
  spinDuration?: number;
  spinButtonColor?: string;
  spinButtonTextColor?: string;
  pointerColor?: string;
  onSpinEnd?: (section: WheelSection) => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({
  sections,
  size = 300,
  spinDuration = 5000,
  spinButtonColor = '#333',
  spinButtonTextColor = '#FFFFFF',
  pointerColor = '#333333',
  onSpinEnd,
}) => {
  const [rotation] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<WheelSection | null>(null);

  const spinWheel = () => {
    rotation.setValue(0);

    const randomIndex = Math.floor(Math.random() * sections.length);
    const degrees = 360 * 10 + randomIndex * (360 / sections.length);

    Animated.timing(rotation, {
      toValue: degrees,
      duration: spinDuration,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      const selectedSection = sections[randomIndex];
      if (selectedSection) {
        setSelectedPrize(selectedSection);
        setModalVisible(true);
        onSpinEnd?.(selectedSection);
      }
    });
  };

  const getWheelPath = (index: number, total: number) => {
    const startAngle = (index * 360) / total;
    const endAngle = ((index + 1) * 360) / total;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 50 * Math.cos(startRad);
    const y1 = 50 + 50 * Math.sin(startRad);
    const x2 = 50 + 50 * Math.cos(endRad);
    const y2 = 50 + 50 * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.pointerContainer}>
        <Svg width={18} height={24} viewBox="0 0 24 36">
          <Polygon
            points="12,10 24,36 0,36"
            fill={pointerColor}
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.wheelContainer,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <G>
            {sections.map((item, index) => (
              <G key={item.key}>
                <Path
                  d={getWheelPath(index, sections.length)}
                  fill={item.color}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
                <SvgText
                  x={
                    50 +
                    35 *
                      Math.cos(((index + 0.5) * 2 * Math.PI) / sections.length)
                  }
                  y={
                    50 +
                    35 *
                      Math.sin(((index + 0.5) * 2 * Math.PI) / sections.length)
                  }
                  fontSize="4"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  transform={`rotate(${((index + 0.5) * 360) / sections.length}, ${50 + 35 * Math.cos(((index + 0.5) * 2 * Math.PI) / sections.length)}, ${50 + 35 * Math.sin(((index + 0.5) * 2 * Math.PI) / sections.length)})`}
                >
                  {item.label}
                </SvgText>
              </G>
            ))}
          </G>
          <Circle cx={50} cy={50} r={5} fill={pointerColor} />
          <Circle cx={50} cy={50} r={3} fill="#FFFFFF" />
        </Svg>
      </Animated.View>

      <TouchableOpacity
        onPress={spinWheel}
        style={[styles.spinButton, { backgroundColor: spinButtonColor }]}
      >
        <Text style={[styles.spinButtonText, { color: spinButtonTextColor }]}>
          SPIN
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AntDesign
              name={selectedPrize?.icon as any}
              size={60}
              color={selectedPrize?.color}
            />
            <Text style={[styles.modalTitle, { color: selectedPrize?.color }]}>
              {selectedPrize?.label}
            </Text>
            <Text style={styles.modalMessage}>{selectedPrize?.message}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.modalButton,
                { backgroundColor: selectedPrize?.color },
              ]}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  pointerContainer: {
    position: 'absolute',
    zIndex: 1,
    top: '38.2%',
    alignItems: 'center',
  },
  wheelContainer: {
    position: 'relative',
  },
  spinButton: {
    marginTop: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  spinButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 15,
  },
  modalMessage: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  modalButton: {
    width: '80%',
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});

export default SpinningWheel;
