interface StdMarksType{
    name: string;
    marks: number[] 
}
//creating class- use the class keyword
class StudentMarks {
    name: string;
    marks: number[];
    //adding a constructor
    constructor(studObj: StdMarksType) {
        //initiliaze the properties
        this.name = studObj.name
        this.marks= studObj.marks
    }
}


//adding arguments to a constructor

//class properties
//default values(property Initializer)
class Album1{
    title="Unknown Album";
    artist= "Me"
    releaseYear= 2000;
}
//overriding them in a constructor

//readonly

//optional properties
class Album4{
    title?:string;
    artist?: string;
    releaseYear?:number;
}

//methods- defined within a class
//1. 
interface AlbumOptions{
    title: string;
    artist: string;
    releaseYear: number;
}
class Album7{
    title="Unknown Album";
    artist= "Me"
    releaseYear= 2000;

    constructor(opts: AlbumOptions){
        this.title= opts.title;
        this.artist=opts.artist;
        this.releaseYear= opts.releaseYear;
    }
}

//inheritance- use extends
class SpecialEditionAlbum extends Album7{
    bonusTracks: string[]
    constructor(opts:  { title: string; artist: string;releaseYear: number;bonusTracks: string[]}){
        super(opts)//call the parent class constructor
        this.bonusTracks= opts.bonusTracks
    }
}
//getters and setters
