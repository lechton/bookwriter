export default async function ({ page, sleep }) {
  await page.evaluate(() => {
    let count = 0;
    count = count + 1;
    console.log('P1 plain let: ' + count);

    function render(number) {
      function handleNext() {
        console.log('P2 closure: ' + number);
      }
      return handleNext;
    }
    const first = render(12);
    const second = render(13);
    first();
    second();
    first();

    function render3(number) {
      return function handleNext() {
        setTimeout(() => console.log('P3 timer: ' + number), 300);
      };
    }
    render3(12)();
    render3(13)();
  });
  await sleep(600);
}
