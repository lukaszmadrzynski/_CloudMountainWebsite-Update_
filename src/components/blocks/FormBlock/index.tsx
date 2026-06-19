import * as React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import SubmitButtonFormControl from './SubmitButtonFormControl';

function FormBlockInner(props) {
    const formRef = React.createRef<HTMLFormElement>();
    const turnstileRef = React.createRef<HTMLDivElement>();
    const { fields = [], elementId, submitButton, className, styles = {}, 'data-sb-field-path': fieldPath } = props;

    // Get URL params via Pages Router (static-export safe; populated client-side after hydration)
    const router = useRouter();
    const tourFromUrl = typeof router.query.tour === 'string' ? router.query.tour : '';
    const partnershipTypeFromUrl = typeof router.query.type === 'string' ? router.query.type : '';
    
    // State for form submission
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = React.useState('');
    // Turnstile token captured via the widget's callback. Used because the script
    // is loaded with `?render=explicit` (see _app.js), so the token is NOT auto-
    // inserted into the form as a hidden input — we have to pass it ourselves.
    const [turnstileToken, setTurnstileToken] = React.useState<string>('');

    // Render the Turnstile widget explicitly. The script is loaded with
    // `?render=explicit` (auto-scan disabled), so we MUST call
    // window.turnstile.render() ourselves or the widget never appears.
    // Polls briefly because the script may not be ready at mount time.
    React.useEffect(() => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
        if (!siteKey) return;
        if (!turnstileRef.current) return;

        let cancelled = false;
        const tryRender = () => {
            if (cancelled) return;
            if (typeof window !== 'undefined' && (window as any).turnstile && turnstileRef.current) {
                try {
                    (window as any).turnstile.render(turnstileRef.current, {
                        sitekey: siteKey,
                        theme: 'light',
                        callback: (token: string) => setTurnstileToken(token),
                        'expired-callback': () => setTurnstileToken(''),
                        'error-callback': () => setTurnstileToken(''),
                    });
                } catch (e) {
                    console.error('Turnstile render failed:', e);
                }
            } else {
                setTimeout(tryRender, 100);
            }
        };
        tryRender();

        return () => {
            cancelled = true;
            if (typeof window !== 'undefined' && (window as any).turnstile) {
                try {
                    (window as any).turnstile.reset();
                } catch (e) {
                    // ignore — widget may already be gone
                }
            }
        };
    }, []);

    if (fields.length === 0) {
        return null;
    }

    // Update fields with prefilled values from URL
    const updatedFields = fields.map(field => {
        if (field.name === 'tourName' && tourFromUrl) {
            return { ...field, defaultValue: decodeURIComponent(tourFromUrl) };
        }
        if (field.name === 'partnershipType' && partnershipTypeFromUrl) {
            return { ...field, defaultValue: partnershipTypeFromUrl };
        }
        return field;
    });

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setStatusMessage('');

        try {
            const formData = new FormData(formRef.current);

            // Cloudflare Turnstile: with `?render=explicit`, the token is NOT auto-
            // inserted into the form as a hidden input. It's captured in component
            // state via the widget's callback (see useEffect above). We append it
            // to FormData ourselves so the Worker reads it from the same
            // 'cf-turnstile-response' field name it already knows how to verify.
            const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
            if (turnstileSiteKey) {
                if (!turnstileToken || turnstileToken.length === 0) {
                    setSubmitStatus('error');
                    setStatusMessage('Please complete the security check before submitting.');
                    setIsSubmitting(false);
                    return;
                }
                formData.append('cf-turnstile-response', turnstileToken);
            }

            // Diagnostic: log field names only. NEVER log values - they contain PII
            // (name, email, phone). Console-logging PII leaks via browser extensions,
            // screen-share tools, and any future error reporter that auto-captures console.*.
            console.log('Submitting form to Worker', [...formData.keys()]);

            // Send to Cloudflare Worker endpoint as FormData.
            // The Worker must verify the 'cf-turnstile-response' token server-side
            // (POST https://challenges.cloudflare.com/turnstile/v0/siteverify with
            // secret + token). Reject the submission if siteverify returns success:false.
            const response = await fetch('https://contact-form.lukasz-madrzynski.workers.dev', {
                method: 'POST',
                body: formData,
            });

            const responseText = await response.text();

            if (response.ok || response.status === 200) {
                setSubmitStatus('success');
                setStatusMessage('Thank you for your message! We will get back to you soon.');
                if (formRef.current) {
                    formRef.current.reset();
                    // Reset the Turnstile widget so a returning visitor has to re-verify
                    setTurnstileToken('');
                    if (typeof (window as any).turnstile !== 'undefined') {
                        (window as any).turnstile.reset();
                    }
                }
            } else {
                throw new Error(`Server error: ${response.status} - ${responseText}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setStatusMessage(`Error: ${errorMsg}. Please try again or contact us directly via email.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-form-block',
                className,
                styles?.self?.margin ? mapStyles({ margin: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : undefined,
                styles?.self?.borderWidth && styles?.self?.borderWidth !== 0 && styles?.self?.borderStyle !== 'none'
                    ? mapStyles({
                          borderWidth: styles?.self?.borderWidth,
                          borderStyle: styles?.self?.borderStyle,
                          borderColor: styles?.self?.borderColor ?? 'border-primary'
                      })
                    : undefined,
                styles?.self?.borderRadius ? mapStyles({ borderRadius: styles?.self?.borderRadius }) : undefined
            )}
            name={elementId}
            id={elementId}
            onSubmit={handleSubmit}
            ref={formRef}
            data-sb-field-path= {fieldPath}
        >
            <div
                className={classNames('w-full', 'flex', 'flex-wrap', 'gap-8', mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }))}
                {...(fieldPath && { 'data-sb-field-path': '.fields' })}
            >
                <input type="hidden" name="form-name" value={elementId} />
                {updatedFields.map((field, index) => {
                    const modelName = field.__metadata.modelName;
                    if (!modelName) {
                        throw new Error(`form field does not have the 'modelName' property`);
                    }
                    const FormControl = getComponent(modelName);
                    if (!FormControl) {
                        throw new Error(`no component matching the form field model name: ${modelName}`);
                    }
                    return <FormControl key={index} {...field} {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />;
                })}
            </div>
            {submitButton && (
                <div className={classNames('mt-8', 'flex', 'justify-center')}>
                    <SubmitButtonFormControl
                        {...submitButton}
                        disabled={isSubmitting}
                        {...(fieldPath && { 'data-sb-field-path': '.submitButton' })}
                    />
                </div>
            )}

            {/* Cloudflare Turnstile widget. Renders only when the site key is set.
                The script is loaded with `?render=explicit` (see _app.js), so the
                useEffect above MUST call window.turnstile.render() on this div
                ref or the widget never appears. The token is captured via the
                callback (turnstileToken state) and appended to FormData on submit. */}
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="mt-6 flex justify-center">
                    <div ref={turnstileRef} className="cf-turnstile" />
                </div>
            )}
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                    {statusMessage}
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                    {statusMessage}
                </div>
            )}
        </form>
    );
}

export default function FormBlock(props) {
    return <FormBlockInner {...props} />;
}
