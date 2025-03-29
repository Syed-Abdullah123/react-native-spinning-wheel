export interface WheelSection {
    key: number | string;
    label: string;
    color: string;
    icon?: string;
    message?: string;
  }
  
  export interface SpinningWheelProps {
    // Wheel content
    sections: WheelSection[];
    
    // Wheel appearance
    size?: number;
    borderWidth?: number;
    borderColor?: string;
    centerCircleSize?: number;
    centerCircleColor?: string;
    pointerColor?: string;
    
    // Animation
    spinDuration?: number;
    numberOfSpins?: number;
    easing?: (value: number) => number;
    
    // Button
    spinButtonText?: string;
    spinButtonStyle?: object;
    spinButtonTextStyle?: object;
    
    // Modal
    showModal?: boolean;
    modalTitle?: string;
    modalButtonText?: string;
    modalButtonStyle?: object;
    modalButtonTextStyle?: object;
    modalOverlayStyle?: object;
    modalContentStyle?: object;
    
    // Callbacks
    onSpinStart?: () => void;
    onSpinEnd?: (prize: WheelSection) => void;
  }