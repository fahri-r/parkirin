import React from "react";

import PageContainer from "../components/layout/pageContainer";
import PageContent from "../components/layout/pageContent";
import Nav from "../components/layout/nav";
import Footer from "../components/layout/footer";
import Table from "../components/dashboard/table";
import serverProps from "../lib/authentication";
import Authorization from "../lib/authorization";
import { db } from "../lib/db.server";

const prisma = db;

export default function History({ account, parking }) {
  // Authorization(account, "MEMBER");

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
  parking.map((parking) => {
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
