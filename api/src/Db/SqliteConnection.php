<?php

namespace NewsEditorApi\Db;

/**
 * It is a SQLite PDO Connection
 */
class SqliteConnection
{
    static private $instance;

    static private $config;

    static public function setConfig(array $config)
    {
        self::$config = $config;
    }

    static public function getInstance()
    {
        if (!self::$instance) {
            $dsn = sprintf('sqlite:%s', self::$config['db']);
            self::$instance = new \PDO($dsn);
        }

        return self::$instance;
    }
}
