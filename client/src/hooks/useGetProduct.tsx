import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { product, productCategory } from "../data/product";

function useGetProduct(branchId: string | undefined) {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/product/branch/${branchId}`;

  const [data, setData] = useState<product[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let mount = true;
    if (mount) {
      setLoading(true);
      axios.get(url).then(
        (data) => {
          setData(data.data["products"]);
          setLoading(false);
        },
        (error: AxiosError) => {
          setData(undefined);
          setLoading(false);
          setError(error.message);
        }
      );
    }
    return () => {
      mount = false;
    };
  }, [url]);

  return { data: data, error: error, loading: loading };
}

export default useGetProduct;
