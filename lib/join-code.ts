const JOIN_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const JOIN_CODE_LENGTH = 6;

export function generateJoinCode() {
  let joinCode = "";

  for (let index = 0; index < JOIN_CODE_LENGTH; index += 1) {
    const randomIndex = Math.floor(
      Math.random() * JOIN_CODE_ALPHABET.length
    );
    joinCode += JOIN_CODE_ALPHABET[randomIndex];
  }

  return joinCode;
}
