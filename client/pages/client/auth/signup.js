import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRequest } from "../../../hooks/useRequest";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { errors, requestFunc } = useRequest({
    url: "/auth/signup",
    method: "post",
    body: { email, password },
    pushPath: "/",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await requestFunc();
  };
  return (
    <>
      <div className="container">
        <h4>Sign Up</h4>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary py-1">
            Sign up!
          </button>
          {errors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <ul>
                {errors.map((error) => {
                  return <li key={error.message}>{error.message}</li>;
                })}
              </ul>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
