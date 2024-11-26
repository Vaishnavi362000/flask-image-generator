import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
        initialColorMode: "light",
        useSystemColorMode: false,
      }
    }
  }
})

export default theme;