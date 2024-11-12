import { Page, expect } from "@playwright/test";


export class HelpeBase{
    readonly page:Page

    constructor(page: Page){
        this.page=page;
    }

    async waitForNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds * 1000);
    }
}