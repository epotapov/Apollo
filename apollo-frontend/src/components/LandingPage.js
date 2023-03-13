import React from 'react';
import { useState, useEffect } from 'react';
import logo from '../img/apollo-gray.png';
import { Link, useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useTheme } from '../hooks/useTheme';
import { useThemeContext } from '../hooks/useThemeContext';

import { Button, Avatar, Switch, theme } from 'antd';
import bluepfp from '../img/bluepfp.png';
import redpfp from '../img/redpfp.png';
import greenpfp from '../img/greenpfp.png';
import yellowpfp from '../img/yellowpfp.png';
import defpfp from '../img/defaultpfp.png';

export default function LandingPage() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    const { theme } = useThemeContext();
    const { changeTheme } = useTheme();
    const [ darkButton, setDarkButton ] = useState(false);
    const navigate = useNavigate();
    let buttonEnable = false;

    function getpfp() {
        if (user) {
            let pfpColor = user.user.profilePicture;
            console.log("asd" + pfpColor);
            if (pfpColor == 'blue') {
                return bluepfp;
            }
            else if (pfpColor == 'red') {
                return redpfp;
            }
            else if (pfpColor == 'green') {
                return greenpfp;
            }
            else if (pfpColor == 'yellow') {
                return yellowpfp;
            }
            else {
                return defpfp;
            }
        }
    }

    const pfp = getpfp();

    const goToProfile = () => {
		fetch('http://localhost:5001/api/user/get/' + user.username)
		.then(response => response.json())
		.then(data => navigate('/Profile',{state: {user: data}}))
    }
    return(
        <div className='Container'>
            <div className='Corner'>
                <div className='CornerButtons'>
                    {  // I need to fix this, this is atrocious
                        theme && theme === "dark"
                        && <Switch defaultChecked={true} onChange={() => changeTheme()} />
                    }
                    {
                        theme && theme === "light"
                        && <Switch defaultChecked={false} onChange={() => changeTheme()} />
                    }
                    {user && (
                        <div>
                            <span>Welcome {user.username} </span>
                            <Avatar onClick={goToProfile} size={40} shape="circle" src={pfp} />
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