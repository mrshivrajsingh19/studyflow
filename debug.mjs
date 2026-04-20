import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', exception => {
    console.log('Uncaught exception:', exception);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });

  await page.goto('http://localhost:5173/');
  
  try {
    // Attempt clicking use demo credentials if not logged in
    const demoBtn = page.getByText('Use Demo Credentials');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
      await page.waitForTimeout(2000); // wait for auth
    }

    console.log('Clicking Smart Notes...');
    await page.getByText('Smart Notes', { exact: false }).first().click();
    await page.waitForTimeout(2000);

    console.log('Clicking Subjects...');
    await page.getByText('Subjects', { exact: false }).first().click();
    await page.waitForTimeout(2000);
    
    console.log('Done scanning.');
  } catch (e) {
    console.log('Test caught error: ', e);
  }
  
  await browser.close();
})();
