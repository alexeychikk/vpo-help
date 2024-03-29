import { EmailTemplate } from './emailTemplate';

export class VpoVerificationTemplate extends EmailTemplate<{
  verificationCode: string;
}> {
  subject = `КОД ПІДТВЕРДЖЕННЯ РЕЄСТРАЦІЇ В ЦЕНТРІ «ЖИТТЄЛЮБ ПІКЛУЄТЬСЯ»`;

  render() {
    return `
<style>
body {
  text-align: center;
  background-color: #FAFAFA;
  color: #212121;
}
.hint {
  font-size: 16px;
}
.v-code {
  padding: 8px;
  margin: 0 auto;
  border: 4px solid #0D47A1;
  border-radius: 8px;
  background-color: #FFFDE7;
  font-size: 48px;
  max-width: 6em;
}
</style>
<p class="hint">
  Для завершення <b>реєстрації</b> введіть наступний код у формі реєстрації <br/>
  до <b>Центру підтримки людей зі статусом ВПО «Життєлюб піклується»</b>:
</p>
<h1 class="v-code">${this.data.verificationCode}</h1>
`;
  }
}
