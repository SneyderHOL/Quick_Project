exports.getStatus = async (req, res, error) => {
  const status = { 'status': 'OK' };
  res.status(200).send({ data: status });
};
