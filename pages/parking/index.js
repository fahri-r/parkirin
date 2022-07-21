import { Box, Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";
import PageContainer from "../../components/layout/pageContainer";
import PageContent from "../../components/layout/pageContent";
import serverProps from "../../lib/authentication";
import { db } from "../../lib/db.server";

const prisma = db;

export default function Parking({ account, parkingArea, parking }) {
  // Authorization(account, "MEMBER");
  const router = useRouter();

  async function handleSubmit(e) {
    await fetch("/api/parking", {
      method: "POST",
      body: JSON.stringify({
        parkingAreaId: e.target.value,
        memberId: account.memberId,
      }),
    });

    toast.success("You've successfully made a booking");
    router.push("/parking");
  }

  function handleDetail(e) {
    const checkParking = parking.find(
      (parking) => parking.parkingAreaId == e.target.value && !parking.done
    );
    router.push(`/parking/${checkParking.id}/done`);
  }

  const parkingAreaGroup = (array, count) => {
    let output = [];

    for (let index = count; index < array.length; index++) {
      if (
        index > count &&
        array[index].parkingBlock.name !== array[index - 1].parkingBlock.name
      ) {
        return output;
      }
      if (account.role === "MEMBER") {
        output.push(
          <Button
            key={index}
            colorScheme={array[index].available ? "teal" : "red"}
            size="lg"
            value={array[index].id}
            onClick={handleSubmit}
            disabled={array[index].available ? false : true}
          >
            {array[index].parkingBlock.name + array[index].number}
          </Button>
        );
      } else {
        output.push(
          <Button
            key={index}
            colorScheme={array[index].available ? "teal" : "red"}
            size="lg"
            value={array[index].id}
            onClick={handleDetail}
            disabled={array[index].available ? true : false}
          >
            {array[index].parkingBlock.name + array[index].number}
          </Button>
        );
      }
    }
    return output;
  };

  let block1 = parkingAreaGroup(parkingArea, 0);
  let block2 = parkingAreaGroup(parkingArea, block1.length);
  let block3 = parkingAreaGroup(parkingArea, block1.length + block2.length);
  let block4 = parkingAreaGroup(
    parkingArea,
    block1.length + block2.length + block3.length
  );

  return (
    <PageContainer isFixedNav>
      <Toaster position="top-center" reverseOrder={true} />
      <Nav role={account.role} avatar={account.avatar} />
      <PageContent title="Book Parking Area">
        <Box
          width="100%"
          bg="white"
          rounded="lg"
          p={5}
          alignContent="space-between"
        >
          <HStack w="100%">
            <VStack spacing={4} align="stretch" w="15%">
              {block1}
            </VStack>
            <Spacer />
            <VStack spacing={4} align="stretch" w="15%">
              {block2}
            </VStack>
            <VStack spacing={4} align="stretch" w="15%">
              {block3}
            </VStack>
            <Spacer />
            <VStack spacing={4} align="stretch" w="15%">
              {block4}
            </VStack>
          </HStack>
        </Box>
      </PageContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const parkingArea = await prisma.parkingArea.findMany({
    select: {
      id: true,
      number: true,
      available: true,
      parkingBlock: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        parkingBlock: {
          name: "asc",
        },
      },
      {
        number: "asc",
      },
    ],
  });

  const parking = await prisma.parking.findMany({
    orderBy: {
      done: "asc",
    },
    select: {
      id: true,
      parkingAreaId: true,
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

  const authProps = await serverProps(ctx);
  return {
    props: {
      account: authProps.props.account,
      parkingArea,
      parking,
    },
  };
}
