export interface Helper {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role?: string[];
  roles?: string[];
  username: string;
  createdAt: string;
}

export interface PIN {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface SelectedUser {
  id: number;
  index: number;
  type: string;
}

export interface GETPaginationHelper {
  content: Helper[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface GETPaginationPIN {
  content: PIN[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserJWT {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string[];
  username?: string;
}
