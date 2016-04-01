<?php

namespace NewsEditorApi\Model;

use NewsEditorApi\Db\Connection;

class Config extends ActiveRecord
{
    public static $tableName = 'config';

    public static function getValue($key, $default = null)
    {
      $sql = 'SELECT `valor` FROM `'.static::$tableName.'` WHERE LCASE(`nome`) = LCASE(?)';
      $stmt = Connection::getInstance()->prepare($sql);
      if (!$stmt->execute(array($key)))
        return $default;
      return $stmt->fetchColumn() ? : $default;
    }

    public static function addValue($key, $value)
    {
      // if key exists update it
      $sql = 'SELECT `id` FROM `'.static::$tableName.'` WHERE LCASE(`nome`) = LCASE(?)';
      $stmt = Connection::getInstance()->prepare($sql);
      if ($stmt->execute(array($key))) {
        $id = (int)$stmt->fetchColumn();
        if ($id > 0)
          return self::updateValue($key, $value);
      }
      // else is new
      $sql = 'INSERT INTO `'.static::$tableName.'` VALUES(NULL, ?, ?)';
      $stmt = Connection::getInstance()->prepare($sql);
      return $stmt->execute(array($key, $value));
    }

    public static function updateValue($key, $value)
    {
      // if key not exists add it
      $sql = 'SELECT `id` FROM `'.static::$tableName.'` WHERE LCASE(`nome`) = LCASE(?)';
      $stmt = Connection::getInstance()->prepare($sql);
      if (!$stmt->execute(array($key))) {
        return self::add($key, $value);
      }
      $id = (int)$stmt->fetchColumn();
      if ($id <= 0) {
        return self::add($key, $value);
      }
      $sql = 'UPDATE `'.static::$tableName.'` SET `valor`=? WHERE `id`=?';
      $stmt = Connection::getInstance()->prepare($sql);
      return $stmt->execute(array($value, $id));
    }
}
