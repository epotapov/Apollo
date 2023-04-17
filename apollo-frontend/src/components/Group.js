import { React, useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse} from "antd";

import { useUserContext } from '../hooks/useUserContext';
import Forum from './Forum';

import Navbar from "./Navbar";

export default function Group() {
    return(
        <>
            <Navbar/>
            <div className='namePage'>
                <h1> Group: </h1>
            </div>
            <div className='bodyPage'>
                <h2>Title: </h2>
                <p>{/*Title*/}</p>
                {
                    /*user != null &&
                    <section>
                        <h2>Favorite Group:</h2>
                        <Switch checked={checkedFavorite} onChange={() => {
                            favClass();
                            setCheckedFavorite(!checkedFavorite);
                        }} />
                    </section>*/
                }
                <h2>Group Owner: </h2>
                {/*<Forum courseName={courseName} type={'Public'}  />*/}
            </div>
        </>
    )
}