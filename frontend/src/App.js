import React from 'react'
import arti from "./Contract/contracts/message.sol/chai.json";
import { ethers } from 'ethers';
import { useState,useEffect } from 'react';
import Send from './Send';
import Calldata from './Calldata';
import Login from './Login';

const App = () => {
      const [data, setData] = useState({
        provider : null,
        contract : null,
        signer : null,
        currentAccount : null,
      })
      const [name, _setName] = useState(null);
      async function metaConnect(){
       if(window.ethereum){
      try{
        const curr = await window.ethereum.request({method : 'eth_requestAccounts'});
         const pro = new ethers.providers.Web3Provider(window.ethereum);
         const sign = pro.getSigner();
         const con = new ethers.Contract("0xB3562D85B52dA58008b09d050BC45A0fEe79534d", arti.abi, sign);
       const _name =await con.yourName(curr[0]);
        _setName(_name);
         setData({
          provider : pro,
          contract : con,
          signer : sign,
          currentAccount :curr,
        })
        
        console.log(curr[0]);
        }catch(error){
            console.log(error);
            window.location.reload();
        }
      }
      else{
         window.alert("install metamask!!");
      }
    }
    
    useEffect(()=>{
      if(window.ethereum){
         window.ethereum.on('accountsChanged',async function(){
            metaConnect();
        })
      }
    },[])

    useEffect(() => {
      if(window.ethereum){
      window.ethereum.on('chainChanged', () =>{
        window.location.reload();
      })
    }
   },[])
       
  return (
    <div>
       <div>
       <header className="p-3 text-bg-dark">
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a  className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
        </a>

        <a  className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img className="bi me-2" width="40" height="32" alt="Alternative logo" src='https://s2.coinmarketcap.com/static/img/coins/200x200/21916.png'></img>
        <span className="fs-4 text-primary">Alternative</span>
      </a>

        <div className="text-end">
          <button type="button" className="btn btn-outline-light me-2 p-0">{name ? name : <Login contract={data.contract}/>}</button>
        
        
          <button type="button" className="btn btn-warning"onClick={metaConnect}>{data.currentAccount ? data.currentAccount : "connect"}</button>
        </div>
      </div>
    </div>
  </header>
       </div>
       <Send contract={data.contract}/>
       <Calldata contract={data.contract}/>
    </div>
  )
}

export default App