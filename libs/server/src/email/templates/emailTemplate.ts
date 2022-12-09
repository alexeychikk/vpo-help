export abstract class EmailTemplate<
  D extends Record<string, unknown> = Record<string, unknown>,
> {
  from?: string;
  to?: string;
  subject?: string;
  data: D;

  constructor({ from, to, subject, ...data }: D & EmailTemplateHeader) {
    if (from) this.from = from;
    if (to) this.to = to;
    if (subject) this.subject = subject;
    this.data = data as D;
  }

  abstract render(): string | EmailTemplateRenderResult;
}

export type EmailTemplateHeader = {
  from?: string;
  to?: string;
  subject?: string;
};

export type EmailTemplateRenderResult = EmailTemplateHeader & {
  html: string;
};
