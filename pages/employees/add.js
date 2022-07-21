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
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  FaImage,
  FaLock,
  FaPhone,
  FaRegEnvelope,
  FaRegUser,
} from "react-icons/fa";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";
import PageContainer from "../../components/layout/pageContainer";
import PageContent from "../../components/layout/pageContent";
import serverProps from "../../lib/authentication";
import { db } from "../../lib/db.server";

const prisma = db;

export default function Profile({ account, users }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const userExist = users.some((user) => user.email === data.email);

    if (userExist) {
      toast.error("This account is already exist!");
      return;
    }

    data.role = "EMPLOYEE";
    await fetch("/api/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
    router.push("/employees");
  };

  return (
    <PageContainer isFixedNav>
      <Toaster position="top-center" reverseOrder={true} />
      <Nav role={account.role} avatar={account.avatar} />
      <PageContent centerContent={true}>
        <Container maxW="container.sm">
          <Heading marginBottom="1.5rem">Edit Employee</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box bg="secondary.card" rounded="lg" p={5}>
              <Stack spacing={4} marginBottom="1rem">
                <FormControl>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaRegUser} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter employee full name"
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
                  <FormLabel htmlFor="avatar">Avatar URL</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaImage} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      type="text"
                      name="avatar"
                      id="avatar"
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
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaPhone} color="secondary.inputHelper" />
                    </InputLeftElement>
                    <Input
                      focusBorderColor="main.500"
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Enter employee phone number"
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
                  <FormLabel htmlFor="address">Address</FormLabel>

                  <Textarea
                    focusBorderColor="main.500"
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter employee full address"
                    {...register("address", { required: true })}
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <Text fontSize="sm" color="red">
                      Address is required.
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </Box>

            <Stack spacing={0} marginTop="2rem" marginBottom="1rem">
              <Heading as="h4" size="md">
                Security settings
              </Heading>
              <Text color="gray.500" fontSize="md">
                Add the password
              </Text>
            </Stack>

            <Box bg="secondary.card" rounded="lg" p={5}>
              <Stack spacing={4} marginBottom="1rem">
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
                      placeholder="Enter employee password"
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
                            return (
                              password === value || "Passwords should match!"
                            );
                          },
                        },
                      })}
                      disabled={isSubmitting}
                    />
                  </InputGroup>
                  {errors.passwordConfirmation && (
                    <Text fontSize="sm" color="red">
                      {errors.passwordConfirmation.message}
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
              <NextLink href="/employees">
                <Button colorScheme="main" variant="outline">
                  Cancel
                </Button>
              </NextLink>
              <Button type="submit" colorScheme="main">
                Add Employee
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

  const users = await prisma.user.findMany();

  users.map((x) => {
    x.createdAt = JSON.stringify(x.createdAt);
    x.updatedAt = JSON.stringify(x.updatedAt);
    return x;
  });

  return {
    props: {
      account: authProps.props.account,
      users,
    },
  };
}
