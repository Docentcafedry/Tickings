import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useRequest({ url, method, body, pushPath }) {
  const [data, setData] = useState("");
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const requestFunc = async () => {
    try {
      const resp = await axios[method](url, body);
      setData(resp.data);
      router.push(pushPath);
    } catch (err) {
      setErrors(err.response.data.errors);
      console.log(err.response.data);
    }
  };

  return { data, errors, requestFunc };
}
