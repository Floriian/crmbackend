import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const isPasswordValid =
      signUpDto.password === signUpDto.confirm ? true : false;

    const userExistsByUsername = await this.findUserByUsername(
      signUpDto.username,
    );

    const userExistsByEmail = await this.findUserByEmail(signUpDto.email);

    const hashPassword = await argon2.hash(signUpDto.password);

    if (!isPasswordValid)
      throw new BadRequestException("Passwords doesn't match.");

    if (userExistsByUsername) {
      throw new ConflictException('This username is already exists.');
    }

    if (userExistsByEmail) {
      throw new ConflictException('This email has been already taken.');
    }

    try {
      const user = await new this.userModel({
        username: signUpDto.username,
        email: signUpDto.email,
        password: hashPassword,
      });

      await user.save();

      const userClone: User = JSON.parse(JSON.stringify(user));
      delete userClone.password;

      return this.signToken(user.id, user.username, user.email);
    } catch (e) {
      throw e;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({
      $or: [
        {
          email: signInDto.credential,
        },
        {
          username: signInDto.credential,
        },
      ],
    });

    if (!user) throw new NotFoundException("This user doesn't exists.");
    const hashPassword = await argon2.verify(user.password, signInDto.password);
    if (!hashPassword) throw new UnauthorizedException('Incorrect password.');

    const userClone: User = JSON.parse(JSON.stringify(user));
    delete userClone.password;
    return this.signToken(user.id, user.username, user.email);
  }

  private async findUserByUsername(name: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      username: name,
    });

    return user ? true : false;
  }

  private async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      email: email,
    });
    return user ? true : false;
  }

  async signToken(
    id: string,
    username: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const secret = await this.config.get('auth.secret');
    const expiresIn = await this.config.get('auth.expiresIn');

    const payload = {
      sub: id,
      username,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      secret,
      expiresIn,
    });
    return {
      access_token: token,
    };
  }
}
