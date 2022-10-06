'reach 0.1';

// function signatures
const Player = {
  // no input, returns an unsigned integer
  getHand: Fun([], UInt),
  seeOutcome: Fun([UInt], Null),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    // Specify Alice's interact interface here
    ...Player,
  });
  const Bob = Participant('Bob', {
    // Specify Bob's interact interface here
    ...Player,
  });
  init();
  // move into step, where the user provides information to the program
  Alice.only(() => {
    // interact with the frontend function
    // when information comes over from the frontend it's hashed, have to declassify
    const handAlice = declassify(interact.getHand());
  });
  // publish means write this to the blockchain
  Alice.publish(handAlice);
  // done writing consensus operations, move me to the next step
  commit();

  Bob.only(() => {
    const handBob = declassify(interact.getHand());
  });

  // moves into consensus step, write this to the blockchain
  Bob.publish(handBob);
  const outcome = (handAlice + (4 - handBob)) % 3;
  // done writing information to the blockchain, next step please
  commit();

  each([Alice, Bob], () => {
    // interact with the frontend function
    interact.seeOutcome(outcome);
  });
});
