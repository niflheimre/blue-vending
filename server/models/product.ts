import { Model } from "sequelize";

export interface ProductAttribute {
  id?: number;
  name?: string;
  description?: string;
  categoryId?: number;
  imagePath?: string;
}

export class Product
  extends Model<ProductAttribute>
  implements ProductAttribute
{
  public id!: number;
  public name!: string;
  public description?: string;
  public categoryId!: number;
  public imagePath?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface productByBranchItem {
  id: number;
  productId: number;
  price: number;
  status: string;
  isRecommend: boolean;
  quantity: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  imagePath?: string;
}
