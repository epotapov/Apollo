import { React, useState, Component} from 'react';
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import { Avatar, Card, Button} from 'antd';

export default function ProfilePage() {

  var user = {
    username: '',
    bio: '',
    email: '',
    dob: '',
    major: '',
    year: '',
    role: '',
    country: ''
  }

  const {username, setUsername} = useState('');
  const {bio, setBio} = useState('');
  const {email, setEmail} = useState('');
  const {dob, setDob} = useState('');
  const {major, setMajor} = useState('');
  const {year, setYear} = useState('');
  const {role, setRole} = useState('');
  const {country, setCountry} = useState('');
  const {gender, setGender} = useState('');
  const data = useLocation();
    if (data != null) {
      const user = data.state.user;
      if (user != null) {
        setUsername(user.username);
        setBio(user.bio);
        setEmail(user.email);
        setDob(user.dob);
        setMajor(user.major);
        setYear(user.year);
        if (user.isProf) {
          setRole("Professor");
        }
        else {
          setRole("Student");
        }
        setCountry(user.country);
        setGender(user.gender);
      }
    }
    return (
      <div id="ProfilePage">
        <Navbar/>
        <Card id="ProfileCard" title="Profile" bordered={true}>
          <Avatar size={100} shape="circle" src="../img/apollo-gray.png" />
          <h3> Username: {username}</h3>
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
    );
}

