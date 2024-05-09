export const getBlockchain = (req, res, next) => {
  res.status(200).json({ success: true, data: 'Get Funkar' });
};

export const createBlock = (req, res, next) => {
  res.status(200).json({ success: true, data: 'CreateBlock funkar' });
};
