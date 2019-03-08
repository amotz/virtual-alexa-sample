'use strict';

const va = require("virtual-alexa");
const expect = require('chai').expect;

const model = "./models/ja-JP.json";
const handler = "./lambda/custom/index.js";

const alexa = va.VirtualAlexa.Builder()
  .handler(handler)
  .interactionModelFile(model)
  .create();

describe('スキルのE2E会話テスト', () => {
  it('スキル起動時のウェルカムメッセージ', async () => {
    const response = await alexa.launch();
    expect(response.prompt()).to.include('喫茶店へようこそ。ご注文は何になさいますか？');
  });
  it('スキルのヘルプ', async () => {
    const response = await alexa.intend('AMAZON.HelpIntent');
    expect(response.prompt()).to.include('このスキルでは、飲み物をオーダーすることができます。ご注文はいかが致しましょう？');
  });
  it('ダイアログモデルによる飲み物のオーダー', async () => {
    const request = await alexa.request()
      .intent("OrderIntent")
      .slot("drink", "コーヒー")
      .slot("amount", 2)
      .dialogState("COMPLETED")
    const response = await request.send();
    expect(response.prompt()).to.include('コーヒーを2つですね。少々お待ちください。');
  });
});