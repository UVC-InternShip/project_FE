import React from 'react';
import {StyleSheet, View} from 'react-native';
import RemoteImage from './RemoteImage';
import Typo from './Typo';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  content_type: string;
  purpose: string;
  status: string;
  created_at: string;
}
function ProductCard({
  imageUrl,
  title,
  description,
  content_type,
  purpose,
  status,
  created_at,
}: ProductCardProps): JSX.Element {
  return (
    <View style={styles.container}>
      {/* Product Card UI */}
      {/* Add product data here */}
      <RemoteImage imageUrl={imageUrl} width={100} height={100} />
      <View style={styles.productDescContainer}>
        <Typo color="black" fontSize={24}>
          {title}
        </Typo>
        <Typo color="black" fontSize={16}>
          {description}
        </Typo>
        <Typo color="black" fontSize={14}>
          {content_type} - {purpose} - {status}
        </Typo>
        <Typo color="gray" fontSize={12}>
          {created_at}
        </Typo>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
  },
  productDescContainer: {
    flexDirection: 'column',
    padding: 16,
    gap: 8,
  },
});

export default ProductCard;
