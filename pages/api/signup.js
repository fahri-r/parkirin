import bcrypt from "bcryptjs";
import { db } from "../../lib/db.server";

const prisma = db;

const SignUp = async (req, res) => {
  const {
    name,
    avatar,
    address,
    phone,
    email,
    password,
    vehicleName,
    licensePlate,
  } = JSON.parse(req.body);

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const member = await prisma.member.create({
    data: {
      name,
      avatar,
      address,
      phone,
      user: {
        create: {
          email,
          password: hash,
        },
      },
      vehicle: {
        create: {
          name: vehicleName,
          licensePlate,
        },
      },
    },
  });

  res.json(member);
};

export default SignUp;
