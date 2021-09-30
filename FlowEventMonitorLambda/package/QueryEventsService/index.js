const { getBlockCursorForEvent } = require("../BlockCursorTableService");
const { getCurrentBlockHeight, searchBlockRange } = require("../FlowService");

// @params: [String]
const getEvents = async (eventsArray) => {
  const contractAddress = "e223d8a629e49c68";
  const contractName = "FUSD";
  const eventName = "TokensWithdrawn";

  // A.0x29e893174dd9b963.DappyContract.ListingAvailable
  // `A.${"ListingAvailable"}.${"DappyContract"}.${"29e893174dd9b963"}`
  // `A.${"e223d8a629e49c68"}.${"FUSD"}.${"TokensWithdrawn"}`
  // const TEST_EVENTS_ARRAY = ["aMadeUpEvent", "aNonExistantEvent"];
  const TEST_EVENTS_ARRAY = [
    `A.e223d8a629e49c68.FUSD.TokensWithdrawn`,
    `A.29e893174dd9b963.DappyContract.ListingAvailable`,
  ];

  const currentBlockHeight = await getCurrentBlockHeight();
  console.log(`!!!!tO cBH: ${typeof currentBlockHeight}`);
  console.log(`!!!CurrentBlockHeight: ${JSON.stringify(currentBlockHeight)}`);

  // We can use the eventName as an ID as it should be unique
  // Returns { eventName, blockCursor }
  const cursors = await Promise.all(
    TEST_EVENTS_ARRAY.map(async (event) => {
      return await getBlockCursorForEvent(event, currentBlockHeight);
    })
  );
  console.log(`!!!cursors: ${JSON.stringify(cursors)}`);

  const eventObjectsArray = await Promise.all(
    cursors.map(async (cursor) => {
      return await searchBlockRange(currentBlockHeight, cursor);
    })
  );

  console.log(`eventsObjectsArray: ${JSON.stringify(eventObjectsArray)}`);

  // Event details
};

getEvents();

module.exports.getListingCompletedEvents = async () => {
  // Get the most recent sealed block
  // TODO: Uncomment
  // const block = await fcl.send([fcl.getBlock(true)]);
  // decoded = await fcl.decode(block);

  // Get the current block height
  // TODO: Uncomment
  // startingBlockHeight = decoded.height
  // console.log(`height: ${startingBlockHeight}`)

  // Get the block cursor
  // If no block cursor, set it to the current block height - 249; that's the largest spread you can do.
  // Query dDB to get bH.
  // TODO: Update fromBlock with cursor

  // TODO: Uncomment
  // const fromBlock = startingBlockHeight - 249
  // const toBlock = startingBlockHeight

  // Event details
  const contractAddress = "e223d8a629e49c68";
  const contractName = "FUSD";
  const eventName = "TokensWithdrawn";

  // TODO: Uncomment
  // if (fromBlock <= toBlock) {
  if (1 < 5) {
    try {
      // Query for events
      // TODO:Uncomment
      // const result = await fcl.send([
      //   fcl.getEventsAtBlockHeightRange(`A.${contractAddress}.${contractName}.${eventName}`, fromBlock, toBlock)
      // ]);
      // const decoded = await fcl.decode(result)
      // console.log(`Events: ${JSON.stringify(decoded)}`)
      // TODO: Update block cursor
      // If we have some events, return them
    } catch (error) {}
  }
};

module.exports.ListingsAvailableData = [
  {
    data: {
      uuid: "3",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "2",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "1",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "2",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
];

module.exports.ListingsCompletedData = [
  {
    data: {
      uuid: "",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "2",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "3",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "1",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "4",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "5",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
  {
    data: {
      uuid: "6",
      address: "0xt987oghui",
      dna: "6987tyughj8t7oyiuhl",
      name: "guyog",
    },
  },
];

// module.exports.ListingsAvailableData = [
//   {
//     data: {
//       uuid: "1",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "2",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "3",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "4",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "5",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "6",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "7",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "8",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
// ];

// module.exports.ListingsCompletedData = [
//   {
//     data: {
//       uuid: "1",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "2",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "3",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "4",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "5",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "6",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "7",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
//   {
//     data: {
//       uuid: "8",
//       address: "0xt987oghui",
//       dna: "6987tyughj8t7oyiuhl",
//       name: "guyog",
//     },
//   },
// ];
