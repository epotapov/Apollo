import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/apollo-gray.png';
import darklogo from '../img/apollo-orange.png';
import { Button, Avatar } from 'antd';
import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../hooks/useThemeContext';
import bluepfp from '../img/bluepfp.png';
import redpfp from '../img/redpfp.png';
import greenpfp from '../img/greenpfp.png';
import yellowpfp from '../img/yellowpfp.png';
import defpfp from '../img/defaultpfp.png';

export default function Navbar() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    const navigate = useNavigate(); 
    const { theme } = useThemeContext();
    
    function getpfp() {
        if (user) {
            let pfpColor = user.user.profilePicture;
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
        <div id='Navbar'>
            <Link to='/'>
                {theme === "light" && <img src={logo} alt="logo" />}
                {theme === "dark" && <img src={darklogo} alt="logo" />}
            </Link>
            <SearchBar/>
            <div className='CornerButtons'>
                {user && (
                    <div>
                        <span className='WelcomeTag'>Welcome {user.username} </span>
                        <Avatar onClick={goToProfile} size={40} className="avatar" shape="circle" src={pfp} />
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
    )
}