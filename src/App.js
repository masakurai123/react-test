// src/App.js
import React, { useState } from "react";
import { auth } from "./firebase";
import {
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import ClientList from "./components/ClientList";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // const handleSignup = async () => {
  //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //   setUser(userCredential.user);
  // };

  const handleLogin = async () => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
          <h2>ログイン画面</h2>
          <div>
            <input
              style={{ fontSize:"20px", marginBottom:"5px" , padding: "5px", fontFamily: "Arial" }}
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              style={{ fontSize:"20px", marginBottom:"5px" , padding: "5px", fontFamily: "Arial" }}
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleLogin} style={{ fontSize:"20px", fontFamily: "Arial" }}>ログイン</button>
          </div>
          {/* <button onClick={handleSignup}>サインアップ</button> */}
        </div>
      ) : (
        <div>
          <ClientList />
          <button onClick={handleLogout} style={{ margin: "20px", fontSize:"20px", fontFamily: "Arial" }}>ログアウト</button>
        </div>
      )}
    </div>
  );
}

export default App;