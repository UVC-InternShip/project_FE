import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

const fetchProductList = async () => {
  const response = await axios.get('상품목록 API URL', {
    headers: {
      Authorization: 'Bearer token',
    },
  });
  return response.data;
};

export const useProductList = () => {
  return useQuery({
    queryKey: ['productList'],
    queryFn: fetchProductList,
    enabled: true,
  });
};
