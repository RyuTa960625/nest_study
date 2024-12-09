import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local.strategy';
import { JwtAuthGuard } from './strategy/jwt.strategy';
import { Public } from './decorator/public.decorator';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Authorization } from './decorator/authorization.decorator';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBasicAuth()
  @Post('register')
  /// authorization: Basic $token
  registerUser(@Authorization() token: string){
    return this.authService.register(token);
  }

  @Public()
  @Post('login')
  @ApiBasicAuth()
  loginUser(@Authorization() token: string){
    return this.authService.login(token)
  }

  @Post('token/block')
  blockToken(
    @Body('token') token: string,
  ){
    return this.authService.tokenBlock(token);
  }

  @Post('token/access')
  async rotateAccessToken(@Request() req){
    return {
      accessToken: await this.authService.issueToken(req.user, false)
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/passport')
  async loginUserPassport(@Request() req) {
    return {
      refreshToken: await this.authService.issueToken(req.user, true),
      accessToken: await this.authService.issueToken(req.user, false),
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('private')
  // async private(@Request() req){
  //   return req.user;
  // }
}
