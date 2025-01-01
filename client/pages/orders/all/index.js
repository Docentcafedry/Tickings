import { buildClient } from "../../../api/build-client";

export default function ShowUsersOrders({ currentUser, data }) {
  return (
    <div className="container">
      <h3>Your orders, {currentUser.email}</h3>
      <table className="table">
        <thead>
          <tr>
            <td>Ticket</td>
            <td>Price</td>
            <td>Order Status</td>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((order) => {
              return (
                <tr key={order.id}>
                  <td>{order.ticket.title}</td>
                  <td>{order.ticket.price}</td>
                  <td>{order.status}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

ShowUsersOrders.getInitialProps = async (context) => {
  const response = await buildClient(context.ctx.req).get("/api/orders");
  return response.data;
};
