<?php
namespace ChatFlow\Laravel\Tests\Sunrice\Fixtures;

use ChatFlow\Laravel\Sunrice\ChatFlowPlugin;
use Sunrice\Admin\Panel;
use Sunrice\Admin\PanelProvider;

final class TestPanelProvider extends PanelProvider {
	public function panel( Panel $panel ): Panel {
		return $panel->plugin( ChatFlowPlugin::make() );
	}
}
