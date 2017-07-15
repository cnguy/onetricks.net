// @flow

import React from 'react';

type PropTypes = {
  question: string,
  answer: string,
}

const QA = ({ question, answer }: PropTypes): React$Element<any> =>
  <div className="qa-item">
    <h4 className="question">Q: {question}</h4>
    <div className="answer">A: {answer}</div>
  </div>;

export default QA;
