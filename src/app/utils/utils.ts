import { Position } from '../chessboard/model/piece'

export const dataURItoBlob = (dataURI, imageType) => {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: imageType });
  return blob;
};

export const createImageFromBlob = (image: any, imageType: string) => {
  const imageBlob = dataURItoBlob(image, imageType);
  const reader = new FileReader();
  const promise = new Promise(resolve => {
    reader.addEventListener('load', () => {
      resolve(reader.result);
    }, false);
  });
  reader.readAsDataURL(imageBlob);
  return promise;
};


export const hashCode = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function intToRGB(i) {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

export const stringToColor = (str) => {
  //return intToRGB(hashCode(str.split(''). reverse(). join('')));
  return colorize(str);
}

function colorize(str) {
  for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
  var color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
  return Array(6 - color.length + 1).join('0') + color;
}

export const piecesShort = { pawn: '', bishop: 'B', horse: 'N', queen: 'Q', rook: 'R', king: 'Q' };
export const formatPosition = (p: Position) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][p.x] + (7 - p.y + 1);

