<div align="center">
  <a href="https://particle.network/">
    <img src="https://i.imgur.com/xmdzXU4.png" />
  </a>
  <h3>
    Particle Smart WaaS Inscription Demo
  </h3>
</div>

⚡️ Demo application showcasing the creation, minting, and transfer of PRC-20 (inscriptions) tokens through Wallet-as-a-Service on Polygon, in which the associated transactions are routed through a smart account and thus made gasless, all powered by the [Particle Auth Core SDK](https://docs.particle.network/developers/auth-service/core/web).

This same methodology was used within Particle Network's "The People's Alliance" campaign (the largest community inscription event in Web3).

Built using **Particle Auth Core**, **TypeScript**, **Particle AA SDK**

## 🔑 Particle Auth Core
Particle Auth Core, a component of Particle Network's Wallet-as-a-Service, enables seamless onboarding to an application-embedded MPC-TSS/AA wallet facilitated by social login, such as Google, GitHub, email, phone number, etc. - as an alternative to Particle Auth, the Auth Core SDK comes with more control over the modal itself, application-embedded popups rather than redirects, and so on.

##

👉 Try the demo: https://web-demo.particle.network

👉 Learn more about Particle Network: https://particle.network

![Particle Auth Example](https://i.imgur.com/8uu6KqC.png)

## 🛠️ Quickstart

### Clone this repository
```
git clone https://github.com/TABASCOatw/particle-inscription-demo.git
```

### Install dependencies
```
yarn install
```
OR
```
npm install
```

### Set environment variables
This project requires a number of keys from Particle Network and WalletConnect to be defined in `.env`. The following should be defined:
- `REACT_APP_APP_ID`, the ID of the corresponding application in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
- `REACT_APP_PROJECT_ID`, the ID of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
-  `REACT_APP_CLIENT_KEY`, the client key of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).

### Start the project
```
npm run dev
```
OR
```
yarn dev
```
