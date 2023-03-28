import { React, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Forum from './Forum';

import Navbar from './Navbar';
import { useUserContext } from '../hooks/useUserContext';
import { Button, Checkbox, Form, Input, Radio, Switch } from 'antd';

import BarChart from './BarChart';
import {courseGradeData} from './CourseGradeData';

import Reviews from './Reviews';

export default function CoursePage() {
    const {courseName} = useParams();
    const [Title, setTitle] = useState('');
    const [CreditHours, setCreditHours] = useState('');
    const [Description, setDescription] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [checkedFavorite, setCheckedFavorite] = useState(false);
    const [favCourses, setFavCourses] = useState([]);
    const [courseGrades, setCourseGrades] = useState({});

    const [size, setSize] = useState('large');
    const { user } = useUserContext();
    let username = '';
    if (user) 
        username = user.username;

    useEffect(() => {
        const fetchCourse = async () => {
            fetch('http://localhost:5001/api/course/get/' + courseName)
            .then(response => response.json())
            .then(data => {
                setTitle(data.Title);
                setCreditHours(data.CreditHours);
                setDescription(data.Description);
            })
        }
        fetchCourse();

        if (user != null && user.favCourses) {
            setFavorite(true);
        }
    }, [courseName]);

    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-favCourses/' + username)
        .then(response => response.json())
        .then(data => {
            setFavCourses(data);
            console.log("favorite courses: ", favCourses)
        })
        fetch('http://localhost:5001/api/course/get/grades/' + courseName)
        .then(response => response.json())
        .then(data => {
            var courseDist = [];
            var json_data = data;
            for (var i in json_data) {
                courseDist[i] = json_data[i];
            }
            courseDist = Object.values(courseDist)
        
            courseDist = courseDist.filter(Number.isFinite)
        
            console.log(courseDist)

            setCourseGrades({
                labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
                datasets: [{
                    label: 'Number of Students',
                    data: [courseDist],
                    }]
                })

            console.log(courseGrades)
        
        })
    }, [courseName]);

    useEffect(() => {
        let found = false;
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName) {
                setCheckedFavorite(true);
                found = true;
            }
        }
        if (!found)
            setCheckedFavorite(false);
    }, [favCourses]);

    const checkClass = () => {
        console.log("hello")
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName)
                return true;
        }
        return false;
    }

    const favClass = async () => {
        console.log("run favClass")
        let found = false;
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName) {
                favCourses.splice(i, 1);
                found = true;
            }
        }
        if (!found) {
            favCourses.push(courseName)
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


    return( 
        <div id='cont'>
            <Navbar/>
            <div className='namePage'>
                <h1> {courseName} </h1>
            </div>
            <div className='bodyPage'>
                <h2>Title: </h2> 
                <p>{Title}</p>
                {
                    user != null &&
                    <section>
                        <h2>Favorite Class:</h2>
                        <Switch checked={checkedFavorite} onChange={() => {
                            favClass();
                            setCheckedFavorite(!checkedFavorite);
                        }}/>
                    </section>
                }
                <h2>Credit Hours:</h2>
                <p>{CreditHours}</p>
                {
                    Description.length != 0 && <div><h2>Description: </h2><p>{Description}</p></div>
                }
                <Forum courseName={courseName}/>
                <Reviews name={courseName} type={"course"}/>
                {/* <BarChart chartData={courseGrades}/> */}
            </div>
        </div>
    )
}