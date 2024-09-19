import React from 'react';
import { FlatList, FlatListProps, ImageStyle, StyleProp, ViewStyle } from 'react-native';

interface IS3Image {
  imageUrl: string;
}

interface CustomFlatListProps extends FlatListProps<IS3Image> {
    style?: StyleProp<ViewStyle>
}

const CustomFlatList: React.FC<CustomFlatListProps> = (props) => {
    const { style, ...otherProps } = props;
    const imageStyle: StyleProp<ImageStyle> = style as StyleProp<ImageStyle>;


  return <FlatList style={imageStyle} {...otherProps} />;
};

export default CustomFlatList;