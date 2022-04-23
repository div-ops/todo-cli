import { Box } from "ink";
import React from "react";
import { useMainOption } from "../hooks/mainOption";
import Message from "./Message";

export default function App() {
  const message = useMainOption();

  return (
    <Box>
      {message == null ? (
        <Message message={"Comming soon..!"} />
      ) : (
        <Message message={message} />
      )}
    </Box>
  );
}
