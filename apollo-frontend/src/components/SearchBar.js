import React from 'react';
import { useState } from 'react';
import '../App.css'

import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';


const renderTitle = (title) => (
    <span>
      {title}
      <a
        style={{
          float: 'right',
        }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
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
    }
];

export default function SearchBar() {
    const [options, setOptions] = useState([]);
    const [size, setSize] = useState('large');
    return(
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            options={options}
        >
            <Input.Search size="large"/>
        </AutoComplete>
    )
}