export interface Folder {
  id: number;
  name: string;
  userId: number;
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
