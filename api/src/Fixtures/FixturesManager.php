<?php

namespace NewsEditorApi\Fixtures;

use NewsEditorApi\Db\Connection;

class FixturesManager
{
	static private $config = array(
		'host' => 'localhost',
		'db' => 'newseditor',
		'user' => 'root',
		'password' => ''
	);

	public static function load()
	{
		Connection::setConfig(self::$config);

		self::loadSql(Connection::getInstance(), __DIR__.'/../../install/install.sql');
		self::loadSql(Connection::getInstance(), __DIR__.'/../../install/fixtures.load.sql');
	}

	public static function unload()
	{
		Connection::setConfig(self::$config);

		self::loadSql(Connection::getInstance(), __DIR__.'/../../install/fixtures.unload.sql');
		self::loadSql(Connection::getInstance(), __DIR__.'/../../install/uninstall.sql');
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
