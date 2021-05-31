import React from 'react'

import {  Route } from "react-router-dom";
import List from './components/list.js'
import './css/index.less'

const App = () => {
    return [<Route exact path="/material-manage" component={List} key={1} />]
}

export default App
