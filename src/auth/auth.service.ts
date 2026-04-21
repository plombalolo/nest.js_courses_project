import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { LoginRequest } from './dto/login.dto';
import { Response, Request } from 'express';
import { isDev } from 'src/utils/is-dev.util';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET!: string;
  private readonly JWT_ACCESS_TOKEN_TTL!: string;
  private readonly JWT_REFRESH_TOKEN_TTL!: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    ((this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET')),
      (this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_TTL',
      )),
      (this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_TTL',
      )));
  }

  async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new ConflictException('Emaill busy');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });
    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new NotFoundException('Password or mail error');
    }
    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshtoken'];

    if (!refreshToken) {
      throw new UnauthorizedException(' Refresh Token used');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.auth(res, user.id);
    }
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7));

    return { accessToken };
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.configService.get('COOKIE_DOMAIN'),
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
