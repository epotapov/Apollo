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
import defpfp from '../img/defaultpfp.png';

const picServer = "http://localhost:5001/pictures/"

export default function Navbar() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    const navigate = useNavigate(); 
    const { theme } = useThemeContext();
    const [profilePic, setProfilePic] = useState("");
    
    function getpfp() {
        if (user) {
            if (profilePic === 'default' || profilePic === "" || profilePic === null) {
                return defpfp;
            }
            else {
                return picServer + profilePic;
            }
        }
    }

    useEffect(() => {
        if (user) {
            fetch('http://localhost:5001/api/user/get-image/' + user.username)
            .then(response => response.json())
            .then(data => {
                setProfilePic(data);
            })  
        } 
    }, [user])

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
                        <Avatar onClick={goToProfile} size={35} className="avatar" shape="circle" src={pfp} />
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