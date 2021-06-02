export default class Actividad {
    constructor(id, nombre, descripcion, horario, dias, monitor, maxAforo, cliApuntados, imagenes) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.horario = horario;
      this.dias = dias;
      this.monitor = monitor;
      this.maxAforo = maxAforo;
      this.cliApuntados = cliApuntados;
      this.imagenes = imagenes;
    }
  }