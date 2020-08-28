<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class lataoPorTanqueDescResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'latao'                => trim($this->latao),
            'cod_produtor'         => trim($this->codigo),
            'codigo_cacal'         => trim($this->codigo_cacal),
            'produtor_nome'        => ucwords(strtolower(trim($this->nome))), 
            'municipio'            => ucwords(strtolower(trim($this->MUNICIPIO))),
            'tanque'               => trim($this->tanque),
            'linha'                => trim($this->linha),
        ];
    }
}
