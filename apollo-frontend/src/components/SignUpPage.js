import React from 'react';
import { useState } from 'react';
import '../index.css';

import { Link } from 'react-router-dom'

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {

    const user = {username, email, password};
    console.log('hello');

    // TODO this URL will need to change eventually (once we have the server on another machine)
    const response = await fetch('http://localhost:5001/api/user/signup', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setUsername('');
      setEmail('');
      setPassword('');
      setError(null);
      console.log('User created', json);
    }
  }


  return(
    <div className='Container'>
    <Link to='/'>
    <button className='SignIn'>Back</button>
    </Link>

    <form id='LoginForm' onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <h3>Username</h3>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <h3>Email</h3>
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <h3>Password</h3>
      <input
        type="text"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button className='Submit'>Submit</button>
    </form>
    </div>
  );
}
