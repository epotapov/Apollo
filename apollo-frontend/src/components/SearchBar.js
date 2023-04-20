import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../App.css'

import { Select, message } from 'antd';
import ProfilePage from './ProfilePage';


const onSearch = (value) => {
};

export default function SearchBar() {
    const [courseData, setCourseData] = useState([]);
    const [diningHallData, setDiningHallData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [groupData, setGroupData] = useState([]);
    
    const map = [{value: "Map", label: "Map", group: 'Map'}];
    const navigate = useNavigate();
    
    const onChange = (val) => {
        if (val === map[0].value) {
            let path = '/Map';
            navigate(path)
            return;
        }
        for (let i = 0; i < courseData.length; i++) {
            if (courseData[i].value === val) {
                let path = '/Course/' + val.substring(0, val.indexOf(":"));
                navigate(path)
                return;
            }
        }
        for (let i = 0; i < diningHallData.length; i++) {
            if (diningHallData[i].value === val) {
                fetch('http://localhost:5001/api/dining/get/' + val)
                .then(response => response.json())
                .then(data => navigate('/DiningHall',{state: {dining: data}}))
                .catch(error => {
                    message.error('Connection Error');
                });
                return;
            }
        }
        for (let i = 0; i < userData.length; i++) {
            if (userData[i].value === val) {
                let path = '/Profile/' + val;
                navigate(path)
                return;
            }
        }
        for (let i = 0; i < groupData.length; i++) {
            if (groupData[i].value === val) {
                let path = '/Group/' + val;
                navigate(path)
                return;
            }
        }
    };
      

    useEffect(() => {
        fetch('http://localhost:5001/api/course/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].Course + ": " + data[i].Title;
                const element = {value: val, label: val, group: 'Courses'};
                setCourseData(courseData => courseData.concat(element));
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });

        fetch('http://localhost:5001/api/dining/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].name;
                const element = {value: val, label: val, group: 'Dining Halls'};
                setDiningHallData(diningHallData => diningHallData.concat(element));
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });
        fetch('http://localhost:5001/api/user/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].username;
                const element = {value: data[i].username, label: data[i].username, group: 'Users'};
                setUserData(userData => userData.concat(element))
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });
        fetch('http://localhost:5001/api/group/')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let id = data[i]._id;
                let title = data[i].title;
                const element = {value: id, label: title, group: 'Groups'};
                setGroupData(groupData => groupData.concat(element))
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });
    }, []);

    const [size, setSize] = useState('large');
    return(
        <Select
            showSearch
            placeholder="Search for a course, dining hall, group, or user"
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
                    },
                    {
                        label: 'Map',
                        options: map
                    },
                    {
                        label: 'Groups',
                        options: groupData
                    },
                ]
            }
      />        
    )
}