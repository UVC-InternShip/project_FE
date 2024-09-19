import React from 'react';

import {Image, ImageProps} from 'react-native';

// interface RemoteImageProps {
//   imageUrl: string;
//   width?: number;
//   height?: number;
//   // style을 설정할 수 있도록.
//   style: 
// }

interface RemoteImageProps extends ImageProps {
  imageUrl: string;
}

function RemoteImage({imageUrl, style}: RemoteImageProps): JSX.Element {
  return (
    <Image
      source={{uri: imageUrl}}
      style={style}
      resizeMode="cover"
    />
  );
}

export default RemoteImage;
