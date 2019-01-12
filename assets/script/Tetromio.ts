const {ccclass, property} = cc._decorator;

export enum Shape {
    O,
    L,
    Z,
    T,
    J,
    S,
}

interface TopLeft{
    row:number,
    col:number,
}

const jTetromino = [
                    [[0,1],
                    [0,1],
                    [1,1]],
                    [[1,0,0],
                    [1,1,1]],
                    [[1,1],
                    [1,0],
                    [1,0]],
                    [[1,1,1],
                    [0,0,1]]
                            ];

 const oTetromino = [[[1,1],
                    [1,1]]];
                       
 const lTetromino = [
                        [[1,0],
                        [1,0],
                        [1,1]],
                        [[1,1,1],
                        [1,0,0]],
                        [[1,1],
                        [0,1],
                        [0,1]],
                        [[0,0,1],
                        [1,1,1]]
                                ];

 const zTetromino = [
                        [[1,1,0],
                        [0,1,1]],
                        [[1,0],
                        [1,1],
                        [0,1]]
                                ];

const tTetromio = [
    [[0,1,0],
     [1,1,1]],
    [[1,0],
     [1,1],
     [1,0]],
     [[1,1,1],
      [0,1,0]],
      [[0,1],
      [1,1],
      [0,1]]
]

const sTetromio = [
    [[0,1,1],
    [1,1,0]],
    [[0,1,0],
    [0,1,1],
    [0,0,1]]
]

export class Tetromio {
    public shape:number[][];
    public topLeft?:TopLeft;
    public potationTopLeft?:TopLeft;
    public landedArray: number[][];
    private dict:{[key:string]:number[][]};
    private currentShape:Shape;

    constructor(row:number,column:number){
        this.landedArray = [];
        for(let i = 0 ; i < row ; i++){
            this.landedArray[i] = [i];
            for(let j = 0 ; j < column ; j++){
                this.landedArray[i][j] = 0;
            }
        }
        this.topLeft = {row:0,col:4}
        this.potationTopLeft = {row:1,col:4}
        console.log(this.landedArray);
    }

    public addShape(shape:Shape):void{
        this.currentShape = shape;
        this.dict = {
            [Shape.O]: [[1,1],
                        [1,1]],
            [Shape.L]: [[1,0],
                        [1,0],
                        [1,1]],
            [Shape.Z]: [[1,1,0],
                        [0,1,1]],
            [Shape.T]: [[0,1,0],
                        [1,1,1]],
            [Shape.J]: [[0,1],
                        [0,1],
                        [1,1]],
            [Shape.S]: [[0,1,1],
                        [1,1,0]]
        }
    }

    public getLandedArray():number[][]{
        return this.landedArray;
    }
    
    public getShape():number[][]{
        return this.dict[this.currentShape];
    }

    public getRotationShape(shape:Shape): number[][][]{
        let dict:{[key:string]:number[][][]} = { 
            [Shape.O]: oTetromino,
            [Shape.L]: lTetromino,
            [Shape.Z]: zTetromino,
            [Shape.T]: tTetromio,
            [Shape.J]: jTetromino,
            [Shape.S]: sTetromio
        }
        return dict[shape];
    }
}
