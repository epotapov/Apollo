import {React, useState} from 'react';
import {Card, Col, Row} from 'antd';
import '../index.css';
import '../DiningHall.css'

import Navbar from './Navbar';

export default function DiningHall(props) {
    const [name, setName] = useState(props.name);
    const [address, setAddress] = useState(props.address);
    
    const [size, setSize] = useState('large');
    return( 
        <div id='cont'>
            <Navbar/>
            <div id='name'>
                <h1 > {name} </h1>
            </div>
            <div id='menu'>
                <Row>
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
                </Row>
            </div>
        </div>
    );
}