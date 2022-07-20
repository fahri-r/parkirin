import bcrypt from "bcryptjs";
import { db } from "../../lib/db.server";

const prisma = db;

const Profile = async (req, res) => {
  const {
    address,
    email,
    licensePlate,
    name,
    newPassword,
    phone,
    vehicleName,
    id,
    role,
  } = JSON.parse(req.body);

  if (role === "MEMBER") {
    if (newPassword) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, salt);

      const member = await prisma.member.update({
        where: { id },
        data: {
          name,
          phone,
          address,
          user: {
            update: {
              email,
              password: hash,
            },
          },
          vehicle: {
            update: {
              name: vehicleName,
              licensePlate,
            },
          },
        },
      });
    } else {
      const member = await prisma.member.update({
        where: { id },
        data: {
          name,
          phone,
          address,
          user: {
            update: {
              email,
            },
          },
          vehicle: {
            update: {
              name: vehicleName,
              licensePlate,
            },
          },
        },
      });
    }
  } else if (role === "EMPLOYEE") {
    if (newPassword) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, salt);

      const employee = await prisma.employee.update({
        where: { id },
        data: {
          name,
          phone,
          address,
          user: {
            update: {
              email,
              password: hash,
            },
          },
        },
      });
    } else {
      const employee = await prisma.employee.update({
        where: { id },
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
    }
  }

  res.json("Ok");
};

export default Profile;
