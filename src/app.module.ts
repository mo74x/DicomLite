import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudiesModule } from './studies/studies.module';

@Module({
  imports: [StudiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
