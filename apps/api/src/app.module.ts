import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {ThrottlerModule} from "@nestjs/throttler";
import {TaskModule} from "./task/task.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: (config: Record<string, unknown>) => {
        if (!config.MONGODB_URI) {
          throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        return config;
      }
    }),
    MongooseModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('MONGODB_URI'),
        })
      }
    ),
    TaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
