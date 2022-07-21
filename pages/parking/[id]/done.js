import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";

import bcrypt from "bcryptjs";
import { BsCardHeading } from "react-icons/bs";
import {
  FaCar,
  FaDollarSign,
  FaEnvelope,
  FaParking,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/router";
import Footer from "../../../components/layout/auth/footer";
import PageContainer from "../../../components/layout/auth/pageContainer";
import serverProps from "../../../lib/authentication";
import { db } from "../../../lib/db.server";

const prisma = db;

export default function Login({ account, parking }) {
  const duration = moment.duration(moment().diff(moment(parking.createdAt)));
  const hours = duration.asHours();
  const cost = Math.floor(hours) * process.env.NEXT_PUBLIC_PARKING_COST;
  const totalCost = cost ? cost : process.env.NEXT_PUBLIC_PARKING_COST;

  const router = useRouter();

  const handleDone = async (e) => {
    await fetch("/api/parking", {
      method: "PUT",
      body: JSON.stringify({
        id: e.target.value,
        employeeId: account.employeeId,
      }),
    });
    router.push("/dashboard");
  };

  return (
    <PageContainer>
      <Box
        width={{ base: "90%", md: "400px" }}
        bg="secondary.card"
        rounded="lg"
        p={5}
      >
        <Heading marginBottom="1.5rem">Parking Data</Heading>
        <form>
          <Stack spacing={4} marginBottom="1rem">
            <FormControl>
              <FormLabel htmlFor="name">Member Name</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaUser} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="name"
                  id="name"
                  value={parking.member.name}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaPhone} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="phone"
                  id="phone"
                  value={parking.member.phone}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaEnvelope} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="email"
                  name="email"
                  id="email"
                  value={parking.member.user.email}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Textarea
                focusBorderColor="main.500"
                type="text"
                name="address"
                id="address"
                value={parking.member.address}
                disabled
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="vehicleName">Vehicle</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaCar} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="vehicleName"
                  id="vehicleName"
                  value={parking.member.vehicle.name}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={BsCardHeading} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="licensePlate"
                  id="licensePlate"
                  value={parking.member.vehicle.licensePlate}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="parkingArea">Parking Area</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaParking} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="parkingArea"
                  id="parkingArea"
                  value={`${parking.parkingArea.parkingBlock.name}${parking.parkingArea.number}`}
                  disabled
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="cost">Total Cost</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  type="text"
                  name="cost"
                  id="cost"
                  value={totalCost}
                  disabled
                />
              </InputGroup>
            </FormControl>
          </Stack>
          <Stack marginBottom="1rem">
            <Button colorScheme="main" onClick={handleDone} value={parking.id}>
              Done
            </Button>
          </Stack>
        </form>
      </Box>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  const authProps = await serverProps(ctx);
  const parking = await prisma.parking.findFirst({
    where: { id: Number(id) },
    select: {
      id: true,
      member: {
        select: {
          name: true,
          phone: true,
          address: true,
          user: {
            select: {
              email: true,
            },
          },
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

  parking.createdAt = parking.createdAt.toString();
  parking.updatedAt = parking.updatedAt.toString();

  return {
    props: {
      account: authProps.props.account,
      parking,
    },
  };
}
