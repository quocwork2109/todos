export enum Status {
  OPEN = 'OPEN',
  INPROGRESS = 'INPROGRESS',
  DONE = 'DONE',
  ARCHIVE = 'ARCHIVE',
}

export type Todo = {
  id: Number,
  title: String,
  description: String,
  status: Status,
}

export const titleColors = {
  [Status.OPEN]: 'cyan-500',
  [Status.INPROGRESS]: 'purple-500',
  [Status.DONE]: 'pink-500',
  [Status.ARCHIVE]: 'rose-500',
};