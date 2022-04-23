import { Box, Text } from "ink";
import React from "react";

interface Props {
  message: string;
}

export default function Message(props: Props) {
  return (
    <>
      <Box borderStyle="round" borderColor="green">
        <Box>
          <Text>{props.message}</Text>
        </Box>
      </Box>
    </>
  );
}
