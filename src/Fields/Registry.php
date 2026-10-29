<?php
namespace ChatFlow\Laravel\Fields;

use ChatFlow\Laravel\Support\Hooks;

final class Registry {
	/** @var array<string,FieldType> */
	private array $fields = array();

	public function __construct() {
		$fields   = array( new ShortTextField(), new LongTextField(), new EmailField(), new PhoneField(), new NumberField(), new DateField(), new SingleChoiceField(), new MultiChoiceField(), new YesNoField(), new ConsentField(), new HiddenField(), new StatementField(), new SummaryField() );
		$fields   = array_merge( $fields, self::engagementFields() );
		$fields[] = new CalculatedField();
		$fields   = Hooks::filter( 'field_types', $fields );
		if ( ! is_array( $fields ) ) {
			throw new \UnexpectedValueException( 'field_types must return FieldType instances.' );
		}
		foreach ( $fields as $field ) {
			if ( ! $field instanceof FieldType ) {
				throw new \UnexpectedValueException( 'field_types must return FieldType instances.' );
			}
			$this->register( $field );
		}
	}
	/**
	 * @return list<FieldType> */
	public static function engagementFields(): array {
		return array( new RatingField(), new ScaleField(), new NpsField(), new SliderField(), new AddressField(), new MediaField(), new FileUploadField() );
	}

	public function register( FieldType $type ): void {
		$name = $type->type();
		if ( ! preg_match( '/^[a-z][a-z0-9_]{0,63}$/D', $name ) ) {
			throw new \InvalidArgumentException( 'Invalid field type name.' );
		}
		$this->fields[ $name ] = $type;
	}

	public function get( string $type ): FieldType {
		if ( ! isset( $this->fields[ $type ] ) ) {
			throw new \InvalidArgumentException( 'Unknown or unsupported field type.' );
		}
		return $this->fields[ $type ];
	}

	/** @return list<string> */
	public function types(): array {
		return array_keys( $this->fields );
	}

	/**
	 * Field types offered in the builder and accepted on publish: the registry,
	 * narrowed by config('chatflow.field_types') when set. file_upload is never
	 * enabled (uploads are not available in this version).
	 *
	 * @return list<string>
	 */
	public static function enabledTypes(): array {
		$types      = ( new self() )->types();
		$configured = config( 'chatflow.field_types' );
		if ( is_array( $configured ) ) {
			$types = array_intersect( $types, $configured );
		}
		return array_values( array_diff( $types, array( 'file_upload' ) ) );
	}
}
