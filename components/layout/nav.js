import {
  Button,
  Container,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { FaChevronDown, FaCog } from "react-icons/fa";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function Nav({ role = "MEMBER" }) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/signin");
  }

  let menuItems = [];
  if (role === "MEMBER") {
    menuItems = [
      { title: "Parking", href: "/parking" },
      { title: "History", href: "/history" },
    ];
  } else if (role === "EMPLOYEE") {
    menuItems = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Parking", href: "/parking" },
      { title: "Members", href: "/members" },
      { title: "Employees", href: "/employees" },
    ];
  }

  return (
    <Flex
      position={{ md: "fixed" }}
      bg="#ffffff"
      minH="4rem"
      w="100%"
      marginTop={{ md: "-4rem" }}
      zIndex="99"
    >
      <Container maxW="container.lg" paddingTop="5px">
        <Stack
          direction={["column", "row"]}
          alignItems={["flex-end", "center"]}
        >
          <Image
            boxSize="54px"
            fallbackSrc="https://user-images.githubusercontent.com/10295466/95871054-e472de00-0d75-11eb-93f4-2593ce275869.png"
          />
          <Text fontSize="xl" fontWeight="500">
            Parkirin
          </Text>
          <Stack direction={["column", "row"]} style={{ marginLeft: "5rem" }}>
            {menuItems.map((item, index) => (
              <NextLink href={item.href} key={index}>
                <Button colorScheme="navItem" variant="ghost">
                  {item.title}
                </Button>
              </NextLink>
            ))}
          </Stack>
          <Stack direction={["column", "row"]} style={{ marginLeft: "auto" }}>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="navItem"
                variant="ghost"
                rightIcon={<Icon as={FaCog} color="navItem.500" />}
              >
                Settings
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <NextLink href="/profile">
                    <MenuItem>My Account</MenuItem>
                  </NextLink>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}
