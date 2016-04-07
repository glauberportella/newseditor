<?php

namespace NewsEditorApi\Model;

use NewsEditorApi\Utils\Social;

class Noticia extends ActiveRecord
{
    public static $tableName = 'noticia';

    public function add()
    {
        $this->generateSocialDescription();
        return parent::add();
    }

    public function update()
    {
        $this->generateSocialDescription();
        return parent::update();
    }

    protected function generateSocialDescription()
    {
        // if no social_descricao add one from texto
        if (empty($this->social_descricao) && !empty($this->texto)) {
            $desc = substr(strip_tags(trim($this->texto)), 0, Social::DESCRIPTION_MAX_LEN);
            $this->social_descricao = $desc;
        }
    }
}
