import React from 'react';
import { useState } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';


/*const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
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
});*/

const renderTitle = (title) => (
    <span>
      {title}
      <a
        style={{
          float: 'right',
        }}
        href="https://www.google.com/search?q=antd"
      >
        more
      </a>
    </span>
  );

const renderItem = (title, count) => ({
    value: title,
    label: (
        <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}
        >
        {title}
        <span>
            <UserOutlined /> {count}
        </span>
        </div>
    ),
});

const options = [
    {
        label: renderTitle('Courses'),
        options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
    },
    {
        label: renderTitle('Dining Courts'),
        options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
    },
    {
        label: renderTitle('Users'),
        options: [renderItem('AntDesign design language', 100000)],
    },
];

export default function SearchBar() {
    const [options, setOptions] = useState([]);
    const [size, setSize] = useState('large');
    /*const handleSearch = (value) => {
        setOptions(value ? searchResult(value) : []);
    };
    const onSelect = (value) => {
        console.log('onSelect', value);
    };*/
    /*return (
        <AutoComplete
            dropdownMatchSelectWidth={252}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            >
            <Input.Search size="large" placeholder="input here" enterButton />
        </AutoComplete>
    )*/
    return(
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            options={options}
        >
            <Input.Search size="large" placeholder="input here" />
        </AutoComplete>
    )
}