import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import type { Response, Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from './decorators/authhorization.decorator';
import { Authorized } from './decorators/authorized.decorator';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create account',
    description: 'Create new user account',
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiConflictResponse({ description: 'Email busy' })
  @ApiBadRequestResponse({ description: 'Validator eror' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return await this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Login account',
    description: 'Login',
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiBadRequestResponse({ description: 'Validator eror' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return await this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Update token',
    description: 'Update token2',
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Token eror' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }

  @Authorization()
  @Get('@me')
  @HttpCode(HttpStatus.OK)
  async me(@Authorized() user: User) {
    return user;
  }
}
