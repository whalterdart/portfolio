export interface About {
  id?: string;
  _id?: string;
  profile?: {
    name?: string;
    role?: string;
    bio?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
  title: string;
  description: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  avatar?: string;
  socialLinks?: SocialLinks;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5 ou 1-100
  category?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  current?: boolean;
  description: string;
  technologies?: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
}
