import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { buildClient } from "../api/build-client";
import CustomHeader from "../components/header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CustomHeader {...pageProps} />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (context) => {
  let pageProps;
  let data;

  try {
    const response = await buildClient(context.ctx.req).get(
      "/auth/user/currentuser"
    );
    data = response.data;
  } catch (err) {
    console.log(err);
  }

  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx.req);
  }
  return { pageProps, ...data };
};

export default MyApp;
