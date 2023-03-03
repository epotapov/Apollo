import React from 'react';
import { useState } from 'react';
import logo from '../img/apollo-gray.png';
import { Link, useNavigate} from 'react-router-dom';

import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

import { Button, Avatar} from 'antd';

export default function LandingPage() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    const navigate = useNavigate();

    const goToProfile = () => {
		fetch('http://localhost:5001/api/user/get/' + user.username)
		.then(response => response.json())
		.then(data => navigate('/Profile',{state: {user: data}}))
    }

    return(
        <div className='Container'>
            <div className='Corner'>
                <div className='CornerButtons'>
                    {user && (
                        <div>
                            <span>Welcome {user.username} </span>
                            <Avatar onClick={goToProfile} size={50} shape="circle" src="../img/apollo-gray.png" />
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