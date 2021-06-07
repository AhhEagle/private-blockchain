"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                          Blockchain Class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  The Blockchain class contain the basics functions to create your own private blockchain
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  to verify a message signature. The chain is stored in the array
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  isn't a persisten storage method.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _sha = require("crypto-js/sha256");

var _sha2 = _interopRequireDefault(_sha);

var _block = require("./block.js");

var _block2 = _interopRequireDefault(_block);

var _bitcoinjsMessage = require("bitcoinjs-message");

var _bitcoinjsMessage2 = _interopRequireDefault(_bitcoinjsMessage);

var _hex2ascii = require("hex2ascii");

var _hex2ascii2 = _interopRequireDefault(_hex2ascii);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blockchain = function () {
  /**
   * Constructor of the class, you will need to setup your chain array and the height
   * of your chain (the length of your chain array).
   * Also everytime you create a Blockchain class you will need to initialized the chain creating
   * the Genesis Block.
   * The methods in this class will always return a Promise to allow client applications or
   * other backends to call asynchronous functions.
   */
  function Blockchain() {
    _classCallCheck(this, Blockchain);

    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  /**
   * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
   * You should use the `addBlock(block)` to create the Genesis Block
   * Passing as a data `{data: 'Genesis Block'}`
   */


  _createClass(Blockchain, [{
    key: "initializeChain",
    value: async function initializeChain() {
      if (this.height === -1) {
        var block = new _block2.default.Block({ data: "Genesis Block" });
        await this._addBlock(block);
      }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */

  }, {
    key: "getChainHeight",
    value: function getChainHeight() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        resolve(_this.height);
      });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to
     * create the `block hash` and push the block into the chain array. Don't for get
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention
     * that this method is a private method.
     */

  }, {
    key: "_addBlock",
    value: function _addBlock(block) {
      var self = this;
      return new Promise(async function (resolve, reject) {
        try {
          block.height = self.chain.length;
          block.time = new Date().getTime().toString().slice(0, -3);
          block.previousBlockHash = self.chain.length > 0 ? self.chain[self.chain.length - 1].hash : null;
          block.hash = (0, _sha2.default)(JSON.stringify(block)).toString();
          self.chain.push(block);
          self.height++;
          var errorLog = await self.validateChain();
          if (errorLog.length !== 0) {
            resolve({ message: "Blockchain is invalid", error: errorLog, status: false });
          }
          resolve(block);
        } catch (err) {
          reject(new Error(err));
        }
      });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address
     */

  }, {
    key: "requestMessageOwnershipVerification",
    value: function requestMessageOwnershipVerification(address) {
      return new Promise(function (resolve) {
        var message = address + ":" + new Date().getTime().toString().slice(0, -3) + ":starRegistry";
        resolve(message);
      });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address
     * @param {*} message
     * @param {*} signature
     * @param {*} star
     */

  }, {
    key: "submitStar",
    value: function submitStar(address, message, signature, star) {
      var self = this;
      return new Promise(async function (resolve, reject) {
        var requestTime = parseInt(message.split(":")[1]);
        var currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
        var convert = 5 * 60 * 1000;
        if (requestTime + convert >= currentTime) {
          var isValid = _bitcoinjsMessage2.default.verify(message, address, signature);
          if (isValid) {
            var block = new _block2.default.Block({ star: star });
            block.owner = address;
            var addedBlock = await self._addBlock(block);
            resolve(addedBlock);
          } else {
            reject("Invalid message");
          }
        } else {
          reject("Request times out after 5 minutes");
        }
      });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash
     */

  }, {
    key: "getBlockByHash",
    value: function getBlockByHash(hash) {
      var self = this;
      return new Promise(function (resolve, reject) {
        resolve(self.chain.filter(function (element) {
          return element.hash === hash;
        })[0]);
      });
    }

    /**
     * This method will return a Promise that will resolve with the Block object
     * with the height equal to the parameter `height`
     * @param {*} height
     */

  }, {
    key: "getBlockByHeight",
    value: function getBlockByHeight(height) {
      var self = this;
      return new Promise(function (resolve, reject) {
        console.log(self.chain);
        var block = self.chain.filter(function (p) {
          return p.height === height;
        })[0];
        if (block) {
          resolve(block);
        } else {
          resolve(null);
        }
      });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address
     */

  }, {
    key: "getStarsByWalletAddress",
    value: function getStarsByWalletAddress(address) {
      var self = this;
      var stars = [];
      //this.validateChain();
      return new Promise(function (resolve, reject) {
        //console.log(`reach here`);
        //console.log(self.chain.block);
        var personalBlocks = self.chain.filter(function (element) {
          return element.owner === address;
        });
        console.log("first", personalBlocks);

        if (personalBlocks.length === 0) {
          reject("Address not found.");
        }
        console.log("second", personalBlocks);
        stars = personalBlocks.map(function (element) {
          return JSON.parse((0, _hex2ascii2.default)(element.body));
        });
        console.log(stars);
        stars ? resolve(stars) : reject("No stars found");
      });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */

  }, {
    key: "validateChain",
    value: function validateChain() {
      var self = this;
      var errorLog = [];
      return new Promise(async function (resolve, reject) {
        self.chain.forEach(function (block) {
          if (!block.validate()) {
            errorLog.push('Block not verified');
          } else {
            if (block.previousBlockHash !== self.chain[self.chain.length - 1].hash) {
              errorLog.push('Block not verified');
            }
            resolve(errorLog);
          }
        });
      });
    }
  }]);

  return Blockchain;
}();

module.exports.Blockchain = Blockchain;