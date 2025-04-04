import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SpinningWheel, { WheelSection } from 'react-native-spinning-wheel';

const sections: WheelSection[] = [
  {
    key: 1,
    label: 'Try Again',
    color: '#FF6B6B',
    icon: 'closecircleo',
    message: 'Better luck next time! Keep spinning for a chance to win.',
  },
  {
    key: 2,
    label: '$5 Coupon',
    color: '#4ECDC4',
    icon: 'gift',
    message: 'Congratulations! A $5 coupon is heading your way!',
  },
  {
    key: 3,
    label: 'Try Again',
    color: '#FF6B6B',
    icon: 'closecircleo',
    message: 'Not a winner this time. Give it another spin!',
  },
  {
    key: 4,
    label: '$10 Coupon',
    color: '#FFD166',
    icon: 'gift',
    message: "Congratulations! You've won a $10 coupon. Enjoy your reward!",
  },
  {
    key: 5,
    label: 'Try Again',
    color: '#FF6B6B',
    icon: 'closecircleo',
    message: 'Almost! Try your luck again.',
  },
  {
    key: 6,
    label: 'Free Meal',
    color: '#1A535C',
    icon: 'staro',
    message: "Congratulations! You've won a free meal. Time to feast!",
  },
];

export default function App() {
  const handleSpinEnd = (section: WheelSection) => {
    console.log('Spun and landed on:', section.label);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SpinningWheel
        sections={sections}
        size={300}
        spinDuration={5000}
        spinButtonColor="#333"
        spinButtonTextColor="#FFFFFF"
        pointerColor="#333333"
        onSpinEnd={handleSpinEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
