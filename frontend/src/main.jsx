import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { MetaMaskProvider } from "@metamask/sdk-react";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "Your DApp Name",
          url: window.location.href,
        },
        alchemyAPIKey: import.meta.env.VITE_ALCHEMY_API_KEY, // Correctly accessing the Alchemy API key
      }}
    >
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </MetaMaskProvider>
  </React.StrictMode>
);
