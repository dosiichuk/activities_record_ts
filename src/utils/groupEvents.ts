import { UserEvent } from '../redux/userEvents';
import { addZero } from './addZero';

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

export const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};
  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateStart));
    if (groups[dateStartKey] === undefined) {
      groups[dateStartKey] = [];
    }
    groups[dateStartKey].push(event);
    if (dateEndKey !== dateStartKey) {
      groups[dateEndKey].push(event);
    }
  });
  return groups;
};
