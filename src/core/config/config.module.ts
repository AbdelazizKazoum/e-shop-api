// libs/common/config/config.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({})
export class ConfigModule {
  static forRoot(schema: Joi.ObjectSchema): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          validationSchema: schema, // schema is now passed dynamically
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
