export type CustomProductType = {
  _id: string;
  userId: string;

  name: string;

  frontImage: string;
  backImage: string;

  frontDesign: string | null;
  backDesign: string | null;

  frontUpload?: string | null;
  backUpload?: string | null;

  color?: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  description: string;
  price: number;
  countInStock: number;

  offers: string;
  returnPolicy: string;

  createdAt: string;
  updatedAt: string;
};