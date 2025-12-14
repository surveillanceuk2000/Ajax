// Modal functionality
const modal = document.getElementById('contactModal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementsByClassName('close')[0];
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Open modal
openBtn.onclick = function() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Close modal after 3 seconds
            setTimeout(function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }, 3000);
            
        } else {
            alert('Oops! There was a problem submitting your form. Please try again.');
        }
    } catch (error) {
        alert('Oops! There was a problem submitting your form. Please try again.');
    }
});

// Contact protection - Show contact
const showButtons = document.querySelectorAll('.show-contact');
showButtons.forEach(button => {
    button.addEventListener('click', function() {
        const contactValue = this.nextElementSibling;
        this.style.display = 'none';
        contactValue.style.display = 'flex';
        
        // Track event in Google Analytics
        if (typeof gtag !== 'undefined') {
            const contactType = this.textContent.includes('Phone') ? 'phone' : 
                              this.textContent.includes('WhatsApp') ? 'whatsapp' : 'email';
            gtag('event', 'contact_reveal', {
                'event_category': 'engagement',
                'event_label': contactType
            });
        }
    });
});

// Contact protection - Copy contact
const copyButtons = document.querySelectorAll('.copy-contact');
copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        
        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.classList.add('copied');
            
            // Track event in Google Analytics
            if (typeof gtag !== 'undefined') {
                const contactType = textToCopy.includes('@') ? 'email' : 'phone';
                gtag('event', 'contact_copy', {
                    'event_category': 'engagement',
                    'event_label': contactType
                });
            }
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback for older browsers
            alert('Contact: ' + textToCopy);
        });
    });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Track CTA button clicks
openBtn.addEventListener('click', function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'engagement',
            'event_label': 'get_quote_button'
        });
    }
});

// Track scroll depth
let scrollTracked = {
    25: false,
    50: false,
    75: false,
    100: false
};

window.addEventListener('scroll', function() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    Object.keys(scrollTracked).forEach(percent => {
        if (scrollPercent >= percent && !scrollTracked[percent]) {
            scrollTracked[percent] = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'event_label': percent + '%',
                    'value': parseInt(percent)
                });
            }
        }
    });
});

// Form validation enhancement
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');

phoneInput.addEventListener('input', function() {
    // Remove non-numeric characters except + and space
    this.value = this.value.replace(/[^\d+\s]/g, '');
});

emailInput.addEventListener('blur', function() {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value) && this.value.length > 0) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#ddd';
    }
});

// Add loading state to submit button
form.addEventListener('submit', function() {
    const submitButton = form.querySelector('.submit-button');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Reset button state if there's an error (handled in the catch block above)
    setTimeout(() => {
        if (submitButton.disabled) {
            submitButton.textContent = 'Get a Quote';
            submitButton.disabled = false;
        }
    }, 5000);
});

console.log('Ajax Security Systems - Website Loaded Successfully');
