export interface SocialLink {
  platform: string;
  url: string;
  active?: boolean;
}

export interface Profile {
  id?: string;
  _id?: string;
  name: string;
  highlightedText: string;
  description: string;
  socialLinks: SocialLink[];
  active?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
