import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {API_URL} from '../../../config';

const fetchProducts = async ({pageParam = 1}) => {
  try {
    const response = await axios.get(`${API_URL}/contents/listAllScroll`, {
      params: {
        page: pageParam,
        limit: 10, // 한 페이지에 보여줄 데이터 수
        // ... 기타 필요한 파라미터
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const useProductList = () => {
  return useInfiniteQuery({
    queryKey: ['productList'],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });
};
