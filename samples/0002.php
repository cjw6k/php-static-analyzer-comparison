<?php

function unshapedArrayReturn(): array
{
    return [
        'foo' => 1,
        'bar' => 7,
    ];
}

$unshapedArray = unshapedArrayReturn();

echo "{$unshapedArray['foo']} {$unshapedArray['bar']}", PHP_EOL;

echo "{$unshapedArray['baz']}", PHP_EOL;
