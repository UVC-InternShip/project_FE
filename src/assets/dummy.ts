// interface ProductCardProps {
//     imageUrl: string;
//     title: string;
//     description: string;
//     content_type: string;
//     purpose: string; '물물교환' | '나눔'
//     status: '대기중';
//     created_at: string;
//   }
export const dummyData = [
  {
    id: 1,
    userId: 1,
    images: [require('../assets/bed.jpg')],
    title: 'Product 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content_type: 'book',
    purpose: '물물교환',
    status: '대기중',
    created_at: '2021-01-01',
  },
  {
    id: 2,
    userId: 2,
    images: [
      require('../assets/bed.jpg'),
      require('../assets/macbook.jpg'),
      require('../assets/monitor.jpg'),
    ],
    title: 'Product 2',
    description: 'Vestibulum id ligula porta felis euismod semper.',
    content_type: 'electronics',
    purpose: '나눔',
    status: '대기중',
    created_at: '2021-02-01',
  },
  {
    id: 3,
    userId: 2,
    images: [
      require('../assets/bed.jpg'),
      require('../assets/macbook.jpg'),
      require('../assets/monitor.jpg'),
    ],
    title: 'Product 3',
    description:
      'Donec sed odio dui. Nullam id dolor id nibh ultricies vehicula.',
    content_type: 'clothing',
    purpose: '나눔',
    status: '대기중',
    created_at: '2021-03-01',
  },
  {
    id: 4,
    userId: 2,
    images: [
      require('../assets/bed.jpg'),
      require('../assets/macbook.jpg'),
      require('../assets/monitor.jpg'),
    ],
    title: 'Product 4',
    description:
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
    content_type: 'book',
    purpose: '물물교환',
    status: '대기중',
    created_at: '2021-04-01',
  },
  {
    id: 5,
    userId: 2,
    images: [
      require('../assets/bed.jpg'),
      require('../assets/macbook.jpg'),
      require('../assets/monitor.jpg'),
    ],
    title: 'Product 5',
    description: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
    content_type: 'electronics',
    purpose: '물물교환',
    status: '대기중',
    created_at: '2021-05-01',
  },
];
