import React from 'react';
import '../index.css';
import logo from '../img/apollo-gray.png';

import { Link } from 'react-router-dom';

export default function LandingPage() {
    return(
        <div className='Container'>
            <Link to='/SignIn'>
                <button className='SignIn'>Sign In</button>
            </Link>
            <section className='Search'>
                <div id='LogoHolderLanding'>
                    <img src={logo} alt="logo" />
                    <h1>Apollo</h1>
                </div>
                <section id="InputHolder">
                    <input 
                        type="text" 
                        placeholder="search" 
                        />
                </section>
            </section>
        </div>
    );
}