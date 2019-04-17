export interface BookInterface {
    id: number;
    title: string;
    description?: string;
    price: number;
}

export class Book implements BookInterface {
    constructor (
        public id: number,
        public title: string,
        public price: number,
        public description?: string
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
    }

    // getTitle(): string {
    //     return this.title;
    // }
}
