<?php
error_reporting(E_ERROR);

class B {
    /**
     * @param string $p
     * @return string
     */
    function g($p) {
        if (!$p) {
            return null;
        }
        return $p;
    }
}

class C extends B {
    function f($p) {
        return $this->$p[0];
    }

    /**
     * @param int $p
     * @return int
     */
    function g($p) {
        $this->p = $p;
        $this->property = [42];
        return $this->f($p);
    }

}

print (new C)->g('property' . $undeclared_global) . "\n";
