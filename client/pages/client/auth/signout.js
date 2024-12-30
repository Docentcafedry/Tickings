import { useEffect } from "react";
import { useRequest } from "../../../hooks/useRequest";

export default function SignOut() {
  const { requestFunc } = useRequest({
    url: "/auth/logout",
    method: "post",
    pushPath: "/",
    body: {},
  });
  useEffect(() => {
    requestFunc();
  }, []);

  return (
    <>
      <h1>Signing out!</h1>
    </>
  );
}
