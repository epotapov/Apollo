import { React, useState} from 'react';
import { Link } from 'react-router-dom'

import Navbar from './Navbar';
import { Button, Checkbox, Form, Input, Radio } from 'antd';

export default function CoursePage() {
    return(
        <div>
            <Navbar/>
            <section>
                <h1>
                    Course Page
                </h1>
            </section> 
        </div>
    )
}