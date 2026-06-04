<?php
$nonce    = wp_create_nonce( 'wp_rest' );
$endpoint = esc_url_raw( rest_url( 'eduhub/v1/inquiry' ) );

$button_label        = esc_html( $attributes['buttonLabel'] ?? 'Yuborish' );
$success_message     = esc_attr( $attributes['successMessage'] ?? 'Rahmat! Xabaringiz muvaffaqiyatli yuborildi.' );
$name_placeholder    = esc_attr( $attributes['namePlaceholder'] ?? 'Ismingiz' );
$email_placeholder   = esc_attr( $attributes['emailPlaceholder'] ?? 'Elektron pochtangiz' );
$subject_placeholder = esc_attr( $attributes['subjectPlaceholder'] ?? 'Mavzu' );
$message_placeholder = esc_attr( $attributes['messagePlaceholder'] ?? 'Xabaringizni yozing...' );
?>
<form
	<?php echo get_block_wrapper_attributes( array( 'class' => 'eduhub-contact-form' ) ); ?>
	data-endpoint="<?php echo esc_attr( $endpoint ); ?>"
	data-nonce="<?php echo esc_attr( $nonce ); ?>"
	data-success="<?php echo $success_message; ?>"
	novalidate
>
	<div class="eduhub-contact-form__field">
		<label class="eduhub-contact-form__label" for="eduhub-cf-name">
			Ism <span aria-hidden="true">*</span>
		</label>
		<input
			type="text"
			id="eduhub-cf-name"
			name="name"
			class="eduhub-contact-form__input"
			placeholder="<?php echo $name_placeholder; ?>"
			required
			autocomplete="name"
		/>
	</div>

	<div class="eduhub-contact-form__field">
		<label class="eduhub-contact-form__label" for="eduhub-cf-email">
			Elektron pochta <span aria-hidden="true">*</span>
		</label>
		<input
			type="email"
			id="eduhub-cf-email"
			name="email"
			class="eduhub-contact-form__input"
			placeholder="<?php echo $email_placeholder; ?>"
			required
			autocomplete="email"
		/>
	</div>

	<div class="eduhub-contact-form__field">
		<label class="eduhub-contact-form__label" for="eduhub-cf-subject">
			Mavzu <span aria-hidden="true">*</span>
		</label>
		<input
			type="text"
			id="eduhub-cf-subject"
			name="subject"
			class="eduhub-contact-form__input"
			placeholder="<?php echo $subject_placeholder; ?>"
			required
		/>
	</div>

	<div class="eduhub-contact-form__field">
		<label class="eduhub-contact-form__label" for="eduhub-cf-message">
			Xabar <span aria-hidden="true">*</span>
		</label>
		<textarea
			id="eduhub-cf-message"
			name="message"
			class="eduhub-contact-form__textarea"
			rows="5"
			placeholder="<?php echo $message_placeholder; ?>"
			required
		></textarea>
	</div>

	<div class="eduhub-contact-form__actions">
		<button type="submit" class="eduhub-contact-form__submit">
			<span class="eduhub-contact-form__submit-text"><?php echo $button_label; ?></span>
		</button>
	</div>

	<p class="eduhub-contact-form__status" aria-live="polite" role="status"></p>
</form>