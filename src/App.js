// src/App.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // const signUp = async () => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     setUser(userCredential.user);
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>顧客検索</h1>
          <p>ログイン中: {user.email}</p>
          <button onClick={logout}>ログアウト</button>
        </div>
      ) : (
        <div>
          <h1>ログイン画面</h1>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br/>
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* <button onClick={signUp}>新規登録</button> */}
          <button onClick={login}>ログイン</button>
        </div>
      )}
    </div>
  );
}

export default App;