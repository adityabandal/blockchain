const { format } = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previoushash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
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
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("27/04/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward),
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
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
adityacoin.createTransaction(new Transaction("address1", "address2", 100));
adityacoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting miner...");
adityacoin.minePendingTransactions("my-address");

console.log("\n My Balance = ", adityacoin.getBalanceofAddress("my-address"));

// adityacoin.addBlock(new Block(1, "30/04/2021", { amount: 4 }));
// console.log("Mining block 2...");
// adityacoin.addBlock(new Block(2, "30/04/2021", { amount: 41 }));
// console.log("Mining block 3...");
// adityacoin.addBlock(new Block(3, "30/04/2021", { amount: 17 }));

// console.log("Is blockchain valid? " + adityacoin.isChainValid());

// adityacoin.chain[3].data = { amount: 100 };
// adityacoin.chain[3].hash = adityacoin.chain[3].calculateHash();

// console.log("Is blockchain valid? " + adityacoin.isChainValid());
console.log(JSON.stringify(adityacoin, null, 4));
