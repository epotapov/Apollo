import React, { useEffect } from 'react';
import { useState } from 'react';
import '../App.css'

import { Select } from 'antd';

const onChange = (value) => {
    console.log(`selected ${value}`);
};
  
const onSearch = (value) => {
    console.log('search:', value);
};

const options= [ 'CS150', 'CS240', 'CS320']

export default function SearchBar() {
    const [courseData, setCourseData] = useState([]);
    const [diningHallData, setDiningHallData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/course/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let temp = data[i].Course + ": " + data[i].Title;
                setCourseData(courseData => courseData.concat({value: temp, label: temp}));
                //courseTemp.push({value: data[i].Course})
            }
        })

        fetch('http://localhost:5001/api/dining/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                setDiningHallData(diningHallData.concat({value: data[i].name}))
            }
        })
        console.log("Dining ")
        console.log(courseData)
        console.log("Course")
        console.log(diningHallData)
    }, []);

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
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={courseData}
      />        
    )
}