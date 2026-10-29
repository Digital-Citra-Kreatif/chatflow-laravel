<?php
namespace ChatFlow\Laravel\Http\Controllers\Admin;

use ChatFlow\Laravel\Notifications\ContentTemplates;
use ChatFlow\Laravel\Notifications\Notifications;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Http\Request;

/** Email notification tools in the builder: preview, test send and reusable content templates. */
final class NotificationsController extends ApiController {
	public function preview( Request $request ): array|Error {
		return ( new Notifications( $this->forms ) )->preview( $this->body( $request ) );
	}

	public function test( Request $request ): array|Error {
		return ( new Notifications( $this->forms ) )->test( $this->body( $request ) );
	}

	public function templates(): array {
		return array( 'items' => ( new ContentTemplates() )->all() );
	}

	public function saveTemplate( Request $request ): array|Error {
		$items = ( new ContentTemplates() )->add( $this->body( $request ) );
		return Error::is( $items ) ? $items : array( 'items' => $items );
	}

	public function deleteTemplate( Request $request ): array|Error {
		$items = ( new ContentTemplates() )->remove( $this->body( $request )['id'] ?? $request->query( 'id' ) );
		return Error::is( $items ) ? $items : array( 'items' => $items );
	}
}
