<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Tanque extends Model
{
    
    protected $table = 'tanques';


    public function TanquesPorLinha($cod_linha) {
        $cooperados = DB::table('cooperados')
            ->select('cooperados.codigo', 'cooperados.codigo_cacal', 'cooperados.nome', 'cooperados.MUNICIPIO');

        $todos = DB::table('associados')
        ->select('associados.CODIGO' , 'associados.CODIGO_CACAL', 'associados.NOME', 'associados.MUNICIPIO')
        ->union($cooperados);

        $tanques = DB::table('tanques')
        ->select('tanques.id', 'todos.MUNICIPIO', 'tanques.tanque')
        ->where('tanques.linha', '=', $cod_linha)
        ->where('tanques.DT_DESLIG', '=', null)
        ->joinSub($todos, 'todos', function ($join) {
            $join->on('tanques.codigo', '=', 'todos.codigo_cacal');
        })
        ->orderBy('tanques.tanque')
        ->distinct()
        ->get();

        return $tanques;
    }

    public function LataoPorTanque($cod_tanque) {
        $cooperados = DB::table('cooperados')
            ->select('cooperados.codigo', 'cooperados.codigo_cacal', 'cooperados.nome', 'cooperados.MUNICIPIO');

        $todos = DB::table('associados')
        ->select('associados.CODIGO' , 'associados.CODIGO_CACAL', 'associados.NOME', 'associados.MUNICIPIO')
        ->union($cooperados);

        $tanques = DB::table('tanques')
        ->select('todos.codigo', 'todos.codigo_cacal', 'todos.nome', 'todos.MUNICIPIO', 'tanques.tanque', 'tanques.linha', 'tanques.latao')
        ->where('tanques.tanque', '=', $cod_tanque)
        ->where('tanques.DT_DESLIG', '=', null)
        ->joinSub($todos, 'todos', function ($join) {
            $join->on('tanques.codigo', '=', 'todos.codigo_cacal');
        })
        ->distinct()
        ->get();

        return $tanques;
    }

    public function TanquesInLinhas($linhas) {

        $tanques = DB::table('tanques')
        ->join('linha', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha.linha')
        ->select(
            'tanques.id', 
            'tanques.tanque', 
            'tanques.linha', 
            'tanques.latao', 
            'tanques.codigo', 
            'tanques.codigo_cacal', 
            'tanques.ATUALIZAR_COORDENADA',
            'linha.descricao'
            )
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->distinct();


        $LataoQuant = DB::table('tanques')
        ->select(
                DB::raw(
                    'count(*) as lataoQuant'
                ), 
                'tanquesList.id', 
                'tanquesList.tanque', 
                'tanquesList.linha', 
                'tanquesList.latao', 
                'tanquesList.codigo', 
                'tanquesList.codigo_cacal', 
                'tanquesList.ATUALIZAR_COORDENADA',
                'tanquesList.descricao'
        )
        ->joinSub($tanques, 'tanquesList', function ($join) {
            $join->on('tanques.tanque', '=', 'tanquesList.tanque');
        })
        ->join('linha', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha.linha')
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->groupBy(
            'tanquesList.id',
            'tanquesList.tanque',
            'tanquesList.linha',
            'tanquesList.latao',
            'tanquesList.codigo',
            'tanquesList.codigo_cacal',
            'tanquesList.ATUALIZAR_COORDENADA',
            'tanquesList.descricao'
            )
        ->distinct()
        ->get();
        return $LataoQuant;
    }
}


/*
$tanques = DB::table('tanques')
        ->join('linha', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha.linha')
        ->select(
            'tanques.id', 
            'tanques.tanque', 
            'tanques.linha', 
            'tanques.latao', 
            'tanques.codigo', 
            'tanques.codigo_cacal', 
            'tanques.ATUALIZAR_COORDENADA',
            'linha.descricao'
            )
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->distinct();


        ->joinSub($tanques, 'tanquesList', function ($join) {
            $join->on('tanques.tanque', '=', 'tanquesList.tanque');
        })

        */
