import React from 'react';
import { useState } from 'react';
import '../App.css'

import { Select } from 'antd';

const onChange = (value) => {
    console.log(`selected ${value}`);
};
  
const onSearch = (value) => {
    console.log('search:', value);
};

export default function SearchBar() {
    const [size, setSize] = useState('large');
    return(
        <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            size="large"
            style={{ width: 500 }}
            dropdownMatchSelectWidth={500}
            defaultOpen={false}
            filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
            {
                value: 'CS 18000',
                label: 'CS 18000',
            },
            {
                value: 'CS 18001',
                label: 'CS 18001',
            },
            {
                value: 'CS 20000',
                label: 'CS 20000',
            },
            {   
                value: 'CS 25000',
                label: 'CS 25000',
            },
            {
                value: 'CS 25100',
                label: 'CS 25100',
            },
            {
                value: 'Tom',
                label: 'Tom',
            },
            {
                value: 'Jerry',
                label: 'Jerry',
            },
            {
                value: 'Mickey',
                label: 'Mickey',
            },
            {
                value: 'Minnie',
                label: 'Minnie',
            },
            {
                value: 'Windsor Dining Hall',
                label: 'Windsor Dining Hall',
            },
            {
                value: 'Roosevelt Dining Hall',
                label: 'Roosevelt Dining Hall',
            },
            {
                value: 'Ferris Dining Hall',
                label: 'Ferris Dining Hall',
            }
            ]}
      />        
    )
}