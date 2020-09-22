

export function date() {
  data = new Date;

  if (data.getMonth() + 1 < 10) {
    mes = '0' + (data.getMonth() + 1)
  } else {
    mes = data.getMonth() + 1
  }
  if (data.getDate() <= 9) {
    dia = '0' + data.getDate();
  } else {
    dia = data.getDate();
  }
  dataFormat = data.getFullYear() + '-' + mes + '-' + dia;

  return dataFormat;
}

export function time() {

  data = new Date;
  hora = '';
  minutos = '';
  segundos = '';

  if (data.getMinutes() < 10) {
    minutos = '0' + data.getMinutes();
  } else {
    minutos = data.getMinutes();
  }

  if (data.getHours() < 10) {
    hora = '0' + data.getHours();
  } else {
    hora = data.getHours();
  }

  if (data.getSeconds() < 10) {
    segundos = '0' + data.getSeconds();
  } else {
    segundos = data.getSeconds();
  }

  timeFormat = hora + ":" + minutos + ":" + segundos;
  return timeFormat;
}
