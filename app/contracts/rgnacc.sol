// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TickMath} from "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {INonfungiblePositionManager, IUniswapV3Factory, ILockerFactory, ILocker, ExactInputSingleParams, ISwapRouter} from "./interface.sol";
import {ClankerToken} from "./ClankerToken.sol";
import {LpLockerv2} from "./LpLockerv2.sol";

contract rgnacc is Ownable {
    using TickMath for int24;

    error Deprecated();
    error InvalidConfig();
    error NotAdmin(address user);
    error NotAllowedPairedToken(address token);
    error TokenNotFound(address token);
    error InsufficientEARTH();
    error SwapFailed();
    error InvalidTickSpacing();
    error TransferFailed();
    error PoolCreationFailed();

    LpLockerv2 public liquidityLocker;
    string public constant version = "0.0.2";

    address public earth = 0x9d6501275e91c0b2b0845C2c5334dEa1EC6a3c18;

    IUniswapV3Factory public immutable uniswapV3Factory;
    INonfungiblePositionManager public immutable positionManager;
    ISwapRouter public immutable swapRouter;

    bool public deprecated;

    mapping(address => bool) public admins;
    mapping(address => bool) public allowedPairedTokens;

    struct PoolConfig {
        int24 tick;
        address pairedToken;
        uint24 devBuyFee;
    }

    struct DeploymentInfo {
        address token;
        uint256 positionId;
        address locker;
    }

    mapping(address => DeploymentInfo[]) public tokensDeployedByUsers;
    mapping(address => DeploymentInfo) public deploymentInfoForToken;

    event TokenCreated(
        address tokenAddress,
        uint256 positionId,
        address deployer,
        uint256 fid,
        string name,
        string symbol,
        uint256 supply,
        address lockerAddress,
        string castHash
    );

    event SwapExecuted(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event AdminUpdated(address admin, bool status);
    event PairedTokenUpdated(address token, bool allowed);
    event LockerUpdated(address newLocker);
    event DeprecatedStatusUpdated(bool status);
    event RewardsClaimed(address token, uint256 positionId, address recipient);
    event TokensSplit(
        address token,
        address deployer,
        uint256 deployerAmount,
        uint256 poolAmount
    );

    modifier onlyOwnerOrAdmin() {
        if (msg.sender != owner() && !admins[msg.sender]) {
            revert NotAdmin(msg.sender);
        }
        _;
    }

    constructor(
        address locker_,
        address uniswapV3Factory_,
        address positionManager_,
        address swapRouter_,
        address owner_
    ) Ownable(owner_) {
        liquidityLocker = LpLockerv2(locker_);
        uniswapV3Factory = IUniswapV3Factory(uniswapV3Factory_);
        positionManager = INonfungiblePositionManager(positionManager_);
        swapRouter = ISwapRouter(swapRouter_);

        // Approve EARTH token for swap router and position manager
        IERC20(earth).approve(address(swapRouter), type(uint256).max);
        IERC20(earth).approve(address(positionManager), type(uint256).max);

        // Set EARTH as an allowed paired token by default
        allowedPairedTokens[earth] = true;
    }

    function approveToken(address token, uint256 amount) external {
        IERC20(token).approve(address(swapRouter), amount); // Approve swapRouter
        IERC20(token).approve(address(this), amount); // Approve the contract itself
    }

    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) public returns (uint256 amountOut) {
        // Check caller's balance of the input token
        uint256 balance = IERC20(tokenIn).balanceOf(msg.sender);
        require(balance >= amountIn, "Insufficient balance");

        // Check SwapRouter allowance
        uint256 allowance = IERC20(tokenIn).allowance(
            msg.sender,
            address(swapRouter)
        );
        require(allowance >= amountIn, "SwapRouter allowance too low");

        // Transfer input tokens from caller to contract
        bool transferSuccess = IERC20(tokenIn).transferFrom(
            msg.sender,
            address(this),
            amountIn
        );
        require(transferSuccess, "Token transfer failed");

        // Approve SwapRouter to spend input tokens
        IERC20(tokenIn).approve(address(swapRouter), amountIn);

        // Prepare swap parameters
        ExactInputSingleParams memory swapParams = ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: recipient,
            deadline: deadline,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        // Execute the swap
        try ISwapRouter(swapRouter).exactInputSingle(swapParams) returns (
            uint256 result
        ) {
            amountOut = result;
            emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Swap failed: ", reason)));
        } catch {
            revert("Swap failed: unknown error");
        }

        return amountOut;
    }

    function configurePool(
        address newToken,
        address pairedToken,
        int24 tickSpacing,
        uint256 supplyForPool,
        uint256 earthAmount,
        address deployer
    ) internal returns (uint256 positionId) {
       // require(newToken < pairedToken, "Invalid token order");

        int24 tick = -138000; 
        uint24 fee = 10000;
        uint160 sqrtPriceX96 = tick.getSqrtRatioAtTick();

        // Create and initialize pool
        address pool = uniswapV3Factory.createPool(newToken, pairedToken, fee);
        if (pool == address(0)) revert PoolCreationFailed();

        IUniswapV3Factory(pool).initialize(sqrtPriceX96);

        // Calculate ticks
        int24 maxTick = maxUsableTick(tickSpacing);

        // Prepare mint parameters
        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: newToken,
                token1: pairedToken,
                fee: fee,
                tickLower: earthAmount > 0 ? -maxTick : tick,
                tickUpper: maxTick,
                amount0Desired: supplyForPool,
                amount1Desired: earthAmount,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        // Mint position
        (positionId, , , ) = positionManager.mint(params);

        // Transfer position to locker
        positionManager.safeTransferFrom(
            address(this),
            address(liquidityLocker),
            positionId
        );

        // Set up rewards
        liquidityLocker.addUserRewardRecipient(
            LpLockerv2.UserRewardRecipient({
                recipient: deployer,
                lpTokenId: positionId
            })
        );
    }

    function deployToken(
        string calldata _name,
        string calldata _symbol,
        uint256 _supply,
        uint24 _fee,
        bytes32 _salt,
        uint256 _fid,
        string memory _image,
        string memory _castHash,
        PoolConfig memory _poolConfig,
        uint256 earthAmount
    ) external returns (ClankerToken token, uint256 positionId) {
        if (deprecated) revert Deprecated();
        if (!allowedPairedTokens[_poolConfig.pairedToken]) {
            revert NotAllowedPairedToken(_poolConfig.pairedToken);
        }

        // Validate tick spacing
        int24 tickSpacing = uniswapV3Factory.feeAmountTickSpacing(_fee);
        if (tickSpacing == 0 || _poolConfig.tick % tickSpacing != 0) {
            revert InvalidTickSpacing();
        }

        // Transfer EARTH tokens from deployer
        if (earthAmount > 0) {
            uint256 earthBalance = IERC20(earth).balanceOf(msg.sender);
            require(earthBalance >= earthAmount, "Insufficient EARTH balance");

            bool transferSuccess = IERC20(earth).transferFrom(
                msg.sender,
                address(this),
                earthAmount
            );
            require(transferSuccess, "EARTH transfer failed");
        }

        // Deploy token
        token = new ClankerToken{
            salt: keccak256(abi.encode(msg.sender, _salt))
        }(_name, _symbol, _supply, address(this), _fid, _image, _castHash);

        // Calculate amounts (50/50 split)
        uint256 totalSupply = _supply * 10 ** 18;
        uint256 halfSupply = totalSupply / 2;

        uint256 lpSupply = (totalSupply * 95) / 100;
        uint256 deployerSupply = totalSupply - lpSupply;

        // Send half to deployer
        bool success = token.transfer(msg.sender, deployerSupply);
        require(success, "Token transfer to deployer failed");

        // Approve position manager for pool liquidity
        token.approve(address(positionManager), lpSupply);

        // Configure pool with half of the supply and EARTH
        positionId = configurePool(
            address(token),
            earth,
            tickSpacing,
            lpSupply,
            earthAmount,
            msg.sender
        );

        emit TokensSplit(address(token), msg.sender, deployerSupply, lpSupply);

       
        // Handle initial swap with EARTH if specified
        

        if (earthAmount > 0) {
            IERC20(earth).approve(address(swapRouter), earthAmount);
            try
                ISwapRouter(swapRouter).exactInputSingle(
                    ExactInputSingleParams({
                        tokenIn: earth,
                        tokenOut: address(token),
                        fee: _fee,
                        recipient: msg.sender,
                        deadline: block.timestamp + 600,
                        amountIn: earthAmount,
                        amountOutMinimum: 0,
                        sqrtPriceLimitX96: 0
                    })
                )
            returns (uint256 amountOut) {
                emit SwapExecuted(
                    earth,
                    address(token),
                    earthAmount,
                    amountOut
                );
            } catch Error(string memory reason) {
                revert(string(abi.encodePacked("Swap failed: ", reason)));
            } catch {
                revert("Swap failed: unknown error");
            }
        }

    

        // Store deployment info
        DeploymentInfo memory deploymentInfo = DeploymentInfo({
            token: address(token),
            positionId: positionId,
            locker: address(liquidityLocker)
        });

        deploymentInfoForToken[address(token)] = deploymentInfo;
        tokensDeployedByUsers[msg.sender].push(deploymentInfo);

        emit TokenCreated(
            address(token),
            positionId,
            msg.sender,
            _fid,
            _name,
            _symbol,
            _supply,
            address(liquidityLocker),
            _castHash
        );
    }

    function setAdmin(address admin, bool isAdmin) external onlyOwner {
        if (admin == address(0)) revert InvalidConfig();
        admins[admin] = isAdmin;
        emit AdminUpdated(admin, isAdmin);
    }

    function toggleAllowedPairedToken(
        address token,
        bool allowed
    ) external onlyOwner {
        if (token == address(0)) revert InvalidConfig();
        allowedPairedTokens[token] = allowed;
        emit PairedTokenUpdated(token, allowed);
    }

    function claimRewards(address token) external {
        DeploymentInfo memory deploymentInfo = deploymentInfoForToken[token];
        if (deploymentInfo.token == address(0)) revert TokenNotFound(token);

        ILocker(deploymentInfo.locker).collectRewards(
            deploymentInfo.positionId
        );
        emit RewardsClaimed(token, deploymentInfo.positionId, msg.sender);
    }

    function setDeprecated(bool _deprecated) external onlyOwner {
        deprecated = _deprecated;
        emit DeprecatedStatusUpdated(_deprecated);
    }

    function updateLiquidityLocker(address newLocker) external onlyOwner {
        if (newLocker == address(0)) revert InvalidConfig();
        liquidityLocker = LpLockerv2(newLocker);
        emit LockerUpdated(newLocker);
    }
}


function maxUsableTick(int24 tickSpacing) pure returns (int24) {
    return (TickMath.MAX_TICK / tickSpacing) * tickSpacing;
}  

