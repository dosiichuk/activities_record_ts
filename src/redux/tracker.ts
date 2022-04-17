import { Action } from 'redux';
import { RootState } from './store';

interface TrackerState {
  dateStart: string;
}

const START = '@action/tracker/START';
const STOP = '@action/tracker/STOP';

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

//action creators
export const start = (): StartAction => ({ type: START });
export const stop = (): StopAction => ({ type: STOP });

export const selectTrackerState = (rootState: RootState) => {
  return rootState.tracker;
};
export const selectDateStart = (rootState: RootState) => {
  return rootState.tracker.dateStart;
};

//initial state
const initialState = {
  dateStart: '',
};

const trackerReducer = (
  state: TrackerState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      return { ...state, dateStart: new Date().toISOString() };
    case STOP:
      return { ...state, dateStart: '' };
    default:
      return state;
  }
};

export default trackerReducer;
