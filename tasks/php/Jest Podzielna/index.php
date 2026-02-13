<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>AAA</title>
</head>
<body>
    <?php 
    $number = rand(0,1000);

    function CheckNumberDividers($num) {
        $dividers = [];
        for ($i=1; $i < $num; $i++) if (($num % $i) == 0) array_push($dividers,$i);
        return $dividers;
    }

    function MakeListForArray($array) {
        foreach ($array as $value) {
            echo "<li> $value </li>";
        }
    }

    ?>
    <div> 
        <p><?="Liczba $number jest podzielna przez:"?></p>
        <ul><?php MakeListForArray(CheckNumberDividers($number))?></ul>
    </div>
</body>
</html>