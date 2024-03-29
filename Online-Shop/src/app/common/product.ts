export class Product {

  constructor(public productId: number,
    public upc: string,
    public name: string,
    public description: string,
    public unitPrice: number,
    public imageUrl: string,
    public active: boolean,
    public unitsInStock: string,
    public dateCreated: Date,
    public lastUpdated: Date){}
}
