import { useRouter } from "next/router";
import React from "react";
import Table from "../../components/employees/table";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";
import PageContainer from "../../components/layout/pageContainer";
import PageContent from "../../components/layout/pageContent";
import serverProps from "../../lib/authentication";
import { db } from "../../lib/db.server";

const prisma = db;

export default function Employees({ account, employees }) {
  // Authorization(account, "MEMBER");

  const router = useRouter();

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
  employees.map((employee) => {
    items.push({
      id: employee.id,
      name: employee.name,
      email: employee.user.email,
      createdAt: employee.user.createdAt,
    });
  });

  return (
    <PageContainer isFixedNav>
      <Nav role={account.role} />
      <PageContent
        title="Employees"
        primaryAction={{
          content: "Add Employee",
          onClick: () => {
            router.push("/employees/add");
          },
        }}
      >
        <Table selectable selected={[]} headers={headers} items={items} />
      </PageContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const authProps = await serverProps(ctx);

  if (authProps.props.account.role !== "EMPLOYEE") {
    let destination = "/dashboard";
    if (authProps.props.account.role == "MEMBER") {
      destination = "/history";
    }

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  const employees = await prisma.employee.findMany({
    include: {
      user: true,
    },
  });

  employees.map((x) => {
    x.user.createdAt = x.user.createdAt.toDateString();
    x.user.updatedAt = x.user.updatedAt.toDateString();
    return x;
  });

  return {
    props: {
      account: authProps.props.account,
      employees,
    },
  };
}
