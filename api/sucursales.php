<?php
require "config.php";
requerir_nivel(1);
responder($db, "SELECT idSucursal, nombre, ciudad, direccion, cantempleado, activo
                FROM sucursal ORDER BY idSucursal");
