import React from 'react';
import { useState } from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

import { AutoComplete, Input, Button } from 'antd';


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
                href={"/Course"}
                >
                {category}
                </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
            </div>
        ),
    };
});

export const SearchBar = () => {
    const [options, setOptions] = useState([]);
    const [size, setSize] = useState('large');
    const handleSearch = (value) => {
        setOptions(value ? searchResult(value) : []);
    };
    const onSelect = (value) => {
        console.log('onSelect', value);
    };
    return (
        <AutoComplete
            dropdownMatchSelectWidth={252}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            >
            <Input.Search size="large" placeholder="input here" enterButton />
        </AutoComplete>
    )
}