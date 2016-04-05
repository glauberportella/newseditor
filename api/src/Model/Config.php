<?php

namespace NewsEditorApi\Model;

use NewsEditorApi\Db\Connection;

class Config extends ActiveRecord
{
    public static $tableName = 'config';

    public static function getConnectionOptions() {
        $sql = 'SELECT `nome`, `valor` FROM `'.static::$tableName.'` WHERE `nome` LIKE "DB_%"';

        $stmt = SqliteConnection::getInstance()->prepare($sql);

        if (!$stmt->execute())
            return array();

        $options = array();
        while($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $options[$row['nome']] = $row['valor'];
        }

        return array(
            'host' => isset($options['DB_HOST']) ? $options['DB_HOST'] : 'localhost',
            'db' => isset($options['DB_NAME']) ? $options['DB_NAME'] : 'test',
            'user' => isset($options['DB_USER']) ? $options['DB_USER'] : 'root',
            'password' => isset($options['DB_PASS']) ? $options['DB_PASS'] : '',
        );
    }

    public static function getValue($key, $default = null)
    {
      $sql = 'SELECT `valor` FROM `'.static::$tableName.'` WHERE LOWER(`nome`) = LOWER(?)';
      $stmt = Connection::getInstance()->prepare($sql);
      if (!$stmt->execute(array($key)))
        return $default;
      return $stmt->fetchColumn() ? : $default;
    }

    public static function addValue($key, $value)
    {
      // if key exists update it
      $sql = 'SELECT `id` FROM `'.static::$tableName.'` WHERE LOWER(`nome`) = LOWER(?)';
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
      $sql = 'SELECT `id` FROM `'.static::$tableName.'` WHERE LOWER(`nome`) = LOWER(?)';
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
