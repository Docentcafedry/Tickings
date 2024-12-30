import { use, useState } from "react";
import { useRequest } from "../../../hooks/useRequest";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const convertPrice = () => {
    const newPrice = parseFloat(price);

    if (isNaN(newPrice)) {
      return;
    }

    return Math.round(newPrice, 2);
  };
  const { requestFunc, errors } = useRequest({
    url: "/tickets",
    method: "post",
    body: { title, price: convertPrice(price) },
    pushPath: "/",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await requestFunc();
    setTitle("");
    setPrice("");
  };

  return (
    <div className="container">
      <h1>Create your ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="btn btn-primary">
          Create
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
  );
}
