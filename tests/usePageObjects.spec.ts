import {expect, test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'



test.beforeEach(async ({page})=>{
    await page.goto('http://localhost:4200/');
})


test('Navigate to form page', async ({page}) =>{
    const pm = new PageManager(page)
    
    
    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();

    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();

})

test('Login', async ({page}) =>{
    const pm = new PageManager(page)


    await pm.navigateTo().formLayoutsPage();
    await pm.onformLayoutsPage().submitUsingTheGrid('test@test.com', "Test1234",'Option 1'); 
    await pm.navigateTo().datePickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6,10)

})