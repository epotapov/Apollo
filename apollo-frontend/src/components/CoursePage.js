import { React, useState, useEffect } from 'react';
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
    let favCourses = [];
    
    const [size, setSize] = useState('large');
    const data = useLocation();
    const { user } = useUserContext();
    let username = '';
    if (user) 
        username = user.username;
    console.log(data)
    console.log("username: ", username)

    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-favCourses/' + username)
        .then(response => response.json())
        .then(data => {
            favCourses = data;
            console.log("favorite courses: ", favCourses)
        })
    }, [Course]);

    const checkClass = () => {
        console.log("hello")
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === Course)
                return true;
        }
        return false;
    }

    const favClass = async () => {
        console.log("run favClass")
        let found = false;
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === Course) {
                favCourses.splice(i, 1);
                found = true;
            }
        }
        if (!found) {
            favCourses.push(Course)
        }
        const newFavCourse = {username, favCourses};
        const response = await fetch('http://localhost:5001/api/user/add-favCourse', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, favCourses})
        });
        
        const json = await response.json();

        if (!response.ok) {
            console.log("successful switch for user")
        }
        else {
            console.log("not successful switch for user course")
        }
    }


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
                        <Switch checked={checkClass()} onChange={() => favClass()}/>
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