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

export default function SearchBar() {
    const [courseData, setCourseData] = useState([]);
    const [diningHallData, setDiningHallData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/course/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].Course + ": " + data[i].Title;
                const element = {value: val, label: val};
                setCourseData(courseData => courseData.concat(element));
            }
        })

        fetch('http://localhost:5001/api/dining/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].name;
                const element = {value: val, label: val};
                setDiningHallData(diningHallData => diningHallData.concat(element));
            }
        })
        fetch('http://localhost:5001/api/user/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const element = {value: data[i].username, label: data[i].username};
                setUserData(userData => userData.concat(element))
            }
        })
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
            options= {
                [
                    {
                        label: 'Courses',
                        options: courseData 
                    },
                    {
                        label: 'Dining Halls',
                        options: diningHallData
                    },
                    {
                        label: 'Users',
                        options: userData
                    }
                ]
            }
      />        
    )
}