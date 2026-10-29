<?php
namespace ChatFlow\Laravel\Notifications;

use Illuminate\Console\Command;

/** Recovers email deliveries: releases interrupted rows and re-queues due retries. Schedule every five minutes. */
final class RetryDeliveriesCommand extends Command {
	protected $signature = 'chatflow:retry-deliveries';

	protected $description = 'Re-queue pending and interrupted ChatFlow email deliveries';

	public function handle(): int {
		$count = ( new Outbox() )->recover();
		$this->info( "Queued {$count} ChatFlow deliveries." );
		return self::SUCCESS;
	}
}
