import axios from 'axios';
import {API_URL} from '../../../config';
import {IFormData, IFormData2} from '../../interface/interface';
import {useMutation, useQueryClient} from '@tanstack/react-query';

const registerProduct = async (product: IFormData) => {
  const response = await axios.post(`${API_URL}/contents/register`, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const offerProduct = async (product: IFormData2) => {
  const response = await axios.post(`${API_URL}/offer/register`, product, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useRegisterProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productList']});
    },
  });
};

export const useOfferProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: offerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productList']});
    },
  });
};
