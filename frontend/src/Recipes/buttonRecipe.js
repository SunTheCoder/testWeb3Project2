import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const buttonRecipe = defineConfig({
  variants: {
    main: {
      true: {
        size:"xs",
        
        borderRadius:"sm",
        shadow:"md",
        bg:"radial-gradient(circle,rgb(135, 16, 131),rgb(161, 77, 166))",
        _hover:{ background: 'radial-gradient(circle,rgb(135, 11, 131),rgb(191, 97, 196))' },
        
          
          _dark: {
            bg: 'radial-gradient(circle,rgb(160, 15, 155),rgb(118, 31, 122))', // Dark mode hover background
            color: "white", // Dark mode hover text color
          },
        },
      },
    
    login: {
        true: {
            borderRadius: "sm",
            maxWidth: "200px",
            boxShadow: "sm",
            fontSize: "xs",
            bg: "radial-gradient(circle, #FFF6F5, #D0F5D6)", // Light pink to light green
            color: "pink.800", // Default text color
            _dark: {
              bg: "radial-gradient(circle, #8B4A62, #1E392A)", // Dark pink to dark green
              color: "pink.200", // Dark mode text color
            },
            _hover: {
              bg: "radial-gradient(circle, #FCECEC, #B8E6BE)", // Hover: light pink to soft green
              _dark: {
                bg: "radial-gradient(circle, #732f4f, #183E28)", // Hover: Dark pink to darker green
              },
            },
          },
          
    },
    // cancel, delete, logout
    logout: {
        true: {
            borderRadius: "sm",
            maxWidth: "200px",
            boxShadow: "sm",
            fontSize: "xs",
            bg: "radial-gradient(circle, #FFD1D1,rgb(254, 168, 168))", // Light red gradient
            color: "red.800", // Default text color
            _dark: {
              bg: "radial-gradient(circle, #8B0000, #2C1C1C)", // Dark red gradient
              color: "red.200", // Dark mode text color
            },
            _hover: {
              bg: "radial-gradient(circle, #FFB3B3, #FF9999)", // Hover: Lighter red gradient
              _dark: {
                bg: "radial-gradient(circle, #6E0000, #1A0F0F)", // Hover: Darker red gradient
              },
            },
          },
          
    },
    signup: {
        true: {
            borderRadius: "sm",
            maxWidth: "200px",
            boxShadow: "sm",
            fontSize: "xs",
            bg: "radial-gradient(circle, #E5E5E5, #CFCFCF)", // Light gray gradient
            color: "gray.800", // Default text color
            _dark: {
              bg: "radial-gradient(circle, #3C3C3C, #1F1F1F)", // Dark gray gradient
              color: "gray.200", // Dark mode text color
            },
            _hover: {
              bg: "radial-gradient(circle, #D5D5D5, #BFBFBF)", // Hover: Slightly darker light gray gradient
              _dark: {
                bg: "radial-gradient(circle, #2E2E2E, #181818)", // Hover: Slightly darker dark gray gradient
              },
            },
          },
          
    }
  },
});

const customConfig = defineConfig({
  theme: {
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
