import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About } from './schemas/about.schema';
import { CreateAboutDto, UpdateAboutDto } from './dto/about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name) private readonly aboutModel: Model<About>,
  ) {}

  async findAll(): Promise<About[]> {
    return this.aboutModel.find().exec();
  }

  async findOne(id: string): Promise<About | null> {
    return this.aboutModel.findById(id).exec();
  }

  async create(createAboutDto: CreateAboutDto): Promise<About> {
    const createdAbout = new this.aboutModel(createAboutDto);
    return createdAbout.save();
  }

  async update(id: string, updateAboutDto: UpdateAboutDto): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(id, updateAboutDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<About | null> {
    return this.aboutModel.findByIdAndDelete(id).exec();
  }

  // Mu00e9todo para definir um about como ativo e desativar todos os outros
  async setActive(id: string): Promise<About> {
    // Primeiro, desativa todos os registros de about
    await this.aboutModel.updateMany({}, { active: false }).exec();
    
    // Depois, ativa apenas o especificado
    const about = await this.aboutModel
      .findByIdAndUpdate(id, { active: true }, { new: true })
      .exec();
    
    if (!about) {
      throw new Error(`About with ID ${id} not found`);
    }
    
    return about;
  }

  // Mu00e9todo especu00edfico para obter as informau00e7u00f5es atuais de "sobre mim"
  async getCurrentAbout(): Promise<About> {
    // Busca o registro marcado como ativo
    const aboutInfo = await this.aboutModel.findOne({ active: true }).exec();
    
    if (!aboutInfo) {
      // Se nu00e3o existir um ativo, busca qualquer um
      const anyAbout = await this.aboutModel.findOne().exec();
      
      if (anyAbout) {
        // Se encontrou algum, ativa-o
        return this.setActive(anyAbout.id);
      }
      
      // Se nu00e3o existir nenhum registro, cria um registro bu00e1sico
      const newAbout = await this.create({
        title: 'Desenvolvedor',
        description: 'Configure suas informau00e7u00f5es de perfil no painel administrativo.',
        skills: [],
        education: [],
        experience: [],
        active: true // Marca como ativo por padru00e3o
      });
      
      return newAbout;
    }
    
    return aboutInfo;
  }

  // Mu00e9todos para manipular habilidades
  async addSkill(id: string, skill: any): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id, 
        { $push: { skills: skill } },
        { new: true }
      )
      .exec();
  }

  async removeSkill(id: string, skillId: string): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id,
        { $pull: { skills: { _id: skillId } } },
        { new: true }
      )
      .exec();
  }

  // Mu00e9todos para manipular educau00e7u00e3o
  async addEducation(id: string, education: any): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id, 
        { $push: { education: education } },
        { new: true }
      )
      .exec();
  }

  async removeEducation(id: string, educationId: string): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id,
        { $pull: { education: { _id: educationId } } },
        { new: true }
      )
      .exec();
  }

  // Mu00e9todos para manipular experiu00eancia
  async addExperience(id: string, experience: any): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id, 
        { $push: { experience: experience } },
        { new: true }
      )
      .exec();
  }

  async removeExperience(id: string, experienceId: string): Promise<About | null> {
    return this.aboutModel
      .findByIdAndUpdate(
        id,
        { $pull: { experience: { _id: experienceId } } },
        { new: true }
      )
      .exec();
  }
}
