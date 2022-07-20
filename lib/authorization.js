import { useRouter } from "next/router";

const Authorization = (session, role) => {
  const router = useRouter();

  if (session.role !== role) {
    router.push("/");
  }
};

export default Authorization;
