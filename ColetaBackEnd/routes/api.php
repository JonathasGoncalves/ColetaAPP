<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Providers\RouteServiceProvider;
use App\Http\Controllers\Auth\RegisterController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//middleware('jwt.auth')->
Route::namespace('Api')->name('api.')->group(function () {

    Route::prefix('transportadora')->group(function () {
        Route::get('/TransportadoraALL', 'TransportadoraController@TransportadoraALL')->name('TransportadoraALL_transportadora');
        Route::post('/cadastrarIMEI', 'TransportadoraController@cadastrarIMEI')->name('cadastrarIMEI'); 
        Route::post('/verificarPlaca', 'TransportadoraController@verificarPlaca')->name('verificarPlaca');
        Route::post('/transportadoraPorPlaca', 'TransportadoraController@transportadoraPorPlaca')->name('transportadoraPorPlaca');
    });

    Route::prefix('motorista')->group(function () {
        Route::post('/verificarIMEI', 'MotoristaController@verificarIMEI')->name('verificarIMEI');
    });

    Route::prefix('linha')->group(function () {
        Route::post('/linhasPorIMEI', 'LinhaController@linhasPorIMEI')->name('linhasPorIMEI');
    });

    Route::prefix('tanque')->group(function () {
        Route::post('/TanquesPorLinha', 'TanqueController@TanquesPorLinha')->name('TanquesPorLinha');
        Route::post('/LataoPorTanque', 'TanqueController@LataoPorTanque')->name('LataoPorTanque'); 
        Route::post('/TanquesInLinhas', 'TanqueController@TanquesInLinhas')->name('TanquesInLinhas');
    });

    Route::prefix('coleta')->group(function () {
        Route::get('/testeArquivo', 'ColetaController@RetornaColetaPesagem')->name('RetornaColetaPesagemT');//recebe id coleta
        Route::post('/NovaColeta', 'ColetaController@NovaColeta')->name('NovaColeta');
        Route::post('/NovaColetaItem', 'ColetaController@NovaColetaItem')->name('NovaColetaItem');
        Route::post('/ColetaPorPlaca', 'ColetaController@ColetaPorPlaca')->name('ColetaPorPlaca');
        Route::post('/RetornaColetaPesagem', 'ColetaController@RetornaColetaPesagem')->name('RetornaColetaPesagem');//recebe id coleta
        Route::post('/RetornaCoordenada', 'ColetaController@RetornaCoordenada')->name('RetornaCoordenada');//recebe id coleta
        Route::get('/coletaEmAberto', 'ColetaController@coletaEmAberto')->name('coletaEmAberto'); 
        Route::post('/RetornaOcorrencia', 'ColetaController@RetornaOcorrencia')->name('RetornaOcorrencia');
    });
    
});

