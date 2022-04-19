import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { UserEvent } from '../userEvents';
import { UserEventActionType } from '../action-types';
import {
  LoadUserEventsAction,
  CreateUserEventsAction,
  UpdateUserEventsAction,
  DeleteUserEventsAction,
} from '../actions';
import { selectDateStart } from '../tracker';

//thunk action creators
export const loadUserEvents =
  (): ThunkAction<void, RootState, undefined, LoadUserEventsAction> =>
  async (dispatch, getState) => {
    dispatch({
      type: UserEventActionType.LOAD_REQUEST,
    });
    try {
      const response = await fetch('http://localhost:3001/events');
      const events: UserEvent[] = await response.json();
      dispatch({
        type: UserEventActionType.LOAD_SUCCESS,
        payload: { events },
      });
    } catch (e) {
      dispatch({
        type: UserEventActionType.LOAD_ERROR,
        error: 'Failed',
      });
    }
  };

//Creating events
export const createUserEvent =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    CreateUserEventsAction
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: UserEventActionType.CREATE_REQUEST,
    });
    try {
      const dateStart = selectDateStart(getState());
      const event: Omit<UserEvent, 'id'> = {
        title: 'Change the name by clicking here',
        dateStart,
        dateEnd: new Date().toISOString(),
      };
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const createdEvent: UserEvent = await response.json();
      dispatch({
        type: UserEventActionType.CREATE_SUCCESS,
        payload: { event: createdEvent },
      });
    } catch (e) {
      dispatch({
        type: UserEventActionType.CREATE_FAILURE,
        error: 'creation failed',
      });
    }
  };

//Updating events
export const updateUserEvent =
  (
    event: UserEvent
  ): ThunkAction<Promise<void>, RootState, undefined, UpdateUserEventsAction> =>
  async (dispatch) => {
    dispatch({
      type: UserEventActionType.UPDATE_REQUEST,
    });
    try {
      const response = await fetch(`http://localhost:3001/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const updatedEvent: UserEvent = await response.json();
      dispatch({
        type: UserEventActionType.UPDATE_SUCCESS,
        payload: { event: updatedEvent },
      });
    } catch (err) {
      dispatch({
        type: UserEventActionType.UPDATE_FAILURE,
        payload: { error: 'Update failed' },
      });
    }
  };

//Deleting events
export const deleteUserEvent =
  (
    id: UserEvent['id']
  ): ThunkAction<Promise<void>, RootState, undefined, DeleteUserEventsAction> =>
  async (dispatch) => {
    dispatch({
      type: UserEventActionType.DELETE_REQUEST,
    });
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch({
          type: UserEventActionType.DELETE_SUCCESS,
          payload: { id },
        });
      }
    } catch (e) {
      dispatch({
        type: UserEventActionType.DELETE_FAILURE,
      });
    }
  };
