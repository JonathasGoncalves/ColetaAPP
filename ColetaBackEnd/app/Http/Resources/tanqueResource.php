<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class tanque extends JsonResource
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
            //'key'               => rtrim($this->Cooperado->codigo_cacal) . rtrim($this->tanque) . rtrim($this->latao),
            'id'                => trim($this->id),
            'tanque'            => trim($this->tanque),
            'latao'             => trim($this->latao), 
            'matricula'         => trim($this->matricula),
            $this->mergeWhen($this->codigo == 7404 and $this->codigo_cacal == 7404, [
                'Cooperado'      =>  trim($this->Cooperado),
            ]),
            $this->mergeWhen($this->codigo == 7404, [
                'Cooperado'      =>  trim($this->Associado),
            ]),
            $this->mergeWhen($this->codigo <> 7404, [
                'Cooperado'      =>  trim($this->Cooperado),
            ]),
            //'codigo'            => new CooperadoResource($this->Cooperado),
            //'Associado'      => new AssociadoResource($this->Associado),
        ];
    }
}
