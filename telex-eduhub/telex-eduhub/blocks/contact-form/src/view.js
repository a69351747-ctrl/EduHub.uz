document.addEventListener( 'DOMContentLoaded', () => {
	const forms = document.querySelectorAll( '.wp-block-eduhub-contact-form' );

	forms.forEach( ( form ) => {
		const submitBtn = form.querySelector( '.eduhub-contact-form__submit' );
		const submitText = form.querySelector( '.eduhub-contact-form__submit-text' );
		const statusEl = form.querySelector( '.eduhub-contact-form__status' );

		if ( ! submitBtn || ! statusEl ) {
			return;
		}

		const originalLabel = submitText ? submitText.textContent : 'Yuborish';

		form.addEventListener( 'submit', async ( event ) => {
			event.preventDefault();

			statusEl.textContent = '';
			statusEl.className = 'eduhub-contact-form__status';

			if ( ! form.checkValidity() ) {
				const firstInvalid = form.querySelector( ':invalid' );
				if ( firstInvalid ) {
					firstInvalid.focus();
				}
				statusEl.textContent = 'Iltimos, barcha majburiy maydonlarni to\'ldiring.';
				statusEl.classList.add( 'eduhub-contact-form__status--error' );
				return;
			}

			const emailInput = form.querySelector( 'input[name="email"]' );
			if ( emailInput ) {
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if ( ! emailPattern.test( emailInput.value.trim() ) ) {
					emailInput.focus();
					statusEl.textContent = 'Iltimos, to\'g\'ri elektron pochta manzilini kiriting.';
					statusEl.classList.add( 'eduhub-contact-form__status--error' );
					return;
				}
			}

			submitBtn.disabled = true;
			statusEl.textContent = 'Yuborilmoqda...';
			statusEl.classList.add( 'eduhub-contact-form__status--sending' );

			if ( submitText ) {
				submitText.innerHTML =
					'<span class="eduhub-contact-form__spinner"></span> Yuborilmoqda...';
			}

			const formData = new FormData( form );
			const body = {};
			formData.forEach( ( value, key ) => {
				body[ key ] = value.trim();
			} );

			try {
				const response = await fetch( form.dataset.endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': form.dataset.nonce,
					},
					body: JSON.stringify( body ),
				} );

				const data = await response.json();

				if ( ! response.ok ) {
					throw new Error(
						data?.message || 'Xabar yuborishda xatolik yuz berdi.'
					);
				}

				form.reset();
				statusEl.className = 'eduhub-contact-form__status';
				statusEl.classList.add(
					'eduhub-contact-form__status--success'
				);
				statusEl.textContent =
					form.dataset.success ||
					'Rahmat! Xabaringiz muvaffaqiyatli yuborildi.';
			} catch ( error ) {
				statusEl.className = 'eduhub-contact-form__status';
				statusEl.classList.add( 'eduhub-contact-form__status--error' );
				statusEl.textContent = error.message;
			} finally {
				submitBtn.disabled = false;
				if ( submitText ) {
					submitText.textContent = originalLabel;
				}
			}
		} );
	} );
} );