export default class ColetaSchema {
  static schema = {
    name: 'Coleta',
    properties: {
      id: 'string',
      codigo: 'string',
      codigo_cacal: 'string',
      tanque: 'string',
      latao: 'string',
      LINHA: 'string',
      LINHA_DESC: 'string',
      lataoQuant: 'int',
      ATUALIZAR_COORDENADA: 'int',
      temperatura: 'int',
      odometro: 'string',
      volume: 'int',
      latitude: 'string',
      longitude: 'string',
      cod_ocorrencia: 'string',
      observacao: 'string',
      data: 'string',
      hora: 'string',
      boca: 'int',
      volume_fora_padrao: 'int',
    },
  };
}