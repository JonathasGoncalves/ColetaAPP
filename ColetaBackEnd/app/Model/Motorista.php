<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Motorista extends Model
{
    protected $table = 'motorista';
    
    protected $fillable = ['IMEI', 'cod_motorista'];
}
