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

import { Button, Avatar, Switch, theme } from 'antd';
import defpfp from '../img/defaultpfp.png';

const picServer = "http://localhost:5001/pictures/"

export default function LandingPage() {
    const [size, setSize] = useState('large');
    const { logout } = useLogout();
    const { user } = useUserContext();
    const { theme } = useThemeContext();
    const { changeTheme } = useTheme();
    const [ darkButton, setDarkButton ] = useState(false);
    const navigate = useNavigate();
    let buttonEnable = false;
    const [favCourses, setFavCourses] = useState([]);
    const [profilePic, setProfilePic] = useState("");

    function getpfp() {
        if (user) {
            console.log("asd" + profilePic);
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
            console.log("run useeffect")
            fetch('http://localhost:5001/api/user/get-favCourses/' + user.username)
            .then(response => response.json())
            .then(data => {
                setFavCourses(data);
                console.log("favorite courses: ", favCourses)
            })
            fetch('http://localhost:5001/api/user/get-image/' + user.username)
            .then(response => response.json())
            .then(data => {
                setProfilePic(data);
            })  
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
		fetch('http://localhost:5001/api/user/get/' + user.username)
		.then(response => response.json())
		.then(data => navigate('/Profile',{state: {user: data}}))
    }
    return(
        <div className='Container'>
            <div className='Corner'>
                <div className='CornerButtons'>
                    <div id='ThemeButtonContainer'>
                        <Switch checked={theme === "dark"} id="themeSwitch" onChange={() => changeTheme()} />
                    </div>
                    {user && (
                        <div>
                            <span className='WelcomeTag'>Welcome {user.username} </span>
                            <Avatar onClick={goToProfile} size={40} className="avatar" shape="circle" src={pfp} />
                            <Button type="primary" onClick={() => logout()} size={size}>
                                Log Out
                            </Button>
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