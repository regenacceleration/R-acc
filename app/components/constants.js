export const contractAddress = "0xe75195E92A075A9f33b7bacb66e528a2D5DadbcB";
export const abi = [
  {
    inputs: [
      { internalType: "address", name: "locker_", type: "address" },
      { internalType: "address", name: "uniswapV3Factory_", type: "address" },
      { internalType: "address", name: "positionManager_", type: "address" },
      { internalType: "address", name: "swapRouter_", type: "address" },
      { internalType: "address", name: "owner_", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "Deprecated", type: "error" },
  { inputs: [], name: "InsufficientEARTH", type: "error" },
  { inputs: [], name: "InvalidConfig", type: "error" },
  { inputs: [], name: "InvalidTickSpacing", type: "error" },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "NotAdmin",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "NotAllowedPairedToken",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "PoolCreationFailed", type: "error" },
  { inputs: [], name: "SwapFailed", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "TokenNotFound",
    type: "error",
  },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "status", type: "bool" },
    ],
    name: "AdminUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "status", type: "bool" },
    ],
    name: "DeprecatedStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newLocker",
        type: "address",
      },
    ],
    name: "LockerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "allowed", type: "bool" },
    ],
    name: "PairedTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "SwapExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "fid", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "lockerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "castHash",
        type: "string",
      },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deployerAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "poolAmount",
        type: "uint256",
      },
    ],
    name: "TokensSplit",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "admins",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "allowedPairedTokens",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approveToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint256", name: "_supply", type: "uint256" },
      { internalType: "uint24", name: "_fee", type: "uint24" },
      { internalType: "bytes32", name: "_salt", type: "bytes32" },
      { internalType: "uint256", name: "_fid", type: "uint256" },
      { internalType: "string", name: "_image", type: "string" },
      { internalType: "string", name: "_castHash", type: "string" },
      {
        components: [
          { internalType: "int24", name: "tick", type: "int24" },
          { internalType: "address", name: "pairedToken", type: "address" },
          { internalType: "uint24", name: "devBuyFee", type: "uint24" },
        ],
        internalType: "struct Clanker.PoolConfig",
        name: "_poolConfig",
        type: "tuple",
      },
      { internalType: "uint256", name: "earthAmount", type: "uint256" },
    ],
    name: "deployToken",
    outputs: [
      { internalType: "contract ClankerToken", name: "token", type: "address" },
      { internalType: "uint256", name: "positionId", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "deploymentInfoForToken",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "positionId", type: "uint256" },
      { internalType: "address", name: "locker", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deprecated",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "earth",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidityLocker",
    outputs: [
      { internalType: "contract LpLockerv2", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "positionManager",
    outputs: [
      {
        internalType: "contract INonfungiblePositionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "admin", type: "address" },
      { internalType: "bool", name: "isAdmin", type: "bool" },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_deprecated", type: "bool" }],
    name: "setDeprecated",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
    ],
    name: "swapExactInputSingle",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRouter",
    outputs: [
      { internalType: "contract ISwapRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "allowed", type: "bool" },
    ],
    name: "toggleAllowedPairedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "tokensDeployedByUsers",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "positionId", type: "uint256" },
      { internalType: "address", name: "locker", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapV3Factory",
    outputs: [
      { internalType: "contract IUniswapV3Factory", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newLocker", type: "address" }],
    name: "updateLiquidityLocker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];



export const chain = {
  chainName: "Base Mainnet",
  chainId: "0x2105",
  rpcUrls: ["https://developer-access-mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
  // 0x9d6501275e91c0b2b0845c2c5334dea1ec6a3c18
};

// export const chain={
//   chainName: "Base Mainnet",
//   chainId: "0x14a34",
//   rpcUrls: ["https://sepolia.base.org"],
//     blockExplorerUrls: ["https://sepolia.basescan.org"],
//           nativeCurrency: {
//     symbol: "ETH",
//       decimals: 18,
//   },
//   // 0xF5561b9cE91092f60323a54Dd21Dd66F8f0A9279
// }
