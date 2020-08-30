import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import ListPoint from './pages/ListPoint';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} exact path="/" />
            <Route component={CreatePoint} path="/create-point" />
            <Route component={ListPoint} path="/list-point" />
            
        </BrowserRouter>
    )
         
}

export default Routes;