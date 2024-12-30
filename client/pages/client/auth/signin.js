import { useState } from "react";
import { useRequest } from "../../hooks/useRequest";

export default function SignIn() {
  console.log(data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { requestFunc, errors } = useRequest({
    url: "/auth/signin",
    method: "post",
    body: { email, password },
    pushPath: "/",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await requestFunc();
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="container">
        <h4>Sign In</h4>
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
          <button type="submit" className="btn btn-primary">
            Sign In
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
