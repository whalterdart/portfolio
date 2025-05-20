import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.contactModel.findById(id).exec();
  }

  async findUnread(): Promise<Contact[]> {
    return this.contactModel.find({ read: false }).sort({ createdAt: -1 }).exec();
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    this.logger.log(`Creating new contact from ${createContactDto.email}`);
    const createdContact = new this.contactModel(createContactDto);
    return createdContact.save();
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact | null> {
    this.logger.log(`Updating contact with id ${id}`);
    return this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();
  }

  async markAsRead(id: string): Promise<Contact | null> {
    this.logger.log(`Marking contact ${id} as read`);
    return this.contactModel
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .exec();
  }

  async markAsReplied(id: string): Promise<Contact | null> {
    this.logger.log(`Marking contact ${id} as replied`);
    return this.contactModel
      .findByIdAndUpdate(id, { replied: true }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Contact | null> {
    this.logger.log(`Removing contact ${id}`);
    return this.contactModel.findByIdAndDelete(id).exec();
  }
} 