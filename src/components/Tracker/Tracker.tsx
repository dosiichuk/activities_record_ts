import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { selectDateStart, start, stop } from '../../redux/tracker';
import { addZero } from '../../utils/addZero';
import { createUserEvent } from '../../redux/userEvents';
import { RootState } from '../../redux/store';
import { Action } from 'redux';

import styles from './Tracker.module.scss';

const Component: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, undefined, Action> = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const startedFlag = dateStart !== '';
  let interval = useRef<number>(0);
  const [, setCount] = useState<number>(0);
  const handleClick = () => {
    if (startedFlag) {
      window.clearInterval(interval.current);
      dispatch(createUserEvent());
      dispatch(stop());
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };
  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = startedFlag
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;
  const hours = seconds ? Math.floor(seconds / 3600) : 0;
  seconds -= hours * 3600;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;
  return (
    <div
      className={clsx(
        styles.recorder,
        startedFlag ? styles.recorder_started : ''
      )}
    >
      <button onClick={handleClick} className={styles.recorder_record}>
        <span></span>
      </button>
      <div className={styles.recorder_counter}>
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export {
  Component as Tracker,
  // Container as Tracker,
  Component as TrackerComponent,
};
