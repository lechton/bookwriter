export default async function ({ page, sleep, snap }) {
  await page.evaluate(() => {
    document.querySelector('#plain').innerHTML =
      '<input id="hv" value="John">' +
      '<select id="hs"><option value="a">A</option><option value="b" selected>B</option></select>' +
      '<input type="checkbox" id="hc" checked>' +
      '<input type="checkbox" id="hn">';
  });
  for (const id of ['#d', '#r', '#hv']) {
    await page.click(id);
    await page.keyboard.press('End');
    await page.keyboard.type('ny');
    await sleep(150);
  }
  await page.select('#hs', 'a');
  await page.click('#hc');
  await sleep(200);
  const facts = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const opt = q('#hs').options[1];
    return {
      reactDefaultValue: { attribute: q('#d').getAttribute('value'), defaultValue: q('#d').defaultValue, value: q('#d').value },
      reactReadOnly: { value: q('#r').value, changesLine: document.querySelector('p').textContent },
      plainHtmlValue: { attribute: q('#hv').getAttribute('value'), defaultValue: q('#hv').defaultValue, value: q('#hv').value },
      plainSelected: { selectedAttribute: opt.hasAttribute('selected'), defaultSelected: opt.defaultSelected, selectedNow: opt.selected, selectValue: q('#hs').value },
      plainChecked: { checkedAttribute: q('#hc').hasAttribute('checked'), defaultChecked: q('#hc').defaultChecked, checkedNow: q('#hc').checked },
      checkboxValueWithoutAttribute: q('#hn').value,
    };
  });
  console.log('== FACTS ' + JSON.stringify(facts, null, 1));
  await snap('after typing ny into each box');
}
