<?php

namespace App\Http\Controllers\Api;

use Illuminate\Database\QueryException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\API\ApiError;
use App\Model\Coleta;
use App\Model\Transportadora;
use App\Model\ItemColeta;
use App\Model\Ocorrencia;

class ColetaController extends Controller
{
    private $coleta;
    public function __construct(coleta $coleta)
    {
        $this->coleta = $coleta;
    }

    public function coletaEmAberto () {
        $data = Coleta::where('finalizada', '=', 0)->get();
        if (sizeof($data) < 1) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Nenhuma coleta em aberto']], 4040), 404);
        $coletas = ['coletas' => $data];
        return response()->json($coletas);
    }

    //Data      Transportador   Motorista     Veiculo
    //20200608      00468        0000019       000001
    //cod_transportadora, data, finalizada inicia em 0(em aberto)
    public function NovaColeta(Request $request) {

        $coleta = [
            'finalizada'            => 0,
            'transportadora_id'     => $request->cod_transportadora,
            'data'                  => $request->data
        ];
        try {
            $nova_coleta = Coleta::create($coleta);
            return $nova_coleta;
        } catch (QueryException $e) {
            return $e;
        }

        
    }
    //lista de coleta_item, id_coleta
    public function NovaColetaItem(Request $request) {
        $testeFilter = [];
        try{
            foreach($request->coletas as $coleta) {
                $novo_item = [
                    'id_coleta'             => $coleta['id_coleta'],
                    'codigo'                => $coleta['codigo'],
                    'codigo_cacal'          => $coleta['codigo_cacal'],
                    'tanque'                => $coleta['tanque'],
                    'latao'                 => $coleta['latao'],
                    'LINHA'                 => $coleta['LINHA'],
                    'lataoQuant'            => $coleta['lataoQuant'],
                    'ATUALIZAR_COORDENADA'  => $coleta['ATUALIZAR_COORDENADA'],
                    'temperatura'           => $coleta['temperatura'],
                    'odometro'              => $coleta['odometro'],
                    'volume'                => $coleta['volume'],
                    'latitude'              => $coleta['latitude'],
                    'longitude'             => $coleta['longitude'],
                    'cod_ocorrencia'        => $coleta['cod_ocorrencia'],
                    'observacao'            => $coleta['observacao'],
                    'data'                  => $coleta['data'],
                    'hora'                  => $coleta['hora'],
                    'boca'                  => $coleta['boca'],
                    'volume_fora_padrao'    => $coleta['volume_fora_padrao']
                ];
                $coletaCreate = ItemColeta::create($novo_item);
                array_push($testeFilter, $coletaCreate);
            }
            return $testeFilter;
        } catch (QueryException $e) {
            return response()->json($e);
        }

    }

    public function FecharColeta($itens_coleta, $ocorrencias, $coleta_id) {

        try {
            foreach($itens_coleta as $item_coleta) {
                $novo_item = [
                    'tanque_id'         => $item_coleta['tanque_id'],
                    'quantidade'        => $item_coleta['quantidade'],
                    'hora'              => $item_coleta['hora'],
                    'temperatura'       => $item_coleta['temperatura'],
                    'coleta_id'         => $item_coleta['coleta_id'],
                    'latitude'          => $item_coleta['latitude'],
                    'longitude'         => $item_coleta['longitude'],
                ];

                ItemColeta::create($novo_item);
            }

            foreach($ocorrencias as $ocorrencia) {
                $novo_item = [
                    'tanque_id'         => $ocorrencia['tanque_id'],
                    'valor'             => $ocorrencia['valor'],
                    'observacao'        => $ocorrencia['observacao'],
                    'data'              => $ocorrencia['data'],
                    'hora'              => $ocorrencia['hora'],     
                    'coleta_id'         => $ocorrencia['coleta_id'],
                ];

                Ocorrencia::create($novo_item);
            }

        } catch (QueryException $e) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar item para a coleta!']], 1010), 101);
        }
    }


    //recebe o id da coleta
    public function RetornaColetaPesagem(Request $request) {
        /*
        Arquivo coleta
        Linha  Produtor Tanque Latão  Quantidade  hora  Temp   boca 
        000054 000000   000017  001769 00000000229 1634  3,00   1
        */

        $itens = ItemColeta::where('id_coleta', '=', $request->id_coleta)->get();
        $stringArquivo = '';
        foreach($itens as $item) {
            if ($item->volume > 0) {
                $novaHora = str_replace(':', '', $item->hora);
                $stringArquivo =    
                $stringArquivo . $item->LINHA . 
                $item->codigo_cacal . 
                str_pad(trim($item->tanque),6,'0',STR_PAD_LEFT). 
                str_pad(trim($item->latao),6,'0',STR_PAD_LEFT) .
                str_pad(trim($item->volume),6,'0',STR_PAD_LEFT) . 
                $novaHora.  
                str_pad(trim($item->Temp),6,'0',STR_PAD_LEFT) .  
                '1' .           "\n" ;
            } 
        }
        $arquivo = fopen('coletaItem.txt','w');
        if ($arquivo == false) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('coletaItem.txt'));
        }
    }

    //recebe o id da coleta
    public function RetornaCoordenada(Request $request) {
        /*
        Arquivo coordenadas
        tanque atualiza_coordenada latitude longitude
        */

        $itens = ItemColeta::where('id_coleta', '=', $request->id_coleta)->get();
        $stringArquivo = '';
        foreach($itens as $item) {
            $stringArquivo =    
            $stringArquivo . str_pad(trim($item->tanque),6,'0',STR_PAD_LEFT)  . 
            $item->ATUALIZAR_COORDENADA . 
            $item->latitude.  
            $item->longitude.  "\n" ;
        }
        $arquivo = fopen('coordenadaItem.txt','w');
        if ($arquivo == false) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('coordenadaItem.txt'));
        }
    }

    //recebe o id da coleta
    public function RetornaOcorrencia(Request $request) {
        /*
        Arquivo ocorrencias
        linha tanque horario codigo_ocorrencia volume_fora_padrao observacoes 
        */

        $itens = ItemColeta::where('id_coleta', '=', $request->id_coleta)->get();
        $stringArquivo = '';
        foreach($itens as $item) {
            if ($item->cod_ocorrencia != '') {
                $novaData = str_replace('-', '', $item->data);
                $novaHora = str_replace(':', '', $item->hora);
                $stringArquivo =    
                $stringArquivo . str_pad(trim($item->LINHA),6,'0',STR_PAD_LEFT)  . 
                str_pad(trim($item->tanque),6,'0',STR_PAD_LEFT)  .
                $novaData . 
                $novaHora .     
                str_pad(trim($item->cod_ocorrencia),3,'0',STR_PAD_LEFT) .
                str_pad(trim($item->volume),11,'0',STR_PAD_LEFT) .
                str_pad(trim($item->observacao),256,' ',STR_PAD_RIGHT) .
                "\n" ;
            }
        }
        $arquivo = fopen('ocorrenciaItem.txt','w');
        if ($arquivo == false) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('ocorrenciaItem.txt'));
        }
    }
}
