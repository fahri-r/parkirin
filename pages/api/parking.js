import { db } from "../../lib/db.server";

const prisma = db;

const Parking = async (req, res) => {
  const { memberId, parkingAreaId, id, employeeId } = JSON.parse(req.body);
  let parking;

  switch (req.method) {
    case "POST":
      parking = await prisma.parking.create({
        data: {
          memberId: Number(memberId),
          parkingAreaId: Number(parkingAreaId),
        },
      });

      const parkingArea = await prisma.parkingArea.update({
        where: { id: Number(parkingAreaId) },
        data: { available: false },
      });
      break;
    case "PUT":
      parking = await prisma.parking.update({
        where: { id: Number(id) },
        data: {
          done: true,
          employee: {
            connect: {
              id: Number(employeeId),
            },
          },
          parkingArea: {
            update: {
              available: true,
            },
          },
        },
      });
      break;
  }

  res.send(parking);
};

export default Parking;
