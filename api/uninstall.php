<?php

require_once __DIR__.'/vendor/autoload.php';

$config = array(
    'db' => __DIR__.'/data/config.sq3'
);

$newsdb = array(
  'host' => 'localhost',
  'db' => 'newseditor',
  'user' => 'root',
  'password' => ''
);

NewsEditorApi\Install\InstallManager::uninstall($config, $newsdb);
