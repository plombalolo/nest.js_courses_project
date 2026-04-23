import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStretegy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly ConfigService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignireExpiration: false,
      secretOrKey: ConfigService.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return await this.authService.validate(payload.id);
  }
}
