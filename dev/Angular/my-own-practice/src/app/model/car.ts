// when we want to use the data in a more structured way, like in forms or http requests, we use classes
export class Car {
    carId: number;
    brand: string;
    model: string;
    year: string;
    color: string;
    dailyRate: string;
    carImage: string;
    regNo: string;

    constructor(
        carId: number = 0,
        brand: string = "",
        model: string = "",
        year: string = "",
        color: string = "",
        dailyRate: string = "",
        carImage: string = "",
        regNo: string = ""
    ) {
        this.carId = carId;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.color = color;
        this.dailyRate = dailyRate;
        this.carImage = carImage;
        this.regNo = regNo;
    }
}
//used when just storing data in a list/ array
export interface ICarList {
    carId: number;
    brand: string;
    model: string;
    year: string;
    color: string;
    dailyRate: string;
    carImage: string;
    regNo: string;
}