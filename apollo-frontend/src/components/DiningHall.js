import { React, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import { iframe } from 'iframe';
import '../index.css';
import '../iframe.css';

import Navbar from './Navbar';

export default function DiningHall(props) {
    let name = '';
    let address = '';
    let mealSwipe = '';
    let mobileOrder = '';
    let description = '';
    let hours = '';
    let link = '';
    const [size, setSize] = useState('large');
    const data = useLocation();
    console.log(data)
    if (data != null) {
        const hall = data.state.dining;
        name = hall.name;
        address = hall.address;
        mealSwipe = hall.mealSwipe;
        mobileOrder = hall.mobileOrder;
        description = hall.description;
        link = hall.link;
        hours = hall.hours;
    }
    return (
        <div id='cont'>
            <Navbar />
            <div className='namePage'>
                <h1 > {name} </h1>
            </div>
            <div className='bodyPage'>
                <h2>Address: </h2>
                <p>{address}</p>
                <h2>Meal Swipes:</h2>
                {mealSwipe && <p>Yes</p>}
                {!mealSwipe && <p>No</p>}
                <h2>Mobile Order: </h2>
                {mealSwipe && <p>Yes</p>}
                {!mealSwipe && <p>No</p>}
                <h2>Description:</h2>
                <p>{description}</p>
                <h2>Hours</h2>
                <p>{hours}</p>
                <h2>Menu and times:</h2>
                <div className="embedded-page-container">
                    <iframe
                        title= "Dining Court Webpage"
                        src= {link}
                        className="embedded-page"
                    />
                </div>
            </div>
        </div>
    );
}