import React from "react";
import {
  Container,
  Box,
  Text,
  Stack,
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  FormLabel,
  Checkbox,
  Link,
  Button,
  Divider,
  FormControl,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import {
  FaRegEnvelope,
  FaLock,
  FaRegUser,
  FaPhone,
  FaCar,
} from "react-icons/fa";
import { BsCardHeading } from "react-icons/bs";
import PageContainer from "../components/layout/pageContainer";
import PageContent from "../components/layout/pageContent";
import Nav from "../components/layout/nav";
import Footer from "../components/layout/footer";
import serverProps from "../lib/authentication";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../lib/db.server";

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
    const { oldPassword } = data;

    data.id = profile.id;
    data.role = profile.user.role;

    if (oldPassword) {
      const hashPassword = profile.user.password;
      const passwordMatch = await bcrypt.compare(oldPassword, hashPassword);
      if (!passwordMatch) {
        toast.error("Your password is incorrect!");
        return;
      }
    }

    await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    toast.success("Updated profile successfully");
    resetField("oldPassword");
    resetField("newPassword");
    resetField("newPassword2");
  };

  const oldPassword = watch("oldPassword");

  return (
    <PageContainer isFixedNav>
      <Toaster position="top-center" reverseOrder={true} />
      <Nav role={profile.user.role} avatar={account.avatar} />
      <PageContent centerContent={true}>
        <Container maxW="container.sm">
          <Heading marginBottom="1.5rem">Edit profile</Heading>
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

            {profile.user.role === "MEMBER" && (
              <>
                <Stack spacing={0} marginTop="2rem" marginBottom="1rem">
                  <Heading as="h4" size="md">
                    Vehicle settings
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    Update your vehicle data
                  </Text>
                </Stack>

                <Box bg="secondary.card" rounded="lg" p={5}>
                  <Stack spacing={4} marginBottom="1rem">
                    <FormControl>
                      <Stack justifyContent="space-between" isInline>
                        <FormLabel htmlFor="vehicleName">
                          Vehicle Name
                        </FormLabel>
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
            )}

            <Stack spacing={0} marginTop="2rem" marginBottom="1rem">
              <Heading as="h4" size="md">
                Security settings
              </Heading>
              <Text color="gray.500" fontSize="md">
                Update your password
              </Text>
            </Stack>

            <Box bg="secondary.card" rounded="lg" p={5}>
              <Stack spacing={4} marginBottom="1rem">
                <FormControl>
                  <Stack justifyContent="space-between" isInline>
                    <FormLabel htmlFor="oldPassword">
                      Current password
                    </FormLabel>
                  </Stack>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaLock} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      name="oldPassword"
                      id="oldPassword"
                      type="password"
                      placeholder="Enter your current password"
                      {...register("oldPassword", { required: false })}
                      disabled={isSubmitting}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <Stack justifyContent="space-between" isInline>
                    <FormLabel htmlFor="newPassword">New password</FormLabel>
                  </Stack>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaLock} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      name="newPassword"
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      {...register("newPassword", {
                        required: {
                          value: oldPassword,
                          message: "New password is required.",
                        },
                      })}
                      disabled={isSubmitting}
                    />
                  </InputGroup>
                  {errors.newPassword && (
                    <Text fontSize="sm" color="red">
                      {errors.newPassword.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl>
                  <Stack justifyContent="space-between" isInline>
                    <FormLabel htmlFor="newPassword2">
                      Confirm new password
                    </FormLabel>
                  </Stack>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaLock} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      name="newPassword2"
                      id="newPassword2"
                      type="password"
                      placeholder="Confirm your new password"
                      {...register("newPassword2", {
                        required: {
                          value: oldPassword,
                          message: "Password confirmation is required.",
                        },
                        validate: {
                          matchesPreviousPassword: (value) => {
                            const { newPassword } = getValues();
                            return (
                              newPassword === value || "Passwords should match!"
                            );
                          },
                        },
                      })}
                      disabled={isSubmitting}
                    />
                  </InputGroup>
                  {errors.newPassword2 && (
                    <Text fontSize="sm" color="red">
                      {errors.newPassword2.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </Box>

            <Stack
              direction={["column", "row"]}
              spacing="1rem"
              justify="end"
              marginTop="2rem"
            >
              <Button colorScheme="main" variant="outline">
                Cancel
              </Button>
              <Button type="submit" colorScheme="main">
                Update settings
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
  const authProps = await serverProps(ctx);
  let profile;

  if (authProps.props.account.role == "MEMBER") {
    profile = await prisma.member.findFirst({
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
      where: { userId: authProps.props.account.id },
    });
  } else {
    profile = await prisma.employee.findFirst({
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
      },
      where: { userId: authProps.props.account.id },
    });
  }

  return {
    props: {
      profile,
    },
  };
}
