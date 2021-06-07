# private-blockchain
This is a Project that enables end users to securely submit stars details on a private blockchain

### Getting Started
You can either fork or clone this project to your local machine and open it with a suitable IDE. At the terminal run `npm install` to install all dependecies. Run npm start to start the project. The project will run on port 8000.

### Dependencies
The dependecies utilised includes:
- Express
- bitcoinjs-lib
- bitcoinjs-message
- crypto-js
- morgan
- body-parser
- hex2ascii


### Endpoints
1. To request for a validation to be signed by your wallet, you includ your address as part of the parameters to be passed 
2. When you get the message from validation, you sign the message the message with your Bitcoin Core or Electrum wallet
3.You can then post your star details by passing the star details, your waallet address, signature and messgae 
4.You can as well get a your star details by including /block/wallet address to retrieve stars associated to that wallet address.