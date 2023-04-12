import { React, useState, useEffect } from 'react';
import { GoogleMap, LoadScript  } from '@react-google-maps/api';

import Navbar from './Navbar';

const containerStyle = {
    width: "100%",
    height: "85vh"
};

const center = {
    lat: 40.426,
    lng: -86.917
};

export default function Map() {
    return(
        <div id='cont'>
            <Navbar />
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_MAPS}
            >
                <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                >
                { /* Child components, such as markers, info windows, etc. */ }
                <></>
                </GoogleMap>
            </LoadScript>
        </div>
    );
}