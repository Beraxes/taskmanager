export enum TaskStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  WONT_DO = "WONT_DO",
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  icon: string
}
