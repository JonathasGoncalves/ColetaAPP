<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class transportadoraResource extends JsonResource
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
            'cod_transportadora'        => rtrim($this->COD_TRANSPORTADORA),
            //'nome_motorista'            => ucwords(strtolower(trim($this->NOME_MOTORISTA))),
            //'cod_motorista'             => rtrim($this->COD_MOTORISTA),
            //'veiculo'                   => rtrim($this->VEICULO),
            //'placa'                     => trim($this->PLACA),
            //'linha'                     => rtrim($this->LINHA),
        ];
    }
}
