export type LoginGuardianResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshExpiresAt?: string;
  account: {
    id: string;
    role: "guardian" | "teacher" | "schoolAdmin";
    profile?: {
      fullName?: string;
      displayName?: string;
      [key: string]: unknown;
    };
  };
  passwordChangeRequired: boolean;
};

export type SignupCodeResponse = {
  challengeId: string;
  expiresIn: number;
};

export type PasswordResetRequestResponse = {
  challengeId: string;
  expiresIn: number;
  message: string;
};
