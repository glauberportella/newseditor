<?php

namespace NewsEditorApi\Install;

use NewsEditorApi\Db\Connection;
use NewsEditorApi\Db\SqliteConnection;

class InstallManager
{
    public static function install(array $configdb, array $newsdb)
    {
        SqliteConnection::setConfig($configdb);
        static::loadSql(SqliteConnection::getInstance(), __DIR__.'/../../install/config.install.sql');

        Connection::setConfig($newsdb);
        static::loadSql(Connection::getInstance(), __DIR__.'/../../install/install.sql');
    }

    public static function uninstall(array $configdb, array $newsdb)
    {
        SqliteConnection::setConfig($configdb);
        static::loadSql(SqliteConnection::getInstance(), __DIR__.'/../../install/config.uninstall.sql');

        Connection::setConfig($newsdb);
        static::loadSql(Connection::getInstance(), __DIR__.'/../../install/uninstall.sql');
    }

    protected static function loadSql($pdo, $file)
    {
        $sqlContent = file_get_contents($file);
        $sqlStatements = preg_split('/;\s*[\r\n]+/', $sqlContent);
        $result = true;
        foreach ($sqlStatements as $statement) {
            if (!empty($statement)) {
                $result &= false !== $pdo->exec(trim($statement));
            }
        }
        return $result;
    }
}
