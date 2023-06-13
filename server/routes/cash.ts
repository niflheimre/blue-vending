import { Router } from "express";
import * as CashController from "./../controller/cash";
const router: Router = Router();

router.post("/cash", CashController.createCash);
router.post("/cash/bulk", CashController.bulkCreateCash);
router.patch("/cash/:cashId", CashController.updateCash);
router.get("/cash/list", CashController.getCash);
router.delete("/cash/:cashId", CashController.deleteCash);
router.get("/hello", (req, res, _) => {
  res.status(200).send("hello");
});
// router.post(
//   "cash-branch/cash-stock/:branchId",
//   BranchController.updateCoinStock
// );

export default router;
