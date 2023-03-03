import { React, useState, Component} from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom'
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import {LinkedinFilled, InstagramFilled, TwitterCircleFilled} from '@ant-design/icons';
import { Avatar, Card, Button} from 'antd';

function displayArray(arr) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    if (i != arr.length - 1) {
      str += arr[i] + ', ';
    }
    else {
      str += arr[i];
    }
  }
  return str;
}

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
  let linkedinLink = '';
  let instagramLink = '';
  let twitterLink = '';

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
        linkedinLink = user.linkedinLink;
        instagramLink = user.instagramLink;
        twitterLink = user.twitterLink;
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
        <p> Courses: {displayArray(courses)} </p>
        <p> Plan of Study: {displayArray(planOfStudy)} </p>
        <Card title="Social media Links" bordered={false} style={{ width: 200 }}>
          <a href={linkedinLink.toString}> 
            <LinkedinFilled style={{ fontSize: '30px', color: '#08c' }}/>
          </a>
          <a href={instagramLink.toString}>
            <InstagramFilled style={{ fontSize: '30px', color: '#08c' }}/>
          </a>
          <a href={twitterLink.toString}>
            <TwitterCircleFilled style={{ fontSize: '30px', color: '#08c' }}/>
          </a>
        </Card>
        <Button type="primary" shape="round" size="large" onClick={editProfile}>
          Edit Profile
        </Button>
        <Button type="primary" shape="round" size="large" href="/Login">
          Log Out
        </Button>
      </div>  
    );
}