export interface BookInterface {
    id?: number;
    title: string;
    description?: string;
    price: number;
}

export interface BooksInterface {
    data: Array<BookInterface>;
}