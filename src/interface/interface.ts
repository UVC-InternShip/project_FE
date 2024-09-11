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
