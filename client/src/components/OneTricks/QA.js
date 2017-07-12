import React from 'react';

const QA = ({ question, answer }) =>
  <div className='qa-item'>
    <h4 className='question'>Q: {question}</h4>
    <div className='answer'>A: {answer}</div>
  </div>;

export default QA;
