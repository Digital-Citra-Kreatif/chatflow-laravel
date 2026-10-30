<?php
namespace Workbench\App\Providers;

use ChatFlow\Laravel\Sunrice\ChatFlowPlugin;
use Sunrice\Admin\Panel;
use Sunrice\Admin\PanelProvider;

/** A Sunrice admin panel at /admin with the ChatFlow plugin. */
final class AdminPanelProvider extends PanelProvider {
	public function panel( Panel $panel ): Panel {
		return $panel->brand( 'ChatFlow workbench' )->plugin( ChatFlowPlugin::make() );
	}
}
