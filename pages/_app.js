import { useState } from "react";
import Link from "next/link";
import { css } from "@emotion/css";
import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AccountContext } from '../context';
import { ownerAddress} from '../config';
import 'easymde/dist/easymde.min.css';
import '../styles/globals.css';
import { walletconnect } from "web3modal/dist/providers/connectors";

function App ({ Component, pageProps }) {
  const [account, setAccount] = useState(null)

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: `${env.WEB3BLOG_INFURA}`
          },
        },
      },
    })
    return web3Modal
  }

  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (error) {
      console.log('error: ', err)
    }
  }

  return(
    <div>
      <nav className={nav}>
        <div className={header}>
          <Link href="/">
            <a>
              <img
                src="'/logo.svg"
                alt="React Logo"
                style={{ width: '50px'}}
              />
            </a>
          </Link>
          <Link href="/">
            <a>
              <div className={titleContainer}>
                <h2 className={title}>WEB3 BLOG</h2>
                <p className={description}>vagdonic</p>
              </div>
            </a>
          </Link>
          {
            !account && (
              <div className={buttonContainer}>
                <button className={connectBtn} onClick={connect}>Login</button>
              </div>
            )
          }
          {
            account & <p className={accountInfo}>{account}</p>
          }
        </div>
      <div className={linkContainer}>
        <Link href="/">
          <a className={link}>
            Home
          </a>
        </Link>
        {
          (account == ownerAddress) && (
            <Link href="/">
              <a className={link}>
                Create Post
              </a>
            </Link>
          )
        }
      </div>
    </nav>
    <div className={container}>
      <AccountContext.Provider value={account}>
        <Component {...pageProps} connect={connect} />
      </AccountContext.Provider>
    </div>
    </div>
  )
}