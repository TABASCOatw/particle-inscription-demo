import React, { useState, useEffect } from 'react';
import {
	useEthereum,
	useConnect,
	useAuthCore,
} from '@particle-network/auth-core-modal';
import { Polygon } from '@particle-network/chains';
import {
	AAWrapProvider,
	SmartAccount,
	SendTransactionMode,
} from '@particle-network/aa';
import { ethers } from 'ethers';

import './App.css';

const App = () => {
	const { provider } = useEthereum();
	const { connect, disconnect } = useConnect();
	const { userInfo } = useAuthCore();

	const smartAccount = new SmartAccount(provider, {
		projectId: process.env.REACT_APP_PROJECT_ID,
		clientKey: process.env.REACT_APP_CLIENT_KEY,
		appId: process.env.REACT_APP_APP_ID,
		aaOptions: {
			simple: [{ chainId: Polygon.id, version: '1.0.0' }],
		},
	});

	const customProvider = new ethers.providers.Web3Provider(
		new AAWrapProvider(smartAccount, SendTransactionMode.Gasless),
		'any',
	);
	const [balance, setBalance] = useState(null);
	const [tokenTicker, setTokenTicker] = useState('');
	const [tokenLimit, setTokenLimit] = useState('');
	const [amountToMint, setAmountToMint] = useState('');
	const [recipient, setRecipient] = useState('');

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

	const createToken = async () => {
		const signer = customProvider.getSigner();
		const data = ethers.utils.hexlify(
			ethers.utils.toUtf8Bytes(
				`data:,{"p":"prc-20","op":"deploy","tick":"${tokenTicker}","max":"21000000","lim":"${tokenLimit}"}`,
			),
		);

		const tx = {
			to: recipient,
			value: 0,
			data,
		};

		await signer.sendTransaction(tx);
	};

	const mintToken = async () => {
		const signer = customProvider.getSigner();
		const data = ethers.utils.hexlify(
			ethers.utils.toUtf8Bytes(
				`data:,{"p":"prc-20","op":"mint","tick":"${tokenTicker}","amt":"${amountToMint}"}`,
			),
		);

		const tx = {
			to: recipient,
			value: 0,
			data,
		};

		await signer.sendTransaction(tx);
	};

	return (
		<div className="App">
			<div className="logo-section">
				<img
					src="https://i.imgur.com/EerK7MS.png"
					alt="Logo"
					className="logo logo-big"
				/>
			</div>
			{!userInfo ? (
				<div className="login-section">
					<button
						className="sign-button google-button"
						onClick={() => handleLogin('google')}
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
						onClick={() => handleLogin('twitter')}
					>
						<img
							src="https://i.imgur.com/afIaQJC.png"
							alt="Twitter"
							className="icon"
						/>
						Sign in with Twitter
					</button>
				</div>
			) : (
				<div className="profile-card">
					<h2>{userInfo.name}</h2>
					<p style={{ fontSize: '12px' }}>{balance} MATIC</p>
					<div>
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
						<input
							type="text"
							placeholder="Recipient"
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Amount to Mint"
							value={amountToMint}
							onChange={(e) => setAmountToMint(e.target.value)}
						/>
						<button onClick={createToken}>Create Token</button>
						<button onClick={mintToken}>Mint Token</button>
						<button onClick={disconnect}>Logout</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
