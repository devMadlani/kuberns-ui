import { Branch, Organization, Repository } from '.';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type { Organization, Repository, Branch };
