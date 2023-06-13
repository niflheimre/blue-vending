import { Router } from "express";
import * as TransactionController from "./../controller/transaction";
const router: Router = Router();

router.post("/place-order", TransactionController.createTransaction);

export default router;
