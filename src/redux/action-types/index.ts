export enum UserEventActionType {
  //Loading events
  LOAD_REQUEST = '@action/userEvents/LOAD_REQUEST',
  LOAD_SUCCESS = '@action/userEvents/LOAD_SUCCESS',
  LOAD_ERROR = '@action/userEvents/LOAD_ERROR',

  //Creating events
  CREATE_REQUEST = '@action/userEvents/CREATE_REQUEST',
  CREATE_SUCCESS = '@action/userEvents/CREATE_SUCCESS',
  CREATE_FAILURE = '@action/userEvents/CREATE_FAILURE',

  //deleting events
  DELETE_REQUEST = '@action/userEvents/DELETE_REQUEST',
  DELETE_SUCCESS = '@action/userEvents/DELETE_SUCCESS',
  DELETE_FAILURE = '@action/userEvents/DELETE_FAILURE',

  //editing events
  UPDATE_REQUEST = '@action/userEvents/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@action/userEvents/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@action/userEvents/UPDATE_FAILURE',
}

export enum TrackerActionType {
  START = '@action/tracker/START',
  STOP = '@action/tracker/STOP',
}
