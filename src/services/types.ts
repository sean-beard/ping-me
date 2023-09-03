export type FolderNotificationPreference = "daily" | "weekly" | "never";

export interface Folder {
  id: number;
  name: string;
  userId: number;
}

export interface Notification {
  notificationPreference: FolderNotificationPreference;
}

export interface File {
  id: number;
  name: string;
  html: string;
  userId: number;
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
}
