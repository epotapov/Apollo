import React from 'react';
import { useState } from 'react';
import logo from '../img/apollo-gray.png';
import { Link } from 'react-router-dom';

import SearchBar from './SearchBar';

import { Button } from 'antd';


export default function LandingPage() {
    const [size, setSize] = useState('large');
    return(
        <div className='Container'>
            <Link to='/Login'>
                <Button type="primary" className="SignIn" size={size}>
                    Log In
                </Button>
            </Link>
            <section className='Search'>
                <div id='LogoHolderLanding'>
                    <img src={logo} alt="logo" />
                    <h1>Apollo</h1>
                </div>
                <section id="SearchLandingHolder">
                    <SearchBar/>
                </section>
            </section>
        </div>
    );
}