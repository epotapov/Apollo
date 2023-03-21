import { React, useState} from 'react';
import { useLocation } from 'react-router-dom'

import Navbar from './Navbar';
import { useUserContext } from '../hooks/useUserContext';
import { Button, Checkbox, Form, Input, Radio, Switch } from 'antd';

export default function CoursePage() {
    let Course = '';
    let Title  = '';
    let CreditHours = '';
    let Description = '';
    let favorite = false;
    
    const [size, setSize] = useState('large');
    const data = useLocation();
    const { user } = useUserContext();
    console.log(data)
    if (data.state != null) {
        const hall = data.state.course;
        Course = hall.Course;
        Title = hall.Title;
        CreditHours = hall.CreditHours;
        Description = hall.Description;
    }
    if (user != null && user.favCourses) {
        favorite = true;
    }
    return( 
        <div id='cont'>
            <Navbar/>
            <div className='namePage'>
                <h1> {Course} </h1>
            </div>
            <div className='bodyPage'>
                <h2>Title: </h2> 
                <p>{Title}</p>
                {
                    user != null &&
                    <section>
                        <h2>Favorite Class:</h2>
                        <Switch />
                    </section>
                }
                <h2>Credit Hours:</h2>
                <p>{CreditHours}</p>
                {
                    Description.length != 0 && <div><h2>Description: </h2><p>{Description}</p></div>
                }
            </div>
        </div>
    )
}