import React from "react";
import { Flex } from "@chakra-ui/react";

export default function PageContainer(props) {
  return (
    <Flex
      bg="secondary.background"
      minHeight="100vh"
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={10}
    >
      {props.children}
    </Flex>
  );
}
