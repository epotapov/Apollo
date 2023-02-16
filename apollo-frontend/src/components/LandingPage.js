import React from 'react';
import '../index.css';
import logo from '../img/apollo-gray.png';

export default function LandingPage() {
    return(
        <div className='Container'>
            <button className='SignIn'>Sign In</button>
            <section className='Search'>
                <img src={logo} alt="logo" />
                <h1>Apollo</h1>
                <input type="text" />
            </section>
        </div>
    );
}