<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateColetaItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coleta_item', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->increments('id');
            $table->integer('id_coleta');
            $table->string('codigo');
            $table->string('codigo_cacal');
            $table->integer('tanque');
            $table->integer('latao');
            $table->string('LINHA');
            $table->integer('lataoQuant');
            $table->integer('ATUALIZAR_COORDENADA');
            $table->string('temperatura')->nullable();
            $table->string('odometro')->nullable();
            $table->integer('volume')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('cod_ocorrencia')->nullable();
            $table->string('observacao')->nullable();
            $table->date('data');
            $table->time('hora');
            $table->integer('boca');
            $table->integer('volume_fora_padrao');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coleta_item');
    }
}
