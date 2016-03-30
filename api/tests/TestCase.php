<?php

namespace NewsEditorApi\Tests;

class TestCase extends \PHPUnit_Framework_TestCase
{
	protected function loadSql($pdo, $file)
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
