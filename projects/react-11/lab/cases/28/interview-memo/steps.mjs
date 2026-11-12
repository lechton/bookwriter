import { buttons, clickText } from '../helper.mjs';
export default async function ({ page, sleep }) {
  console.log('on load:', JSON.stringify(await buttons(page)));
  await clickText(page, sleep, 'Toggle theme');
  console.log('after Toggle theme:', JSON.stringify(await buttons(page)));
  await clickText(page, sleep, 'Count 0');
  console.log('after Count:', JSON.stringify(await buttons(page)));
}
