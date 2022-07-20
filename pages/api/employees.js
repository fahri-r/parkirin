import bcrypt from "bcryptjs";
import { db } from "../../lib/db.server";

const prisma = db;

const Employees = async (req, res) => {
  let employee;

  const { address, email, name, phone, id, avatar, password, role } =
    JSON.parse(req.body);

  switch (req.method) {
    case "POST":
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      employee = await prisma.employee.create({
        data: {
          name,
          avatar,
          address,
          phone,
          user: {
            create: {
              email,
              password: hash,
              role,
            },
          },
        },
      });
      break;

    case "DELETE":
      employee = await prisma.employee.findFirst({
        where: { id: Number(id) },
      });

      const { userId } = employee;

      employee = await prisma.user.delete({ where: { id: userId } });
      break;

    case "PUT":
      employee = await prisma.employee.update({
        where: { id: Number(id) },
        data: {
          name,
          phone,
          address,
          user: {
            update: {
              email,
            },
          },
        },
      });
      break;
  }

  res.json(employee);
};

export default Employees;
