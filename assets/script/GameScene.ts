import { Tetromio, Shape } from "./Tetromio";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameScene extends cc.Component {
    @property(cc.Prefab)
    public block: cc.Prefab | null = null;

    @property(cc.Node)
    public grid: cc.Node | null = null;

    private press: number = 0;
    private landed?: number[][];
    private currentTetromio?: Tetromio;
    private collide: boolean = false;
    private xPos: number = 4;
    private yPos: number = 1;

    public onLoad(): void {
        this.currentTetromio = new Tetromio(12, 10);
        this.currentTetromio.addShape(Shape.Z);
        this.currentTetromio.shape = this.currentTetromio.getShape();
        this.landed = this.currentTetromio.getLandedArray();
        this.createGrid();
        this.schedule(this.updatePos, 1);
        this.drawShape();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    public onKeyDown(event: cc.Event.EventKeyboard): void {
        this.press++;
        let shape = this.currentTetromio.getShape();
        const rotationShape = this.currentTetromio.getRotationShape(Shape.Z);
        let marcro = cc.macro;
        switch (event.keyCode) {
            case marcro.KEY.a: {
                if (this.press >= rotationShape.length) {
                    this.press = 0;
                }
                this.currentTetromio.shape = rotationShape[this.press];
                this.drawShape();
                break;
            }
            case marcro.KEY.left: {
                this.currentTetromio.topLeft.col--;
                this.checkEdgeCollider();
                this.drawShape();
                break;
            }
            case marcro.KEY.right: {
                this.currentTetromio.topLeft.col++;
                this.checkEdgeCollider()
                this.drawShape();
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }

    private createGrid(): void {
        const row = 12;
        const colunm = 10;
        const layout = this.grid.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.spacingY = 1;
        for (let i = 0; i < row; i++) {
            const node = cc.instantiate(this.block);
            const nodeLayout = node.addComponent(cc.Layout);
            nodeLayout.type = cc.Layout.Type.HORIZONTAL;
            nodeLayout.spacingX = 1;
            for (let j = 0; j < colunm; j++) {
                const prefab = cc.instantiate(this.block);
                node.addChild(prefab);
            }
            this.grid.addChild(node);
        }
        console.log(this.node.children.length + "," + this.node.children[0].children.length);
    }

    private checkEdgeCollider(): boolean {
        this.collide = false;
        const gridLength = this.grid.children[0].children.length;
        for (let row = 0; row < this.currentTetromio.shape.length; row++) {
            for (var col = 0; col < this.currentTetromio.shape[row].length; col++) {
                if (this.currentTetromio.topLeft.col + this.currentTetromio.shape[row][col] <= 0) {
                    this.currentTetromio.topLeft.col = 0
                    this.collide = true;
                    return;
                }
                //this block would be to the left of the playing field

                if (this.currentTetromio.topLeft.col + this.currentTetromio.shape[row][col] >= this.grid.children[0].children.length - 1) {
                    this.currentTetromio.topLeft.col = gridLength - this.currentTetromio.shape[0].length;
                    this.collide = true;
                    return;
                    //this block would be to the right of the playing field
                }
                if (col + this.currentTetromio.topLeft.col === this.grid.children.length) {
                    this.collide = true;
                    break;
                    //this block would be to the end of the playing field
                }
                if (this.landed[row + this.currentTetromio.topLeft.row][col + this.currentTetromio.topLeft.col] !== 0) {
                    this.collide = true;
                    break;
                    //the space is taken
                }
            }
        }
        return this.collide;
    }

    public updatePos(): void {
        if (this.checkLanded()) {
            this.addLanded();
            this.resetPos();
            return;
        }
        this.currentTetromio.topLeft.row++;
        this.drawShape();
    }

    public drawShape(): void {
        const gridRow = this.grid.children.length;
        for (let i = 0; i < gridRow; i++) {
            const gridCol = this.grid.children[i].children.length;
            for (let j = 0; j < gridCol; j++) {
                this.grid.children[i].children[j].color = cc.Color.WHITE;
            }
        }

        const tetrominoRow = this.currentTetromio.shape.length;
        for (let row = 0; row < tetrominoRow; row++) {
            const tetrominoCol = this.currentTetromio.shape[row].length;
            for (var col = 0; col < tetrominoCol; col++) {
                if (this.currentTetromio.shape[row][col] != 0) {
                    this.grid.children[this.currentTetromio.topLeft.row + row].children[this.currentTetromio.topLeft.col + col].color = cc.Color.YELLOW;
                }
            }
        }

        for (let row = 0; row < this.landed.length; row++) {
            for (var col = 0; col < this.landed[row].length; col++) {
                if (this.landed[row][col] != 0) {
                    this.grid.children[row].children[col].color = cc.Color.YELLOW;
                }
            }
        }
    }

    public checkLanded(): boolean {
        let collide = false;
        cc.log(this.currentTetromio.shape);
        const tetrominoShape = this.currentTetromio.shape;
        const rowLength = tetrominoShape.length;
        for (let row = 0; row < rowLength; row++) {
            const colLength = tetrominoShape[row].length;
            for (var col = 0; col < colLength; col++) {
                cc.log(this.landed);
                if (rowLength + this.currentTetromio.topLeft.row >= this.landed.length) {
                    collide = true;
                    break;
                }
                if (this.landed[(row + 1) + this.currentTetromio.topLeft.row][col + this.currentTetromio.topLeft.col] !== 0
                    && this.currentTetromio.shape[row][col] !== 0) {
                    collide = true;
                    break;
                }
                // else if (this.landed[(row + 1)+ this.currentTetromio.topLeft.row][col+ this.currentTetromio.topLeft.col] !== 0
                //          && this.currentTetromio.shape[row][col] !== 0) {
                //     collide = true;
                //     break;
                // } else {
                //     collide = false;
                // }
            }
        }
        return collide;
    }

    public addLanded(): void {
        const rowLength = this.currentTetromio.shape.length;
        for (var row = 0; row < rowLength; row++) {
            const colLength = this.currentTetromio.shape[row].length;
            for (var col = 0; col < colLength; col++) {
                if (this.currentTetromio.shape[row][col] != 0) {
                    this.landed[row + this.currentTetromio.topLeft.row][col + this.currentTetromio.topLeft.col] = this.currentTetromio.shape[row][col];
                }
            }
        }
        this.currentTetromio.topLeft.row = 0;
        this.currentTetromio.potationTopLeft.row = 1;
    }

    public resetPos(): void {
        this.currentTetromio.topLeft = { row: 0, col: 4 }
        this.currentTetromio.potationTopLeft = { row: 1, col: 4 }
    }

    public update(dt: number): void {
    }
}
