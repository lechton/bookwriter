import { typeInto } from '../_lib.mjs';
const caret = (page) => page.evaluate(() => { const i = document.querySelector('input'); return { value: i.value, caret: i.selectionStart }; });
export default async function ({ page, sleep }) {
  await typeInto(page, 'Name', 'ab'); await sleep(200);
  console.log('== after typing ab: ' + JSON.stringify(await caret(page)));
  await page.keyboard.press('Home'); await page.keyboard.type('c'); await sleep(200);
  console.log('== after Home and typing c, the caret should sit after C at 1: ' + JSON.stringify(await caret(page)));
}
