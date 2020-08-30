import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLogIn } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api'

import myIcon from '../CreatePoint/configLeaflet';
import logo from '../../assets/logo.svg';
import './styles.css'

interface Local {
    id: number,
    image_url: string,
    name: string,
    latitude: number,
    longitude: number,
}
const ListPoint = () => {
    const [localPosition, setLocalPosition] = useState<Local[]>([]);
    const [localInfo, setLocalInfo] = useState<Local[]>([])

    useEffect(() => {
        api
            .get('points')
            .then(response => {
                console.log(response.data)
                setLocalInfo(response.data)
            })
    }, [])

    useEffect(() => {
        api
            .get('points')
            .then(response => {
                console.log(response.data)
                setLocalPosition(response.data)
            })
    }, [])

    return (
        <div id="page-list-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                        Voltar para Home
                </Link>
            </header>
            <div id="list-view">
                <aside className="content">
                    <div id="list-point">

                        <ul>
                            {localInfo.map(locald => (
                                <li key={locald.id}>
                                    <img src={locald.image_url} alt={locald.name} />
                                    <p>{locald.name}</p>
                                </li>

                            ))}
                        </ul>
                    </div>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>

                </aside>
                <fieldset>
                    <Map center={[-29.7727039, -51.1463808]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {localPosition.map(local => (
                            <Marker
                                icon={myIcon} key={local.id}
                                position={[local.latitude, local.longitude]}>
                                <Popup>
                                    {local.name}
                                </Popup>

                            </Marker>))}

                    </Map>
                </fieldset>



            </div>

        </div>

    )
}


export default ListPoint