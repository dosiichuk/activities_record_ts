import React from 'react';

// import { connect } from 'react-redux';
// import { reduxSelector, reduxActionCreator } from '../../../redux/exampleRedux.js';

import styles from './{{pascalCase name}}.module.scss';

interface Props{
  children: React.ReactNode;
}

const Component: React.FC<Props> = ({children}) => {
  return (
    <div className={styles.root}>
    <h2>{{pascalCase name}}</h2>
    {children}
  </div>
  )
};


// const mapStateToProps = state => ({
//   someProp: reduxSelector(state),
// });

// const mapDispatchToProps = dispatch => ({
//   someAction: arg => dispatch(reduxActionCreator(arg)),
// });

// const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Component as {{pascalCase name}},
  // Container as {{pascalCase name}},
  Component as {{pascalCase name}}Component,
};
