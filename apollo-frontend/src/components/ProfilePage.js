import { React, useState, Component} from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom'
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import { Avatar, Card, Button} from 'antd';

export default function ProfilePage() {

  const navigate = useNavigate();
  const editProfile = () => {
    fetch('http://localhost:5001/api/user/get/' + user.username)
    .then(response => response.json())
    .then(data => navigate('/EditProfile',{state: {user: data}}))
  }

  let user = null;
  let username = '';
  let aboutMe = '';
  let email = '';
  let dob = '';
  let major = '';
  let year = '';
  let role = '';
  let country = '';
  let gradYear = '';
  let courses = {};
  let planOfStudy = {};

  let gender = '';
  
  const data = useLocation();
    if (data.state != null) {
      user = data.state.user;
      if (user != null) {
        username = user.username;
        aboutMe = user.aboutMe;
        email = user.email;
        dob = user.DOB;
        major = user.major;
        year = user.currentYear;
        gradYear = user.gradYear;
        courses = user.courses;
        planOfStudy = user.planOfStudy;
        if (user.isProf) {
          role = "Professor";
        }
        else {
          role = "Student";
        }
        country = user.country;
        gender = user.gender;
      }
    }
    return (
      <div id="ProfilePage">
        <Navbar/>
        <Card id="ProfileCard" title="Profile" bordered={true}>
          <Avatar size={100} shape="circle" src="../img/apollo-gray.png" />
          <h3> Username: {username}</h3>
        </Card>
        <p> About me: {aboutMe} </p>
        <p> Email: {email} </p>
        <p> Date of Birth: {dob} </p>
        <p> Major: {major} </p>
        <p> Year: {year} </p>
        <p> Role: {role} </p>
        <p> Country: {country} </p>
        <p> Gender: {gender} </p>
        <p> Graduation year: {gradYear} </p>
        <p> Courses: {courses} </p>
        <p> Plan of Study: {planOfStudy} </p>
        <Button type="primary" shape="round" size="large" onClick={editProfile}>
          Edit Profile
        </Button>
        <Button type="primary" shape="round" size="large" href="/Login">
          Log Out
        </Button>
      </div>  
    );
}

