const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previoushash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.timestamp +
                this.previoushash +
                this.nonce +
                JSON.stringify(this.data)
        ).toString();
    }
    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "27/04/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previoushash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
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
console.log("Mining block 1...");
adityacoin.addBlock(new Block(1, "30/04/2021", { amount: 4 }));
console.log("Mining block 2...");
adityacoin.addBlock(new Block(2, "30/04/2021", { amount: 41 }));
console.log("Mining block 3...");
adityacoin.addBlock(new Block(3, "30/04/2021", { amount: 17 }));

// console.log("Is blockchain valid? " + adityacoin.isChainValid());

// adityacoin.chain[3].data = { amount: 100 };
// adityacoin.chain[3].hash = adityacoin.chain[3].calculateHash();

// console.log("Is blockchain valid? " + adityacoin.isChainValid());
// console.log(JSON.stringify(adityacoin, null, 4));
