import { BookInterface } from './../interfaces/books';

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
}
  