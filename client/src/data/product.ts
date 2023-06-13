export interface product {
  id: number;
  productId: number;
  price: number;
  isRecommend: boolean;
  quantity: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  imagePath?: string;
}

export interface productCategory {
  id: number;
  name: string;
}
