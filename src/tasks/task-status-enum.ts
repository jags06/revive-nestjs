/* export interface Task {
  id: string;
  taskTitle: string;
  taskDescription: string;
  status: TaskStatus;
} */

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
