import React, { useState } from 'react'
import { ethers } from 'ethers'
const Send = ({contract}) => {
  const[msg, setMsg] = useState({
    name : null,
    message : null,
    value : "0"
  })
  const [error, setError] = useState(null);
  async function Send(event){
    event.preventDefault();
    if(contract){
      try{
        const val = {value : ethers.utils.parseEther(msg.value)};
        await contract.send(msg.name, msg.message,val);
        console.log(msg);
      }catch(error){
         console.log(error);
         setError("an error occurred")
       
      }
    }
    else{
        window.alert("please connect metamask and then login Please !!");
        window.location.reload();
    }
     }

     function resetError(){
       setError(null);
     }   
    return (
      <div>
    { error ?
      (
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" class="btn-close" data-bs-dismiss="alert" onClick={resetError} aria-label="Close"></button>
        </div>) : "" }

   <div className='container'>
     <form class="row g-3 needs-validation m-4" onSubmit={Send}j novalidate>
  <div class="col-md-4">
    <label for="validationCustom01" class="form-label">Full name</label>
    <input type="text" class="form-control" id="validationCustom01" onChange={(event) => setMsg(prev => ({...prev, name : event.target.value }))} required/>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
 
  <div class="col-md-4">
    <label for="validationCustom02" class="form-label">value</label>
    <input type="text" class="form-control" value={msg.value} onChange={(event) => setMsg(prev => ({...prev, value : event.target.value}))} required/>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
 
  <div class="mb-3">
    <label for="validationTextarea" class="form-label">message</label>
    <textarea class="form-control" id="validationTextarea" placeholder="please enter a message" onChange={(event) => setMsg(prev => ({...prev, message : event.target.value}))} required></textarea>
    <div class="invalid-feedback">
      Please enter a message.
    </div>
  </div>
  <div class="col-12">
    <button class="btn btn-primary" type="submit">Send Message</button>
  </div>
</form>

   </div>
   </div>
 
  )
}

export default Send