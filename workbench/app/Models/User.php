<?php
namespace Workbench\App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

/** The workbench app's user: panel roles come from HasRoles. */
final class User extends Authenticatable {
	use HasRoles;

	protected $table   = 'users';
	protected $guarded = array();
}
