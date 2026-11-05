<?php
require "config.php";
requerir_nivel(1);
responder($db, "SELECT idCliente, apellido, nombre, situacionFiscal, dni
                FROM cliente ORDER BY apellido, nombre");
