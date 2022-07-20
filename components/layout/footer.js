import React from "react";
import { Container, Stack, Link, Text, Icon } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Container
      maxW="container.lg"
      marginTop="auto"
      paddingTop="1.5rem"
      paddingBottom="1.5rem"
    >
      <Stack
        flexDirection={["column", "row"]}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack isInline fontWeight="500" fontSize="sm">
          <Text color="secondary.link">&copy; 2022</Text>
          <Link href="#" color="secondary.link" fontWeight="bold">
            Parkirin
          </Link>
          <Text color="secondary.link">&mdash; Made with ❤</Text>
        </Stack>
      </Stack>
    </Container>
  );
}
