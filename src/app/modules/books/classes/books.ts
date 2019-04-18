import { BookInterface } from './../interfaces/books';

export class Book implements BookInterface {

    public id: number;
    public title: string;
    public price: number;
    public description?: string;

    constructor (
        id: number,
        title: string,
        price: number,
        description?: string
    ) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}
  