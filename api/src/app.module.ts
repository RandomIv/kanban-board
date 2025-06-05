import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BoardModule,
    AuthModule,
    CardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
