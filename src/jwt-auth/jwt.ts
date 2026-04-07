import { jwtDecode } from "jwt-decode";

type JwtPayloadWithExp = { exp?: number };

export function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode<JwtPayloadWithExp>(token);
  const now = Math.round(Date.now() / 1000);
  return !decoded?.exp || now >= decoded.exp;
}
