import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { Model } from 'mongoose';
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

  async validate(payload: { sub: string; username: string; email: string }) {
    const user = await this.userModel.findOne({
      $or: [
        {
          username: payload.username,
        },
        {
          email: payload.email,
        },
      ],
    });
    const userDeepClone: User = JSON.parse(JSON.stringify(user));
    delete userDeepClone.password;
    return user;
  }
}