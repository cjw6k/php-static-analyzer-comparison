<?php

function addTwoInts(int $a, int $b): int
{
    return $a + $b;
}

// Expected usage
echo addTwoInts(7, 14), PHP_EOL;

// Type coercion, from floats
echo addTwoInts(7.0, 14.0), PHP_EOL;

// Type coercion, from numeric strings
echo addTwoInts('7', '14'), PHP_EOL;

// Type coercion, from non-numeric strings
echo addTwoInts('seven', 'fourteen'), PHP_EOL;
