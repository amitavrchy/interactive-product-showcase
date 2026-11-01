import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';
import { CreateIntentDto } from './dto/create-intent.dto.js';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(OptionalJwtAuthGuard)
  createIntent(
    @Body() dto: CreateIntentDto,
    @CurrentUser() user?: AuthUser | null,
  ) {
    return this.paymentsService.createPaymentIntent({
      email: dto.email,
      name: dto.name,
      total: dto.total,
      itemsJson: dto.itemsJson,
      userId: user?.id,
    });
  }

  @Post('confirm')
  confirm(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmOrder(dto.paymentIntentId);
  }
}
