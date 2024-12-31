import { buildClient } from "../../api/build-client";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/navigation";

export default function ShowTicket({ data }) {
  const router = useRouter();
  const { requestFunc, errors } = useRequest({
    url: "/api/orders/create",
    method: "post",
    body: { ticketId: data.id },
  });
  const onClickButton = async () => {
    const resp = await requestFunc();
    router.push(`/orders/${resp.id}`);
  };
  return (
    <div className="px-5">
      <h3>{data.title}</h3>
      <h5>{data.price}</h5>
      <button className="btn btn-primary" onClick={onClickButton}>
        Reserve Ticket
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
    </div>
  );
}

ShowTicket.getInitialProps = async (context) => {
  const { ticketId } = context.ctx.query;
  let response;
  try {
    response = await buildClient(context.ctx.req).get(
      `/api/tickets/${ticketId}`
    );
  } catch (err) {
    console.log(err);
  }

  return response.data;
};
