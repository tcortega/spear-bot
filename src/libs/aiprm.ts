import { Prompt } from '../types/aiprm.js';

export default class AIPRMWrapper {
    private prompts: Prompt[] = [];
    private readonly endpoint = 'https://api.aiprm.com/api3/Prompts?Community=&OwnerExternalID=user-dhHa1uzqFLjTIKvOy5KXF133&OwnerExternalSystemNo=1&SortModeNo=2&UserFootprint=';


    constructor() {
        this.fetchPrompts();
        setInterval(() => {
            this.fetchPrompts();
        }, 1800000);
    }

    private async fetchPrompts(): Promise<void> {
        const response = await fetch(this.endpoint);
        const data = await response.json();

        this.prompts = data.map((item: any, index: number): Prompt => ({
            id: index + 1,
            title: item.Title.trim(),
            prompt: item.Prompt.trim(),
            promptHint: item.PromptHint.trim(),
            teaser: item.Teaser.trim(),
            category: item.Category,
            votes: item.Votes,
            usages: item.Usages,
            revisionTime: item.RevisionTime,
        }));
    }

    public getPrompts(page: number, pageSize: number): Prompt[] {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return this.prompts.slice(start, end);
    }

    public getById(promptId: number): Prompt {
        return this.prompts[promptId - 1];
      }

    public search(query: string, page: number, pageSize: number): Prompt[] {
        const matchedPrompts = this.prompts.filter(
            (prompt) =>
                prompt.title.toLowerCase().includes(query.toLowerCase()) ||
                prompt.teaser.toLowerCase().includes(query.toLowerCase())
        );

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return matchedPrompts.slice(startIndex, endIndex);
    }
}
