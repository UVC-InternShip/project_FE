import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RemoteImage from './RemoteImage';
import Typo from './Typo';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  contentType?: string;
  purpose?: string;
  status?: string;
  created_at?: string;
  onPress?: () => void;
}
function ProductCard({
  imageUrl,
  title,
  contentType,
  purpose,
  status,
  created_at,
  onPress,
}: ProductCardProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <RemoteImage imageUrl={imageUrl} style={styles.productImageContainer} />
      <View style={styles.productDescContainer}>
        <Typo color="black" fontSize={24}>
          {title}
        </Typo>
        {/* <Typo color="black" fontSize={16}>
          {description}
        </Typo> */}
        <Typo color="black" fontSize={14}>
          {contentType} - {purpose} - {status}
        </Typo>
        <Typo color="gray" fontSize={12}>
          {created_at}
        </Typo>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  productDescContainer: {
    flexDirection: 'column',
    padding: 16,
    gap: 8,
  },
  productImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default ProductCard;
