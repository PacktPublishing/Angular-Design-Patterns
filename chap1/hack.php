<?hh
class MyClass {
  public function alpha(): int {
    return 1;
  }

  public function beta(): string {
    return 'hi test';
  }
}

function f(MyClass $my_inst): string {
  // Fix me!
  return $my_inst->alpha();
}