import { useBlockProps } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		buttonLabel,
		successMessage,
		namePlaceholder,
		emailPlaceholder,
		subjectPlaceholder,
		messagePlaceholder,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'eduhub-contact-form eduhub-contact-form--editor',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Form sozlamalari" initialOpen={ true }>
					<TextControl
						label="Tugma matni"
						value={ buttonLabel }
						onChange={ ( val ) =>
							setAttributes( { buttonLabel: val } )
						}
					/>
					<TextareaControl
						label="Muvaffaqiyat xabari"
						value={ successMessage }
						onChange={ ( val ) =>
							setAttributes( { successMessage: val } )
						}
					/>
				</PanelBody>
				<PanelBody title="Placeholder matnlari" initialOpen={ false }>
					<TextControl
						label="Ism placeholder"
						value={ namePlaceholder }
						onChange={ ( val ) =>
							setAttributes( { namePlaceholder: val } )
						}
					/>
					<TextControl
						label="Email placeholder"
						value={ emailPlaceholder }
						onChange={ ( val ) =>
							setAttributes( { emailPlaceholder: val } )
						}
					/>
					<TextControl
						label="Mavzu placeholder"
						value={ subjectPlaceholder }
						onChange={ ( val ) =>
							setAttributes( { subjectPlaceholder: val } )
						}
					/>
					<TextControl
						label="Xabar placeholder"
						value={ messagePlaceholder }
						onChange={ ( val ) =>
							setAttributes( { messagePlaceholder: val } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="eduhub-contact-form__field">
					<label className="eduhub-contact-form__label">
						Ism *
					</label>
					<input
						type="text"
						className="eduhub-contact-form__input"
						placeholder={ namePlaceholder }
						disabled
					/>
				</div>

				<div className="eduhub-contact-form__field">
					<label className="eduhub-contact-form__label">
						Elektron pochta *
					</label>
					<input
						type="email"
						className="eduhub-contact-form__input"
						placeholder={ emailPlaceholder }
						disabled
					/>
				</div>

				<div className="eduhub-contact-form__field">
					<label className="eduhub-contact-form__label">
						Mavzu *
					</label>
					<input
						type="text"
						className="eduhub-contact-form__input"
						placeholder={ subjectPlaceholder }
						disabled
					/>
				</div>

				<div className="eduhub-contact-form__field">
					<label className="eduhub-contact-form__label">
						Xabar *
					</label>
					<textarea
						className="eduhub-contact-form__textarea"
						rows="5"
						placeholder={ messagePlaceholder }
						disabled
					/>
				</div>

				<div className="eduhub-contact-form__actions">
					<button
						type="button"
						className="eduhub-contact-form__submit"
						disabled
					>
						{ buttonLabel }
					</button>
				</div>

				<p className="eduhub-contact-form__status eduhub-contact-form__status--preview">
					Forma frontendda ishlaydi
				</p>
			</div>
		</>
	);
}