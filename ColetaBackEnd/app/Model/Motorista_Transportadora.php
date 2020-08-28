<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Motorista_Transportadora extends Model
{
    protected $table = 'motorista_transportadora';
    protected $fillable = ['IMEI', 'transportadora_id'];
}
