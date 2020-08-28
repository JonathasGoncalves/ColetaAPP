<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Linha extends Model
{
    protected $table = 'linha';

    public function LinhasPorTransportadora($cod_transportadora) {
        $linhas = DB::table('linha')
        ->join('transportadora', 'linha.linha', '=', 'transportadora.linha')
        ->select('linha.linha', 'linha.DESCRICAO')
        ->where('transportadora.cod_transportadora', '=', $cod_transportadora)
        ->get();

        return $linhas;
    }

    public function LinhasPorIMEI($IMEI) {
        $linhas = DB::table('motorista')
        ->join('transportadora', 'motorista.cod_motorista', '=', 'transportadora.cod_motorista')
        ->join('linha', 'transportadora.linha', '=', 'linha.linha')
        ->select('linha.linha', 'linha.DESCRICAO')
        ->where('motorista.IMEI', '=', $IMEI)
        ->distinct()
        ->get();

        return $linhas;
    }


}
