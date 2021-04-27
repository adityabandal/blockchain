const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previoushash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.timestamp +
                this.previoushash +
                JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "27/04/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.calculateHash() != currentBlock.hash) {
                return false;
            }

            if (currentBlock.previoushash != previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let adityacoin = new Blockchain();
adityacoin.addBlock(new Block(1, "30/04/2021", { amount: 4 }));
adityacoin.addBlock(new Block(2, "30/04/2021", { amount: 41 }));
adityacoin.addBlock(new Block(3, "30/04/2021", { amount: 17 }));

console.log("Is blockchain valid? " + adityacoin.isChainValid());

adityacoin.chain[1].data = { amount: 100 };
adityacoin.chain[1].hash = adityacoin.chain[1].calculateHash();

console.log("Is blockchain valid? " + adityacoin.isChainValid());
// console.log(JSON.stringify(adityacoin, null, 4));
