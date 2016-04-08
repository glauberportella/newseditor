<?php

namespace NewsEditorApi\Db;

class Repository
{
	protected $connection;
	protected $class;

	public function __construct(\PDO $conn, $class)
	{
		$this->connection = $conn;
		$this->class = $class;
	}

  public function totalRows(array $conditions = array())
  {
    $className = $this->class;
    $tableName = $className::$tableName;
    $primaryKeyColumn = $className::$primaryKey;

    $values = array();
    $where = $this->whereClause($conditions, $values);

    $sql = "SELECT COUNT($primaryKeyColumn) FROM $tableName";
    if (!empty($where)) {
      $sql .= " WHERE $where";
    }

    $stmt = $this->connection->prepare($sql);
    $success = $stmt->execute($values);

    if (!$success) {
      return false;
    }

    return (int)$stmt->fetchColumn();
  }

	/**
	 * Find rows
	 *
	 * @param  array  $conditions Where conditions [field => value], for each array entry an AND operator is applied. A special key 'where' can be assign to other where clauses.
	 * @param  array  $orderBy    Order by clause [field => direction (ASC|DESC)]
	 * @param  [type] $offset     Offset for limit clause
	 * @param  [type] $numRows    Number of records to load
	 * @return array|boolean    Associative array with results [fieldname => value] if success, FALSE otherwise
	 */
	public function find(array $conditions = array(), array $orderBy = array(), $offset = null, $numRows = null)
	{
		$className = $this->class;
		$tableName = $className::$tableName;

    $values = array();
		$where = $this->whereClause($conditions, $values);
    $order = $this->orderClause($orderBy);

		$limit = '';
		if (!is_null($offset)) {
			$limit = ' LIMIT '.$offset;
		}

		if ($numRows) {
			$limit .= ', '.$numRows;
		}

		$sql = 'SELECT * FROM '.$tableName;
		if (!empty($where)) {
			$sql .= " WHERE $where";
		}

		if (!empty($order)) {
			$sql .= " $order";
		}

		if (!empty($limit)) {
			$sql .= " $limit";
		}

		$stmt = $this->connection->prepare($sql);
		$success = $stmt->execute($values);

		if (!$success) {
			return false;
		}

		return $stmt->fetchAll(\PDO::FETCH_ASSOC);
	}

  /**
   * Create SQL where clause for conditions and return the conditions values in the second argument
   *
   * @param  array  $conditions The where conditions
   * @param  array  &$values    The where conditions values returned, arg passed by reference
   * @return string
   */
  protected function whereClause(array $conditions = array(), &$values = array())
  {
    $where = '';
    if (count($conditions)) {
      if (isset($conditions['where'])) {
        $where = $conditions['where'].' AND ';
        unset($conditions['where']);
      }
      if (count($conditions)) {
        $where .= implode('=? AND ', array_keys($conditions));
        $where .= '=?'; // last field placeholder
        $values = array_values($conditions);
      } else {
        // remove last AND
        $where = substr($where, 0, strlen($where) - strlen(' AND '));
      }
    }
    return $where;
  }

  protected function orderClause(array $orderBy = array())
  {
    $order = '';
    if (count($orderBy)) {
      $order = 'ORDER BY ';
      foreach ($orderBy as $field => $direction) {
        if (empty($direction)) {
          $direction = 'ASC';
        }
        $order .= "$field $direction,";
      }
      $order = substr($order, 0, strlen($order) - 1); // remove last additional ','
    }
    return $order;
  }
}
