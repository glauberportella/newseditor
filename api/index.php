<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use NewsEditorApi\Db\Connection;
use NewsEditorApi\Db\SqliteConnection;
use NewsEditorApi\Db\Repository;
use NewsEditorApi\Model\Config;
use NewsEditorApi\Model\Noticia;

/** CORS  */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

$app = new Silex\Application();
$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => __DIR__.'/views',
));

$app['debug'] = true;

// Initialize Connection settings
SqliteConnection::setConfig(array('db' => __DIR__.'/data/config.db'));
Connection::setConfig(Config::getConnectionOptions());
$app['db'] = Connection::getInstance();
$app['config'] = SqliteConnection::getInstance();

$app['base_url'] = $app['debug'] ? 'http://localhost:8000' : 'http://'.Config::getValue('DOMAIN');

/**
 * CONFIG API
 */
$app->get('/config', function() use($app) {

  $repository = new Repository($app['config'], '\NewsEditorApi\Model\Config');
  $values = $repository->find();

  return $app->json($values);

});

$app->get('/config/{key}', function($key) use($app) {

  return $app->json(array(
    $key => Config::get($key),
  ));

});

$app->post('/config', function(Request $request) use($app) {

  $data = json_decode($request->getContent(), true);

  $success = true;

  foreach ($data as $key => $value) {
    $success &= Config::updateValue($key, $value);
  }

  return (bool)$success
    ? $app->json(array('success' => true))
    : $app->json(array('success' => false));

});

$app->put('/config/{key}', function(Request $request) use($app) {

  $data = json_decode($request->getContent(), true);
  return Config::updateValue($key, $data[$key])
    ? $app->json(array('success' => true, $key => $data[$key]))
    : $app->json(array('success' => false));

});

$app->post('/testdb', function(Request $request) use($app) {
    $config = json_decode($request->getContent(), true);
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s', $config['host'], $config['port'], $config['db']);
    try {
        $pdo = new \PDO($dsn, $config['user'], $config['pass']);
    } catch (\PDOException $e) {
        return $app->json(array(
            'success' => false,
            'message' => utf8_encode($e->getMessage())
        ));
    }
    return $app->json(array(
        'success' => true,
        'message' => utf8_encode('Conectado com sucesso!')
    ));
});
/**
 * NOTICIAS API
 */
$app->get('/noticias', function(Request $request) use($app) {
    $page = $request->get('page', 1);
    $limit = $request->get('limit', 25);
    $offset = ($page - 1) * $limit;

    $repository = new Repository($app['db'], '\NewsEditorApi\Model\Noticia');

    $conditions = array();
    foreach ($request->query as $field => $value) {
        // TODO add conditions in another format on query string
        if ($field == 'limit' || $field == 'page')
            continue;
        $conditions[$field] = $value;
    }
    // total rows
    $total = $repository->totalRows($conditions);
    $orderBy = array();
    $noticias = $repository->find($conditions, $orderBy, $offset, $limit);

    if (false === $noticias) {
        return $app->json(array(
            'success' => false,
            'message' => 'Erro ao obter noticias.'
        ));
    }

    return $app->json(array(
        'success' => true,
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
        'items' => $noticias
    ));
});

$app->get('/noticias/{id}', function($id) use($app) {
    $noticia = new Noticia((int)$id);
    return $app->json($noticia);
});

$app->post('/noticias', function(Request $request) use($app) {
    $data = json_decode($request->getContent(), true);

    // create file
    if (Imagem::isBase64($data['social_imagem'])) {
        $file = Imagem::base64ToFile($data['social_imagem'], __DIR__.'/files');
        if ($file) {
            $data['social_imagem'] = $app['base_url'].'/api/files/'.$file;
        }
    }

    $noticia = new Noticia();
    foreach ($data as $field => $value) {
        $noticia->{$field} = $value;
    }
    $success = $noticia->add();
    if (!$success) {
        // remove file
        if (!empty($file)) {
            if (file_exists(__DIR__.'/files/'.$file)) {
                unlink(__DIR__.'/files/'.$file);
            }
        }

        return $app->json(array(
            'success' => false,
            'message' => 'Erro ao adicionar nova noticia.',
        ));
    }

    return $app->json(array(
        'success' => true,
        'id_noticia' => $noticia->id,
    ));
});

$app->put('/noticias/{id}', function(Request $request, $id) use($app) {
    $data = json_decode($request->getContent(), true);
    $noticia = new Noticia($id);
    foreach ($data as $field => $value) {
        $noticia->{$field} = $value;
    }
    $success = $noticia->update();
    if (!$success) {
        return $app->json(array(
            'success' => false,
            'message' => 'Erro ao atualizar dados da noticia.',
        ));
    }
    return $app->json(array(
        'success' => true,
        'id_noticia' => $noticia->id,
    ));
});

$app->delete('/noticias/{id}', function($id) use ($app) {
    $noticia = new Noticia($id);
    $success = $noticia->delete();
    if (!$success) {
        return $app->json(array(
            'success' => false,
            'message' => 'Erro ao excluir noticia.',
        ));
    }
    return $app->json(array(
        'success' => true
    ));
});

// url for social share
$app->get('/share/noticia/{id}/{slug}', function($id, $slug = null) use ($app) {
  $noticia = new Noticia($id);

  // nao faz nada com slug so para ficar amigavel
  $slug = $slug; // :)

  if (empty($noticia->id)) {
    // render error 404
    return $app['twig']->render('error404.html.twig');
  }

  $config = Config::getValues();

  return $app['twig']->render('share.html.twig', array('news' => $noticia->asArray(), 'config' => $config));
})->value('slug', null);


// Workaround CORS problem with OPTIONS request
$app->match("{url}", function($url) use ($app){
    return "OK";
})->assert('url', '.*')->method("OPTIONS");

$app->run();
