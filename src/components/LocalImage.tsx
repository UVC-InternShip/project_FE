import React from 'react';
import {Image, ImageSourcePropType} from 'react-native';

interface ImageProps {
  localAsset: ImageSourcePropType;
  width?: number;
  height?: number;
}

function LocalImage({localAsset, width, height}: ImageProps): JSX.Element {
  return <Image source={localAsset} style={{width, height}} />;
}

export default LocalImage;
