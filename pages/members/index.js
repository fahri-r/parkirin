import React from "react";

import PageContainer from "../../components/layout/pageContainer";
import PageContent from "../../components/layout/pageContent";
import Nav from "../../components/layout/nav";
import Footer from "../../components/layout/footer";
import Table from "../../components/members/table";
import serverProps from "../../lib/authentication";
import Authorization from "../../lib/authorization";
import { PrismaClient } from "@prisma/client";
import { db } from "../../lib/db.server";

const prisma = db;

export default function Members({ account, members }) {
  // Authorization(account, "MEMBER");

  let headers = [
    {
      id: "id",
      title: "ID",
    },
    {
      id: "name",
      title: "Name",
    },
    {
      id: "email",
      title: "Email",
    },
    {
      id: "createdAt",
      title: "Date registered",
    },
  ];

  let items = [];
  members.map((member) => {
    items.push({
      id: member.id,
      name: member.name,
      email: member.user.email,
      createdAt: member.user.createdAt,
    });
  });

  return (
    <PageContainer isFixedNav>
      <Nav role={account.role} />
      <PageContent title="Members">
        <Table selectable selected={[]} headers={headers} items={items} />
      </PageContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const authProps = await serverProps(ctx);
  const members = await prisma.member.findMany({
    include: {
      user: true,
    },
  });

  members.map((x) => {
    x.user.createdAt = x.user.createdAt.toDateString();
    x.user.updatedAt = x.user.updatedAt.toDateString();
    return x;
  });

  return {
    props: {
      account: authProps.props.account,
      members,
    },
  };
}
