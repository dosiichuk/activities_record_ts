import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
// import { reduxSelector, reduxActionCreator } from '../../../redux/exampleRedux.js';
import { RootState } from '../../redux/store';
import { selectUserEvents, loadUserEvents } from '../../redux/userEvents';
import { Event } from '../Event/Event';
import { groupEventsByDay } from '../../utils/groupEvents';
import styles from './Calendar.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const Component: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;
  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }

  return (
    <div className={styles.calendar}>
      {groupedEvents && sortedGroupKeys ? (
        sortedGroupKeys.map((day) => {
          const events = groupedEvents![day];
          const groupDate = new Date(day);
          const eventDay = groupDate.getDate();
          const month = groupDate.toLocaleString(undefined, { month: 'long' });
          return (
            <div key={day} className={styles.calendar_day}>
              <div className={styles.calendar_day_label}>
                <span>
                  {eventDay} {month}
                </span>
              </div>
              <div className={styles.calendar_events}>
                {events.map((event) => {
                  return <Event key={event.id} event={event} />;
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  events: selectUserEvents(state),
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, undefined, Action>
) => ({
  loadUserEvents: () => dispatch(loadUserEvents()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
const Container = connector(Component);

export { Container as Calendar, Component as CalendarComponent };
