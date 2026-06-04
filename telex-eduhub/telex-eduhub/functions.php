<?php
if ( file_exists( __DIR__ . '/page-url-rewrite.php' ) ) { require_once __DIR__ . '/page-url-rewrite.php'; }
if ( file_exists( __DIR__ . '/scrollytelling.php' ) ) { require_once __DIR__ . '/scrollytelling.php'; }
/**
 * EduHub Theme Functions
 *
 * @package EduHub
 * @since   1.0.0
 */

// Telex-injected runtime helpers — siblings of functions.php at the theme root.
if ( file_exists( __DIR__ . '/styles.php' ) ) { require_once __DIR__ . '/styles.php'; }
if ( file_exists( __DIR__ . '/theme-assets-rewrite.php' ) ) { require_once __DIR__ . '/theme-assets-rewrite.php'; }
if ( file_exists( __DIR__ . '/content-loader.php' ) ) { require_once __DIR__ . '/content-loader.php'; }
require_once __DIR__ . '/fonts.php';

/**
 * Theme setup — theme supports and editor features.
 */
add_action( 'after_setup_theme', static function (): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'custom-spacing' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
} );

/**
 * Enqueue front-end styles and scripts.
 */
add_action( 'wp_enqueue_scripts', static function (): void {
	$theme_version = wp_get_theme()->get( 'Version' );

	wp_enqueue_script(
		'eduhub-header-scroll',
		get_theme_file_uri( 'assets/header-scroll.js' ),
		array(),
		$theme_version,
		true
	);

	wp_enqueue_script(
		'eduhub-reveal-on-scroll',
		get_theme_file_uri( 'assets/reveal-on-scroll.js' ),
		array(),
		$theme_version,
		true
	);

	wp_enqueue_script(
		'eduhub-counter',
		get_theme_file_uri( 'assets/counter.js' ),
		array(),
		$theme_version,
		true
	);
} );

/**
 * Register custom post types and their meta fields.
 */
add_action( 'init', static function (): void {

	// --- Content CPT: Competitions ---
	register_post_type( 'eduhub_competition', array(
		'label'        => 'Competitions',
		'labels'       => array(
			'name'          => 'Competitions',
			'singular_name' => 'Competition',
			'menu_name'     => 'Competitions',
			'add_new_item'  => 'Add New Competition',
			'edit_item'     => 'Edit Competition',
		),
		'public'       => true,
		'has_archive'  => 'competitions-archive',
		'show_in_rest' => true,
		'rest_base'    => 'competitions',
		'menu_icon'    => 'dashicons-awards',
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
		'rewrite'      => array( 'slug' => 'competition' ),
	) );

	$competition_meta = array(
		'grade_levels' => 'sanitize_text_field',
		'subject'      => 'sanitize_text_field',
		'start_date'   => 'sanitize_text_field',
		'end_date'     => 'sanitize_text_field',
		'prize_info'   => 'sanitize_text_field',
		'status'       => 'sanitize_text_field',
	);

	foreach ( $competition_meta as $key => $sanitize ) {
		register_post_meta( 'eduhub_competition', $key, array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
			'sanitize_callback' => $sanitize,
		) );
	}

	// --- Content CPT: Games ---
	register_post_type( 'eduhub_game', array(
		'label'        => 'Games',
		'labels'       => array(
			'name'          => 'Games',
			'singular_name' => 'Game',
			'menu_name'     => 'Games',
			'add_new_item'  => 'Add New Game',
			'edit_item'     => 'Edit Game',
		),
		'public'       => true,
		'has_archive'  => 'games-archive',
		'show_in_rest' => true,
		'rest_base'    => 'games',
		'menu_icon'    => 'dashicons-games',
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
		'rewrite'      => array( 'slug' => 'game' ),
	) );

	$game_meta = array(
		'age_group'  => 'sanitize_text_field',
		'difficulty' => 'sanitize_text_field',
		'category'   => 'sanitize_text_field',
	);

	foreach ( $game_meta as $key => $sanitize ) {
		register_post_meta( 'eduhub_game', $key, array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
			'sanitize_callback' => $sanitize,
		) );
	}

	// --- Content CPT: Universities ---
	register_post_type( 'eduhub_university', array(
		'label'        => 'Universities',
		'labels'       => array(
			'name'          => 'Universities',
			'singular_name' => 'University',
			'menu_name'     => 'Universities',
			'add_new_item'  => 'Add New University',
			'edit_item'     => 'Edit University',
		),
		'public'       => true,
		'has_archive'  => 'universities',
		'show_in_rest' => true,
		'rest_base'    => 'universities',
		'menu_icon'    => 'dashicons-building',
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
		'rewrite'      => array( 'slug' => 'university' ),
	) );

	$university_string_meta = array(
		'city'            => 'sanitize_text_field',
		'exam_subjects'   => 'sanitize_text_field',
		'website_url'     => 'esc_url_raw',
		'specializations' => 'sanitize_text_field',
	);

	foreach ( $university_string_meta as $key => $sanitize ) {
		register_post_meta( 'eduhub_university', $key, array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
			'sanitize_callback' => $sanitize,
		) );
	}

	register_post_meta( 'eduhub_university', 'min_score', array(
		'type'              => 'number',
		'single'            => true,
		'show_in_rest'      => true,
		'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
		'sanitize_callback' => static fn( $v ) => (float) $v,
	) );

	// --- Submission CPT: Inquiries ---
	register_post_type( 'eduhub_inquiry', array(
		'label'        => 'Inquiries',
		'labels'       => array(
			'name'          => 'Inquiries',
			'singular_name' => 'Inquiry',
			'menu_name'     => 'Inquiries',
			'add_new_item'  => 'Add New Inquiry',
			'edit_item'     => 'Edit Inquiry',
		),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'show_in_rest' => true,
		'rest_base'    => 'eduhub-inquiries',
		'menu_icon'    => 'dashicons-email-alt',
		'supports'     => array( 'title', 'editor', 'custom-fields' ),
	) );

	$inquiry_fields = array(
		'name'    => array( 'type' => 'string', 'sanitize' => 'sanitize_text_field' ),
		'email'   => array( 'type' => 'string', 'sanitize' => 'sanitize_email' ),
		'subject' => array( 'type' => 'string', 'sanitize' => 'sanitize_text_field' ),
		'message' => array( 'type' => 'string', 'sanitize' => 'sanitize_textarea_field' ),
	);

	foreach ( $inquiry_fields as $key => $spec ) {
		register_post_meta( 'eduhub_inquiry', $key, array(
			'type'              => $spec['type'],
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
			'sanitize_callback' => $spec['sanitize'],
		) );
	}

	// --- One-shot rewrite flush ---
	if ( ! get_option( 'eduhub_rewrite_flushed' ) ) {
		flush_rewrite_rules();
		update_option( 'eduhub_rewrite_flushed', 1 );
	}
} );

/**
 * Register custom blocks from their build directories.
 */
add_action( 'init', static function (): void {
	$blocks = array( 'contact-form' );
	foreach ( $blocks as $slug ) {
		register_block_type( get_template_directory() . '/blocks/' . $slug . '/build' );
	}
} );

/**
 * Register REST API route for contact form submissions.
 */
add_action( 'rest_api_init', static function (): void {
	register_rest_route( 'eduhub/v1', '/inquiry', array(
		'methods'             => 'POST',
		'callback'            => 'eduhub_handle_inquiry_submission',
		'permission_callback' => '__return_true',
		'args'                => array(
			'name'    => array(
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
			),
			'email'   => array(
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_email',
			),
			'subject' => array(
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
			),
			'message' => array(
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_textarea_field',
			),
		),
	) );
} );

/**
 * Handle incoming inquiry submissions from the contact form block.
 *
 * @param WP_REST_Request $request The REST request object.
 * @return WP_REST_Response|WP_Error
 */
function eduhub_handle_inquiry_submission( WP_REST_Request $request ) {
	$email = $request->get_param( 'email' );

	if ( ! is_email( $email ) ) {
		return new WP_Error(
			'invalid_email',
			'Please provide a valid email address.',
			array( 'status' => 400 )
		);
	}

	$name    = $request->get_param( 'name' );
	$subject = $request->get_param( 'subject' );
	$message = $request->get_param( 'message' );

	$post_id = wp_insert_post( array(
		'post_type'    => 'eduhub_inquiry',
		'post_status'  => 'publish',
		'post_title'   => $name . ' — ' . $subject . ' — ' . current_time( 'Y-m-d H:i' ),
		'post_content' => $message,
		'meta_input'   => array(
			'name'    => $name,
			'email'   => $email,
			'subject' => $subject,
			'message' => $message,
		),
	), true );

	if ( is_wp_error( $post_id ) ) {
		return new WP_Error(
			'insert_failed',
			'Could not save your inquiry. Please try again.',
			array( 'status' => 500 )
		);
	}

	return new WP_REST_Response( array(
		'ok' => true,
		'id' => $post_id,
	), 201 );
}