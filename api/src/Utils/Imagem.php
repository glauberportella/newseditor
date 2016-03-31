<?php

namespace NewsEditorApi\Utils;

use NewsEditorApi\Utils\Mime;

class Imagem
{
    private static $base64Pattern = '/^data:(image\/.*);base64/i';

    /**
     * Verifica se string passada representa imagem em base64
     * @param  string  $data
     * @return boolean
     */
    public static function isBase64($data)
    {
        return 1 === preg_match(static::$base64Pattern, $data);
    }

    /**
     * [base64ToFile description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public static function base64ToFile($data, $basePath = __DIR__, $filename = null)
    {
        // process only if base64 data
        if (1 === preg_match(static::$base64Pattern, $data, $match)) {
            if (!$filename) {
                $mime = $match[1];
                $extension = Mime::findExtension($mime);
                $filename = uniqid().'.'.$extension;
            }

            $ifp = fopen($basePath.DIRECTORY_SEPARATOR.$filename, "wb");
            $data = explode(',', $data);
            fwrite($ifp, base64_decode($data[1]));
            fclose($ifp);

            return $filename;
        }

        return false;
    }
}
