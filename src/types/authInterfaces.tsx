export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface Session {
  user: { id: string; email: string; name: string };
  token: string;
  refreshToken: string;
  expiresIn: number;
  loggedIn: boolean;
}

export function NewSession(): Session {
  return {
    user: { id: "", email: "", name: "" },
    token: "",
    refreshToken: "",
    expiresIn: 0,
    loggedIn: false,
  };
}
