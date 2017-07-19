// @flow

type elementOrNull = React$Element<any> | null

const renderOnCondition = (cond: any, element: elementOrNull): elementOrNull =>
  cond
    ? element
    : null;

export default renderOnCondition;
