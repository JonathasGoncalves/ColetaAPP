<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class associado extends JsonResource
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
            'codigo'        => trim($this->CODIGO),
            'codigo_cacal'  => trim($this->CODIGO_CACAL),
            'matricula'     => trim($this->MATRICULA),
            'nome'          => ucwords(strtolower(trim($this->NOME))),
            'cpf_cnpj'      => trim($this->CPF_CNPJ),
            'cota'          => trim($this->cota),
            'ENDERECO'      => trim(trim($this->ENDERECO)), 
            'BAIRRO'        => trim(trim($this->BAIRRO)),
            'UF'            => trim($this->UF),
            'MUNICIPIO'     => trim(trim($this->MUNICIPIO)),
            'CEP'           => trim($this->CEP),
            'INSCRICAO'     => trim($this->INSCRICAO),
            'NIRF'          => trim($this->NIRF),
            'INCRA'         => trim($this->INCRA),
        ];
    }
}
