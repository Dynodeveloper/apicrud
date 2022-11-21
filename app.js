var mysql = require('mysql');
var express = require('express');
const req = require('express/lib/request');

var app = express();
app.use(express.json());

//cors
let cors = require("cors");
app.use(cors());

//establecer parametros
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articulosdb'
})

//probar
conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('conexion exitosa')
    }
})

app.get('/', function (req, res) {
    res.send('ruta INICIO')
})

//mostrar articulos
app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })

});

//mostrar un articulos
app.get('/api/articulos/:Id', (req, res) => {
    conexion.query('SELECT * FROM articulos where Id= ?', [req.params.Id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
        }
    })

});

//crear articulo
app.post('/api/articulos', (req, res) => {
    let data = { descripcion: req.body.descripcion, precio: req.body.precio, stock: req.body.stock };
    let sql = "INSERT INTO articulos SET ?"
    conexion.query(sql, data, function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
})

//editar campo
app.put('/api/articulos/:Id', (req, res) => {
    let id = req.params.Id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio=?, stock = ? where Id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

//eliminar registro
app.delete('/api/articulos/:Id', (req, res) => {
    conexion.query("DELETE FROM articulos WHERE Id = ?", [req.params.Id], function (error, filas) {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
})

const puerto = process.env.puerto || 3000;

app.listen(puerto, function () {
    console.log("server ok en puerto:" + puerto);
});