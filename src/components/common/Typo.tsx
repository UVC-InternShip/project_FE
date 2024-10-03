import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';

interface TextProps {
  children: React.ReactNode; // children prop 타입 정의
  style?: TextStyle; // 선택적 style prop 타입 정의
  color?: string;
  fontSize?: number;
}

function Typo({children, style, color, fontSize}: TextProps): JSX.Element {
  return <RNText style={[{color, fontSize}, style]}>{children}</RNText>;
}

export default Typo;
