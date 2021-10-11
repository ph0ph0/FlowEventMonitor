# ReadMe

## Introduction

This is a set of coordinated AWS services that can monitor the Flow blockchain for events. In Flow, one of the primary uses of events is to keep track of resources and their state. This is necessary because, unlike in Ethereum, mappings/dictionaries are not used as a central record of the location of assets. Instead, resources (which often represent assets) are held in accounts, and so their whereabouts and other properties must be kept track of in another way. Whenever a resource is moved, its state changed, or its relationship to another entity is updated, an event is often emitted to record this. The event is posted to the Flow blockchain, and applications can listen for these events in order to respond accordingly.

One such use-case of an event monitor would be for a marketplace of NFTs. When NFTs are listed on the marketplace, a Listing resource is created which points to the NFT. When a party wants to purchase the NFT, they do so through the Listing, which provides the appropriate access to functions that can move the underlying NFT into their account. Both the creation of the Listing and the completion of the Listing (the purchasing of the NFT) will emit events to the blockchain. We can use these events to populate a record of the Listings that are currently available on the market. We can then pull down this information into a frontend, in order to display these records in the market to the user of our application.

This set of AWS services is one such way that an event monitor might be architected. The marketplace contract that it integrates with is the DappyMarket contract (LINK) of the [CryptoDappy tutorial](https://www.cryptodappy.com/). The DappyMarket contract is a modified version of the [NFTStorefront contract](https://github.com/onflow/nft-storefront). All modifications have been documented at the top of the contract. Please note that the NFTStorefront contract is currently the recommended approach to implementing a marketplace, however, it had to be modified to work with the CryptoDappy application.

## Which AWS Services Are Used? 

Central to the event monitor is the FlowEventMonitorLambda (FEML). This is an AWS Lambda function that checks the Flow blockchain for events, converts them into Listings objects (a representation of the NFT/Dappy) and stores them in a DynamoDB table. It is invoked by a Step Functions state machine (SM), which invokes the FEML at regular intervals 10 times a minute. The SM itself is then invoked once a minute by an EventBridge rule. An API is exposed using API Gateway, which links through to a Lambda that returns the 20 most recent Listings to the caller. The result is a system that polls the Flow blockchain for new events, uses these to update a table, and allows a frontend to display a market using this data through an accessible API. 

Lambda: FlowEventMonitorLambda, IteratorLambda, QueryListingTableLambda
DynamoDB: ListingTable, BlockCursorTable
Events: InvokeFlowEventMonitorStateMachine
IAM: ~10
StepFunctions: FlowEventMonitorStateMachine

\
&nbsp;

### Flow Event Monitor Architecture Diagram
\
&nbsp;
![Flow Event Monitor Architecture Diagram](./assets/CryptoDappies_MarketPlace_AWS_Architecture.png?raw=true "Flow Event Monitor Architecture")
\
&nbsp;

### Flow Event Monitor Step Functions Diagram
\
&nbsp;
![Flow Event Monitor Step Functions Diagram](./assets/CryptoDappies_AWS_StepFunction.png?raw=true "Flow Event Monitor Step Functions")

## What Does the FlowEventMonitorLambda (FEML) Do?

The FEML begins by looking through the array of event names that it is passed from the env vars. These are the events that the system will listen out for. In this case, the FEML looks for DappyListingAvailable and DappyListingCompleted events, which essentially represent the creation and deletion events of Listings, respectively. For each event name, the FEML then queries a DynamoDB (dDB) table called BlockCursorTable for the block cursor associated with the event. The block cursor represents the most recent block that was searched for the event in question. With the block cursor in hand, the FEML then searches within a block range for these events. The lower boundary is the block cursor, and the upper boundary is the most recent sealed block. There is a limit on the number of blocks that can be searched on the Flow blockchain to avoid overloading nodes on the network. Due to this, the FEML breaks down this range into batches and loops through these to search for the events. The two different event types, creation and deletion, are kept separate in different arrays and parsed into a shape that allows them to update objects in the ListingTable in dDB. Before being saved to the table, the arrays are ‘deduplicated’, which involves two steps. The first step removes duplicates from within an array. This is necessary as there is nothing preventing multiple events of the same kind being emitted from a single function in a contract. This could occur by mistake if, for example, a developer emitted an event at the start of a function and then emitted the same event again at the end. The second step involves removing matching creation and deletion events from both arrays. If the FEML picks up a creation event within one invocation, as well as a corresponding deletion event, then there is no need to write to the database then delete the entry in the same invocation. Once this process is finished, the events are written in batches to dDB. These objects can then be accessed by the client. 

## Monthly Cost Estimate

A very, very rough estimate of the cost of running this architecture is about $40 per month. This was calculated using the AWS Pricing Calculator and various online tools. The approximate breakdown is as follows:

* Lambda Functions: ~$0 (free tier)
* DynamoDB: ~$3
* EventBridge: $0 (free tier)
* StepFunctions: $36 (~33 state transitions per minute)
* Total: ~$39

# Getting Started

1. Firstly, clone the repo to your local machine
2. Download the AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
3. If you haven't already, create an AWS account (https://console.aws.amazon.com/)
4. Configure your AWS CLI so that it is linked to your AWS account: (https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
5. In the cloned repo on your local machine, cd into the CloudFormationTemplate folder.
6. To deploy the stack to your AWS account, run the following command:
   ```
   aws cloudformation create-stack \
   --stack-name FEM14 \
   --template-body file://template.yaml \
   --capabilities CAPABILITY_NAMED_IAM
   ```
7. Navigate to the CloudFormation console and check the status of your deployed stack: (https://console.aws.amazon.com/cloudformation)
8. Once your stack has been deployed (status: CREATE_COMPLETE), cd into the FlowEventMonitorLambda folder in your local repo, using your terminal.
9. In the terminal, run `./publish.sh`. This will deploy the FEML code to the newly created lambda in your stack.
10. Repeat for the IteratorLambda folder, and the QueryListingsTableLambda folder in the repo. Now all of the lambda code will be deployed.
11. To test that the FlowEventMonitor is working, you can emit some events from the cryptodappy app (see below for info on how to emit events).
12. Once the events have been emitted, navigate to the EventBridge console (). NOTE: If there is no block cursor object stored in the BlockCursorTable, then the default block range is set to 50 blocks. That means that only 50 blocks previous to the current block will be scanned. If you delay starting the FlowEventMonitor after emitting the events, the events may be located in older blocks. You can change the DEFAULT_BLOCK_RANGE environment variable in the FlowEventMonitorLambda console, or you can start the FlowEventMonitor immediately after emitting the events.
13. To start the FlowEventMonitor, click the "Enable" button on the InvokeFlowEventMonitorStateMachine rule in the EventBridge console. WARNING: Be sure to disable this rule after a few minutes or the FlowEventMonitor will run indefinitely and could cost you money!
14. To check that the FlowEventMonitor is working, navigate to the BlockCursorTable and check that new block cursors have been added. Check the ListingTable for the eventts that you emitted.
15. Congratulations, your FlowEventMonitor is now working! To find out how you can modify this for your own events, see "Modifying For Your Own Use"


# How To Emit Events from CryptoDappy

There are two ways to emit events. Using the UI, and using the flow CLI.


Go to CD and list some dappies

# Modifying For Your Own Use

Change the FEML env vars to event names that you would like to monitor.
Go to utils and change the parsing functions so that the events are converted to a shape suitable for your database.
Add/remove DynamoDB tables as requiredand and update access permissions on the FEML and QueryListingTableLambda to allow access. 

# Iteterator Test Event:
{
  "iterator": {
    "Payload": {
      "index": 0,
      "count": 6
    }
  }
}
 

Why only 20 listings? Explain that you can get more
How is concurrency avoided?
Events can be added as env vars to the FEML.
The processing of events can be altered and extended in Utils so that it can cater for a variety of events.
New tables can be tied in to store unrelated events.
Talk about the BlockCursor.
The FEML could be broken down into separate Lambdas, but wasn’t in the interest of time and a preference for code technical debt.

Could easily be split into more lambdas, however, doing so would increase latency (probably marginal though) and complexity from an AWS services view point. I had limited time to implement this and lumping all the code into one lambda was the fastest and easiest approach. 