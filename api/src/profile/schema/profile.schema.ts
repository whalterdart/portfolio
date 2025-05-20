import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SocialLink {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: true })
  active: boolean;
}

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  highlightedText: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ platform: String, url: String, active: Boolean }], default: [] })
  socialLinks: SocialLink[];

  @Prop({ default: true })
  active: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
