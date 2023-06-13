import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { product } from "../data/product";
import { cash } from "../data/cash";
import { Modal } from "antd";
import { orderRequest } from "../data/order";

function usePlaceOrder(product: product, cashIn: cash[]) {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/place-order/`;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();



  const placeOrder = useCallback(async () => {
    setLoading(true);
    if (!process.env.REACT_APP_BRANCH_ID) throw Error("branch id not found");
    const requestBody: orderRequest = {
      stockId: product.id,
      branchId: Number.parseInt(process.env.REACT_APP_BRANCH_ID),
      cashIn: cashIn,
    };
    axios.post<cash[]>(url, requestBody).then(
      (data) => {
        const cashChange = data.data;
        setLoading(false);
        console.log(data);
        Modal.success({
          title: "Thank you for your Purchased",
          content: (
            <div>
              <p>
                Please collect your product{" "}
                {cashChange!.length > 0 && <>and change</>}
              </p>
              {cashChange!.length > 0 && (
                <>
                  <p>Your change : </p>
                  {cashChange!.map((cash) => (
                    <li>
                      {cash.value}฿ x{cash.amount}
                    </li>
                  ))}
                </>
              )}
            </div>
          ),
        });
      },
      (error: AxiosError) => {
        setLoading(false);
        setError(error.message);
        Modal.error({
          title: "We cannot complete your Purchased",
          content: (
            <div>
              <p>{"Insufficient change. Please collect your money :("}</p>

              <p>Your money : </p>
              {cashIn.map((cash) => (
                <li>
                  {cash.value}฿ x{cash.amount}
                </li>
              ))}
            </div>
          ),
        });
      }
    );
  }, [url, cashIn, product]);

  return {
    loading,
    error,
    placeOrder,
  };
}

export default usePlaceOrder;
