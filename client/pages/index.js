import { buildClient } from "../api/build-client";

export default function IndexPage({ data }) {
  return (
    <>
      <h1>Index page</h1>
      {data?.email ? (
        <h4>You are authenticated</h4>
      ) : (
        <h4>You are not authenticated</h4>
      )}
    </>
  );
}

IndexPage.getInitialProps = async (context) => {
  let data;
  try {
    const resp = await buildClient(context).get("/auth/user/currentuser");
    data = resp.data;
    console.log("From index initial props");
  } catch (err) {
    console.log(err);
  }

  return { data };
};
