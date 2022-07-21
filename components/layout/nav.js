import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Container,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";

export default function Simple({ role = "MEMBER", avatar }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <>
      <Flex
        position={{ md: "fixed" }}
        bg="#ffffff"
        minH="4rem"
        w="100%"
        marginTop={{ md: "-4rem" }}
        zIndex="99"
      >
        <Container maxW="container.lg" paddingTop="5px">
          <Box px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <IconButton
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ md: "none" }}
                onClick={isOpen ? onClose : onOpen}
              />
              <HStack spacing={8} alignItems={"center"}>
                <Box>
                  <Image
                    boxSize="54px"
                    fallbackSrc="https://user-images.githubusercontent.com/10295466/95871054-e472de00-0d75-11eb-93f4-2593ce275869.png"
                  />
                </Box>
                <HStack
                  as={"nav"}
                  spacing={4}
                  display={{ base: "none", md: "flex" }}
                >
                  {menuItems.map((link, index) => (
                    <NextLink href={link.href} key={index}>
                      <Button colorScheme="navItem" variant="ghost">
                        {link.title}
                      </Button>
                    </NextLink>
                  ))}
                </HStack>
              </HStack>
              <Flex alignItems={"center"}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={avatar} />
                  </MenuButton>
                  <MenuList>
                    <NextLink href="/profile">
                      <MenuItem>My Account</MenuItem>
                    </NextLink>
                    <MenuDivider />
                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>

            {isOpen ? (
              <Box pb={4} display={{ md: "none" }}>
                <Stack as={"nav"} spacing={4}>
                  {menuItems.map((link, index) => (
                    <NextLink href={link.href} key={index}>
                      <Button colorScheme="navItem" variant="ghost">
                        {link.title}
                      </Button>
                    </NextLink>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Box>
        </Container>
      </Flex>
    </>
  );
}
