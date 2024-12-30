import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { buildClient } from "../api/build-client";
import CustomHeader from "../components/header";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <CustomHeader currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (context) => {
  let pageProps = {};
  let currentUser;

  try {
    const response = await buildClient(context.ctx.req).get(
      "/auth/user/currentuser"
    );
    currentUser = response.data;
  } catch (err) {
    console.log(err);
  }

  if (context.Component.getInitialProps) {
    pageProps.data = await context.Component.getInitialProps(context);
  }
  return { pageProps, currentUser };
};

export default MyApp;
