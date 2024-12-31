import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useRequest({ url, method, body, pushPath }) {
  const [data, setData] = useState("");
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const requestFunc = async (addProps = {}) => {
    let resp;
    try {
      resp = await axios[method](url, { ...body, ...addProps });
      setData(resp.data);
      if (pushPath) {
        router.push(pushPath);
      }
    } catch (err) {
      console.log(err.response);
      setErrors(err.response.data.errors);
    }

    return resp.data;
  };

  return { data, errors, requestFunc };
}
