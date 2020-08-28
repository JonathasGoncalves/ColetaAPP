<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Tanque;
use App\Model\Linha;
use App\API\ApiError;
use App\Http\Resources\tanqueDescResource;
use App\Http\Resources\lataoPorTanqueDescResource;

class TanqueController extends Controller
{

    private $tanque;
    public function __construct(tanque $tanque) {
        $this->tanque = $tanque;
    }

    public function TanquesPorLinha(Request $request) {
        $linha = Linha::where('linha', $request->cod_linha)->first();
        if (!$linha) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Linha inexistente!']], 4040), 404);
        $data = ['tanques' => tanqueDescResource::collection($this->tanque->TanquesPorLinha($request->cod_linha))];
        return response()->json($data);
    }

    public function LataoPorTanque (Request $request) {
        $tanque = Tanque::where('tanque', $request->cod_tanque)->first();
        if (!$tanque) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Tanque inexistente!']], 4040), 404);
        $data = ['tanques' => lataoPorTanqueDescResource::collection($this->tanque->LataoPorTanque($request->cod_tanque))];
        return response()->json($data);
    }

    public function TanquesInLinhas (Request $request) {
        $data = ['tanques' => tanqueDescResource::collection($this->tanque->TanquesInLinhas($request->linhas))];
        return response()->json($data);
    }

    
}

