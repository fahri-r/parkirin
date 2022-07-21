import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Table from "../components/dashboard/table";
import Footer from "../components/layout/footer";
import Nav from "../components/layout/nav";
import PageContainer from "../components/layout/pageContainer";
import PageContent from "../components/layout/pageContent";
import serverProps from "../lib/authentication";
import { db } from "../lib/db.server";

const prisma = db;

export default function History({ account, parking }) {
  // Authorization(account, "MEMBER");

  const [parkingData, setParkingData] = useState(parking);
  useEffect(() => {}, [parkingData]);

  const handleSearch = (e) => {
    if (e.target.value) {
      setParkingData(
        parking.filter((parking) =>
          parking.id.toString().includes(e.target.value)
        )
      );
    } else {
      setParkingData(parking);
    }
  };

  let headers = [
    {
      id: "id",
      title: "ID",
    },
    {
      id: "memberName",
      title: "Member Name",
    },
    {
      id: "parkingArea",
      title: "Area",
    },
    {
      id: "vehicle",
      title: "Vehicle",
    },
    {
      id: "status",
      title: "Status",
    },
  ];

  let items = [];
  parkingData.map((parking) => {
    let status = parking.done ? "Done" : "Still";
    items.push({
      id: parking.id,
      memberName: parking.member.name,
      parkingArea:
        parking.parkingArea.parkingBlock.name + parking.parkingArea.number,
      vehicle: parking.member.vehicle.name,
      status: status,
    });
  });

  return (
    <PageContainer isFixedNav>
      <Nav role={account.role} />
      <PageContent title="Dashboard">
        <InputGroup bgColor="white" mb={5}>
          <InputLeftAddon bgColor="main.500" color="white">
            Search by Id
          </InputLeftAddon>
          <Input type="tel" onChange={handleSearch} />
        </InputGroup>
        <Table headers={headers} items={items} />
      </PageContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const authProps = await serverProps(ctx);
  const parking = await prisma.parking.findMany({
    orderBy: {
      done: "asc",
    },
    select: {
      id: true,
      member: {
        select: {
          name: true,
          vehicle: {
            select: {
              name: true,
              licensePlate: true,
            },
          },
        },
      },
      employee: {
        select: {
          name: true,
        },
      },
      parkingArea: {
        select: {
          number: true,
          parkingBlock: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      done: true,
    },
  });

  parking.map((x) => {
    x.createdAt = JSON.stringify(x.createdAt);
    x.updatedAt = JSON.stringify(x.updatedAt);
    return x;
  });

  return {
    props: {
      account: authProps.props.account,
      parking,
    },
  };
}
