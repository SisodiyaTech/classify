import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'classify_secret_key_123',
    { expiresIn: '30d' }
  );
};

export default generateToken;
