import React from 'react';
import { useState } from 'react';
import logo from '../img/apollo-gray.png';
import { Link } from 'react-router-dom';

import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

import { Button } from 'antd';


export default function LandingPage() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    return(
        <div className='Container'>
            <div className='Corner'>
                <div className='CornerButtons'>
                    {user && (
                        <div>
                            <span>Welcome {user.username} </span>
                            <Button type="primary" onClick={() => logout()} size={size}>
                                Log Out
                            </Button>
                        </div>
                    )}
                    {!user && (
                        <Link to='/Login'>
                            <Button type="primary" size={size}>
                                Log In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
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