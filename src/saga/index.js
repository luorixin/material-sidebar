import { fork } from 'redux-saga/effects'

import materialSagas from './material.js'

function* sagas() {
    yield fork(materialSagas)
}

export default sagas
