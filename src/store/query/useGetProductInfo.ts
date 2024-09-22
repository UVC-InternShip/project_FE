import axios from 'axios';
import {API_URL} from '../../../config';
import {useQuery} from '@tanstack/react-query';

const getProductInfo = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/contents/listContents?contentsId=${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
};

export const useProductInfo = (id: number) => {
  return useQuery({
    queryKey: ['productInfo', id],
    queryFn: () => getProductInfo(id),
    enabled: true,
  });
};
