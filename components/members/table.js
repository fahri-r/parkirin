import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

import { FaEllipsisV } from "react-icons/fa";
import NextLink from "next/link";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";

export default function CustomTable({
  headers = [],
  items = [],
  bg = "secondary.card",
  color = "gray.800",
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleDelete = async (e) => {
    await fetch("/api/members", {
      method: "DELETE",
      body: JSON.stringify({ id: e.target.value }),
    });
    onClose();
  };

  return (
    <Box
      className="custom-table-container"
      width="100%"
      bg={bg}
      color={color}
      rounded="lg"
      p={5}
    >
      <Table>
        <Thead>
          <Tr>
            {headers.map((head, i) => (
              <Th key={i} data-column={head.id}>
                {head.title}
              </Th>
            ))}
            <Th data-column="item-actions"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              {Object.keys(item).map((column, c) => (
                <Td key={c} data-column={headers[c]}>
                  {item[headers[c].id]}
                </Td>
              ))}
              <Td data-column="item-actions">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                  ></MenuButton>
                  <MenuList>
                    <NextLink href={`/members/${item.id}/edit`}>
                      <MenuItem>Edit</MenuItem>
                    </NextLink>
                    <MenuItem onClick={onOpen} value={item.id}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Member
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure? You can&apos;t undo this action
                        afterwards.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleDelete}
                          ml={3}
                          value={item.id}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
