import {React, useState} from 'react';
import {Card, Col, Row} from 'antd';
import { useLocation } from 'react-router-dom';
import '../index.css';

import Navbar from './Navbar';

export default function DiningHall(props) {
    let name = '';
    let address = '';
    let mealSwipe = '';
    let mobileOrder = '';
    let description = '';
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
    }
    return( 
        <div id='cont'>
            <Navbar/>
            <div id='name'>
                <h1 > {name} </h1>
            </div>
            <div id='menu'>
                <h2>Address: </h2> 
                {address}
                <h2>Meal Swipes:</h2>
                {mealSwipe && <p>Yes</p>}
                {!mealSwipe && <p>No</p>}
                <h2>Mobile Order: </h2>
                {mealSwipe && <p>Yes</p>}
                {!mealSwipe && <p>No</p>}
                <h2>Description:</h2>
                {description}
                <h2><a href={link}>Menu</a></h2>
                <h2>User Reviews:</h2>
                {/*<Row>
                    <Col span={8}>
                    <Card>
                        <h2> Breakfast </h2>
                        <p> Eggs </p>
                        <p> Bacon </p>
                        <p> Pancakes </p>
                        <p> Waffles </p>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card>
                        <h2> Lunch </h2>
                        <p> Chicken </p>
                        <p> Rice </p>
                        <p> Salad </p>
                        <p> Soup </p>
                    </Card>
                    </Col>
                    <Col span={8}>
                    <Card>
                        <h2> Dinner </h2>
                        <p> Steak </p>
                        <p> Potatoes </p>
                        <p> Salad </p>
                        <p> Soup </p>
                    </Card>
                    </Col>
                </Row>*/}
            </div>
        </div>
    );
}