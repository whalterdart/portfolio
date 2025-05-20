import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpStatus, Logger } from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto, UpdateAboutDto } from './dto/about.dto';

@Controller('about')
export class AboutController {
  private readonly logger = new Logger(AboutController.name);
  
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.findAll(),
    };
  }

  @Get('current')
  async getCurrentAbout() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.getCurrentAbout(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.findOne(id),
    };
  }

  @Post()
  async create(@Body() createAboutDto: CreateAboutDto) {
    try {
      this.logger.log(`Creating about with data: ${JSON.stringify(createAboutDto)}`);
      
      // Process experience items to ensure endDate is properly handled
      if (createAboutDto.experience && createAboutDto.experience.length > 0) {
        createAboutDto.experience = createAboutDto.experience.map(exp => {
          if (exp.current) {
            return { ...exp, endDate: undefined };
          }
          return exp;
        });
      }
      
      // Process socialLinks to ensure empty fields are removed
      if (createAboutDto.socialLinks) {
        for (const key in createAboutDto.socialLinks) {
          if (createAboutDto.socialLinks[key] === '') {
            delete createAboutDto.socialLinks[key];
          }
        }
        
        // If socialLinks is empty after processing, set it to undefined
        if (Object.keys(createAboutDto.socialLinks).length === 0) {
          createAboutDto.socialLinks = undefined;
        }
      }
      
      const result = await this.aboutService.create(createAboutDto);
      
      this.logger.log(`About created successfully with ID: ${result.id}`);
      
      return {
        statusCode: HttpStatus.CREATED,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error creating about: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      this.logger.error(`About data: ${JSON.stringify(createAboutDto)}`);
      
      if (error.response && error.response.message) {
        // Handle validation errors from NestJS
        this.logger.error(`Validation errors: ${JSON.stringify(error.response.message)}`);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: error.response.message
        };
      }
      
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Error creating about'
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAboutDto: UpdateAboutDto,
  ) {
    try {
      this.logger.log(`Updating about with ID ${id} and data: ${JSON.stringify(updateAboutDto)}`);
      
      // Process experience items to ensure endDate is properly handled
      if (updateAboutDto.experience && updateAboutDto.experience.length > 0) {
        updateAboutDto.experience = updateAboutDto.experience.map(exp => {
          if (exp.current) {
            return { ...exp, endDate: undefined };
          }
          return exp;
        });
      }
      
      // Process socialLinks to ensure empty fields are removed
      if (updateAboutDto.socialLinks) {
        for (const key in updateAboutDto.socialLinks) {
          if (updateAboutDto.socialLinks[key] === '') {
            delete updateAboutDto.socialLinks[key];
          }
        }
        
        // If socialLinks is empty after processing, set it to undefined
        if (Object.keys(updateAboutDto.socialLinks).length === 0) {
          updateAboutDto.socialLinks = undefined;
        }
      }
      
      const result = await this.aboutService.update(id, updateAboutDto);
      
      this.logger.log(`About updated successfully with ID: ${id}`);
      
      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error updating about: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      this.logger.error(`About data: ${JSON.stringify(updateAboutDto)}`);
      
      if (error.response && error.response.message) {
        // Handle validation errors from NestJS
        this.logger.error(`Validation errors: ${JSON.stringify(error.response.message)}`);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: error.response.message
        };
      }
      
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Error updating about'
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.remove(id),
    };
  }

  @Patch(':id/set-active')
  async setActive(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.setActive(id),
    };
  }

  // Endpoints especializados para habilidades
  @Put(':id/skills/add')
  async addSkill(@Param('id') id: string, @Body() skill: any) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.addSkill(id, skill),
    };
  }

  @Delete(':id/skills/:skillId')
  async removeSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
  ) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.removeSkill(id, skillId),
    };
  }

  // Endpoints especializados para educau00e7u00e3o
  @Put(':id/education/add')
  async addEducation(@Param('id') id: string, @Body() education: any) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.addEducation(id, education),
    };
  }

  @Delete(':id/education/:educationId')
  async removeEducation(
    @Param('id') id: string,
    @Param('educationId') educationId: string,
  ) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.removeEducation(id, educationId),
    };
  }

  // Endpoints especializados para experiu00eancia
  @Put(':id/experience/add')
  async addExperience(@Param('id') id: string, @Body() experience: any) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.addExperience(id, experience),
    };
  }

  @Delete(':id/experience/:experienceId')
  async removeExperience(
    @Param('id') id: string,
    @Param('experienceId') experienceId: string,
  ) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.aboutService.removeExperience(id, experienceId),
    };
  }
}
