import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import { RootState } from '../../redux/store';
import { UserEvent } from '../../redux/userEvents';
import { deleteUserEvent, updateUserEvent } from '../../redux/action-creators';
import styles from './Event.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  event: UserEvent;
}

const Component: React.FC<Props> = ({
  event,
  deleteUserEvent,
  updateUserEvent,
}) => {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(event.title);
  const handleDeleteClick = (id: UserEvent['id']) => {
    deleteUserEvent(id);
  };
  const handleTitleClick = () => {
    setEditTitle(true);
  };
  const handleInputBlur = () => {
    setEditTitle(false);
    if (title !== event.title) {
      updateUserEvent({
        ...event,
        title,
      });
    }
  };
  const editRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editTitle && editRef.current) {
      editRef.current.focus();
    }
  }, [editTitle]);
  return (
    <div className={styles.calendar_event}>
      <div className={styles.calendar_event_info}>
        <div className={styles.calendar_event_time}>
          {new Date(event.dateStart).getHours()}:
          {new Date(event.dateStart).getMinutes()} -{' '}
          {new Date(event.dateEnd).getHours()}:
          {new Date(event.dateEnd).getMinutes()}
        </div>
        <div className={styles.calendar_event_title}>
          {editTitle ? (
            <input
              type="text"
              ref={editRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleInputBlur}
            />
          ) : (
            <span onClick={handleTitleClick}>{event.title}</span>
          )}
        </div>
      </div>
      <button
        className={styles.calendar_event_delete_button}
        onClick={() => handleDeleteClick(event.id)}
      >
        x
      </button>
    </div>
  );
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, undefined, Action>
) => ({
  deleteUserEvent: (id: UserEvent['id']) => dispatch(deleteUserEvent(id)),
  updateUserEvent: (event: UserEvent) => dispatch(updateUserEvent(event)),
});
const connector = connect(undefined, mapDispatchToProps);
const Container = connector(Component);

export { Container as Event, Component as EventComponent };
