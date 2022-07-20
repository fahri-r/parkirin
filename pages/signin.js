import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

import bcrypt from "bcryptjs";
import { FaLock, FaRegEnvelope } from "react-icons/fa";

import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Footer from "../components/layout/auth/footer";
import PageContainer from "../components/layout/auth/pageContainer";
import withSession from "../lib/session";
import toast, { Toaster } from "react-hot-toast";
import NextLink from "next/link";
import { db } from "../lib/db.server";

const prisma = db;

export default function Login({ users }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSignIn = async (data) => {
    const email = data.email;
    const password = data.password;

    //check the user if exist
    const checkUser = users.find((user) => user.email === email);

    if (!checkUser) {
      toast.error("This account is not registered! Sign up first...");
      return;
    }

    //matching the encrypted password and the set password

    const hashPassword = checkUser.password;
    const passwordMatch = await bcrypt.compare(password, hashPassword);

    //check if the password is match
    if (!passwordMatch) {
      toast.error("Your password is incorrect!");
      return;
    }

    await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    reset();
    if (checkUser.role == "MEMBER") {
      router.push("/history");
    } else {
      router.push("/dashboard");
    }
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
        <Heading marginBottom="1.5rem">Sign in</Heading>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <Stack spacing={4} marginBottom="1rem">
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
                  Username is required.
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Stack justifyContent="space-between" isInline>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="#"
                  color="secondary.link"
                  fontSize="sm"
                  fontWeight="500"
                >
                  Forgot Password?
                </Link>
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
          </Stack>
          <Stack marginBottom="1rem">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Please wait.."
              colorScheme="main"
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </Stack>
        </form>
        <Divider marginBottom="1rem" />
        <Stack>
          <Text textAlign="center" fontWeight="500">
            Don&apos;t have an account?
          </Text>
          <NextLink href="/signup">
            <Button colorScheme="main" variant="outline">
              Sign up
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
