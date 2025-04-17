import svgCaptcha from 'svg-captcha';
import type { ConfigObject } from 'svg-captcha';
import { randomBytes } from 'crypto';

export type Captcha = {
  text: string;
  data: string;
};

