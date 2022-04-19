import { Action } from 'redux';
import { UserEventActionType } from '../action-types';
import { UserEvent } from '../userEvents';

//Loading events
interface LoadRequestAction
  extends Action<typeof UserEventActionType.LOAD_REQUEST> {}
export interface LoadSuccessAction
  extends Action<typeof UserEventActionType.LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}
interface LoadErrorAction
  extends Action<typeof UserEventActionType.LOAD_ERROR> {
  error: string;
}
export type LoadUserEventsAction =
  | LoadRequestAction
  | LoadSuccessAction
  | LoadErrorAction;

//Creating events
interface CreateEventAction
  extends Action<typeof UserEventActionType.CREATE_REQUEST> {}
export interface CreateSuccessAction
  extends Action<typeof UserEventActionType.CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface CreateEventFailure
  extends Action<typeof UserEventActionType.CREATE_FAILURE> {
  error: string;
}

export type CreateUserEventsAction =
  | CreateEventAction
  | CreateSuccessAction
  | CreateEventFailure;

//Deleting events
interface DeleteRequestAction
  extends Action<typeof UserEventActionType.DELETE_REQUEST> {}
export interface DeleteSuccessAction
  extends Action<typeof UserEventActionType.DELETE_SUCCESS> {
  payload: { id: UserEvent['id'] };
}
interface DeleteFailureAction
  extends Action<typeof UserEventActionType.DELETE_FAILURE> {}

export type DeleteUserEventsAction =
  | DeleteRequestAction
  | DeleteSuccessAction
  | DeleteFailureAction;

//Updating events
interface UpdateEventAction
  extends Action<typeof UserEventActionType.UPDATE_REQUEST> {}
export interface UpdateSuccessAction
  extends Action<typeof UserEventActionType.UPDATE_SUCCESS> {
  payload: { event: UserEvent };
}
interface UpdateFailureAction
  extends Action<typeof UserEventActionType.UPDATE_FAILURE> {
  payload: { error: string };
}

export type UpdateUserEventsAction =
  | UpdateEventAction
  | UpdateSuccessAction
  | UpdateFailureAction;
