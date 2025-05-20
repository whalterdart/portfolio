import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AddSocialLinkDto, CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { Profile } from './schema/profile.schema';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Get('active')
  async findActive(): Promise<Profile> {
    const profile = await this.profileService.findActive();
    if (!profile) {
      throw new NotFoundException('No active profile found');
    }
    return profile;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.profileService.remove(id);
  }

  @Patch(':id/set-active')
  async setActive(@Param('id') id: string): Promise<Profile> {
    return this.profileService.setActive(id);
  }

  @Post(':id/social')
  addSocialLink(
    @Param('id') id: string,
    @Body() socialLinkDto: AddSocialLinkDto,
  ): Promise<Profile> {
    return this.profileService.addSocialLink(id, socialLinkDto);
  }

  @Delete(':id/social/:index')
  removeSocialLink(
    @Param('id') id: string,
    @Param('index') index: string,
  ): Promise<Profile> {
    return this.profileService.removeSocialLink(id, parseInt(index, 10));
  }

  @Patch(':id/social/:index')
  updateSocialLink(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() updateDto: AddSocialLinkDto,
  ): Promise<Profile> {
    return this.profileService.updateSocialLink(id, parseInt(index, 10), updateDto);
  }
}
