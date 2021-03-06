CREATE TABLE IF NOT EXISTS `noticia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `data_noticia` DATETIME,
  `titulo` VARCHAR(255) NOT NULL,
  `texto` TEXT,
  `social_titulo` VARCHAR(255),
  `social_imagem` VARCHAR(255),
  `social_descricao` TEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_noticia_dominio`
  INDEX `noticia_data_idx` (`data_noticia` ASC))
ENGINE = InnoDB;
