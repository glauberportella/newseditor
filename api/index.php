<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use NewsEditorApi\Db\Connection;
use NewsEditorApi\Db\Repository;
use NewsEditorApi\Model\Noticia;

/** CORS  */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

$app = new Silex\Application();

$app['debug'] = true;

// Initialize Connection settings
Connection::setConfig(array(
    'host' => 'localhost',
    'db' => 'newseditor',
    'user' => 'root',
    'password' => ''
));
$app['db'] = Connection::getInstance();

/**
 * NOTICIAS API
 */
$app->get('/noticias', function(Request $request) use($app) {
    $page = $request->get('page', 1);
    $limit = $request->get('limit', 25);
    $offset = ($page - 1) * $limit;

    $conditions = array();

    foreach ($request->query as $field => $value) {
        $conditions[$field] = $value;
    }

    $orderBy = array();

    $repository = new Repository($app['db'], '\NewsEditorApi\Model\Noticia');
    $noticias = $repository->find($conditions, $orderBy, $offset, $limit);

    return $app->json($noticias);
});

$app->get('/noticias/{id}', function($id) use($app) {
    $noticia = new Noticia((int)$id);
    return $app->json($noticia);
});

$app->post('/noticias', function(Request $request) use($app) {
    $data = json_decode($request->getContent(), true);
    $noticia = new Noticia();
    foreach ($data as $field => $value) {
        $noticia->{$field} = $value;
    }
    $success = $noticia->add();
    if (!$success) {
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

// Workaround CORS problem with OPTIONS request
$app->match("{url}", function($url) use ($app){
    return "OK";
})->assert('url', '.*')->method("OPTIONS");

$app->run();
