import { React, useState} from 'react';
import '../index.css';
import { Link } from 'react-router-dom'
import logo from '../img/apollo-gray.png';

import { AutoComplete, Button } from 'antd';
import { SearchBar } from './SearchBar';

export const Navbar = () => {
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