import bcrypt from "bcryptjs";
import { db } from "../../lib/db.server";

const prisma = db;

const Members = async (req, res) => {
  let member;

  const { address, email, licensePlate, name, phone, vehicleName, id } =
    JSON.parse(req.body);
  switch (req.method) {
    case "DELETE":
      member = await prisma.member.findFirst({
        where: { id: Number(id) },
      });

      const { vehicleId, userId } = member;

      member = await prisma.user.delete({ where: { id: userId } });
      member = await prisma.vehicle.delete({ where: { id: vehicleId } });

    case "PUT":
      member = await prisma.member.update({
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

  res.json(member);
};

export default Members;
