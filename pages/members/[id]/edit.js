import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { BsCardHeading } from "react-icons/bs";
import { FaCar, FaPhone, FaRegEnvelope, FaRegUser } from "react-icons/fa";
import Footer from "../../../components/layout/footer";
import Nav from "../../../components/layout/nav";
import PageContainer from "../../../components/layout/pageContainer";
import PageContent from "../../../components/layout/pageContent";
import serverProps from "../../../lib/authentication";
import { db } from "../../../lib/db.server";

const prisma = db;

export default function Profile({ profile }) {
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    data.id = profile.id;
    data.role = profile.user.role;

    await fetch("/api/members", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    toast.success("Updated member successfully");
  };

  return (
    <PageContainer isFixedNav>
      <Toaster position="top-center" reverseOrder={true} />
      <Nav role={profile.user.role} />
      <PageContent centerContent={true}>
        <Container maxW="container.sm">
          <Heading marginBottom="1.5rem">Edit Member</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box bg="secondary.card" rounded="lg" p={5}>
              <Stack spacing={4} marginBottom="1rem">
                <FormControl>
                  <FormLabel htmlFor="name">Your name</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaRegUser} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={profile.name}
                      {...register("name", { required: true })}
                      disabled={isSubmitting}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaRegEnvelope} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={profile.user.email}
                      {...register("email", { required: true })}
                      disabled={isSubmitting}
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
                      defaultValue={profile.phone}
                      {...register("phone", { required: true })}
                      disabled={isSubmitting}
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
                    defaultValue={profile.address}
                    {...register("address", { required: true })}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </Stack>
            </Box>

            <>
              <Stack spacing={0} marginTop="2rem" marginBottom="1rem">
                <Heading as="h4" size="md">
                  Vehicle settings
                </Heading>
                <Text color="gray.500" fontSize="md">
                  Update vehicle data
                </Text>
              </Stack>

              <Box bg="secondary.card" rounded="lg" p={5}>
                <Stack spacing={4} marginBottom="1rem">
                  <FormControl>
                    <Stack justifyContent="space-between" isInline>
                      <FormLabel htmlFor="vehicleName">Vehicle Name</FormLabel>
                    </Stack>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaCar} color="secondary.inputHelper" />
                      </InputLeftElement>
                      <Input
                        focusBorderColor="main.500"
                        name="vehicleName"
                        id="vehicleName"
                        type="text"
                        defaultValue={profile.vehicle.name}
                        {...register("vehicleName", { required: true })}
                        disabled={isSubmitting}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <Stack justifyContent="space-between" isInline>
                      <FormLabel htmlFor="licensePlate">
                        License Plate
                      </FormLabel>
                    </Stack>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon
                          as={BsCardHeading}
                          color="secondary.inputHelper"
                        />
                      </InputLeftElement>
                      <Input
                        focusBorderColor="main.500"
                        name="licensePlate"
                        id="licensePlate"
                        type="text"
                        defaultValue={profile.vehicle.licensePlate}
                        {...register("licensePlate", { required: true })}
                        disabled={isSubmitting}
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>
              </Box>
            </>

            <Stack
              direction={["column", "row"]}
              spacing="1rem"
              justify="end"
              marginTop="2rem"
            >
              <NextLink href="/members">
                <Button colorScheme="main" variant="outline">
                  Cancel
                </Button>
              </NextLink>
              <Button type="submit" colorScheme="main">
                Update
              </Button>
            </Stack>
          </form>

          <Divider
            marginTop="2rem"
            marginBottom="2rem"
            orientation="horizontal"
          />
        </Container>
      </PageContent>
      <Footer />
    </PageContainer>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;

  const authProps = await serverProps(ctx);

  const profile = await prisma.member.findFirst({
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      user: {
        select: {
          email: true,
          password: true,
          role: true,
        },
      },
      vehicle: {
        select: {
          name: true,
          licensePlate: true,
        },
      },
    },
    where: { id: Number(id) },
  });

  return {
    props: {
      account: authProps.props.account,
      profile,
    },
  };
}
