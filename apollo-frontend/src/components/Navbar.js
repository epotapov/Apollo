import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/apollo-gray.png';
import { Button, Avatar } from 'antd';
import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
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
        <div id='Navbar'>
            <Link to='/'>
                <img src={logo} alt="logo" />
            </Link>
            <SearchBar/>
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
    )
}