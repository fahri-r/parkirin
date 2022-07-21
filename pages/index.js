import Head from "next/head";
import { useRouter } from "next/router";
import serverProps from "../lib/authentication";

export default function Home({ account }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/signin");
  }

  return (
    <>
      <Head>
        <title>Home | {account.name}</title>
      </Head>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center w-full max-w-sm space-y-3">
          <h1>Using Next JS Iron Session</h1>
          <img
            className="w-20 h-20 object-cover rounded-full"
            src={account.avatar}
            alt={account.name}
          />
          <h1>
            Welcome <span className="font-bold">{account.name}</span>
          </h1>
          <button
            className="w-full px-5 py-3 border border-yellow-300 focus:outline-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const authProps = await serverProps(ctx);

  let destination = "/signin";
  if (authProps.props) {
    if (authProps.props.account.role == "MEMBER") {
      destination = "/history";
    } else if (authProps.props.account.role == "EMPLOYEE") {
      destination = "/dashboard";
    }
  }

  return {
    redirect: {
      permanent: false,
      destination,
    },
  };
}
