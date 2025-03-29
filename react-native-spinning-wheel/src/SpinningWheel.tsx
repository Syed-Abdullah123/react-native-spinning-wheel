import { useState, useRef } from 'react';
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
import type { WheelSection, SpinningWheelProps } from './types';

const defaultProps: Partial<SpinningWheelProps> = {
  size: 300,
  borderWidth: 1,
  borderColor: '#FFFFFF',
  centerCircleSize: 5,
  centerCircleColor: '#333333',
  pointerColor: '#333333',
  spinDuration: 5000,
  numberOfSpins: 10,
  easing: Easing.out(Easing.cubic),
  spinButtonText: 'SPIN',
  showModal: true,
  modalButtonText: 'OK',
};

const SpinningWheel = (props: SpinningWheelProps) => {
  const {
    sections,
    size,
    borderWidth,
    borderColor,
    centerCircleSize,
    centerCircleColor,
    pointerColor,
    spinDuration,
    numberOfSpins,
    easing,
    spinButtonText,
    spinButtonStyle,
    spinButtonTextStyle,
    showModal,
    modalTitle,
    modalButtonText,
    modalButtonStyle,
    modalButtonTextStyle,
    modalOverlayStyle,
    modalContentStyle,
    onSpinStart,
    onSpinEnd,
  } = { ...defaultProps, ...props };

  const rotation = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<WheelSection | null>(null);

  const spinWheel = () => {
    // Reset rotation to 0 before spinning
    rotation.setValue(0);

    const randomIndex = Math.floor(Math.random() * sections.length);
    // Calculate degrees to spin based on numberOfSpins and random section
    const degrees =
      360 * (numberOfSpins || 10) + randomIndex * (360 / sections.length);

    // Call onSpinStart callback if provided
    if (onSpinStart) {
      onSpinStart();
    }

    Animated.timing(rotation, {
      toValue: degrees,
      duration: spinDuration,
      useNativeDriver: true,
      easing: easing,
    }).start(() => {
      const prize = sections[randomIndex];
      setSelectedPrize(prize);

      if (showModal) {
        setModalVisible(true);
      }

      // Call onSpinEnd callback if provided
      if (onSpinEnd) {
        onSpinEnd(prize);
      }
    });
  };

  const getWheelPath = (index: number, total: number) => {
    const startAngle = (index * 360) / total;
    const endAngle = ((index + 1) * 360) / total;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const radius = 50; // SVG viewBox is 100x100, so radius is 50
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M50,50 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <View style={styles.container}>
      {/* Pointer/Needle */}
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
                  stroke={borderColor}
                  strokeWidth={borderWidth}
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
          <Circle
            cx={50}
            cy={50}
            r={centerCircleSize}
            fill={centerCircleColor}
          />
          <Circle cx={50} cy={50} r={centerCircleSize - 2} fill="#FFFFFF" />
        </Svg>
      </Animated.View>

      <TouchableOpacity
        onPress={spinWheel}
        style={[styles.spinButton, spinButtonStyle]}
      >
        <Text style={[styles.spinButtonText, spinButtonTextStyle]}>
          {spinButtonText}
        </Text>
      </TouchableOpacity>

      {showModal && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={[styles.modalOverlay, modalOverlayStyle]}>
            <View style={[styles.modalContent, modalContentStyle]}>
              {selectedPrize?.icon && (
                <View style={styles.iconContainer}>
                  {/* You might want to make this more flexible for custom icons */}
                  <Text style={[styles.icon, { color: selectedPrize.color }]}>
                    {selectedPrize.icon}
                  </Text>
                </View>
              )}
              <Text
                style={[styles.modalTitle, { color: selectedPrize?.color }]}
              >
                {modalTitle || selectedPrize?.label}
              </Text>
              {selectedPrize?.message && (
                <Text style={styles.modalMessage}>{selectedPrize.message}</Text>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.modalButton,
                  { backgroundColor: selectedPrize?.color },
                  modalButtonStyle,
                ]}
              >
                <Text style={[styles.modalButtonText, modalButtonTextStyle]}>
                  {modalButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
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
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    fontSize: 60,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
