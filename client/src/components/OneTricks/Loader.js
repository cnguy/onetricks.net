// @flow

import React from 'react'

import loader from '../../assets/misc/loading.svg'

const Loader = (): React$Element<any> => (
    <div className="loader center-align">
        <img src={loader} className="loader-img" alt="... loading ..." />
    </div>
)

export default Loader
