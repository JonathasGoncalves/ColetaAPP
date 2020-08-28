<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class linhaResource extends JsonResource
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
            'linha'         => trim($this->linha),
            'descricao'     => ucwords(strtolower(trim($this->DESCRICAO))),     
        ];
    }
}
