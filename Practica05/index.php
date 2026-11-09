<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi primer página web en PHP - 250954</title>
</head>
<body>
    <?php 
    //Declaracion de una variable de tipo String
    $nombre="Gael U. López García";
    $carrera_estudiante="T.S.U. Desarrollo De Software Multiplataforma";
    echo "<h1>Hola mundo PHP!</h1>";
    #Esta linea imprime la version de PHP que se esta Utilizando
    echo "<h2>Estas usando la version de PHP:".phpversion(). "</h2>";
    ?>
    <hr>
    <?php
    /* Despúes de asignarle un valor a la varibles $nombre,podemos imprimirla en  pantalla */
    echo "<h3>Mi nombre es: $nombre <br><br>
    Estudio: $carrera_estudiante</h3>"; 
     ?>
     <?php
     //Global Scoope - Alcance Global 
     $x=10;
     $y=5;
     $z='3';
     echo "<h3>la suma de $x+$y es:".($x+$y)."</h3>"; 
     echo "<h3>la suma de $x+$y+$z es:".($x+$y+$z)."</h3>"; 
     echo"<hr>";
     //Local Scope - Alcance Local

     function multiplicar($a,$b)
     {
        $resultado=$a*$b;
        echo "<h4>La Multiplicacion de $a * $b es: $resultado</h4>";
        return $resultado;
     }
     echo "<h4>La multiplicacion de 3x3 es:".multiplicar(3,3). "</h4>";
     echo "<h4>La multiplicacion de $x x $z es:".multiplicar($x,$z). "</h4>";
     echo "<h4>La multiplicacion de 1250x325 es:".multiplicar(1250,325). "</h4>";
     echo"<hr>";
     
     //Static Scoope - Alcance Estatico

     function myTest()
     {static $w=0;
     echo"$w <br>";
     $w++;
     }
     myTest();
     myTest();
     myTest();
     myTest();
     myTest();
     #funxion para saber el tipo de dato de un variable
     //var_dump() es una funcion que nos permite conocer el tipo de daro de una 
     //varible y su valor, no es necesario programarla por ya está implementada en PHP
     echo "<p>las variables <estrong>nombre</strong> es de tipo: ";
     var_dump($nombre);
     echo "</p>";
      echo "<p>las variables <estrong>carrera_estudiante</strong> es de tipo: ";
     var_dump($carrera_estudiante);
     echo "</p>";
    $edad=20.5;
    $fecha_nacimineto=date("2006/04/30");
     echo "<p>las variables <estrong>\fecha_nacimiento</strong> es de tipo: ";
     var_dump($fecha_nacimineto);
     echo"</p>";

     $fecha_hoy=date("Y/M/D");
     $edad_actual=$fecha_hoy - $fecha_nacimineto;
     echo "<p>la edad actual es: $edad_actual</p>";






      ?>
</body>
</html>