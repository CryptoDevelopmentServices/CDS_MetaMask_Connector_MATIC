var tipButton = document.querySelector('.tip-button')
tipButton.addEventListener('click', async function() {
  if (typeof ethereum === 'undefined') {
    return renderMessage('You need to install MetaMask to use this feature.  https://metamask.io')
  }

  const accounts = await ethereum.request({method:'eth_requestAccounts'})
  var user_address = accounts[0]

  try {
    const transactionHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          'to': '0xc0B254f1e80517Ea4D298a88AB9371dEec62792C',
          'from': user_address,
          'value': '0xB1A2BC2EC50000',
        },
      ],
    })
    // Handle the result
    console.log(transactionHash)
  } catch (error) {
    console.error(error)
  }
})
function renderMessage (message) {}
