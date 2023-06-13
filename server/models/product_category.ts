import { Model } from "sequelize";

export interface ProductCategoryAttribute {
  id?: number;
  categoryName?: string;
}

export class ProductCategory
  extends Model<ProductCategoryAttribute>
  implements ProductCategoryAttribute
{
  public id!: number;
  public categoryName?: string;
}
