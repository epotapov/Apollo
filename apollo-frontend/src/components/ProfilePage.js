import { React, useState} from 'react';
import { Link } from 'react-router-dom'
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import { Avatar, Card, Button} from 'antd';

export default function ProfilePage(props) {

    console.log(props)
    const [username, setUserName] = useState(props.username)
    const [email, setEmaiil] = useState(props.email)
    const [dob, setDOB] = useState('10/20/2022')
    const [major, setMajor] = useState(props.major)
    const [year, setYear] = useState(props.year)
    const [bio, setBio] = useState(props.bio)
    const [role, setRole] = useState(props.role)
    const [country, setCountry] = useState(props.country)
    const [gender, setGender] = useState(props.gender);
    const [courses, setCourses] = useState(props.courses);
    const [planOfStudy, setPlanOfStudy] = useState(props.planOfStudy);

    return (
      <div id="ProfilePage">
        <Navbar/>
        <Card id="ProfileCard" title="Profile" bordered={true}>
          <Avatar size={100} shape="circle" src="../img/apollo-gray.png" />
          <h3></h3>
        </Card>
        <p> About me: {bio} </p>
        <p> Email: {email} </p>
        <p> Date of Birth: {dob} </p>
        <p> Major: {major} </p>
        <p> Year: {year} </p>
        <p> Role: {role} </p>
        <p> Country: {country} </p>
        <p> Gender: {gender} </p>
        <p>  </p>
        <Button type="primary" shape="round" size="large" href="/TellUsMore">
          Edit Profile
        </Button>
        <Button type="primary" shape="round" size="large" href="/Login">
          Log Out
        </Button>
      </div>  
    )
}