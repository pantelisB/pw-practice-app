
import {Locator, Page} from "@playwright/test"


export class NavigationPage {

    readonly page: Page;
    readonly formLayoutMenuItem: Locator;
    readonly datePickerMenuItem: Locator;

    
    constructor(page: Page){
        this.page = page;
        this.formLayoutMenuItem = page.getByText('Form Layouts');
        this.datePickerMenuItem = page.getByText('Datepicker');

    }

    async formLayoutsPage(){
        //await this.page.getByText('Forms').click();
        await this.selectGroupMenuItem('Forms');

        await this.formLayoutMenuItem.click();
    }

    async datePickerPage(){
        //await this.page.getByText('Forms').click();
        await this.selectGroupMenuItem('Forms');

        //await this.page.waitForTimeout(1000);
        await this.page.getByText('Datepicker').click();
    }
    async smartTablePage(){
        //await this.page.getByText('Tables & Data').click();
        await this.selectGroupMenuItem('Tables & Data');

        await this.page.getByText('Smart Table').click();
    }
    async toastrPage(){
        //await this.page.getByText('Modal & Overlays').click();
        await this.selectGroupMenuItem('Modal & Overlays');

        await this.page.getByText('Toastr').click();
    }

    async tooltipPage(){
        //await this.page.getByText('Modal & Overlays').click();
        await this.selectGroupMenuItem('Modal & Overlays');
        
        await this.page.getByText('Tooltip').click();
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');

        if(expandedState == "false")
            await groupMenuItem.click();
    }
}