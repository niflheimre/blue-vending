import { Router } from "express";
import * as ProductController from "./../controller/product";
const router: Router = Router();

router.post("/product", ProductController.createProduct);
router.post("/product/category", ProductController.createProductCategory);
router.post("/product/branch/:branchId", ProductController.createBranchProduct);
router.post("/products", ProductController.bulkCreateProduct);
router.post(
  "/products/branch/:branchId",
  ProductController.bulkCreateBranchProduct
);
router.patch("/product/:productId", ProductController.updateProduct);
router.post("/product/list", ProductController.getProduct);
router.get("/product/branch/:branchId", ProductController.getProductByBranch);
router.delete("/product/:productId", ProductController.deleteProduct);

export default router;
