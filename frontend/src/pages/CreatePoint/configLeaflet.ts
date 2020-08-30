import leaflet from 'leaflet';

const myIcon = leaflet.icon({
    iconUrl: require('../../assets/marker.svg'),
    iconSize: [32,32],
    iconAnchor: [16, 32],
});

export default  myIcon 