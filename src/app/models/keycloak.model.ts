export interface KeycloakTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  scope?: string;
}

export interface KeycloakJwtPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  exp: number;
  iat: number;
  id?: number;
}
