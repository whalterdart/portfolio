import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'about'
})
export class About extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ name: String, level: Number, category: String }] })
  skills: { name: string; level: number; category?: string }[];

  @Prop({
    type: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ]
  })
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];

  @Prop({
    type: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        technologies: [String]
      }
    ]
  })
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    technologies?: string[];
  }[];

  @Prop()
  avatar?: string;

  @Prop({
    type: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String,
      instagram: String
    }
  })
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };

  @Prop({ default: false })
  active: boolean;
}

export const AboutSchema = SchemaFactory.createForClass(About);
