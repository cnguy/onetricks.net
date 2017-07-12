import React from 'react';

import loader from '../../assets/misc/loading.svg';

const Loader = () =>
  <div className="loader center-align">
    <img src={loader} className="loader-img" alt="... loading ..." />
  </div>;

export default Loader;
