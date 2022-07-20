import {
  Badge,
  Box,
  Checkbox,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function CustomTable({
  headers = [],
  items = [],
  selected = [],
  selectable = false,
  bg = "secondary.card",
  color = "gray.800",
}) {
  let itemsIds = items.map((item) => item.id);
  let [localSelected, setLocalSelected] = useState(selected);
  const setCheckedItems = (isChecked) => {
    setLocalSelected([]);
    if (isChecked === true) {
      setLocalSelected(itemsIds);
    }
  };

  const setCheckedItem = (item, isChecked) => {
    isChecked
      ? setLocalSelected([...localSelected, item])
      : setLocalSelected(localSelected.filter((i) => i !== item));
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
            {selectable ? (
              <Th data-column="global-selector">
                <Checkbox
                  isChecked={localSelected.length === itemsIds.length}
                  onChange={(e) => setCheckedItems(e.target.checked)}
                />
              </Th>
            ) : (
              ""
            )}

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
              {selectable ? (
                <Td data-column="global-selector">
                  <Checkbox
                    defaultIsChecked={selected.includes(item.id)}
                    isChecked={localSelected.includes(item.id)}
                    onChange={(e) => setCheckedItem(item.id, e.target.checked)}
                  />
                </Td>
              ) : (
                ""
              )}

              {Object.keys(item).map((column, c) => (
                <Td key={c} data-column={headers[c]}>
                  {column !== "status" ? (
                    item[headers[c].id]
                  ) : (
                    <Badge
                      variant="outline"
                      colorScheme={
                        item[headers[c].id] === "Done" ? "green" : "yellow"
                      }
                    >
                      {item[headers[c].id]}
                    </Badge>
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
