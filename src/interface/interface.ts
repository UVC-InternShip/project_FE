type TImage = {
  image: File;
};

export interface IFormData {
  title: string;
  description: string;
  contentsType: string;
  purpose: string;
  images: TImage[];
}

export interface IProduct {
  id: number;
  images: TImage[];
  title: string;
  description: string;
  content_type: string;
  purpose: string;
  status: string;
  created_at: string;
}
