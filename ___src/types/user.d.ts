interface UserType {
  subId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  sector: string;
  company: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserResponseType {
  subId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  sector: string;
  company: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { UserType, UserResponseType };