import { React, useState, Component} from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom'
import '../ProfilePage.css'
import '../App.css'
import Navbar from './Navbar';
import { Avatar, Card, Button} from 'antd';

export default function ProfilePage() {

  const navigate = useNavigate();
  const editProfile = () => {
    console.log("Edit Profile");
    console.log(user);
    let userData = JSON.stringify(user);
    navigate('/EditProfile', {state: {user: userData}});
  }

  let user = null;
  var username = '';
  var aboutMe = '';
  var email = '';
  var dob = '';
  var major = '';
  var year = '';
  var role = '';
  var country = '';
  var gender = '';
  
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
        <Button type="primary" shape="round" size="large" onClick={editProfile}>
          Edit Profile
        </Button>
        <Button type="primary" shape="round" size="large" href="/Login">
          Log Out
        </Button>
      </div>  
    );
}

