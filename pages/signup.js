import {
  Box,
  Button,
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
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { BsCardHeading } from "react-icons/bs";
import {
  FaCar,
  FaImage,
  FaLock,
  FaPhone,
  FaRegEnvelope,
  FaUser,
} from "react-icons/fa";
import Footer from "../components/layout/auth/footer";
import PageContainer from "../components/layout/auth/pageContainer";
import { db } from "../lib/db.server";
import withSession from "../lib/session";

const prisma = db;

export default function SignUp({ users }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSignUp = async (data) => {
    //check if the user is already exist
    const userExist = users.some((user) => user.email === data.email);

    if (userExist) {
      toast.error("This account is already exist!");
      return;
    }

    //create or register new user
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    reset();
    router.push("/signin");
  };

  return (
    <PageContainer>
      <Toaster position="top-center" reverseOrder={true} />
      <Box
        width={{ base: "90%", md: "400px" }}
        bg="secondary.card"
        rounded="lg"
        p={5}
      >
        <Heading marginBottom="1.5rem">Sign up</Heading>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <Stack spacing={4} marginBottom="1rem">
            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="name">Name</FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaUser} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.name && (
                <Text fontSize="sm" color="red">
                  Name is required.
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="avatar">Avatar URL</FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaImage} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="avatar"
                  id="avatar"
                  type="text"
                  placeholder="https://www.example.com"
                  {...register("avatar", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.avatar && (
                <Text fontSize="sm" color="red">
                  Avatar is required.
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="phone">Phone</FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaPhone} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="phone"
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  {...register("phone", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.phone && (
                <Text fontSize="sm" color="red">
                  Phone is required.
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="address">Address</FormLabel>
              </Stack>
              <InputGroup>
                <Textarea
                  focusBorderColor="main.500"
                  name="address"
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  {...register("address", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.address && (
                <Text fontSize="sm" color="red">
                  Address is required.
                </Text>
              )}
            </FormControl>
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
                  placeholder="Enter your vehicle name"
                  {...register("vehicleName", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.vehicleName && (
                <Text fontSize="sm" color="red">
                  Vehicle name is required.
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={BsCardHeading} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="licensePlate"
                  id="licensePlate"
                  type="text"
                  placeholder="Enter your license plate"
                  {...register("licensePlate", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.licensePlate && (
                <Text fontSize="sm" color="red">
                  License plate is required.
                </Text>
              )}
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
                  placeholder="name@example.com"
                  {...register("email", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.email && (
                <Text fontSize="sm" color="red">
                  Email is required.
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaLock} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                  disabled={isSubmitting}
                />
              </InputGroup>
              {errors.password && (
                <Text fontSize="sm" color="red">
                  Password is required.
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="passwordConfirmation">
                  Confirm Password
                </FormLabel>
              </Stack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaLock} color="secondary.inputHelper" />
                </InputLeftElement>
                <Input
                  focusBorderColor="main.500"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("passwordConfirmation", {
                    required: "Password confirmation is required.",
                    validate: {
                      matchesPreviousPassword: (value) => {
                        const { password } = getValues();
                        return password === value || "Passwords should match!";
                      },
                    },
                  })}
                />
              </InputGroup>
              {errors.passwordConfirmation && (
                <Text fontSize="sm" color="red">
                  {errors.passwordConfirmation.message}
                </Text>
              )}
            </FormControl>
          </Stack>
          <Stack marginBottom="1rem">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Please wait.."
              colorScheme="main"
            >
              Sign up
            </Button>
          </Stack>
        </form>
        <Divider marginBottom="1rem" />
        <Stack>
          <Text textAlign="center" fontWeight="500">
            Already have an account?
          </Text>
          <NextLink href={"/signin"}>
            <Button colorScheme="main" variant="outline">
              Sign in
            </Button>
          </NextLink>
        </Stack>
      </Box>
      <Footer />
    </PageContainer>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  //check the user session
  const user = req.session.get("user");

  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  //find all users from the database
  const users = await prisma.user.findMany();

  users.map((x) => {
    x.createdAt = JSON.stringify(x.createdAt);
    x.updatedAt = JSON.stringify(x.updatedAt);
    return x;
  });

  return {
    props: {
      users,
    },
  };
});
