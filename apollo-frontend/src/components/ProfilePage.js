import { React, useEffect, useState, Component} from 'react';
import { Link , useNavigate} from 'react-router-dom'
import { useParams } from "react-router-dom";
import Navbar from './Navbar';
import {LinkedinFilled, InstagramFilled, TwitterCircleFilled} from '@ant-design/icons';
import { Avatar, Card, Button, message} from 'antd';
import defpfp from '../img/defaultpfp.png';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import io from "socket.io-client"

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

const ENDPOINT = "http://localhost:5001"
var socket;

export default function ProfilePage() {

  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user: outerUser } = useUserContext();
  const [user, setUser] = useState(outerUser ? outerUser.user : null);
  const [userFound, setUserFound] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);
  const [userFoundBlocked, setUserFoundBlocked] = useState(false);
  const [blocked, setBlocked] = useState(false);
  socket = io(ENDPOINT);

  // Track the friend status of the current user and viewed user
  // 0: Not friends 1: Current user sent a friend request 2: Current user received a friend request 3: Friends
  // If the user is the same or there is no user, we set it to null
  const usernameParam = useParams().username;
  var friendsList = null;
  var friendRequestsSent = null;
  var friendRequests = null;

  const fetchUser = async () => {
    await fetch('http://localhost:5001/api/user/get/' + usernameParam)
    .then(response => response.json())
    .then(data => setUserFound(data))
    .catch(error => {
      message.error('Connection Error');
    });
  }

  useEffect(() => {
    if (outerUser) {
        const fetchUpdatedUser = async () => {
            await fetch('http://localhost:5001/api/user/get/' + outerUser.username)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => {
            message.error('Connection Error');
            }); 
        }
        fetchUpdatedUser();
    }
}, [outerUser || user]);

  useEffect(() => {
    if (!userFound || userFound.username !== usernameParam) {
      fetchUser();
    }
    if (!user && outerUser) {
      setUser(outerUser.user);
    }
  }, [userFound || user || usernameParam]);

  useEffect(() => {
    if (user && userFound) {
      friendsList = user.friendsList ? user.friendsList : [];
      friendRequestsSent = user.friendRequestsSent ? user.friendRequestsSent : [];
      friendRequests = user.friendRequests ? user.friendRequests : [];
      var friends = false;
      for (let i = 0; i < friendsList.length; i++) {
          if (userFound.username === friendsList[i].username) {
              friends = true;
          }
      }
      if (friends) {
         setFriendStatus(3);
      } else if (friendRequestsSent.includes(userFound.username)) {
        setFriendStatus(1);
      } else if (friendRequests.includes(userFound.username)) {
        setFriendStatus(2);
      } else if (user.username !== userFound.username) {
        setFriendStatus(0);
      }

      if (user.blockedList.includes(userFound.username)) {
        setUserFoundBlocked(true);
      }
      if (userFound.blockedList.includes(user.username)) {
        setBlocked(true);
      }
    }
  }, [user, userFound]);

  useEffect(() => {
    if (usernameParam) {
      fetchUser();
    }
  }, [usernameParam]);

  const unblockUser = async () => {
    const response = await fetch(`http://localhost:5001/api/user//block-user/${userFound.username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        outerUser.user = data.user;
        message.success('User unblocked!', 3);
        setUserFoundBlocked(false);
      }
    })
    .catch(error => {
      message.error('Connection Error');
    }
    );
  }

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
    .catch(error => {
      message.error('Connection Error');
    });
  }

  const sendFriendRequest = async () => {
    if (user.friendRequests.includes(userFound.username)) {
      message.error('You already sent a friend request to this user!', 2);
      return;
    }

    const response = await fetch('http://localhost:5001/api/user/sendFriendRequest', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        friendUsername: userFound.username
      })
    })
    .then(response => response.json())
    .then(data =>{
      if (data.user) {
        setUser(data.user);
        outerUser.user = data.user;
      }
      if (data.pendingFriend) {
        setUserFound(data.userFound);
        const payload = {
          user: data.pendingFriend,
          sender: data.user,
        };
        socket.emit('New Friend Request', payload);
        message.success('Friend request sent!', 3);
        setFriendStatus(1);
      }
    })
    .catch(error => {
      message.error('Connection Error');
    });
  }

  const cancelFriendRequest = async () => {
    const response = await fetch('http://localhost:5001/api/user/cancelFriendRequest', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        friendUsername: userFound.username
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        outerUser.user = data.user;
      }
      if (data.pendingFriend) {
        setUserFound(data.userFound);
        message.success('Friend request cancelled!', 3);
        setFriendStatus(0);
      }
    })
    .catch(error => {
      message.error('Connection Error');
    });
  }

  const acceptFriendRequest = () => {
    const response = fetch('http://localhost:5001/api/user/acceptFriendRequest', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        friendUsername: userFound.username
      })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
          setUser(data.user);
          outerUser.user = data.user;
        }
        if (data.pendingFriend) {
          setUserFound(data.userFound);
          message.success('Friend request accepted!', 3);
          setFriendStatus(3);
        }
    })
    .catch(error => {
      message.error('Connection Error');
    });
  }

  const removeFriend = () => {
    const response = fetch('http://localhost:5001/api/user/removeFriend', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        friendUsername: userFound.username
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        outerUser.user = data.user;
      }
      if (data.pendingFriend) {
        setUserFound(data.userFound);
        message.success('Friend removed!', 3);
        setFriendStatus(0);
      }
    })
    .catch(error => {
      message.error('Connection Error');
    });
  }

  const blockUser = async () => {
    const response = await fetch(`http://localhost:5001/api/user//block-user/${userFound.username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        outerUser.user = data.user;
        message.success('User blocked!', 3);
        setUserFoundBlocked(true);
      }
    })
    .catch(error => {
      message.error('Connection Error');
    }
    );
  }

  if (userFoundBlocked && user && userFound && !blocked) {
    return (
      <div>
        <Navbar />
        <div id="ProfilePage">
          <Card id="ProfileCard" title="Profile" bordered={true}>
              <Avatar src={pfp} size={150} shape="circle" alt="Profile Picture" />
              <h3> Username: {username}</h3>
              <Button onClick={unblockUser} >Unblock</Button>
          </Card>
        </div>
      </div>
    )
  }

  if (blocked && user && userFound && !userFoundBlocked) {
    return (
      <div>
        <Navbar />
        <div id="ProfilePage">
          <Card id="ProfileCard" title="Profile" bordered={true}>
              <h3> {username} </h3>
              <h3> This user has blocked you </h3>
              {userFoundBlocked && <Button onClick={unblockUser}>Unblock</Button>}
              {!userFoundBlocked && <Button onClick={blockUser}> Block </Button>}
          </Card>
        </div>
      </div>
    )
  }

  if (blocked && userFoundBlocked && user && userFound) {
    return ( 
      <div>
        <Navbar />
        <div id="ProfilePage">
          <Card id="ProfileCard" title="Profile" bordered={true}>
              <h3> {username} </h3>
              <h3> This user has blocked you </h3>
              <Button onClick={unblockUser}>Unblock</Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar/>
      <div id="ProfilePage">
        <Card id="ProfileCard" title="Profile" bordered={true}>
          <Avatar src={pfp} size={150} shape="circle" alt="Profile Picture" />
          <h3> Username: {username}</h3>
          {friendStatus == 0 && <Button onClick={sendFriendRequest}> Add Friend </Button>}
          {friendStatus == 1 && <Button onClick={cancelFriendRequest}> Cancel Friend Request </Button>}
          {friendStatus == 2 && <Button onClick={acceptFriendRequest}> Accept Friend Request </Button>}
          {friendStatus == 3 && <Button onClick={removeFriend}> Remove Friend </Button>}
          {!sameAccount && !userFoundBlocked && <Button onClick={blockUser}> Block </Button>}
          {
            privateAccount && !sameAccount && friendStatus != 3 &&
            <div>
              <p> Major: {major} </p>
              <h4>Is a Private Account</h4>
            </div>
          }
          {
            (!privateAccount || sameAccount || friendStatus == 3) &&
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