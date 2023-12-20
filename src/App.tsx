import React, { useState, useEffect } from "react";
import {
  useEthereum,
  useConnect,
  useAuthCore,
} from "@particle-network/auth-core-modal";
import { Polygon } from "@particle-network/chains";
import {
  AAWrapProvider,
  SmartAccount,
  SendTransactionMode,
} from "@particle-network/aa";
import { ethers } from "ethers";
import { notification } from "antd";

import "./App.css";

const App = () => {
  const { provider } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();

  const smartAccount = new SmartAccount(provider, {
    projectId: process.env.REACT_APP_PROJECT_ID,
    clientKey: process.env.REACT_APP_CLIENT_KEY,
    appId: process.env.REACT_APP_APP_ID,
    aaOptions: {
      simple: [{ chainId: Polygon.id, version: "1.0.0" }],
    },
  });

  const customProvider = new ethers.providers.Web3Provider(
    new AAWrapProvider(smartAccount, SendTransactionMode.Gasless),
    "any",
  );
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const address = await smartAccount.getAddress();
    const balanceResponse = await customProvider.getBalance(address);
    setBalance(ethers.utils.formatEther(balanceResponse));
  };

  const handleLogin = async (authType) => {
    if (!userInfo) {
      await connect({
        socialType: authType,
        chain: Polygon,
      });
    }
  };

  const executeTransaction = async (data) => {
    const signer = customProvider.getSigner();
    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: 0,
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({ message: txReceipt.transactionHash });
  };

  const createToken = () => {
    executeTransaction(
      'data:,{"p":"prc-20","op":"deploy","tick":"THMD","max":"21000000","lim":"100"}',
    );
  };

  const mintToken = () => {
    executeTransaction(
      'data:,{"p":"brc-20","op":"mint","tick":"THMD","amt":"10"}',
    );
  };

  const transferToken = async () => {
    const signer = customProvider.getSigner();

    const data = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(
        'data:,{"p":"prc-20","op":"transfer","tick":"THMD","amt":"5”}',
      ),
    );

    const tx = {
      to: "0x696Bc9Df37BE518AaDFeefEd5cf242a716a3b8Ce",
      value: 0,
      data,
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: txReceipt.transactionHash,
    });
  };

  return (
    <div className="App">
      <div className="logo-section">
        <img
          src="https://i.imgur.com/EerK7MS.png"
          alt="Logo 1"
          className="logo logo-big"
        />
      </div>
      {!userInfo ? (
        <div className="login-section">
          <button
            className="sign-button google-button"
            onClick={() => handleLogin("google")}
          >
            <img
              src="https://i.imgur.com/nIN9P4A.png"
              alt="Google"
              className="icon"
            />
            Sign in with Google
          </button>
          <button
            className="sign-button twitter-button"
            onClick={() => handleLogin("twitter")}
          >
            <img
              src="https://i.imgur.com/afIaQJC.png"
              alt="Twitter"
              className="icon"
            />
            Sign in with X
          </button>
        </div>
      ) : (
        <div className="profile-card">
          <h2>{userInfo.name}</h2>
          <div className="balance-section">
            <small>{balance} MATIC</small>
            <button className="sign-message-button" onClick={createToken}>
              Create Token
            </button>
            <button className="sign-message-button" onClick={mintToken}>
              Mint Token
            </button>
            <button className="sign-message-button" onClick={transferToken}>
              Transfer Token
            </button>
            <button className="disconnect-button" onClick={disconnect}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;