import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { Model } from 'mongoose';
import { Role } from '../role.enum';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWT') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    email: string;
    role: Role[];
  }) {
    const user = await this.userModel.findById(payload.sub);

    if (user) {
      const userDeepClone: User = JSON.parse(JSON.stringify(user));
      delete userDeepClone.password;
      return userDeepClone;
    }
  }
}
