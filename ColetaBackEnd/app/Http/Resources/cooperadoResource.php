<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class cooperado extends JsonResource
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
                'id'            => trim($this->id),
                'codigo'        => trim($this->codigo),
                'codigo_cacal'  => trim($this->codigo_cacal),
                'matricula'     => trim($this->matricula),
                'nome'          => ucwords(strtolower(trim($this->nome))),
                'cpf_cnpj'      => trim($this->cpf_cnpj),
                'cota'          => trim($this->cota),
                'ENDERECO'      => ucwords(strtolower(trim($this->ENDERECO))), 
                'BAIRRO'        => ucwords(strtolower(trim($this->BAIRRO))),
                'UF'            => trim($this->UF),
                'MUNICIPIO'     => ucwords(strtolower(trim($this->MUNICIPIO))),
                'CEP'           => trim($this->CEP),
                'INSCRICAO'     => trim($this->INSCRICAO),
                'NIRF'          => trim($this->NIRF),
                'INCRA'         => trim($this->INCRA),
            ];
        }
}
