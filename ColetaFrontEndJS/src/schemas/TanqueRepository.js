export default class TanqueSchema {
  static schema = {
    name: 'Tanque',
    properties: {
      id: 'string',
      codigo: 'string',
      codigo_cacal: 'string',
      tanque: 'string',
      latao: 'string',
      LINHA: { type: 'string', indexed: true },
      descricao: 'string',
      lataoQuant: 'string',
      ATUALIZAR_COORDENADA: 'string'
    },
  };
}