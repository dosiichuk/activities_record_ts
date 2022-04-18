import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';
import { selectDateStart } from './tracker';

export interface UserEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
}

//selector functions
export const selectUserEvents = (state: RootState) =>
  state.userEvents.allIds.map((id) => state.userEvents.byIds[id]);

//normalizing the data to make it easier to type records in the reducer
export interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

//ACTION NAMES
//Loading events
const LOAD_REQUEST = '@action/userEvents/LOAD_REQUEST';
const LOAD_SUCCESS = '@action/userEvents/LOAD_SUCCESS';
const LOAD_ERROR = '@action/userEvents/LOAD_ERROR';

//Creating events
const CREATE_REQUEST = '@action/userEvents/CREATE_REQUEST';
const CREATE_SUCCESS = '@action/userEvents/CREATE_SUCCESS';
const CREATE_FAILURE = '@action/userEvents/CREATE_FAILURE';

//deleting events
const DELETE_REQUEST = '@action/userEvents/DELETE_REQUEST';
const DELETE_SUCCESS = '@action/userEvents/DELETE_SUCCESS';
const DELETE_FAILURE = '@action/userEvents/DELETE_FAILURE';

//editing events
const UPDATE_REQUEST = '@action/userEvents/UPDATE_REQUEST';
const UPDATE_SUCCESS = '@action/userEvents/UPDATE_SUCCESS';
const UPDATE_FAILURE = '@action/userEvents/UPDATE_FAILURE';

//ACTION TYPES
//Loading events
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}
interface LoadErrorAction extends Action<typeof LOAD_ERROR> {
  error: string;
}

//Creating events
interface CreateEventAction extends Action<typeof CREATE_REQUEST> {}
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface CreateEventFailure extends Action<typeof CREATE_FAILURE> {
  error: string;
}

//Deleting events
interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: UserEvent['id'] };
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {}

//Updating events
interface UpdateEventAction extends Action<typeof UPDATE_REQUEST> {}
interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: { event: UserEvent };
}
interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
  payload: { error: string };
}

//ACTION CREATORS
//Loading events
export const loadUserEvents =
  (): ThunkAction<
    void,
    RootState,
    undefined,
    LoadRequestAction | LoadSuccessAction | LoadErrorAction
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: LOAD_REQUEST,
    });
    try {
      const response = await fetch('http://localhost:3001/events');
      const events: UserEvent[] = await response.json();
      dispatch({
        type: LOAD_SUCCESS,
        payload: { events },
      });
    } catch (e) {
      dispatch({
        type: LOAD_ERROR,
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
    | CreateEventAction
    | LoadErrorAction
    | CreateSuccessAction
    | CreateEventFailure
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: CREATE_REQUEST,
    });
    try {
      const dateStart = selectDateStart(getState());
      const event: Omit<UserEvent, 'id'> = {
        title: 'no name',
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
        type: CREATE_SUCCESS,
        payload: { event: createdEvent },
      });
    } catch (e) {
      dispatch({
        type: CREATE_FAILURE,
        error: 'creation failed',
      });
    }
  };

//Updating events
export const updateUserEvent =
  (
    event: UserEvent
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    UpdateEventAction | UpdateSuccessAction | UpdateFailureAction
  > =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_REQUEST,
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
        type: UPDATE_SUCCESS,
        payload: { event: updatedEvent },
      });
    } catch (err) {
      dispatch({
        type: UPDATE_FAILURE,
        payload: { error: 'Update failed' },
      });
    }
  };

//Deleting events
export const deleteUserEvent =
  (
    id: UserEvent['id']
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    DeleteRequestAction | DeleteFailureAction | DeleteSuccessAction
  > =>
  async (dispatch) => {
    dispatch({
      type: DELETE_REQUEST,
    });
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { id },
        });
      }
    } catch (e) {
      dispatch({
        type: DELETE_FAILURE,
      });
    }
  };

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

//reducer
const userEventsReducer = (
  state: UserEventsState = initialState,
  action:
    | LoadSuccessAction
    | CreateSuccessAction
    | DeleteSuccessAction
    | UpdateSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((storedId) => storedId !== id),
      };
      delete newState.byIds[id];
      return newState;
    case UPDATE_SUCCESS:
      const { event: updatedEvent } = action.payload;
      return {
        ...state,
        byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent },
      };

    default:
      return state;
  }
};

export default userEventsReducer;
