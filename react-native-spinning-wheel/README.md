# React Native Spinning Wheel

A customizable spinning wheel component for React Native applications. This library provides an interactive prize wheel that can be fully customized with different sections, colors, and animations.

## Features

- 🎡 Fully customizable wheel sections with different colors and labels
- 🎯 Smooth spinning animation with configurable duration
- 🎨 Customizable colors for wheel sections, spin button, and pointer
- 📱 Built-in results modal with customizable messages
- 💪 Written in TypeScript for better type safety
- ⚡ Built with React Native's Animated API for smooth performance

## Installation

```bash
npm install react-native-spinning-wheel
# or
yarn add react-native-spinning-wheel
```

## Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "*",
  "react-native": "*",
  "react-native-svg": "*",
  "@expo/vector-icons": "*"
}
```

## Usage

```typescript
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SpinningWheel, { WheelSection } from 'react-native-spinning-wheel';

const sections: WheelSection[] = [
  {
    key: 1,
    label: "Try Again",
    color: "#FF6B6B",
    icon: "closecircleo",
    message: "Better luck next time!"
  },
  // Add more sections as needed
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
```

## Props

| Prop                | Type                            | Default   | Description                                |
| ------------------- | ------------------------------- | --------- | ------------------------------------------ |
| sections            | WheelSection[]                  | Required  | Array of wheel sections                    |
| size                | number                          | 300       | Size of the wheel in pixels                |
| spinDuration        | number                          | 5000      | Duration of spin animation in milliseconds |
| spinButtonColor     | string                          | "#333"    | Color of the spin button                   |
| spinButtonTextColor | string                          | "#FFFFFF" | Color of the spin button text              |
| pointerColor        | string                          | "#333333" | Color of the wheel pointer                 |
| onSpinEnd           | (section: WheelSection) => void | undefined | Callback function when spin ends           |

## WheelSection Interface

```typescript
interface WheelSection {
  key: number;
  label: string;
  color: string;
  icon: string;
  message: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
