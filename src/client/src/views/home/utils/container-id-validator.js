export default class ContainerIdValidator {
  validate = (containerId = '') => {
    const containerIdChars = [...containerId.substr(0, containerId.length - 1)];
    const lastChar = containerId.slice(containerId.length - 1);
    let total = 0;

    containerIdChars.forEach((char, index) => {
      if (isLetter(char)) {
        char = characterNumberMapper[char];
      }

      total += char * Math.pow(2, index);
    });

    const checkNumber = total % 11;

    if (checkNumber.toString() === lastChar) {
      return true;
    }

    return false;
  };
}

const characterNumberMapper = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38,
};

const isLetter = str => {
  return str.length === 1 && str.match(/[a-z]/i);
};
