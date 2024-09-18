import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {API_URL} from '../../../config';

const fetchProductList = async () => {
  try {
    const response = await axios.get(`${API_URL}/contents/listAll`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const useProductList = () => {
  return useQuery({
    queryKey: ['productList'],
    queryFn: fetchProductList,
    enabled: true,
  });
};
