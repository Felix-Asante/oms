import { LoginMethods } from 'src/common/enums/auth.enum';

export type User = {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  photo: string;
  social_id: string;
  login_method: LoginMethods;
  date_of_birth: Date;
  city: string;
  country: string;
  created_at: Date;
  updated_at: Date;
  organization: {
    id: string;
    name: string;
    logo: string;
    phone: string;
    email: string;
    website: string;
    created_at: Date;
    updated_at: Date;

    role: {
      created_at: Date;
      updated_at: Date;
      id: string;
      label: string;
      permissions: string[];
    };
  };
};
