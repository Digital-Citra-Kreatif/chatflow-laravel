<?php
namespace ChatFlow\Laravel\Tests\Sunrice\Fixtures;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

final class User extends Authenticatable {
	use HasRoles;

	protected $table   = 'users';
	protected $guarded = array();
}
