import { buildClient } from "../api/build-client";
import Link from "next/link";

export default function IndexPage({ currentUser, data }) {
  return (
    <>
      <div className="container">
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr>
              <td>Title</td>
              <td>Price</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((ticket) => {
                return (
                  <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.price}</td>
                    <td>
                      <Link href={`/tickets/${ticket.id}`}>Show</Link>
                    </td>
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
