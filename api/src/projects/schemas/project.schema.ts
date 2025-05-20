import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop()
  githubUrl: string;

  @Prop()
  liveUrl: string;

  @Prop({ type: String, default: () => new Date().toISOString().split('T')[0] })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
