import { BrowserProvider } from 'ethers';

const POLYGON_CHAIN_ID = '0x89';
const POLYGON_PARAMS = {
  chainId: POLYGON_CHAIN_ID,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

export const checkMetaMask = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const connectWallet = async (): Promise<string> => {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(137)) {
      await switchToPolygon();
    }

    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

export const switchToPolygon = async (): Promise<void> => {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_CHAIN_ID }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_PARAMS],
        });
      } catch (addError) {
        throw new Error('Failed to add Polygon network');
      }
    } else {
      throw new Error('Failed to switch to Polygon network');
    }
  }
};

export const getConnectedWallet = async (): Promise<string | null> => {
  if (!checkMetaMask()) {
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_accounts', []);
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    return null;
  }
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
