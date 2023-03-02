import { React, useState} from 'react';
import { useLocation } from 'react-router-dom'

import Navbar from './Navbar';
import { Button, Checkbox, Form, Input, Radio } from 'antd';

export default function CoursePage() {
    let Course = '';
    let Title  = '';
    let CreditHours = '';
    let Description = '';
    
    const [size, setSize] = useState('large');
    const data = useLocation();
    console.log(data)
    if (data != null) {
        const hall = data.state.course;
        Course = hall.Course;
        Title = hall.Title;
        CreditHours = hall.CreditHours;
        Description = hall.Description;
    }
    return( 
        <div id='cont'>
            <Navbar/>
            <div id='name'>
                <h1 > {Course} </h1>
            </div>
            <div id='menu'>
                <h2>Title: </h2> 
                {Title}
                <h2>Credit Hours:</h2>
                {CreditHours}
                {
                    Description.length != 0 && <div><h2>Description: </h2><p>{Description}</p></div>
                }
            </div>
        </div>
    )
}