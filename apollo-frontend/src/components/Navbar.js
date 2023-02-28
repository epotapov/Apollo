import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/apollo-gray.png';

import { Button } from 'antd';
import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

export default function Navbar() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
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