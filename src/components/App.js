import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'
import preview from '../preview.png'
import '../css/custom.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Data from './Data';
import Mint from './Mint';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [nft, setNFT] = useState(null);
  const [account, setAccount] = useState(null)
  const [revealTime, setRevealTime] = useState(0)
  const [latestNft, setLatestNFT] = useState(null);
  const [tokenIds, setTokenIds] = useState(null);

  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [cost, setCost] = useState(0);
  const [balance, setBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // setProvider(provider);
    // console.log('Provider:', await provider.getNetwork())

    // const chainId = (await provider.getNetwork()).chainId;

    // const nft = new ethers.Contract(config[chainId].nft.address, NFT_ABI, provider);
    // setNFT(nft);

    // // Fetch accounts
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // const account = ethers.utils.getAddress(accounts[0])
    // setAccount(account)

    // // fetch countdown
    // const allowMintingOn = await nft.allowMintingOn();
    // setRevealTime(allowMintingOn.toString() + '000');

    // const maxSuply = await nft.maxSupply();
    // setMaxSupply(maxSuply)
    // const totalSupply = await nft.totalSupply();
    // setTotalSupply(totalSupply)
    // const cost = await nft.cost();
    // setCost(cost)
    // const balance = await nft.balanceOf(account);
    // setBalance(balance)
    // console.log('Balance:', balance)

    // let tokenIds = await nft.walletOfOwner(account);
    // console.log('Token IDs:', tokenIds)
    // setTokenIds(tokenIds)
    // const latestNft = tokenIds.length - 1;
    // setLatestNFT(latestNft)
    // console.log('This is the latest nft:', latestNft)

    // setIsLoading(false)
    try {
      // Initiate provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider);
      
      const network = await provider.getNetwork()
      console.log('Provider Network:', network)
      const chainId = network.chainId;
  
      // Initialize contract
      const nft = new ethers.Contract(config[chainId].nft.address, NFT_ABI, provider);
      console.log('NFT Contract Address:', config[chainId].nft.address);
      setNFT(nft);
  
      // Fetch accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
  
      try {
        // Essential calls
        const maxSuply = await nft.maxSupply();
        setMaxSupply(maxSuply)
        const totalSupply = await nft.totalSupply();
        setTotalSupply(totalSupply)
        const cost = await nft.cost();
        setCost(cost)
        const balance = await nft.balanceOf(account);
        setBalance(balance)
        console.log('Balance:', balance)
        
        // Only try to fetch token IDs if balance > 0
        if (balance > 0) {
          try {
            let tokenIds = await nft.walletOfOwner(account);
            setTokenIds(tokenIds)
            const latestNft = tokenIds.length - 1;
            setLatestNFT(latestNft)
          } catch (error) {
            console.warn('Failed to fetch wallet tokens:', error)
            setTokenIds([])
            setLatestNFT(null)
          }
        }
  
        try {
          const allowMintingOn = await nft.allowMintingOn();
          setRevealTime(allowMintingOn.toString() + '000');
        } catch (error) {
          console.warn('Failed to fetch minting time:', error)
          setRevealTime(0)
        }
      } catch (error) {
        console.error('Contract interaction failed:', error)
      }
  
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load blockchain data:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return (
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>CC3 Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              {balance > 0 ? (
                <div className='text-center'>
                  <img src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${tokenIds[latestNft]}.png`} alt='Open Punk' width="400px" height="400px" />
                </div>
              ) : (
                <img src={preview} alt="" />
              )}
            </Col>
            <Col>
              <div className='my-4 text-center'>
                <Countdown date={parseInt(revealTime)} className='h2' />
              </div>
              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance} />
              <Mint provider={provider} nft={nft} cost={cost} setIsLoading={setIsLoading}/>  
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
