<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class tanqueDescResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

     //resource personalizado que recebe o resultado da função TanquesPorLinha do model Tanque
    public function toArray($request)
    {
        return [
            //'key'               => trim($this->Cooperado->codigo_cacal) . trim($this->tanque) . trim($this->latao),
           
            'id'                        => trim($this->id),
            'tanque'                    => str_pad(trim($this->tanque),6,'0',STR_PAD_LEFT),
            'linha'                     => str_pad(trim($this->linha),6,'0',STR_PAD_LEFT),
            'latao'                     => str_pad(trim($this->latao),6,'0',STR_PAD_LEFT),
            'codigo'                    => str_pad(trim($this->codigo),6,'0',STR_PAD_LEFT),
            'codigo_cacal'              => str_pad(trim($this->codigo_cacal),6,'0',STR_PAD_LEFT),
            'ATUALIZAR_COORDENADA'      => trim($this->ATUALIZAR_COORDENADA),
            'descricao'                 => ucwords(strtolower(trim($this->descricao))),
            'lataoQuant'                => trim($this->lataoQuant),
        ];
    }
}

