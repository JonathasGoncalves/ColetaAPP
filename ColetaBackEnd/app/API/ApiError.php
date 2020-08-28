<?php


namespace App\API;


class ApiError
{

    public static function errorMassage($message, $code)
    {
        return [
            'msg' => $message,
            'code' =>$code
        ];

    }
}
