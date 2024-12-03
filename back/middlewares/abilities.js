const jwt = require("jsonwebtoken");
const Conexion = require("../database/user/UserConnection");
const conx = new Conexion();

const statusUser = (req, res, next) => {
    conx
      .getUserByEmail(req.body.email)
      .then((msg) => {
        if (msg.active == 1) {
          next();
        } else {
          res.status(403).json({ msg: "La cuenta esta desactivada" });
        }
    })
    .catch((err) => {
        res.status(400).json({ msg: "Usuario no encontrado", error: err });
    });
};

const checkToken = (req, res, next) => {
    const token = req.header("x-token");
  
    if (!token) {
      return res.status(401).json({ msg: "No hay token en la petición." });
    }
  
    try {
      const { uid, roles } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
      req.userId = uid;
      req.uroles = roles;
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token no valido" });
    }
};

const checkTokenPayload = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
      return res.status(401).json({ msg: "No hay token en la petición." });
  }
  try {
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
      req.payload = { userId: uid }; // Asegúrate de que esto esté configurado correctamente
      next();
  } catch (error) {
      res.status(401).json({ msg: "Token no válido" });
  }
};

const tokenCanAdmin = (req, res, next) => {
    let roles = req.uroles;
    let i = 0;
    let check = true;
    while (i < roles.length && check) {
        if (roles[i] == process.env.ID_ROL_ADMIN) {
        check = false;
        }
        i++;
    }

    if (!check) {
        next();
    } else {
        res.status(400).json({ msg: "Token sin permisos" });
    }
};

const tokenCanUser = (req, res, next) => {
    let roles = req.uroles;
    let i = 0;
    let check = true;
    while (i < roles.length && check) {
      if (roles[i] == process.env.ID_ROL_USER || 
        roles[i] == process.env.ID_ROL_ADMIN) {
        check = false;
      }
      i++;
    }
  
    if (!check) {
      next();
    } else {
      res.status(400).json({ msg: "Token sin permisos" });
    }
};

const userExist = async (userId) => {
  try {
      if (userId) {
          const user = await conx.getUserById(userId); // Usa la instancia para llamar al método

          if (!user) {
              throw new Error('El usuario no existe.'); // Lanza un error estándar
          }
      }
  } catch (e) {
      console.log(e);
      throw new Error('Ha habido un problema al comprobar si el usuario existe.'); // Lanza un error estándar
  }
};

module.exports = {
    statusUser,
    checkToken,
    tokenCanAdmin,
    tokenCanUser,
    userExist,
    checkTokenPayload
}