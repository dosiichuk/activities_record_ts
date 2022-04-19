import { RootState } from './store';
import {
  LoadSuccessAction,
  CreateSuccessAction,
  UpdateSuccessAction,
  DeleteSuccessAction,
} from './actions';
import { UserEventActionType } from './action-types';

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
    case UserEventActionType.LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    case UserEventActionType.CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case UserEventActionType.DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((storedId) => storedId !== id),
      };
      delete newState.byIds[id];
      return newState;
    case UserEventActionType.UPDATE_SUCCESS:
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
