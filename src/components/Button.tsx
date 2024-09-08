import React from 'react';
import {Pressable} from 'react-native';

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
}

function CustomButton({
  onPress,
  children,
  hitSlop = {left: 0, right: 0, top: 0, bottom: 0}, // 기본값 설정
  paddingHorizontal,
  paddingVertical,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      style={{
        paddingHorizontal,
        paddingVertical,
      }}>
      {children}
    </Pressable>
  );
}

export default CustomButton;
