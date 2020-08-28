<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Linha;
use App\API\ApiError;
use App\Model\Transportadora;
use App\Http\Resources\linhaResource;

class LinhaController extends Controller
{

    private $linha;
    public function __construct(linha $linha)
    {
        $this->linha = $linha;
    }
    
    public function LinhasPorIMEI (Request $request) {  
        $data = ['linhas' => linhaResource::collection($this->linha->LinhasPorIMEI($request->IMEI))];
        return response()->json($data);
    }
    
}
