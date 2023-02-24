import React from 'react';
import { useState } from 'react';
import '../index.css';
import logo from '../img/apollo-gray.png';
import { Link } from 'react-router-dom';

import { generate, presetPalettes } from '@ant-design/colors';
import { AutoComplete, Input, Button } from 'antd';


const colors = generate('#353744');

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
const searchResult = (query) =>
new Array(getRandomInt(5))
.join('.')
.split('.')
.map((_, idx) => {
    const category = `${query}${idx}`;
    return {
        value: category,
        label: (
            <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
            >
            <span>
                Found {query} on{' '}
                <a
                href={"/"}
                target="_blank"
                rel="noopener noreferrer"
                >
                {category}
                </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
            </div>
        ),
    };
});

export default function LandingPage() {
    const [options, setOptions] = useState([]);
    const [size, setSize] = useState('large');
    const handleSearch = (value) => {
        setOptions(value ? searchResult(value) : []);
    };
    const onSelect = (value) => {
        console.log('onSelect', value);
    };
    return(
        <div className='Container'>
            <Link to='/Login'>
                <Button type="primary" className="SignIn" size={size}>
                    Sign In
                </Button>
            </Link>
            <section className='Search'>
                <div id='LogoHolderLanding'>
                    <img src={logo} alt="logo" />
                    <h1>Apollo</h1>
                </div>
                <section id="SearchLandingHolder">
                    <AutoComplete
                        dropdownMatchSelectWidth={252}
                        options={options}
                        onSelect={onSelect}
                        onSearch={handleSearch}
                        >
                        <Input.Search size="large" placeholder="input here" enterButton />
                    </AutoComplete>
                </section>
            </section>
        </div>
    );
}