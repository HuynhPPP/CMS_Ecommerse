export interface Variants {
  id?: number;
  size: string;
  price: number;
  quantity: number;
}

export interface Colors {
  colorName: string;
  colorCode: string;
  images: {
    imageUrl: string;
    order: number;
  }[];
  variants: Variants[];
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  colors: Colors[];
}
