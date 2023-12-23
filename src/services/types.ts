export interface NotificationRepeat {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface Folder {
  id: number;
  name: string;
  userId: number;
}

export interface NotificationPreference {
  date: string;
  time: string;
  repeat: NotificationRepeat;
}

export interface Notification {
  notificationPreference: NotificationPreference;
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
