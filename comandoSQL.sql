-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`tb_usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tb_usuarios` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(80) NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `user_pass` VARCHAR(255) NOT NULL,
  `user_tipo` ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
  `user_avatar` VARCHAR(10) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT ':D',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`tb_comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tb_comentarios` (
  `com_id` INT NOT NULL AUTO_INCREMENT,
  `com_user_id` INT NOT NULL,
  `com_texto` VARCHAR(1000) NOT NULL,
  `com_data` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  `com_topico` VARCHAR(50) NOT NULL,
  `com_categoria` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`com_id`),
  INDEX `fk_tb_comentarios_tb_usuarios_idx` (`com_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_comentarios_tb_usuarios`
    FOREIGN KEY (`com_user_id`)
    REFERENCES `mydb`.`tb_usuarios` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`tb_logs_acesso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tb_logs_acesso` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `tb_usuarios_user_id` INT NULL,
  `log_acao` VARCHAR(100) NOT NULL,
  `log_data` TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`log_id`),
  INDEX `fk_tb_logs_acesso_tb_usuarios1_idx` (`tb_usuarios_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_logs_acesso_tb_usuarios1`
    FOREIGN KEY (`tb_usuarios_user_id`)
    REFERENCES `mydb`.`tb_usuarios` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`tb_recuperacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tb_recuperacoes` (
  `rec_id` INT NOT NULL AUTO_INCREMENT,
  `tb_usuarios_user_id` INT NOT NULL,
  `rec_codigo` VARCHAR(255) NOT NULL,
  `rec_expiracao` TIMESTAMP NOT NULL,
  `rec_usado` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`rec_id`),
  INDEX `fk_tb_recuperacoes_tb_usuarios1_idx` (`tb_usuarios_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_tb_recuperacoes_tb_usuarios1`
    FOREIGN KEY (`tb_usuarios_user_id`)
    REFERENCES `mydb`.`tb_usuarios` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
