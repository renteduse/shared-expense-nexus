
/**
 * Generates a random invite code for groups
 * @returns {string} A 6 character alphanumeric invite code
 */
const generateInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let result = '';
  
  for (let i = 0; i < codeLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

module.exports = generateInviteCode;
