import {expect, test} from '@playwright/test'
import { throwIfAlreadyLoaded } from '../src/app/@core/module-import-guard';
import { DialogComponent } from '../src/app/pages/modal-overlays/dialog/dialog.component';


test.beforeEach(async ({page})=>{
    await page.goto('http://localhost:4200/');
    

})
test.describe('Form layouts page', () =>{
    test.beforeEach(async({page}) =>{
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('Input fields', async({page}) =>{
        const usingTheGridEmailInput = page.locator('nb-card', {hasText:'Using the Grid'}).getByRole('textbox', {name:"Email"});
        await usingTheGridEmailInput.fill('test1@test.com')
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay:200});

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText:'Using the Grid'});
        
        //await usingTheGridForm.getByLabel('Option 1').check({force: true});
        await usingTheGridForm.getByRole('radio', {name:"Option 1"}).check({force:true});
        const radioStatus = await usingTheGridForm.getByRole('radio', {name:"Option 1"}).isChecked();

        expect(radioStatus).toBeTruthy();
        
        
        await expect(usingTheGridForm.getByRole('radio', {name:"Option 1"})).toBeChecked();



        await usingTheGridForm.getByRole('radio', {name:"Option 2"}).check({force:true});
        expect(await usingTheGridForm.getByRole('radio', {name:"Option 1"}).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', {name:"Option 2"}).isChecked()).toBeTruthy();




    })
})

test('Checkboxes', async({page}) =>{
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Popover').click();
    await page.getByText('Toastr').click();
    await page.getByRole('checkbox', {name:"Hide on click"}).click({force:true})
    await page.getByRole('checkbox', {name:"Prevent arising of duplicate toast"}).click({force:true})
    await page.getByRole('checkbox', {name:"Show toast with icon"}).click({force:true})


    const allBoxes = page.locator('nb-checkbox').getByRole('checkbox')

    for(const box of await allBoxes.all()){

        await box.check({force:true});
        expect(await box.isChecked()).toBeTruthy();
    }



})

test('Lists and Dropdowns', async({page}) =>{
    //button to change forn of the page
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    page.getByRole('list');// When list has a UL tag
    page.getByRole('listitem') //When the list has LI tag
    const optionList = page.locator('.option-list nb-option');
    await expect(optionList).toHaveText(['Light','Dark','Cosmic','Corporate']);
    
    await optionList.filter({hasText:'Cosmic'}).click()
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color','rgb(50, 50, 89)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }
    await dropDownMenu.click();
    for(const color in colors) {
        await optionList.filter({hasText:color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color != 'Corporate')
            await dropDownMenu.click();

    }


    
})

test('Tooltip', async({page}) =>{
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();
    const toolTipPlacementCard = page.locator('nb-card', {hasText: 'Tooltip Placement'});
    await toolTipPlacementCard.getByRole('button', {name: 'TOP'}).hover();


    const tooltip = await page.locator('nb-tooltip').textContent()


     expect(tooltip).toEqual('This is a tooltip');

})

test('Dialogs', async({page}) =>{
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept();
    })
    await page.getByRole('table').locator('tr',{hasText:'mdo@gmail.com'}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('Tables 1', async({page}) =>{
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //get the row by email
    const targetRow = await page.getByRole('row', {name:'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder("Age").clear();
    await page.locator('input-editor').getByPlaceholder("Age").fill('35');
    await page.locator('.nb-checkmark').click();

    //get the row by id
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()

    const targetRowById = page.getByRole('row',{name:'11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click();

    await page.locator('input-editor').getByPlaceholder("E-mail").clear();
    await page.locator('input-editor').getByPlaceholder("E-mail").fill('test@test.com')
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //use filter
    let ages = ['20', '30', '40' ,'200'];

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder("Age").clear();
        await page.locator('input-filter').getByPlaceholder("Age").fill(age);
        await page.waitForTimeout(1000)
        const ageRow = page.locator('tbody tr');
        for(let row of await ageRow.all()){
            const cellValue = await row.locator('td').last().textContent();
            if(parseInt(age)>100)
                expect(await page.locator('tbody td').textContent()).toContain('No data found')
            else {
                expect(cellValue).toEqual(age);  
            }        
        }
    }



})
test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 7)
    const expectedDate = date.getDate().toString()
    const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    // Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x +100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})