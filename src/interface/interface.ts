export type TImage = {
  image: File;
  uri?: string;
  originalPath?: string;
  filename?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

export interface IFormData {
  userId?: number;
  title: string;
  description: string;
  contentsType: string;
  purpose: string;
  images: TImage[];
}

export interface IFormData2 extends IFormData {
  proposalUserId: number;
  offererUserId: number;
  proposerContentId: number;
}

export interface IProduct {
  id: number;
  userId: number;
  images: TImage[];
  title: string;
  description: string;
  content_type: string;
  purpose: string;
  status: string;
  created_at: string;
}

export interface IUser {
  userId: number;
  phoneNumber: string;
  eamil: string;
  name: string;
  reputationScore: number;
  role: string;
}
