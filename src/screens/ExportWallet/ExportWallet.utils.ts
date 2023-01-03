export const authenticateUser = args => {
  const res = args.reduce((prev, curr) => {
    if (prev.trim() === curr.trim()) {
      return true;
    }
    return false;
  });
  return res;
};

export default authenticateUser;
