import React from 'react';
import { Tracker } from '../Tracker/Tracker';
import { Calendar } from '../Calendar/Calendar';
import styles from './App.module.scss';

function App() {
  return (
    <div className="App">
      <Tracker />
      <Calendar />
    </div>
  );
}

export default App;
