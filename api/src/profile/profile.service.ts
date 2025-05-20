import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './schema/profile.schema';
import { AddSocialLinkDto, CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = new this.profileModel(createProfileDto);
    return profile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findActive(): Promise<Profile | null> {
    return this.profileModel.findOne({ active: true }).exec();
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const updatedProfile = await this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return updatedProfile;
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }

  async addSocialLink(id: string, socialLinkDto: AddSocialLinkDto): Promise<Profile> {
    const profile = await this.findOne(id);
    profile.socialLinks.push({
      ...socialLinkDto,
      active: true,
    });

    return profile.save();
  }

  async removeSocialLink(profileId: string, socialLinkIndex: number): Promise<Profile> {
    const profile = await this.findOne(profileId);
    
    if (socialLinkIndex < 0 || socialLinkIndex >= profile.socialLinks.length) {
      throw new NotFoundException(`Social link at index ${socialLinkIndex} not found`);
    }

    profile.socialLinks.splice(socialLinkIndex, 1);
    return profile.save();
  }

  async updateSocialLink(profileId: string, socialLinkIndex: number, updateDto: AddSocialLinkDto): Promise<Profile> {
    const profile = await this.findOne(profileId);
    
    if (socialLinkIndex < 0 || socialLinkIndex >= profile.socialLinks.length) {
      throw new NotFoundException(`Social link at index ${socialLinkIndex} not found`);
    }

    profile.socialLinks[socialLinkIndex] = {
      ...profile.socialLinks[socialLinkIndex],
      ...updateDto,
    };

    return profile.save();
  }
  
  async setActive(id: string): Promise<Profile> {
    // Primeiro, desativa todos os perfis
    await this.profileModel.updateMany({}, { active: false }).exec();
    
    // Em seguida, ativa apenas o perfil especificado
    const profile = await this.profileModel
      .findByIdAndUpdate(id, { active: true }, { new: true })
      .exec();
      
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    return profile;
  }
}
