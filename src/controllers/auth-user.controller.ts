import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthUserService } from '../services/auth-user.service';

@Controller('auth')
export class AuthUserController {
  constructor(private authService: AuthUserService) {
    this.authService = authService;
  }
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthUserCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthUserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
