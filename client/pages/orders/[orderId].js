import { buildClient } from "../../api/build-client";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/useRequest";

export default function ShowOrder({ data, currentUser }) {
  const startDate = Math.round((new Date(data.expTime) - new Date()) / 100000);
  const [timeLeft, setTimeLeft] = useState(startDate);
  const { requestFunc, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: data.id },
    pushPath: "/",
  });

  useEffect(() => {
    const setTime = () => {
      setTimeLeft((prev) => prev - 1);
    };

    setTime();
    const intervalId = setInterval(setTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (timeLeft < 1) {
    return <h3>Order has expired</h3>;
  }
  return (
    <div className="px-5">
      <h3>Time left for complete the order {timeLeft}</h3>
      <StripeCheckout
        amount={data.price} // cents
        currency="USD"
        stripeKey={process.env.stripeKey}
        email={currentUser.email}
        // Note: Enabling either address option will give the user the ability to
        // fill out both. Addresses are sent as a second parameter in the token callback.
        token={(token) => requestFunc({ token: token.id })} // submit callback // called when the checkout popin is closed (no IE6/7)
        // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
        // you are using multiple stripe keys
      >
        <button className="btn btn-primary">Make payment</button>
      </StripeCheckout>
    </div>
  );
}

ShowOrder.getInitialProps = async (context) => {
  const { orderId } = context.ctx.query;
  let response;
  try {
    response = await buildClient(context.ctx.req).get(`/api/orders/${orderId}`);
  } catch (err) {
    console.log(err);
  }

  return response.data;
};
