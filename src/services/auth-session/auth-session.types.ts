export type AuthSession = {
  userId: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshExpiresAt: string;
};
