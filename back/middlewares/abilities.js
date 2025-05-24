const jwt = require("jsonwebtoken");
const Conexion = require("../database/user/UserConnection");
const conx = new Conexion();

/**
 * Middleware de estado de usuario
 * @function statusUser Middleware de estado de usuario
 * @function checkToken Middleware de verificacion de token
 * @function tokenCanAdmin Middleware de verificacion de token para admin
 * @function tokenCanUser Middleware de verificacion de token para user
 * @function userExist Middleware de verificacion de usuario existente
 */
const statusUser = (req, res, next) => {
    conx
      .getUserByEmail(req.body.email)
      .then((msg) => {
        if (msg.activo == 1) {
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

  console.log('token', token);

  try {
      const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
      console.log('uid', uid);
      req.userId = uid; 
      next();
  } catch (error) {
      console.error('Error al verificar el token:', error); 
      res.status(401).json({ msg: "Token no válido", error: error.message }); 
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
          const user = await conx.getUserById(userId); 

          if (!user) {
              throw new Error('El usuario no existe.'); 
          }
      }
  } catch (e) {
      console.log(e);
      throw new Error('Ha habido un problema al comprobar si el usuario existe.');
  }
};

module.exports = {
    statusUser,
    checkToken,
    tokenCanAdmin,
    tokenCanUser,
    userExist
}