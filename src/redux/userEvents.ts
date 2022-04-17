import { Action, AnyAction } from 'redux';
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

const LOAD_REQUEST = '@action/userEvents/LOAD_REQUEST';
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}

const LOAD_SUCCESS = '@action/userEvents/LOAD_SUCCESS';
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

const LOAD_ERROR = '@action/userEvents/LOAD_ERROR';
interface LoadErrorAction extends Action<typeof LOAD_ERROR> {
  error: string;
}

const CREATE_REQUEST = '@action/userEvents/CREATE_REQUEST';
interface CreateEventAction extends Action<typeof CREATE_REQUEST> {}

const CREATE_SUCCESS = '@action/userEvents/CREATE_SUCCESS';
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
const CREATE_FAILURE = '@action/userEvents/CREATE_FAILURE';
interface CreateEventFailure extends Action<typeof CREATE_FAILURE> {
  error: string;
}

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

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

//reducer
const userEventsReducer = (
  state: UserEventsState = initialState,
  action: LoadSuccessAction | CreateSuccessAction
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

    default:
      return state;
  }
};

export default userEventsReducer;
