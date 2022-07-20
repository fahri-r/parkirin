import withSession from "./Session";
import { db } from "./db.server";
const prisma = db;

export const getServerSideProps = withSession(async function ({ req, res }) {
  //check the user session
  const user = req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  //get the user from the database
  const account = await prisma.user.findFirst({
    where: {
      email: req.session.get("user").email,
    },
  });

  account.memberId = req.session.get("user").memberId;
  account.employeeId = req.session.get("user").employeeId;
  account.createdAt = JSON.stringify(account.createdAt);
  account.updatedAt = JSON.stringify(account.updatedAt);

  return {
    props: {
      account,
    },
  };
});

export default getServerSideProps;
