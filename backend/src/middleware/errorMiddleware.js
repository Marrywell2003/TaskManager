//gestionare erori
const notFound = (req, res, next) => {
  res.status(404).json({ message: "Ruta nu a fost găsită!" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ceva s-a stricat în backend!" });
};

module.exports = { notFound, errorHandler };