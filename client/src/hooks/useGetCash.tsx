import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { cash } from "../data/cash";

function useGetCash() {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/cash/list`;

  const [data, setData] = useState<cash[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let mount = true;

    if (mount) {
      setData([]);
      axios.get<cash[]>(url).then(
        (data) => {
          return setData(data.data);
        },
        (error: AxiosError) => {
          setData([]);
          setError(error.message);
        }
      );
    }
    return () => {
      mount = false;
    };
  }, []);

  return { data: data, error: error };
}

export default useGetCash;
