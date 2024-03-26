import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (inputedPassword, storedPassword) => {
  return await bcrypt.compare(inputedPassword, storedPassword);
};
