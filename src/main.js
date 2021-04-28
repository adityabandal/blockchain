const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
    "e72ae95d6bfc364a891c16b34246b88579df28858aafdf4a36950b2e3d16b00d"
);
const myWalletAddress = myKey.getPublic("hex");

let adityacoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "publicKey", 10);
tx1.signTransaction(myKey);
adityacoin.addTransaction(tx1);

console.log("\nStarting miner...");
adityacoin.minePendingTransactions(myWalletAddress);

console.log("\nMy Balance = ", adityacoin.getBalanceofAddress(myWalletAddress));

console.log("Is chain valid? ", adityacoin.isChainValid());

adityacoin.chain[1].transactions[0].amount = 1;
console.log("Is chain valid? ", adityacoin.isChainValid());
