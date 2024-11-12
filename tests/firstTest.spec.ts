import {expect, test} from '@playwright/test'


test.beforeEach(async ({page})=>{
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();

})

test('Locator syntax rules', async({page})=>{
    //by tag name
    await page.locator('input')

    //by ID
    page.locator('#inputEmail')

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute 
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]')

    //combine different seectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath not recommended
    page.locator('//*[@id="inputEmail]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact match
    page.locator(':text-is("Using the Grid")')

    
})


test('User facing locators', async ({page}) =>{
    await page.getByRole('textbox', {name: "Email"}).first().click();
    await page.getByRole('button', {name: "Sign in"}).first().click();
    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the Grid').click();
    await page.getByTestId('SignIn').click();

    await page.getByTitle('IoT Dashboard').click();

})


test('Locating child elements', async ({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio ').locator(':text-is("Option 2")').click();  
    await page.locator('nb-card').getByRole('button', {name:'Sign in'}).first().click();
    await page.locator('nb-card').nth(1).getByRole('button').click();
})

test('Locating Parent elements', async ({page}) => {
    await page.locator('nb-card',{hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click();
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).first().fill("test");
    await page.locator('nb-card').filter({hasText:"Basic form"}).getByRole('textbox', {name: "Email"}).fill("test");
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).fill("test");
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('button', {name: "Submit"}).click();
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText:'Sign in'}).getByRole('textbox', {name: "Email"}).fill("test");
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).getByRole('button', {name:'Sign in'}).click();
    //XPath
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).fill("test5");

})

test('Reusing locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText:"Basic form"});
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    await emailField.fill("test@test.com");
    await basicForm.getByRole('textbox', {name: "Password"}).fill("Welcom123");
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button', {name: "Submit"}).click();


    await expect(emailField).toHaveValue('test@test.com');

})
test('Extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText:"Basic form"});
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //get all text values
    const gridForm = page.locator('nb-card').filter({hasText:"Using the Grid"});
    const radioButtons = await gridForm.locator('nb-radio').allTextContents();
    console.log(radioButtons);

    expect(radioButtons).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    await emailField.fill("test@test.gr");
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@test.gr')
    //get atribute value
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email')
})


test('Assertions', async({page}) => {
    //general assertions
    const value = 5;

    expect(value).toEqual(5)

    const basicFormButton = page.locator('nb-card').filter({hasText:"Basic form"}).locator('button');
    const basicFormButtonText = await basicFormButton.textContent();

    expect(basicFormButtonText).toEqual('Submit');

    //locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertion
    //continue test running with keyword soft
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click();

})