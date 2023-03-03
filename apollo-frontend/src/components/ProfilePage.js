import { React, useState, Component} from 'react';
import { Link , useLocation, useNavigate} from 'react-router-dom'
import Navbar from './Navbar';
import {LinkedinFilled, InstagramFilled, TwitterCircleFilled} from '@ant-design/icons';
import { Avatar, Card, Button} from 'antd';

import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

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
  const { logout } = useLogout();
  const { user } = useUserContext();

  const editProfile = () => {
    fetch('http://localhost:5001/api/user/get/' + user.username)
    .then(response => response.json())
    .then(data => navigate('/EditProfile',{state: {user: data}}))
  }

  let userFound = null;
  let sameAccount = false;
  let privateAccount = false;
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
      userFound = data.state.user;
      if (user && userFound.username === user.username) {
        sameAccount = true;
      }
      console.log("user found", userFound)
      if (userFound != null) {
        username = userFound.username;
        aboutMe = userFound.aboutMe;
        email = userFound.email;
        dob = userFound.DOB;
        major = userFound.major;
        year = userFound.currentYear;
        gradYear = userFound.gradYear;
        courses = userFound.courses;
        planOfStudy = userFound.planOfStudy;
        privateAccount = userFound.isPrivate;
        if (userFound.isProf) {
          role = "Professor";
        }
        else {
          role = "Student";
        }
        country = userFound.country;
        gender = userFound.gender;
        linkedinLink = userFound.linkedinLink;
        instagramLink = userFound.instagramLink;
        twitterLink = userFound.twitterLink;
      }
    }
    /*
    let courseItems = null;
    let planofstudyItems = null;
    if (!courses)
      courseItems = courses.map((course) => <p key={course.toString()}>{course} </p>);
    if (!planOfStudy)
      planofstudyItems = planOfStudy.map((course) => <p key={course.toString()}>{course} </p>);*/
    return (
      <div>
        <Navbar/>
        <div id="ProfilePage">
          <Card id="ProfileCard" title="Profile" bordered={true}>
            <Avatar size={100} shape="circle" src="../img/apollo-gray.png" />
            <h3> Username: {username}</h3>
          </Card>
          {
            privateAccount && !sameAccount &&
            <h4>Is a Private Account</h4>
          }
          {
            (!privateAccount || sameAccount) &&
            <div>
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
            </div>
          }
          {user && sameAccount &&
              <div>
                <Button type="primary" shape="round" size="large" onClick={editProfile}>
                  Edit Profile
                </Button>
                <Button type="primary" shape="round" size="large" onClick={() => logout()}>
                  Log Out
                </Button>
              </div>
            }
        </div>  
      </div>
    );
}