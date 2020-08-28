<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class coletaPorPlacaResource extends JsonResource
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
            'data'                  => trim($this->nome), 
            'NOME_MOTORISTA'        => ucwords(strtolower(trim($this->MUNICIPIO))),
            'PLACA'                 => trim($this->tanque),
            'linha'                 => trim($this->linha),
        ];
    }
}