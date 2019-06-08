import { Deserializable } from './deserializable';

export class SimplePiece implements Deserializable{

  color: string;
  type: string;
  get isWhite(): boolean {
    return this.color === 'WHITE';
  }
  getType(){
    return this.type;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  constructor( color: string, type: string){
    this.color = color;
    this.type  = type;
  }
}
