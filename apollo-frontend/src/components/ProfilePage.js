import { React, useState} from 'react';
import { Link } from 'react-router-dom'
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import { Avatar, Card, Button} from 'antd';

export default function ProfilePage() {

    const [username, setUserName] = useState('TestUser')
    const [email, setEmaiil] = useState('test@purdue.edu')
    const [dob, setDOB] = useState('10/20/2022')
    const [major, setMajor] = useState('Computer Science')
    const [year, setYear] = useState('Junior')
    const [bio, setBio] = useState('I am currently a third year student at Purdue. blablablalablabla')
    const [role, setRole] = useState('Student')
    const [country, setCountry] = useState('United States')
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('1234567890')

    return (
      <div id="ProfilePage">
        <Navbar/>
        <Card id="ProfileCard" title="Profile" bordered={true}>
          <Avatar size={100} shape="circle" src="../img/apollo-gray.png" />
          <h3>{username}</h3>
        </Card>
        <p> About me: {bio} </p>
        <p> Email: {email} </p>
        <p> Date of Birth: {dob} </p>
        <p> Major: {major} </p>
        <p> Year: {year} </p>
        <p> Role: {role} </p>
        <p> Country: {country} </p>
        <p> Gender: {gender} </p>
        <p> Phone Number: {phoneNumber} </p>
        <Button type="primary" shape="round" size="large" href="/TellUsMore">
          Edit Profile
        </Button>
        <Button type="primary" shape="round" size="large" href="/Login">
          Log Out
        </Button>
      </div>  
    )
}