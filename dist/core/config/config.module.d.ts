import { DynamicModule } from '@nestjs/common';
import * as Joi from 'joi';
export declare class ConfigModule {
    static forRoot(schema: Joi.ObjectSchema): DynamicModule;
}
