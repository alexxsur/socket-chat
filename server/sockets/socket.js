const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        let personas = usuarios.agregarPersona(client.id, data.nombre);

        client.broadcast.emit('listaPersona', usuarios.getPersonas());

        callback(personas);

        console.log(usuarios);
    });

    client.on('disconnect', (data, callback) => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: `${personaBorrada.nombre} abandonó el chat`
        });

        client.broadcast.emit('listaPersona', usuarios.getPersonas());
    });

});