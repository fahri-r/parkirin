import { withIronSession } from "next-iron-session";
import { db } from "../../lib/db.server";

const prisma = db;

async function handler(req, res) {
  // get user from prisma
  const findUser = await prisma.user.findMany({
    where: {
      email: req.body.email,
    },
    select: {
      id: true,
      email: true,
      Member: true,
      Employee: true,
    },
  });

  const getId = findUser[0].id;
  const getEmail = findUser[0].email;
  const getRole = findUser[0].role;
  const getMemberId = findUser[0].Member.length ? findUser[0].Member[0].id : "";
  const getEmployeeId = findUser[0].Employee.length
    ? findUser[0].Employee[0].id
    : "";
  const getAvatar = findUser[0].Member.length
    ? findUser[0].Member[0].avatar
    : findUser[0].Employee[0].id;

  // get user from database then:
  req.session.set("user", {
    id: getId,
    email: getEmail,
    role: getRole,
    memberId: getMemberId,
    employeeId: getEmployeeId,
    avatar: getAvatar,
  });
  await req.session.save();
  res.send("Logged in");
}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "myapp_cookiename",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
