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
1. You can get the first (genesis block):
<img width="1271" alt="Screenshot 2021-06-04 at 20 24 40" src="https://user-images.githubusercontent.com/24871973/121030704-a2355b80-c7a1-11eb-856c-2114a5608c32.png">
2. To request for a validation to be signed by your wallet, you includ your address as part of the parameters to be passed 
<img width="1312" alt="Screenshot 2021-06-04 at 20 33 53" src="https://user-images.githubusercontent.com/24871973/121030275-3eab2e00-c7a1-11eb-9433-9677a6ebc6c6.png">
3. When you get the message from validation, you sign the message the message with your Bitcoin Core or Electrum wallet
<img width="778" alt="Screenshot 2021-06-04 at 20 40 17" src="https://user-images.githubusercontent.com/24871973/121030065-0c99cc00-c7a1-11eb-8743-942230eaf545.png">
4.You can then post your star details by passing the star details, your wallet address, signature and message
<img width="1334" alt="Screenshot 2021-06-04 at 21 18 30" src="https://user-images.githubusercontent.com/24871973/121030402-571b4880-c7a1-11eb-9b04-77caa00eeb3a.png">
5. You can submit stars after 5minutes of verifying the message
<img width="1288" alt="Screenshot 2021-06-04 at 20 42 47" src="https://user-images.githubusercontent.com/24871973/121030544-7ade8e80-c7a1-11eb-8159-3a786eaffde7.png">
6.You can as well get a your star details by including /blocks/wallet address to retrieve stars associated to that wallet address.
<img width="1253" alt="Screenshot 2021-06-07 at 15 13 18" src="https://user-images.githubusercontent.com/24871973/121032299-0f95bc00-c7a3-11eb-9c1f-29d83f458b6c.png">

