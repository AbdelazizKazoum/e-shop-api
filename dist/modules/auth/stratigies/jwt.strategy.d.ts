import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): {
        id: string;
        lastName: string;
        firstName: string;
        email: string;
        role: string;
    };
}
export {};
