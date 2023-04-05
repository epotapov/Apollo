import { React, useEffect, useState, Component} from 'react';
import { Link , useNavigate} from 'react-router-dom'
import { useParams } from "react-router-dom";
import Navbar from './Navbar';
import {LinkedinFilled, InstagramFilled, TwitterCircleFilled} from '@ant-design/icons';
import { Avatar, Card, Button} from 'antd';
import defpfp from '../img/defaultpfp.png';

import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

const picServer = "http://localhost:5001/pictures/"

function displayArray(arr) {
  if (arr == null) {
    return '';
  }
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

  const [userFound, setUserFound] = useState(null);
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
  let pfp = null;

  let gender = '';
  
  const usernameParam = useParams().username;
  useEffect(() => {
    const fetchUser = async () => {
      fetch('http://localhost:5001/api/user/get/' + usernameParam)
      .then(response => response.json())
      .then(data => setUserFound(data))
    }

    fetchUser();
  }, [usernameParam]);

  if (userFound) {
    if (user && userFound.username === user.username) {
      sameAccount = true;
    }
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
      let profilePic = userFound.profilePicture;
      if (profilePic === 'default' || profilePic === "" || profilePic === null) {
        pfp = defpfp;
      }
      else {
        pfp = picServer + profilePic
      }
    }
  }

  const editProfile = () => {
    fetch('http://localhost:5001/api/user/get/' + user.username)
    .then(response => response.json())
    .then(data => navigate('/EditProfile',{state: {user: data}}))
  }

    return (
      <div>
        <Navbar/>
        <div id="ProfilePage">
          <Card id="ProfileCard" title="Profile" bordered={true}>
            <Avatar src={pfp} size={150} shape="circle" alt="Profile Picture" />
            <h3> Username: {username}</h3>
            {
              privateAccount && !sameAccount &&
              <div>
                <p> Major: {major} </p>
                <h4>Is a Private Account</h4>
              </div>
            }
            {
              (!privateAccount || sameAccount) &&
              <div>
                <p> About me: {aboutMe} </p>
                <p> Email: {email} </p>
                <p> Date of Birth: {dob} </p>
                <p> Role: {role} </p>
                <p> Country: {country} </p>
                <p> Gender: {gender} </p>
                {role == "Student" ? (
                  <div>
                    <p> Major: {major} </p>
                    <p> Year: {year} </p>
                    <p> Courses: {displayArray(courses)} </p>
                    <p> Plan of Study: {displayArray(planOfStudy)} </p>
                    <p> Graduation year: {gradYear} </p>
                  </div>
                ) : (
                  <div>
                  <p> Currently Teaching: {displayArray(courses)} </p>
                  <p> Planning To teach: {displayArray(planOfStudy)}  </p>
                  <p> Department: {major} </p>
                </div>
                )}
                <Card title="Social media Links" bordered={false} style={{ width: 200 }}>
                {
                  instagramLink.length != 0 &&
                  <a target="_blank" href={instagramLink}>
                    <InstagramFilled style={{ fontSize: '30px', color: '#08c' }}/>
                  </a>
                }
                {
                  linkedinLink.length != 0 &&
                  <a target="_blank" href={linkedinLink}> 
                    <LinkedinFilled style={{ fontSize: '30px', color: '#08c' }}/>
                  </a>
                }  
                {
                  twitterLink.length != 0 &&
                  <a target="_blank" href={twitterLink}>
                    <TwitterCircleFilled style={{ fontSize: '30px', color: '#08c' }}/>
                  </a>
                }     
              </Card>
              </div>
            }
            {user && sameAccount &&
              <div>
                <Button type="primary" shape="round" size="large" onClick={editProfile}>
                  Edit Profile
                </Button>
                <Button type="primary" shape="round" size="large" onClick={() => navigate('/ChangePass')}>
                  Change Password
                </Button>
                <Button type="primary" shape="round" size="large" onClick={() => logout()}>
                  Log Out
                </Button>
              </div>
            }
          </Card>
        </div>  
      </div>
    );
}