import { React, useState} from 'react';
import { Link } from 'react-router-dom'
import '../ProfilePage.css'
import Navbar from './Navbar';
import { Avatar, Card} from 'antd';

export default function ProfilePage() {

    return (
    <div id="ProfilePage">
        <div id="ProfileNavBar">
            <Navbar/>
        </div>
        <div id="ProfileTab">
            

        </div>    
    </div>
    )
}