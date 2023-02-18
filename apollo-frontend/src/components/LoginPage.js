import React from 'react';
import '../index.css';

import { Link } from 'react-router-dom'

export default function LoginPage() {
    return(
        <div className='Container'>
            <Link to='/'>
                <button className='SignIn'>Back</button>
            </Link>
            <form id='LoginForm' action="">
                <h2>Login</h2>
                <h3>Username</h3>
                <input type="text" placeholder="Username" />
                <h3>Email</h3>
                <input type="text" placeholder="Email" />
                <h3>Password</h3>
                <input type="text" placeholder="Password" />
                <button className='Submit'>Submit</button>
            </form>
        </div>
    );
}