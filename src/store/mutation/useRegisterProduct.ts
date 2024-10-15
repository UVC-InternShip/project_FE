import axios from 'axios';
import {API_URL} from '../../../config';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {NavigationProp} from '@react-navigation/native';

const registerProduct = async (product: FormData) => {
  const response = await axios.post(`${API_URL}/contents/register`, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const offerProduct = async (product: FormData) => {
  const response = await axios.post(`${API_URL}/offer/register`, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useRegisterProduct = (navigation: NavigationProp<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productList']});
      navigation.navigate('Home');
    },
  });
};

export const useOfferProduct = (navigation: NavigationProp<any>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: offerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productList']});
      navigation.navigate('Home');
    },
  });
};
