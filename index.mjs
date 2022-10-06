import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
// easily reference standard library
const stdlib = loadStdlib();

// Algorand network speaks microAlgos
// this is storing 100 Algos in microAlgos in startingBalance
const startingBalance = stdlib.parseCurrency(100);
// takes in a number for how much we fund the new account with
const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(startingBalance);

// attach to contract backend
const ctcAlice = accAlice.contract(backend);
// Bob attaches to Alice's instance of the contract
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const HAND = ['Rock', 'Paper', 'Scissors'];
const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];

const Player = (Who) => ({
  getHand: () => {
    const hand = Math.floor(Math.random() * 3);
    console.log(`${Who} played ${HAND[hand]}`);
    return hand;
  },
  seeOutcome: (outcome) => {
    console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
  },
});

await Promise.all([
  ctcAlice.p.Alice({
    // Alice interact object here
    ...Player('Alice'),
  }),
  ctcBob.p.Bob({
    // Bob interact object here
    ...Player('Bob'),
  }),
]);
