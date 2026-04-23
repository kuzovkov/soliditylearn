import React, {useState, useEffect} from "react";
import Web3 from 'web3';
import Proger from './Proger';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum){
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3);
      } else if (window.web3){
          setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.log('Браузер не поддерживает систему');
      }
    }

    async function loadBlockchainData(){
      const accounts = await web3.eth.getAccounts();
      console.log('accounts: ', accounts);
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      console.log('networkId:', networkId);
      const networkData = Proger.networks[networkId];
      if (networkData){
        const token = new web3.eth.Contract(Proger.abi, networkData.address);
        let balance = await token.methods.balanceOf(accounts[0]).call();
        setBalance(balance.toString());
      } else {
        window.alert('Токен не задеплоен или нет поддержки');
      }
    }

    if (web3){
      loadBlockchainData();
    } else {
      loadWeb3();
    }
  }, [web3]);

  const transferTokens = async (recipient, amount) => {
      const networkId = await web3.eth.net.getId();
      const networkData = Proger.networks[networkId];
      if (networkData){
        const token = new web3.eth.Contract(Proger.abi, networkData.address);
        await token.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).send({from: account});
        let balance = await token.methods.balanceOf(account).call();
        setBalance(balance.toString());
      } else {
        window.alert('Токен не задеплоен или нет поддержки');
      }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Proger App</h1>
        <p>Ваш аккаунт: {account}</p>
        <p>Ваш баланс: {balance}</p> 
        <h2>Transfer tokens:</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          transferTokens(recipient, amount);
        }}>
          <div>
            <div>
            <label>
              Recipient:
              <input size="100" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Amount:
              <input size="20" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
          </div>
          <button type="submit">Отправить</button>
          </div>
          
        </form>

      </header>
    </div>
  );
}

export default App;
