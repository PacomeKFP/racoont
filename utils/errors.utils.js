module.exports.signUpErrors = (err) => {
  let errors = {};

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou deja pris";

  if (err.message.includes("email")) errors.email = "Email incorrecte";

  if (err.message.includes("password"))
    errors.password = "le mot de passe doit faire 6 caracteres au moins";

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est deja enregistré";

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "ce pseudo est deja pris";
  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = {};

  if (err.message.includes("email"))
    errors.email = "L'adresse mail entrée est incorrecte";

  if (err.message.includes("password"))
    errors.password = "le mot de passe entré est incorrect";
  return errors;
};
module.exports.uploadErrors = (err) => {
  let errors = {};
  if (err.message.includes("format"))
    errors.format = "Format de fichier incompatible";
  if (err.message.includes("size")) errors.format = "Le fichier depasse  500ko";
};
