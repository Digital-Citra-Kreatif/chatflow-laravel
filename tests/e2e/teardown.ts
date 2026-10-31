import { execFileSync } from 'node:child_process';

// `testbench serve` writes a .env and cached config into the Testbench skeleton, which
// PHPUnit would then load. Reset the skeleton so the PHP tests run against defaults.
export default function teardown() {
  execFileSync('vendor/bin/testbench', ['package:purge-skeleton'], { stdio: 'ignore' });
}
