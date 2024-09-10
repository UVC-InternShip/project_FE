import React from 'react';

import {Image} from 'react-native';

interface RemoteImageProps {
  imageUrl: string;
  width?: number;
  height?: number;
}

function RemoteImage({imageUrl, width, height}: RemoteImageProps): JSX.Element {
  return (
    <Image
      source={{uri: imageUrl}}
      style={{width: width, height: height}}
      resizeMode="cover"
    />
  );
}

export default RemoteImage;
