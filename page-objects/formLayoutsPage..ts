import {Locator, Page} from "@playwright/test"
import { HelpeBase } from '../page-objects/helperBase';

export class FormLayoutsPage extends HelpeBase{

    //private readonly page: Page;
    readonly formLayoutMenuItem: Locator;
    readonly datePickerMenuItem: Locator;

    
    constructor(page: Page){
        super(page);        
    }
    /**
     * 
     * @param email 
     * @param password 
     * @param optionText 
     */
    async submitUsingTheGrid(email:string, password:string, optionText:string){
        const help = new HelpeBase(this.page)
        help.waitForNumberOfSeconds(6)

        const usingTheGridForm = this.page.locator('nb-card', {hasText:'Using the Grid'})//.getByRole('textbox', {name:"Email"});
        await usingTheGridForm.getByRole('textbox', {name:'Email'}).clear();
        await usingTheGridForm.getByRole('textbox', {name:'Email'}).pressSequentially(email, {delay:200});
        await usingTheGridForm.getByRole('textbox', {name:'Password'}).clear();
        await usingTheGridForm.getByRole('textbox', {name:'Password'}).pressSequentially(password, {delay:200});
        await usingTheGridForm.getByRole('radio', {name: optionText}).check({force:true});
        await usingTheGridForm.getByRole('button').click({force:true});
    
    }

    /**
     * This method sumbits Inline Form
     * @param name - provide a valid user first and last name
     * @param email - provide a valid email that belongs this this user
     * @param rememberMe - set it to true is select checkbox and to false if not select is
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){
        const inlineForm = this.page.locator('nb-card').filter({ hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
        if(rememberMe)
            await inlineForm.getByRole('checkbox').check({force: true})
        await inlineForm.getByRole('button').click()
    }
}