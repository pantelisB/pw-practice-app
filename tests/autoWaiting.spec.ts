import {expect, request, test} from '@playwright/test'


test.beforeEach(async ({page})=>{
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('button Triggering AJAX Request').click();
})

test('auto waiting', async({page})=>{
    const successButton = page.locator('.bg-success');
    //await successButton.click();

    //const text = await successButton.textContent()
    //expect(text).toEqual('Data loaded with AJAX get request.')

    /*await successButton.waitFor({state:'attached'})
    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.')*/

    await expect(successButton).toHaveText('Data loaded with AJAX get request.',{timeout:16500});
})

test('alternative waits', async ({page})=>{
    const successButton = page.locator('.bg-success');
    //example 1
    //wait for element
    //await page.waitForSelector('.bg-success');

    //wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed(Not recommended)
    //await page.waitForLoadState('networkidle');
    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.')
})


test.only('timeouts', async({page})=>{
    //test.setTimeout(10000);
    //test.slow();
    const successButton = page.locator('.bg-success');
    await successButton.click();
})