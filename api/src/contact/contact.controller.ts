import { Controller, Get, Post, Body, Param, Put, Delete, Patch, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.findAll(),
    };
  }

  @Get('unread')
  async findUnread() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.findUnread(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.findOne(id),
    };
  }

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.contactService.create(createContactDto),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.update(id, updateContactDto),
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.markAsRead(id),
    };
  }

  @Patch(':id/replied')
  async markAsReplied(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.markAsReplied(id),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      data: await this.contactService.remove(id),
    };
  }
} 