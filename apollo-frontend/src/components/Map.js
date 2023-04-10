import { React, useState, useEffect } from 'react';
import { GoogleMap, LoadScript  } from '@react-google-maps/api';

import Navbar from './Navbar';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

export default function Map() {
    return(
        <div id='cont'>
            <Navbar />
            <LoadScript
                googleMapsApiKey="YOUR_API_KEY"
            >
                <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                >
                { /* Child components, such as markers, info windows, etc. */ }
                <></>
                </GoogleMap>
            </LoadScript>
        </div>
    );
}