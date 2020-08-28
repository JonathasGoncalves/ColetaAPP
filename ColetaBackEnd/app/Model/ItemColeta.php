<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ItemColeta extends Model
{
    protected $table = 'coleta_item';

    protected $fillable = [
        'id_coleta',
        'codigo',
        'codigo_cacal',
        'tanque',
        'latao',
        'LINHA',
        'lataoQuant',
        'ATUALIZAR_COORDENADA',
        'temperatura',
        'odometro',
        'volume',
        'latitude',
        'longitude',
        'cod_ocorrencia',
        'observacao',
        'data',
        'hora',
        'boca',
        'volume_fora_padrao'
    ];

    
    public function ItemPorColeta($id_coleta) {
        $itens = DB::table('item_coleta')
        ->join('tanques', 'item_coleta.tanque_id', '=', 'tanques.id')
        ->select('tanques.linha', 'tanques.tanque', 'tanques.latao', 'item_coleta.quantidade', 'item_coleta.temperatura', '1')
        ->where('item_coleta.coleta_id', '=', $id_coleta)
        ->get();
        return $itens;
    }

    //não precisa filtrar por atualizar_coordenada, por que o app só vai mandar as coordenadas de tanques habilitados
    public function CoordPorColeta($id_coleta) {
        $itens = DB::table('item_coleta')
        ->join('tanques', 'item_coleta.tanque_id', '=', 'tanques.id')
        ->select('tanques.tanque', 'item_coleta.latitude', 'item_coleta.longitude')
        ->where('item_coleta.coleta_id', '=', $id_coleta)
        ->distinct()
        ->get();
        return $itens;
    }
}
