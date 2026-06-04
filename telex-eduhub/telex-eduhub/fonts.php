<?php
add_action( 'enqueue_block_assets', 'eduhub_fonts' );
function eduhub_fonts() {
	wp_enqueue_style(
		'eduhub-google-fonts',
		'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);
}