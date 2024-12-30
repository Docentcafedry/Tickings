import { buildClient } from "../api/build-client";

export default function IndexPage({ currentUser, data }) {
  console.log(data);
  return (
    <>
      <div className="container">
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr>
              <td>Title</td>
              <td>Price</td>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((ticket) => {
                return (
                  <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.price}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

IndexPage.getInitialProps = async (context) => {
  const response = await buildClient(context.ctx.req).get("/api/tickets");

  return response.data;
};
