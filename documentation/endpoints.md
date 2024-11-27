# OnyxTunes API Endpoints

## Users

### Show Users
**Method**: `GET`  
**URL**: `localhost:9292/api/users`

---

### Show Artists
**Method**: `GET`  
**URL**: `localhost:9292/api/users/artists`

---

### Get User By Token
**Method**: `GET`  
**URL**: `localhost:9292/api/userToken`  
**Request Headers**:
- `x-token`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImlhdCI6MTczMDk4NDk5NCwiZXhwIjoxNzMxMDA2NTk0fQ.Fn1kQWH_3_q7z8pvaOJYO55KSHo8H81YRNSZbzfGozQ`

---

### Create User from Admin
**Method**: `POST`  
**URL**: `localhost:9292/api/users/new`  
**Request Headers**:
- `x-token`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTczMTU4NTMwNywiZXhwIjoxNzMxNjA2OTA3fQ.wa89RHBIL_6mqV1TbZBjGVaFAJB0X0SabBEwZfrJvcg`  
**Request Body**:
```json
{
    "nombre": "gema",
    "email": "gvvvv@gmail.com",
    "password": "1234",
    "roles": ["Usuario"]
}
```

---

### Update User
**Method**: `PUT`  
**URL**: `localhost:9292/api/users/{id}`  
**Request Headers**:
```json
Copiar código
{
    "email": "prueba@gmail.com"
}
```

---

### Show User
**Method**: `PUT`  
**URL**: `localhost:9292/api/users/{id}`  

---

## Authentication

### Registro
**Method**: `POST`  
**URL**: `localhost:9292/api/registro`  
**Request Headers**:
```json
{
  "nombre": "asdasdacsc",
  "email": "pruebaddddddd@example.com",
  "password": "1234",
  "fecha_nacimiento": "2004-06-22",  
  "direccion": "direccion1",
  "telefono": 652359399,
  "genero": "Femenino"
}
```

---

### Inicio de Sesión
**Method**: `POST`  
**URL**: `localhost:9292/api/login`  
**Request Headers**:
```json
{
    "email": "admin@onyxtunes.com",
    "password": "1234"
}
```

--- 

## Roles

### Get Roles
**Method**: `GET`  
**URL**: `localhost:9292/api/roles`  