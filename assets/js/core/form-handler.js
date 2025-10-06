/**
 * Form Handler Manager - V9 Wooden Cabin Website
 *
 * Comprehensive form handling system including:
 * - Form validation
 * - Contact form submission
 * - Error handling and user feedback
 * - Spam protection
 * - File upload handling
 * - Form state management
 * - Analytics integration
 *
 * @version 1.0.0
 * @author Wooden Cabin Website Team
 */

class FormHandlerManager {
    constructor() {
        this.forms = [];
        this.validators = new Map();
        this.submitHandlers = new Map();
        this.csrfToken = null;
        this.recaptchaSiteKey = null;

        this.defaultOptions = {
            validateOnBlur: true,
            validateOnInput: false,
            showSuccessMessage: true,
            showErrorMessage: true,
            resetFormOnSuccess: true,
            enableAnalytics: true,
            spamProtection: true
        };

        this.init();
    }

    init() {
        this.cacheForms();
        this.setupValidators();
        this.setupSubmitHandlers();
        this.setupSpamProtection();
        this.setupFileUploads();
        this.setupFormAnalytics();

        console.log('Form Handler Manager initialized successfully');
    }

    cacheForms() {
        const allForms = document.querySelectorAll('form[data-form-handler], .contact-form, .inquiry-form, form[action*="submit"], form[action*="send"]');

        allForms.forEach(form => {
            this.registerForm(form);
        });

        // Watch for dynamically added forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const forms = node.querySelectorAll ? node.querySelectorAll('form') : [];
                        forms.forEach(form => this.registerForm(form));

                        if (node.tagName === 'FORM') {
                            this.registerForm(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    registerForm(form) {
        if (!form || this.forms.includes(form)) return;

        const formId = form.id || `form-${this.forms.length}`;
        const options = this.parseFormOptions(form);

        this.forms.push(form);
        this.setupFormEvents(form, options);

        // Initialize validation for this form
        this.initializeFormValidation(form, options);

        console.log(`Form registered: ${formId}`);
    }

    parseFormOptions(form) {
        const dataOptions = form.dataset.formOptions ? JSON.parse(form.dataset.formOptions) : {};
        return { ...this.defaultOptions, ...dataOptions };
    }

    setupFormEvents(form, options) {
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, options);
        });

        // Field validation events
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (options.validateOnBlur) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            }

            if (options.validateOnInput) {
                field.addEventListener('input', () => {
                    this.validateField(field);
                });
            }

            // Remove error state on focus
            field.addEventListener('focus', () => {
                this.clearFieldError(field);
            });
        });

        // Reset button
        const resetButton = form.querySelector('button[type="reset"], input[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetForm(form);
            });
        }
    }

    setupValidators() {
        // Email validator
        this.validators.set('email', (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : 'Please enter a valid email address';
        });

        // Phone validator
        this.validators.set('phone', (value) => {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : null;
        });

        // Required validator
        this.validators.set('required', (value) => {
            return !value || value.trim() === '' ? 'This field is required' : null;
        });

        // Min length validator
        this.validators.set('minLength', (value, min) => {
            return value && value.length < min ? `Minimum ${min} characters required` : null;
        });

        // Max length validator
        this.validators.set('maxLength', (value, max) => {
            return value && value.length > max ? `Maximum ${max} characters allowed` : null;
        });

        // Pattern validator
        this.validators.set('pattern', (value, pattern) => {
            const regex = new RegExp(pattern);
            return value && !regex.test(value) ? 'Please enter a valid format' : null;
        });

        // Custom validators can be added via data attributes
        document.querySelectorAll('[data-validate]').forEach(field => {
            const validateType = field.dataset.validate;
            const customValidator = this.getCustomValidator(validateType);
            if (customValidator) {
                this.validators.set(validateType, customValidator);
            }
        });
    }

    getCustomValidator(type) {
        // Define custom validators
        const customValidators = {
            'name': (value) => {
                const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
                return value && !nameRegex.test(value) ? 'Please enter a valid name' : null;
            },
            'message': (value) => {
                return value && value.length < 10 ? 'Message must be at least 10 characters long' : null;
            },
            'zip': (value) => {
                const zipRegex = /^\d{5}(-\d{4})?$/;
                return value && !zipRegex.test(value) ? 'Please enter a valid ZIP code' : null;
            }
        };

        return customValidators[type] || null;
    }

    initializeFormValidation(form, options) {
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            // Add validation attributes if missing
            if (field.hasAttribute('required') && !field.dataset.validate) {
                field.dataset.validate = 'required';
            }

            if (field.type === 'email' && !field.dataset.validate) {
                field.dataset.validate = 'email';
            }

            if (field.type === 'tel' && !field.dataset.validate) {
                field.dataset.validate = 'phone';
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const validateTypes = (field.dataset.validate || '').split('|');
        let errorMessage = null;

        for (const validateType of validateTypes) {
            const [type, param] = validateType.split(':');
            const validator = this.validators.get(type);

            if (validator) {
                const error = validator(value, param);
                if (error) {
                    errorMessage = error;
                    break;
                }
            }
        }

        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class to field
        field.classList.add('error', 'invalid');
        field.setAttribute('aria-invalid', 'true');

        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error, .error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error error-message';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
    }

    clearFieldError(field) {
        field.classList.remove('error', 'invalid');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = field.parentNode.querySelector('.field-error, .error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    async handleFormSubmit(form, options) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';

        try {
            // Show loading state
            this.setFormLoading(form, true);

            // Validate form
            if (!this.validateForm(form)) {
                this.showFormError(form, 'Please correct the errors in the form');
                return;
            }

            // Get form data
            const formData = this.getFormData(form);

            // Add CSRF token if available
            if (this.csrfToken) {
                formData.append('csrf_token', this.csrfToken);
            }

            // Add timestamp for spam protection
            if (options.spamProtection) {
                formData.append('timestamp', Date.now());
            }

            // Determine submission method
            const action = form.getAttribute('action') || '/api/contact';
            const method = form.getAttribute('method') || 'POST';

            // Submit form
            const response = await this.submitForm(action, method, formData, options);

            // Handle success
            if (response.success) {
                this.showFormSuccess(form, response.message || 'Form submitted successfully!');

                if (options.resetFormOnSuccess) {
                    this.resetForm(form);
                }

                // Track analytics
                if (options.enableAnalytics) {
                    this.trackFormSubmission(form, 'success');
                }

                // Emit success event
                this.emitFormEvent(form, 'formSubmitted', { success: true, response });
            } else {
                throw new Error(response.message || 'Form submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(form, error.message || 'An error occurred. Please try again.');

            // Track analytics
            if (options.enableAnalytics) {
                this.trackFormSubmission(form, 'error', error.message);
            }

            // Emit error event
            this.emitFormEvent(form, 'formError', { error: error.message });
        } finally {
            // Restore loading state
            this.setFormLoading(form, false);
            if (submitButton) {
                submitButton.textContent = originalButtonText;
            }
        }
    }

    async submitForm(url, method, formData, options) {
        // For demo purposes, simulate a successful submission
        // In production, this would make an actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Thank you for your message! We will get back to you soon.'
                });
            }, 1500); // Simulate network delay
        });

        // Production implementation would be:
        /*
        const response = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
        */
    }

    getFormData(form) {
        const formData = new FormData(form);

        // Add additional data
        formData.append('form_id', form.id || 'unknown');
        formData.append('page_url', window.location.href);
        formData.append('user_agent', navigator.userAgent);
        formData.append('timestamp', new Date().toISOString());

        return formData;
    }

    setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const loadingClass = 'loading';
        const disabledClass = 'disabled';

        if (isLoading) {
            form.classList.add(loadingClass);
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add(disabledClass, loadingClass);
                submitButton.innerHTML = '<span class="spinner"></span> Sending...';
            }
        } else {
            form.classList.remove(loadingClass);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove(disabledClass, loadingClass);
            }
        }
    }

    showFormSuccess(form, message) {
        // Create success message
        const successContainer = this.createMessageContainer('success', message);
        form.appendChild(successContainer);

        // Animate in
        setTimeout(() => {
            successContainer.style.opacity = '1';
            successContainer.style.transform = 'translateY(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            successContainer.style.opacity = '0';
            setTimeout(() => {
                if (successContainer.parentNode) {
                    successContainer.parentNode.removeChild(successContainer);
                }
            }, 300);
        }, 5000);

        // Announce to screen readers
        if (window.AccessibilityAPI) {
            window.AccessibilityAPI.announce(message);
        }
    }

    showFormError(form, message) {
        // Create error message
        const errorContainer = this.createMessageContainer('error', message);
        form.appendChild(errorContainer);

        // Animate in
        setTimeout(() => {
            errorContainer.style.opacity = '1';
            errorContainer.style.transform = 'translateY(0)';
        }, 100);

        // Auto remove after 8 seconds
        setTimeout(() => {
            errorContainer.style.opacity = '0';
            setTimeout(() => {
                if (errorContainer.parentNode) {
                    errorContainer.parentNode.removeChild(errorContainer);
                }
            }, 300);
        }, 8000);

        // Announce to screen readers
        if (window.AccessibilityAPI) {
            window.AccessibilityAPI.announce(message);
        }
    }

    createMessageContainer(type, message) {
        const container = document.createElement('div');
        container.className = `form-message form-message-${type}`;
        container.setAttribute('role', 'alert');
        container.setAttribute('aria-live', 'polite');

        const styles = {
            padding: '1rem',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        };

        if (type === 'success') {
            Object.assign(styles, {
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb'
            });
        } else {
            Object.assign(styles, {
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb'
            });
        }

        Object.assign(container.style, styles);

        const icon = type === 'success' ? '✓' : '⚠';
        container.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${message}</span>`;

        return container;
    }

    resetForm(form) {
        // Clear all field errors
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearFieldError(field);
        });

        // Remove any form messages
        const messages = form.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());

        // Reset form fields
        form.reset();
    }

    setupSpamProtection() {
        // Add hidden honeypot fields to forms
        this.forms.forEach(form => {
            if (!form.querySelector('.honeypot')) {
                const honeypot = document.createElement('input');
                honeypot.type = 'text';
                honeypot.name = 'honeypot';
                honeypot.className = 'honeypot';
                honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
                honeypot.setAttribute('tabindex', '-1');
                honeypot.setAttribute('aria-hidden', 'true');
                form.appendChild(honeypot);
            }

            // Add form timestamp
            if (!form.querySelector('.form-timestamp')) {
                const timestamp = document.createElement('input');
                timestamp.type = 'hidden';
                timestamp.name = 'form_timestamp';
                timestamp.className = 'form-timestamp';
                timestamp.value = Date.now().toString();
                form.appendChild(timestamp);
            }
        });
    }

    setupFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach(input => {
            const wrapper = input.parentElement;
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.style.cssText = 'margin-top: 0.5rem; font-size: 0.875rem; color: #666;';

            input.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    const fileNames = Array.from(files).map(file => file.name).join(', ');
                    const fileSize = Array.from(files).reduce((total, file) => total + file.size, 0);
                    const formattedSize = this.formatFileSize(fileSize);

                    fileInfo.textContent = `${fileNames} (${formattedSize})`;
                    wrapper.appendChild(fileInfo);
                } else {
                    if (fileInfo.parentNode) {
                        fileInfo.parentNode.removeChild(fileInfo);
                    }
                }
            });
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupFormAnalytics() {
        // Track form interactions
        this.forms.forEach(form => {
            const formName = form.id || form.className || 'unnamed_form';

            // Track form views
            this.trackFormEvent(formName, 'form_view');

            // Track field interactions
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.addEventListener('focus', () => {
                    this.trackFormEvent(formName, 'field_focus', {
                        field_name: field.name || field.id || 'unnamed_field',
                        field_type: field.type || field.tagName.toLowerCase()
                    });
                });
            });
        });
    }

    trackFormEvent(formName, action, data = {}) {
        // In production, this would integrate with Google Analytics or other analytics
        console.log('Form Analytics:', {
            event: 'form_interaction',
            form_name: formName,
            action: action,
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    trackFormSubmission(form, status, error = null) {
        const formName = form.id || form.className || 'unnamed_form';

        this.trackFormEvent(formName, 'form_submission', {
            status: status,
            error: error,
            form_data: this.getAnalyticsFormData(form)
        });
    }

    getAnalyticsFormData(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        const data = {};

        fields.forEach(field => {
            if (field.name && !field.type.includes('password')) {
                data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
            }
        });

        return data;
    }

    emitFormEvent(form, eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: { form, ...detail }
        });
        form.dispatchEvent(event);
    }

    // Public methods
    addValidator(name, validatorFunction) {
        this.validators.set(name, validatorFunction);
    }

    removeValidator(name) {
        this.validators.delete(name);
    }

    validateFormById(formId) {
        const form = document.getElementById(formId);
        return form ? this.validateForm(form) : false;
    }

    // Initialize when DOM is ready
    static init() {
        return new FormHandlerManager();
    }
}

// Initialize form handler manager
document.addEventListener('DOMContentLoaded', () => {
    window.FormHandlerManager = new FormHandlerManager();

    // Expose methods globally
    window.FormAPI = {
        validateForm: (formId) => window.FormHandlerManager.validateFormById(formId),
        addValidator: (name, validator) => window.FormHandlerManager.addValidator(name, validator),
        resetForm: (formId) => {
            const form = document.getElementById(formId);
            if (form) window.FormHandlerManager.resetForm(form);
        }
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandlerManager;
}