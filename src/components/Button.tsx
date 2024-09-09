import React from 'react';
import {Pressable, View} from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  hitSlop?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: View['props']['style'];
  disabled?: boolean;
}

function CustomButton({
  onPress,
  children,
  hitSlop = {left: 0, right: 0, top: 0, bottom: 0}, // 기본값 설정
  paddingHorizontal,
  paddingVertical,
  style,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[
        {
          paddingHorizontal,
          paddingVertical,
        },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

export default CustomButton;
