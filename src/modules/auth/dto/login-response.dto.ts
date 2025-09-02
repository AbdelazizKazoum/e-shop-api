/* eslint-disable prettier/prettier */
// auth/dto/auth-response.dto.ts
export class AuthResponseDto {
  data: {
    sub: string; // user id
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    provider: string;
  };
  access_token: string;
  refresh_token: string;
}
