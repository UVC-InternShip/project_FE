// NOTE useGetProposalList
// DESC 상품 상세 페이지에서 해당 상품에 제안된 리스트를 불러오는 API
// CHECK endpoint : offer/contentsList
// CHECK query parameters : proposalContentId = 원글 게시글 아이디
// [ ] 실제 작동하는지 테스트 진행.

import axios from 'axios';
import {API_URL} from '../../../config';
import {useQuery} from '@tanstack/react-query';

const fetchProposalList = async (proposalContentId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/offer/contentsList?proposalContentId=${proposalContentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.result;
  } catch (error) {
    console.error('Error fetching proposal list:', error);
  }
};

export const useGetProposalList = (proposalContentId: number) => {
  return useQuery({
    queryKey: ['proposalList', proposalContentId],
    queryFn: () => fetchProposalList(proposalContentId),
    enabled: true,
  });
};