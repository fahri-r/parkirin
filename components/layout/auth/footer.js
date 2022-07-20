import React from "react";
import { Stack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <>
      <Stack isInline marginTop="1rem" fontWeight="500" fontSize="sm">
        <Text color="secondary.link">&copy; Made with ❤</Text>
      </Stack>
    </>
  );
}
