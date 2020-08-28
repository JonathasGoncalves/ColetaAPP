<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\transportadoraResource;
use App\Model\Transportadora;
use App\Model\Motorista;
use App\Model\Motorista_Transportadora;
use Illuminate\Database\QueryException;
use App\API\ApiError;

class TransportadoraController extends Controller
{

    private $transportadora;
    public function __construct(Transportadora $transportadora)
    {
        $this->transportadora = $transportadora;
    }

    //retorna o nome e o código de todas as transportadoras
    public function TransportadoraALL () {
        $data = ['transportadoras' => transportadoraResource::collection($this->transportadora->TransportadoraALL())];
        return response()->json($data);
    }
    
    //recebe cod_transportadora, imei
    public function cadastrarIMEI(Request $request) {
        $temp = intval($request->transportadora);
        $transp_find = Transportadora::where('COD_TRANSPORTADORA', '=', $temp)->first(); 
        //return $transp_find->COD_MOTORISTA;
        $motorista = [
            'IMEI'               => $request->IMEI,
            'cod_motorista'      => $transp_find->COD_MOTORISTA,
        ];

        try {
            $motorista_new = ['motorista' => Motorista::create($motorista)];
            return response()->json($motorista_new);
        } catch(QueryException $e) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'IMEI DUPLICADO!']], 4040), 404);
        }
    }

    public function verificarPlaca(Request $request) {

        $data = Transportadora::where('PLACA', '=', $request->placa)->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Placa inválida']], 4040), 404);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }

    public function transportadoraPorPlaca(Request $request) {
        $data = ['transportadora' => Transportadora::where('PLACA', '=', $request->placa)->where('LINHA', '=', $request->linha)->first()];
        return response()->json($data);
    }

}
