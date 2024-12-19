import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import ConnectWallet from "../components/ConnectWallet/connectWallet";
import WalletManager from "../components/WalletManager/walletManager";
import WalletManagerDocs from "../components/WalletManager/walletManagerDocs";
import WalletCard from "../components/WalletManager/walletCard";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        <Modal />
        {/* <ConnectWallet/> */}
        <WalletManager/>
        <WalletManagerDocs/>
        <WalletCard/>
      </ModalProvider>
    </>
  );
}
