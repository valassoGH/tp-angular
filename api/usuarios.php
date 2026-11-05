<?php
require "config.php";
requerir_nivel(2);
responder($db, "SELECT idUsuario, usuario, categoria, nivel, activo FROM usuario ORDER BY idUsuario");
