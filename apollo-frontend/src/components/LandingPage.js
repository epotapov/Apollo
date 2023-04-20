import React from 'react';
import { useState, useEffect } from 'react';
import logo from '../img/apollo-gray.png';
import darklogo from '../img/apollo-orange.png';
import { Link, useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useTheme } from '../hooks/useTheme';
import { useThemeContext } from '../hooks/useThemeContext';

import { Button, Avatar, Switch, theme, message } from 'antd';
import defpfp from '../img/defaultpfp.png';
import AvatarBar from './AvatarBar';
const picServer = "http://localhost:5001/pictures/"

export default function LandingPage() {
    const [size, setSize] = useState('large');
    const {user} = useUserContext();
    const { theme } = useThemeContext();
    const { changeTheme } = useTheme();
    const [ darkButton, setDarkButton ] = useState(false);
    const navigate = useNavigate();
    let buttonEnable = false;
    const [favCourses, setFavCourses] = useState([]);
    const [profilePic, setProfilePic] = useState("");

    /* Connect to socket
    const [socketConnected, setSocketConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        if (!user) {
            setUser(outerUser ? outerUser.user : null);
        }
        if (user && !socketConnected) {
            socket = io(ENDPOINT);
            socket.emit('setup', outerUser);
            socket.on('connected', () => setSocketConnected(true));
        }
    })

    useEffect(() => {
        if (!socketConnected) return;
        console.log("socket connected: ", socketConnected);
        socket.on("message recieved", (newMessageRecieved) => {
            console.log("new message recieved: ", newMessageRecieved);
            if (!messages.includes(newMessageRecieved)) {
                messages.push(newMessageRecieved);
                const response = fetch('http://localhost:5001/api/user/addNotification', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: user.username,
                        title: newMessageRecieved.sender.username + ' has sent you a message ' + newMessageRecieved.content.substring(0, 5) + '...',
                        path: '/Chat/',
                        type: 'Chat',
                        sender: newMessageRecieved.sender.username,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        console.log("user: ", data.user);
                        setUser(data.user);
                        outerUser.user = data.user;
                        dispatch({type: 'UPDATE', payload: outerUser});
                    }
                })
            }
        });
    })
*/

    function getpfp() {
        if (user) {
            if (profilePic === 'default' || profilePic === "" || profilePic === null) {
                return defpfp;
            }
            else {
                return picServer + profilePic;
            }
        }
    }

    useEffect(() => {
        if (user) {
            fetch('http://localhost:5001/api/user/get-favCourses/' + user.username)
            .then(response => response.json())
            .then(data => {
                setFavCourses(data);
                console.log("favorite courses: ", favCourses)
            })
            .catch(error => {
                message.error('Connection Error');
            });
            fetch('http://localhost:5001/api/user/get-image/' + user.username)
            .then(response => response.json())
            .then(data => {
                setProfilePic(data);
            })  
            .catch(error => {
                message.error('Connection Error');
            });
        } 
    }, [user])

    const pfp = getpfp();
    function FavoriteCourse(props) {
        const onPress = () => {
            console.log(props.course)
            let path = '/Course/' + props.course;
            navigate(path);
        }
        return(
            <div className='grid-item' onClick={() => onPress()}>{props.course}</div>
        )
    }

    const listFavorites = favCourses.map((favorite) =>
        <FavoriteCourse key={favorite.toString()} course={favorite}/>
    );

    const goToProfile = () => {
        let path = '/Profile/' + user.username;
        navigate(path);
    }

    const goToCreateGroup = () => {
        let path = '/CreateGroup';
        navigate(path);
    }

    return(
        <div className='Container'>
            <div className='Corner'>
                <div className='CornerButtons'>
                    <Button type="primary" id='createGroup' onClick={goToCreateGroup} size={size}>
                        Create Group                
                    </Button>
                    <div id='ThemeButtonContainer'>
                        <Switch checked={theme === "dark"} id="themeSwitch" onChange={() => changeTheme()} />
                    </div>
                    {user && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <span className='WelcomeTag'>Welcome {user.username} </span>
                            <AvatarBar pic={getpfp()}/>
                        </div>
                    )}
                    {!user && (
                        <Link to='/Login'>
                            <Button type="primary" size={size}>
                                Log In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <section className='Search'>
                <div id='LogoHolderLanding'>
                    {theme === "light" && <img src={logo} alt="logo" />}
                    {theme === "dark" && <img src={darklogo} alt="logo" />}
                    <h1>Apollo</h1>
                </div>
                <section id="SearchLandingHolder">
                <SearchBar/>
                </section>
                {user && (
                    <section className='grid-container'>
                        {listFavorites}
                    </section>
                )}
            </section>
        </div>
    );
}