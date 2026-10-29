<?php
namespace ChatFlow\Laravel\Admin;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\Statistics;
use Illuminate\Http\Request;

/** Data for the server-rendered forms list (the plugin's FormsTable). */
final class FormsList {
	public const PER_PAGE = 20;

	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/** @return array<string,mixed> */
	public function prepare( Request $request ): array {
		$status  = self::status( $request );
		$search  = mb_substr( trim( is_string( $request->query( 's' ) ) ? strip_tags( $request->query( 's' ) ) : '' ), 0, 200 );
		$orderby = 'title' === $request->query( 'orderby' ) ? 'title' : 'updated_at';
		$order   = is_string( $request->query( 'order' ) ) && 'asc' === strtolower( $request->query( 'order' ) ) ? 'asc' : 'desc';
		$page    = max( 1, Config::positiveInt( $request->query( 'paged' ) ) );
		$result  = $this->forms->paginate(
			array(
				'page'    => $page,
				'perPage' => self::PER_PAGE,
				'search'  => $search,
				'status'  => $status,
				'orderby' => $orderby,
				'order'   => $order,
			)
		);
		$items   = array_map( static fn( Form $form ): array => self::item( $form ), $result['items'] );
		$base    = array_filter(
			array(
				'page'    => 'cff-forms',
				'status'  => $status,
				's'       => $search,
				'orderby' => 'title' === $orderby ? 'title' : null,
				'order'   => 'title' === $orderby ? $order : null,
			),
			static fn( $value ): bool => null !== $value && '' !== $value
		);
		$views   = array();
		foreach ( array(
			''        => __( 'All' ),
			'draft'   => __( 'Draft' ),
			'publish' => __( 'Live' ),
			'trash'   => __( 'Trash' ),
		) as $view => $label ) {
			$args = array_filter(
				array(
					'page'   => 'cff-forms',
					'status' => $view,
					's'      => $search,
				),
				static fn( $value ): bool => '' !== $value
			);
			$views[] = array(
				'label'   => $label,
				'url'     => self::url( $args ),
				'current' => $view === $status,
			);
		}
		$pages = max( 1, (int) ceil( $result['total'] / self::PER_PAGE ) );
		return array(
			'items'     => $items,
			'total'     => $result['total'],
			'page'      => $page,
			'pages'     => $pages,
			'prevUrl'   => $page > 1 ? self::url( array_merge( $base, array( 'paged' => $page - 1 ) ) ) : null,
			'nextUrl'   => $page < $pages ? self::url( array_merge( $base, array( 'paged' => $page + 1 ) ) ) : null,
			'sortUrl'   => self::url(
				array_merge(
					$base,
					array(
						'orderby' => 'title',
						'order'   => 'title' === $orderby && 'asc' === $order ? 'desc' : 'asc',
					)
				)
			),
			'sorted'    => 'title' === $orderby ? $order : null,
			'views'     => $views,
			'status'    => $status,
			'search'    => $search,
			'trashView' => 'trash' === $status,
		);
	}

	/** @return array<string,mixed> */
	public static function item( Form $form ): array {
		$item = array_merge(
			array(
				'id'     => $form->id(),
				'name'   => $form->title(),
				'status' => $form->status(),
			),
			Statistics::get( $form->id() )
		);
		if ( 'trash' !== $form->status() ) {
			$item['editUrl']    = self::url(
				array(
					'page'   => 'cff-builder',
					'formId' => $form->id(),
				)
			);
			$item['previewUrl'] = self::url(
				array(
					'page'    => 'cff-builder',
					'formId'  => $form->id(),
					'preview' => 1,
				)
			);
			$item['shortcode']  = self::embed( $form );
		}
		return $item;
	}

	/** The Blade embed snippet for a form, matching the plugin's shortcode rules. */
	public static function embed( Form $form ): string {
		$display  = $form->settings()['display'] ?? array();
		$mode     = $display['mode'] ?? 'inline';
		$mode     = in_array( $mode, array( 'inline', 'fullpage', 'launcher', 'popup' ), true ) ? $mode : 'inline';
		$position = ( 'launcher' === $mode || 'popup' === $mode ) && 'left' === ( $display['launcher']['position'] ?? 'right' ) ? ' position="left"' : '';
		return '<x-chatflow::form :id="' . $form->id() . '" mode="' . $mode . '"' . $position . ' />';
	}

	public static function status( Request $request ): string {
		$status = $request->query( 'status' );
		return is_string( $status ) && in_array( $status, array( 'draft', 'publish', 'trash' ), true ) ? $status : '';
	}

	/** @param array<string,mixed> $args */
	public static function url( array $args ): string {
		return route( 'chatflow.admin.index', $args );
	}

	/** The unread inbox count shown in the navigation. */
	public static function unread(): int {
		try {
			return \ChatFlow\Laravel\Support\Database::query( 'submissions' )->where( 'is_read', 0 )->whereNotIn( 'status', array( 'spam', 'trash' ) )->count();
		} catch ( \Throwable ) {
			return 0;
		}
	}
}
