'use strict';

// Utility functions
function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function select(selector, parent = document) {
    return parent.querySelector(selector);
}

const track = select('.track');
const mapStructure = document.getElementById('map');

let fadeElements = document.querySelectorAll('.scrollFade');

// Declare the map variable outside the function
let map;

function scrollFade() {
    let viewportBottom = window.scrollY + window.innerHeight;

    for (let i = 0; i < fadeElements.length; i++) {
        let fadeElement = fadeElements[i];
        let rect = fadeElement.getBoundingClientRect();

        let elementFourth = rect.height / 4;
        let fadeIn = window.innerHeight - elementFourth;
        let fadeOut = -(rect.height / 2);

        if (rect.top <= fadeIn) {
            fadeElement.classList.add('is-visible');
            fadeElement.classList.remove('scrollFade-hidden');
        } else {
            fadeElement.classList.remove('is-visible');
            fadeElement.classList.add('scrollFade-hidden');
        }

        if (rect.top <= fadeOut) {
            fadeElement.classList.remove('is-visible');
            fadeElement.classList.add('scrollFade-hidden');
        }
    }
}

document.addEventListener('scroll', scrollFade);
window.addEventListener('resize', scrollFade);
document.addEventListener('DOMContentLoaded', () => {
    scrollFade();
});

mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbG1hLWRldiIsImEiOiJjbGJncnJqc2wwaXhjM29xd2liMXYzbmE4In0.c2LzFGTr8v0YUQlSfSe3mQ';

function getLocation(position) {
    const { latitude, longitude } = position.coords;
    updateMapMarker([longitude, latitude]);
}

function errorHandler() {
    updateMapMarker([-97.19318, 49.81453]);
}

const options = {
    enableHighAccuracy: true
};

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-97.19318, 49.81453]
            },
            properties: {
                title: 'Location',
                description: 'MITT Henlow Campus'
            }
        },
    ]
};

// Modify the function to assign the map to the global variable
function setUpMap(center) {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 15,
        attributionControl: false,
        marker: false,  // Corrected typo here
        pitch: 50,
    });

    map.addControl(new mapboxgl.NavigationControl());
    updateMapMarker(center);

    map.dragPan.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
}

function updateMapMarker(coordinates) {
    const [longitude, latitude] = coordinates;

    // Remove any existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    new mapboxgl.Marker({ color: '#3898ff' })
        .setLngLat([longitude, latitude])
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                    `<h3>Your Location</h3><p>Latitude: ${latitude}, Longitude: ${longitude}</p>`
                )
        )
        .addTo(map);

    // Zoom to the updated location
    map.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        essential: true
    });
}

// Call setUpMap at the beginning
setUpMap([-97.19318, 49.81453]);

// Event listeners
onEvent('click', track, () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
    } else {
        console.log('Track your Device');
    }
});
