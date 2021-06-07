"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *          BlockchainController
 *       (Do not change this code)
 * 
 * This class expose the endpoints that the client applications will use to interact with the 
 * Blockchain dataset
 */
var BlockchainController = function () {

    //The constructor receive the instance of the express.js app and the Blockchain class
    function BlockchainController(app, blockchainObj) {
        _classCallCheck(this, BlockchainController);

        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.getValidateChain();
    }

    // Enpoint to Get a Block by Height (GET Endpoint)


    _createClass(BlockchainController, [{
        key: "getBlockByHeight",
        value: function getBlockByHeight() {
            var _this = this;

            this.app.get("/block/height/:height", async function (req, res) {
                if (req.params.height) {
                    var height = parseInt(req.params.height);
                    var block = await _this.blockchain.getBlockByHeight(height);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } else {
                    return res.status(404).send("Block Not Found! Review the Parameters!");
                }
            });
        }

        // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)

    }, {
        key: "requestOwnership",
        value: function requestOwnership() {
            var _this2 = this;

            this.app.post("/requestValidation", async function (req, res) {
                if (req.body.address) {
                    var address = req.body.address;
                    var message = await _this2.blockchain.requestMessageOwnershipVerification(address);
                    if (message) {
                        return res.status(200).json(message);
                    } else {
                        return res.status(500).send("An error happened!");
                    }
                } else {
                    return res.status(500).send("Check the Body Parameter!");
                }
            });
        }

        // Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)

    }, {
        key: "submitStar",
        value: function submitStar() {
            var _this3 = this;

            this.app.post("/submitstar", async function (req, res) {
                if (req.body.address && req.body.message && req.body.signature && req.body.star) {
                    var address = req.body.address;
                    var message = req.body.message;
                    var signature = req.body.signature;
                    var star = req.body.star;
                    try {
                        var block = await _this3.blockchain.submitStar(address, message, signature, star);
                        if (block) {
                            return res.status(200).json(block);
                        } else {
                            return res.status(500).send("An error happened!");
                        }
                    } catch (error) {
                        return res.status(500).send(error);
                    }
                } else {
                    return res.status(500).send("Check the Body Parameter!");
                }
            });
        }

        // This endpoint allows you to retrieve the block by hash (GET endpoint)

    }, {
        key: "getBlockByHash",
        value: function getBlockByHash() {
            var _this4 = this;

            this.app.get("/block/hash/:hash", async function (req, res) {
                if (req.params.hash) {
                    var hash = req.params.hash;
                    var block = await _this4.blockchain.getBlockByHash(hash);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } else {
                    return res.status(404).send("Block Not Found! Review the Parameters!");
                }
            });
        }

        // This endpoint allows you to request the list of Stars registered by an owner

    }, {
        key: "getStarsByOwner",
        value: function getStarsByOwner() {
            var _this5 = this;

            this.app.get("/blocks/:address", async function (req, res) {
                if (req.params.address) {
                    var address = req.params.address;
                    try {
                        var stars = await _this5.blockchain.getStarsByWalletAddress(address);

                        if (stars) {
                            return res.status(200).json(stars);
                        } else {
                            return res.status(404).send("Block Not Found!");
                        }
                    } catch (error) {
                        console.log(error.message);
                        return res.status(500).send("An error happened!");
                    }
                } else {
                    return res.status(500).send("Block Not Found! Review the Parameters!");
                }
            });
        }

        // This endpoint allows you to validate the blockchain

    }, {
        key: "getValidateChain",
        value: function getValidateChain() {
            var _this6 = this;

            this.app.get("/block/", async function (req, res) {
                // if(req.params.hash) {
                //     const hash = req.params.hash;
                try {
                    var chain = await _this6.blockchain.validateChain();
                    console.log(chain);
                    if (chain) {
                        return res.status(200).json(chain);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    console.log(error.message);
                    return res.status(500).send("An error happened!");
                }
                // } else {
                //     return res.status(404).send("Block Not Found! Review the Parameters!");
                // }
            });
        }
    }]);

    return BlockchainController;
}();

module.exports = function (app, blockchainObj) {
    return new BlockchainController(app, blockchainObj);
};