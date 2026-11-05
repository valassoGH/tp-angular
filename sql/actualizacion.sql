-- Ejecutar UNA vez en phpMyAdmin, con la base `bdfacturas` seleccionada (pestaña SQL o Importar).
-- Se puede ejecutar aunque ya hayas importado el usuario.sql anterior.

-- 1) Corrección de facturas: IVA era decimal(5,2) (máximo 999,99) y quedó cortado en la mayoría de las filas
ALTER TABLE `facturas` MODIFY `IVA` decimal(12,2) NOT NULL;
UPDATE `facturas` SET `IVA` = ROUND(`Importe` * 0.21, 2);

-- 2) Baja lógica de sucursales
ALTER TABLE `sucursal` ADD COLUMN IF NOT EXISTS `activo` tinyint(1) NOT NULL DEFAULT 1;

-- 3) Usuarios (categoría: 1 = Empleado, 2 = Administrador)
CREATE TABLE IF NOT EXISTS `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario`   varchar(50)  NOT NULL UNIQUE,
  `clave`     varchar(255) NOT NULL,
  `categoria` varchar(30)  NOT NULL,
  `nivel`     int(11)      NOT NULL,
  `activo`    tinyint(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `usuario` ADD COLUMN IF NOT EXISTS `activo` tinyint(1) NOT NULL DEFAULT 1;

INSERT IGNORE INTO `usuario` (`usuario`, `clave`, `categoria`, `nivel`) VALUES
('empleado', '$2y$10$lpGM6tE18ePf1buu4j53D.vK7NFWsHfBp040SSMRnLIWK2XvrUR2O', 'Empleado', 1),
('admin', '$2y$10$z2To56SBVM2sCAPifsRCYuPpCRde3afPUMNUjH3IlN5igJc/H.29K', 'Administrador', 2);

UPDATE `usuario` SET `nivel` = 2, `categoria` = 'Administrador' WHERE `usuario` = 'admin';
DELETE FROM `usuario` WHERE `usuario` = 'gerente';
