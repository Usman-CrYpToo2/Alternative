import React from 'react'
import { useState } from 'react'
const Login = ({contract}) => {
     const[user, setUser] = useState(null);
     const[name,setName] = useState(null);
      async function Login(){
        try{
         if(user && contract){
             const tx = await contract.login(user);
             tx.wait();
             setName(user);
             console.log(user);

         }
         else if(contract === undefined){
            window.alert("please press the connect button to connect to the wallet");
         }
         else if(user === ""){
             window.alert("please enter the userName");
         }
          
        }catch(error){
            console.log(error);
        }
      }
  return (
    <div>
     
    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">{name ? name : "Login"}</button>
    
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Enter your name</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label for="recipient-name" className="col-form-label">user name</label>
                <input type="text" className="form-control" id="recipient-name" onChange={(event) => setUser(event.currentTarget.value)}/>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={Login}  data-bs-dismiss="modal">Login</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login