import { Box } from "ink";
import React from "react";
import { useMainOption } from "../hooks/mainOption";
import { useRouter } from "../hooks/router";
import Message from "./Message";

function App() {
  useMainOption();
  const router = useRouter();

  switch (router.pathname) {
    case "message": {
      return (
        <Message
          message={router.query?.["message"] ?? "message is not defined"}
        />
      );
    }

    default: {
      return <Message message={"Comming soon..!"} />;
    }
  }
}

export default function AppContainer() {
  return (
    <Box>
      <App />
    </Box>
  );
}
