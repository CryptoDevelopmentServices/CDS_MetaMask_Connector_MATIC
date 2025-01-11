const provider = window.ethereum;
const PolygonChainId = '0x89';
const tokenAddress = '0xF7B5991c676929BF98BF3E2e2e386789BB16912a';
const tokenSymbol = 'CDS';
const tokenDecimals = 8;
const tokenImage = 'https://i.imgur.com/ZXf2SKw.png';

/** Connect to Crypto Development Services and the Polygon mainnet network */
const setupPolygonChain = async () => {
  const errorModalContainer = document.querySelector('.error-modal-container');
  const errorMessage = document.querySelector('.error-message');

  if (provider) {
    try {
      await provider.request({ method: 'eth_requestAccounts' });
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: PolygonChainId,
            chainName: 'Polygon (Mainnet)',
            nativeCurrency: {
              name: 'Polygon (MATIC)',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: ['https://polygon-rpc.com/'], // Public RPC or Infura
            blockExplorerUrls: ['https://polygonscan.com/'],
          },
        ],
      });
      const wasAdded = await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
      if (!wasAdded) {
        console.log('Token addition rejected by the user.');
      }
    } catch (e) {
      if (e.code !== 4001) {
        errorModalContainer.style.display = 'block';
        errorMessage.innerHTML = e.message;
      }
    }
  } else {
    errorModalContainer.style.display = 'block';
    errorMessage.innerHTML = `It looks like MetaMask hasn't been installed. Please <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">install MetaMask</a> and try again.`;
  }
};

/** Add event listener to the Connect MetaMask button */
const connectMetaMask = document.querySelector('.connectMetaMask');

if (connectMetaMask) {
  connectMetaMask.addEventListener('click', setupPolygonChain);
}

/** Display "Connected" button text if already connected */
const displayConnectedButton = async () => {
  const accounts = await provider.request({ method: 'eth_accounts' });
  if (accounts.length > 0) {
    const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
    connectMetaMask.innerHTML = `Connected: ${shortenedAccount}`;
    connectMetaMask.classList.add('disabled-button');
    connectMetaMask.removeEventListener('click', setupPolygonChain);
  }
};

const isConnectedToPolygonChain = async () => {
  const chainId = await provider.request({ method: 'eth_chainId' });
  if (chainId === PolygonChainId) {
    displayConnectedButton();
  }
};

if (provider) {
  isConnectedToPolygonChain();

  provider.on('chainChanged', () => {
    window.location.reload();
  });

  provider.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      displayConnectedButton();
    } else {
      window.location.reload();
    }
  });
}
