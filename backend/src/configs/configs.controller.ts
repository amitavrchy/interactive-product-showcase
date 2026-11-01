import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ConfigsService } from './configs.service.js';
import { CreateConfigDto } from './dto/create-config.dto.js';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateConfigDto) {
    return this.configsService.create(user.id, dto);
  }

  @Get(':shareCode')
  findByShareCode(@Param('shareCode') shareCode: string) {
    return this.configsService.findByShareCode(shareCode);
  }
}
