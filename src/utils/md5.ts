import { MD5 } from 'crypto-js';
export function md5Encode(raw: string): string {
  return MD5(raw).toString();
}
