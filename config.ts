import { Platform } from 'react-native';

const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = __DEV__ 
  ? `http://${localhost}:3000/api` 
  : 'https://your-production-api-url.com/api';