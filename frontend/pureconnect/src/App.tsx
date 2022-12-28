import React, {useEffect} from 'react';
import './App.css';
import {authGoogle, login} from './fetch/FetchData'

function App() {
  const clientId = "101792196480-mfjdod0mrjbgpambjn5psnpj5q88jhf7.apps.googleusercontent.com"

  async function handleCallbackResponse(response : google.accounts.id.CredentialResponse){
    console.log("Encoded JWT ID token: ", response.credential);
    const res = await authGoogle(response.credential);
    console.log(res)
  }
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("signInDiv")!,
        {theme: "outline", size: "large", type: "icon"}
    );
  },[])

  const loginUserTest = async () => {
    const res = await login({email: "user4@exgample.com", password: "stringst"});
  }

  return (
    <div>
      <div id="signInDiv"></div>
      <button onClick={loginUserTest}>Aboba</button>
    </div>
  );
}

export default App;
