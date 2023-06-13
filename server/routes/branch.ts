import { Router } from "express";
import * as BranchController from "./../controller/branch";
const router: Router = Router();

router.post("/branch", BranchController.createBranch);
router.get("/branch", BranchController.getBranch);
router.patch("/branch/:branchId", BranchController.updateBranch);
router.delete("/branch/:branchId", BranchController.deleteBranch);
router.get("/cash-stock/branch/:branchId", BranchController.getCashStock);
router.post("/cash-stock/branch/:branchId", BranchController.updateCashStock);
router.post(
  "/cash-stock/bulk/branch/:branchId",
  BranchController.bulkUpdateCashStock
);
router.get("/hello", (req, res, _) => {
  res.status(200).send("hello");
});
// router.post(
//   "cash-branch/cash-stock/:branchId",
//   BranchController.updateCoinStock
// );

export default router;
