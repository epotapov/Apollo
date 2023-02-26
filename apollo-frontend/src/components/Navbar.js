import { React, useState} from 'react';
import { Link } from 'react-router-dom'
import logo from '../img/apollo-gray.png';

import { Button } from 'antd';
import SearchBar from './SearchBar';

export default function Navbar() {
    const [size, setSize] = useState('large');
    return(
        <div id='Navbar'>
            <img src={logo} alt="logo" />
            <SearchBar/>
            <Link to='/Login'>
                <Button type="primary" size={size}>
                    Log In
                </Button>
            </Link>
        </div>
    )
}