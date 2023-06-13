import { cash } from "./cash";

export interface orderRequest {
  stockId: number;
  branchId: number;
  cashIn: cash[];
}
