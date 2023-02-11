<?php

return [
    'exclude_analysis_directory_list' => [
        'vendor',
        'vendor-bin',
    ],
    'directory_list' => [
        'samples',
        'vendor',
    ],
    'exclude_file_list' => [
        'samples/phan-loose.php',
        'samples/phan-strict.php',
    ],
    'minimum_severity' => 10,
];
