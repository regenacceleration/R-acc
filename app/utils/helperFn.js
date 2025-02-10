import env from "../constants/env"

export const urlGeneration = (path) => `${env.supabaseUrl}/storage/v1/object/public/${path}`

export const getAddress = () => localStorage.getItem("address");

export const formatAddress = (address) => `${address.slice(0, 6)}....${address.slice(address.length - 6, address.length)}`


const addNetwork = async (obj) => {
    try {
        if (window?.ethereum !== undefined) {
            const provider = window.ethereum;
            await provider.request({
                method: "wallet_addEthereumChain",
                params: [obj],
            });

            // connectWallet();
            return true;
        }
    } catch (error) {
        console.log(error);
    }
};

const switchNetwork = async (obj) => {
    try {
        const provider = window.ethereum;
        const response = await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: obj.chainId }],
        });
        return true;
    } catch (error) {
        if (error.code === 4902) {
            return addNetwork(obj);
        }
        console.log(error);
    }
};

const checkNetwork = async (obj) => {
    try {
        if (typeof window.ethereum !== "undefined") {
            const provider = window.ethereum;
            let chainId = await provider.chainId;

            if (chainId === obj.chainId) {
                return true;
            }
            return switchNetwork(obj);
        }
    } catch (error) {
        console.log(error);
    }
};



export const VerifyNetwork = async (obj) => {
    try {
        const getNetworkResult = await checkNetwork(obj);
        if (!getNetworkResult) {
            return;
        }
        // connectWallet();
        return getNetworkResult;
    } catch (error) {
        console.error(error);
    }
};