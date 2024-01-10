import React, { useState, useEffect } from 'react';
import { useEthereum, useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import { Polygon } from '@particle-network/chains';
import { AAWrapProvider, SmartAccount, SendTransactionMode } from '@particle-network/aa';
import { ethers } from 'ethers';
import { notification } from 'antd';

import './App.css';

const App = () => {
  const { provider, address } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();

  const smartAccount = new SmartAccount(provider, {
    projectId: process.env.REACT_APP_PROJECT_ID,
    clientKey: process.env.REACT_APP_CLIENT_KEY,
    appId: process.env.REACT_APP_APP_ID,
    aaOptions: {
      simple: [{ chainId: Polygon.id, version: '1.0.0' }]
    }
  });

  const customProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");
  
  const [balance, setBalance] = useState(null);
  const [tokenTicker, setTokenTicker] = useState('');
  const [tokenLimit, setTokenLimit] = useState('');
  const [amountToMint, setAmountToMint] = useState('');
  const [smartAddress, setSmartAddress] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const addressResponse = await smartAccount.getAddress();
    const balanceResponse = await customProvider.getBalance(addressResponse);
    setSmartAddress(addressResponse);
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

  const openModal = (modalType) => {
    if (modalType === 'create') setIsCreateModalOpen(true);
    if (modalType === 'mint') setIsMintModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsMintModalOpen(false);
  };

  const createToken = async () => {
    const signer = customProvider.getSigner();
    const data = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`data:,{"p":"prc-20","op":"deploy","tick":"${tokenTicker}","max":"21000000","lim":"${tokenLimit}"}`));

    const tx = {
      to: address,
      value: 0,
      data,
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: 'Transaction Successful',
      description: (
        <div>
          Transaction Hash: <a href={`https://polygonscan.com/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
        </div>
      )
    });
    closeModal();
  };

  const mintToken = async () => {
    const signer = customProvider.getSigner();
    const data = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`data:,{"p":"prc-20","op":"mint","tick":"${tokenTicker}","amt":"${amountToMint}"}`));

    const tx = {
      to: address,
      value: 0,
      data,
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: 'Transaction Successful',
      description: (
        <div>
          Transaction Hash: <a href={`https://polygonscan.com/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
        </div>
      )
    });

    closeModal();
  };

  return (
    <div className="App">
      <div className="logo-section">
        <img src="https://i.imgur.com/EerK7MS.png" alt="Logo" className="logo logo-big" />
      </div>
      {!userInfo ? (
        <div className="login-section">
          <button className="sign-button google-button" onClick={() => handleLogin('google')}>
            <img src="https://i.imgur.com/nIN9P4A.png" alt="Google" className="icon"/>
            Sign in with Google
          </button>
          <button className="sign-button twitter-button" onClick={() => handleLogin('twitter')}>
            <img src="https://i.imgur.com/afIaQJC.png" alt="Twitter" className="icon"/>
            Sign in with Twitter
          </button>
        </div>
      ) : (
        <div className="profile-card">
          <h2>{userInfo.name}</h2>
          <p className="white-text">EOA: {address}</p>
          <p className="white-text">Smart Account: {smartAddress}</p>
          <div className="balance-section">
            <small className="white-text">{balance} ETH</small>
            <button className="sign-message-button" onClick={() => openModal('create')}>Create Token</button>
            <button className="sign-message-button" onClick={() => openModal('mint')}>Mint Token</button>
            <button className="disconnect-button" onClick={disconnect}>Logout</button>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal">
          <input
            type="text"
            placeholder="Token Ticker"
            value={tokenTicker}
            onChange={(e) => setTokenTicker(e.target.value)}
          />
          <input
            type="text"
            placeholder="Token Limit"
            value={tokenLimit}
            onChange={(e) => setTokenLimit(e.target.value)}
          />
          <button onClick={createToken}>Create Token</button>
          <button onClick={closeModal}>Close</button>
        </div>
      )}

      {isMintModalOpen && (
        <div className="modal">
          <input
            type="text"
            placeholder="Token Ticker"
            value={tokenTicker}
            onChange={(e) => setTokenTicker(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount to Mint"
            value={amountToMint}
            onChange={(e) => setAmountToMint(e.target.value)}
          />
          <button onClick={mintToken}>Mint Token</button>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
