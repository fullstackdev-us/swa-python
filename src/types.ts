export interface Job {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobFormData {
  name: string;
  description: string;
  status: string;
}
