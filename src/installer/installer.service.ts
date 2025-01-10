import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { hashSync } from 'bcrypt';
import mongoose, { Model } from 'mongoose';

import { CreateInstallerDto } from './dto/create-installer.dto';
import { UpdateInstallerDto } from './dto/update-installer.dto';
import { UpdateCoordinatesInstallerDto } from './dto/update-coordinates-installer.dto';

import { Installer } from './entities/installer.entity';
import { UpdateStatusInstallerDto } from './dto/update-status-installer.dto';

import { User } from '../user/entities/user.entity';

import { Role } from '../role/entities/role.entity';

import { FROM_EMAIL } from '../constants/email';

import { confirmationRegisterInstallerEmail } from '../templates/email/confirmationRegisterInstallerEmail';
import { welcomeAndNewPasswordEmail } from 'src/templates/email/welcomeAndNewPasswordEmail';

@Injectable()
export class InstallerService {

  constructor(
    @InjectModel(Installer.name)
    private readonly installerModel: Model<Installer>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectConnection() 
    private readonly connection: mongoose.Connection,

    private readonly mailService: MailerService,

    private readonly jwtTokenService: JwtService
  ){}

  async create(createInstallerDto: CreateInstallerDto) {
    const {installer, ...user} = createInstallerDto;

    const {email, rfc, name, lastName} = user;

    const session = await this.connection.startSession();

    
    const role = await this.roleModel.findOne({ name: 'Installer' });


    if (!role) {
      throw new NotFoundException('Execute seed first');
    }

    const isRepeatedEmail = await this.userModel.findOne({ email });
    if (isRepeatedEmail) {
      throw new BadRequestException('El correo ya existe');
    }

    const isRepeatedRfc = await this.userModel.findOne({ rfc });
    if (isRepeatedRfc) {
      throw new BadRequestException('El RFC ya existe');
    }

    session.startTransaction();

    try {

    const newInstaller = new this.installerModel(installer)

    await newInstaller.save({ session });

    const randomPassword = Math.random().toString(36).slice(-8);

    const userBody = {
      ...user,
      roleId: role._id,
      password: hashSync(randomPassword, 10),
      status: 'pending',
      installerId: newInstaller._id,
    };

    await new this.userModel(userBody).save({ session });

    await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    await this.mailService.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "MasterGas23: Confirmación de solicitud",
      html: confirmationRegisterInstallerEmail(name,lastName)
    })

    return {msg: "Installer was created"};

  }

  async findAll(status: string) {

    if (status !== 'pending' && status !== 'approved' && status !== 'rejected' && status !== undefined) {
      throw new BadRequestException('Status no valid');
    }

    if (status === undefined) {
      status = 'pending';
    }

    const roleId = await this.roleModel.findOne({ name: 'Installer' });

    const installers = await this.userModel.find({roleId: roleId._id, status })
      .populate([
        {
          path: 'installerId',
          select: 'companyName -_id',
          model: Installer.name
        }
      ])
      .select('-password -roleId -__v');

    return installers;
  }

  async findOne(id: string) {
    const role = await this.roleModel.findOne({name: 'Installer'});

    const installer = await this.userModel.findOne({_id: id, roleId: role._id})
    .populate([
      {
        path: 'roleId',
        model: Role.name,
        select: 'name -_id'
      },
      {
        path: 'installerId',
        model: Installer.name,
        select: '-password -status -__v -_id'
      }
    ]);

    if (!installer) {
      throw new NotFoundException('Instalador no encontrado');
    }

    return installer
  }

  async updateStatus(id: string, updateInstallerStatusDto: UpdateStatusInstallerDto) {
    const role = await this.roleModel.findOne({name: 'Installer'});

    if (!role) {
      throw new NotFoundException('Execute seed first');
    }

    const installer = await this.userModel.findOne({_id: id, roleId: role._id});

    if (!installer) {
      throw new NotFoundException('Instalador no encontrado');
    }

    const { status } = updateInstallerStatusDto;
    
    if (status === 'approved' && installer.status === 'pending') {

      await this.userModel.findOneAndUpdate({_id: id, roleId: role._id}, { status, updatePassword: true });

      const token = this.jwtTokenService.sign({id: id})

      this.sendNewPassword(installer.email, installer.name, installer.lastName, token);
    } else {
      throw new BadRequestException('Status no valid');
    }

    return {msg: 'Status actualizado'};
  }

  async updateCoordinatesByToken(updateCoordinatesInstallerDto: UpdateCoordinatesInstallerDto) {
    
    const { userId, longitude, latitude } = updateCoordinatesInstallerDto;

    if ((longitude < -180 || longitude > 180) || (latitude < -90 || latitude > 90)) {
      throw new BadRequestException('Send coordinates in longitude [-180, 180] and latitude [-90, 90]');
    }

    const role = await this.roleModel.findOne({name: 'Installer'});

    if (!role) {
      throw new NotFoundException('Execute seed first');
    }

    const installer = await this.userModel.findOne({_id: userId, roleId: role._id});

    if (!installer) {
      throw new NotFoundException('Instalador no encontrado');
    }

    await this.userModel.findOneAndUpdate({_id: userId}, { coordinates: [longitude, latitude] });

    return {msg: 'Coordenadas actualizadas'}
  }

  async remove(id: string) {
    const role = await this.roleModel.findOne({name: 'Installer'});
    
    if (!role) {
      throw new NotFoundException('Execute seed first');
    }
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      await this.userModel.findByIdAndDelete(id, { session });
      
      await this.installerModel.findByIdAndDelete(user.installerId, { session });

      await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    return {msg: 'Instalador eliminado'}
  }

  async sendNewPassword(email: string, name: string, lastName: string, token: string) {

    await this.mailService.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "MasterGas23: Bienvenido a MasterGas23",
      html: welcomeAndNewPasswordEmail(name,lastName, email, token)
    })
  }
}
