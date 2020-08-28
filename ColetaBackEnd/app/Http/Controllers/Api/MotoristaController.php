<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\API\ApiError;
use App\Model\Coleta;
use App\Model\Transportadora;
use App\Model\ItemColeta;
use App\Model\Ocorrencia;
use App\Model\Motorista;

class MotoristaController extends Controller
{
    public function verificarIMEI (Request $request) {
        $data = Motorista::where('IMEI', '=', $request->imei)->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Imei não cadastrado']], 4040), 404);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }
}
