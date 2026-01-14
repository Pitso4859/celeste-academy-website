// Shared JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initForms();
    initAnimations();
    initBackToTop();
    initCurrentYear();
});

// Initialize Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set active link based on current page
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Add click event for mobile menu close
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Initialize Forms
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
        
        // Add validation styles
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    });
}

// Handle Form Submission
function handleFormSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validate all required fields
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showToast('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        
        // Scroll to top for thank you
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Validate Single Field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.required && !value) {
        field.classList.add('is-invalid');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    field.classList.remove('is-invalid');
    return true;
}

// Show Toast Notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'bi-check-circle-fill text-success';
    if (type === 'error') icon = 'bi-x-circle-fill text-danger';
    if (type === 'warning') icon = 'bi-exclamation-circle-fill text-warning';
    if (type === 'info') icon = 'bi-info-circle-fill text-primary';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${icon} me-2 fs-4"></i>
            <div>${message}</div>
        </div>
    `;
    
    // Add to container
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Initialize Animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.card, .icon-circle, h1, h2, h3').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Back to Top Button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'btn btn-accent back-to-top';
    backToTop.innerHTML = '<i class="bi bi-chevron-up"></i>';
    backToTop.style.display = 'none';
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Set Current Year in Footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add spinner border CSS
const style = document.createElement('style');
style.textContent = `
    .spinner-border {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        vertical-align: text-bottom;
        border: 0.25em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border .75s linear infinite;
    }
    
    @keyframes spinner-border {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Export for global use
window.showToast = showToast;

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot elements
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotIcon = document.getElementById('chatbotIcon');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        chatbotToggle.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotIcon.classList.remove('bi-chat-dots');
            chatbotIcon.classList.add('bi-x');
        } else {
            chatbotIcon.classList.remove('bi-x');
            chatbotIcon.classList.add('bi-chat-dots');
        }
    });
    
    // Close chatbot window
    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatbotToggle.classList.remove('active');
        chatbotIcon.classList.remove('bi-x');
        chatbotIcon.classList.add('bi-chat-dots');
    });
    
    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            sendUserMessage();
        }
    });
    
    // Quick option buttons
    document.querySelectorAll('.quick-option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const question = button.getAttribute('data-question');
            chatInput.value = question;
            sendUserMessage();
        });
    });
    
    // Send user message function
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get bot response after delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        messageDiv.innerHTML = `
            <div class="message-content">${formatMessage(text)}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Format message with line breaks
    function formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Get bot response based on user input
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Admissions questions
        if (message.includes('admission') || message.includes('apply') || message.includes('enroll')) {
            return `The admission process at Celeste Academy is simple:\n\n` +
                   `📝 **Application Steps:**\n` +
                   `1. Contact us or visit the school\n` +
                   `2. Submit completed application form\n` +
                   `3. Student assessment & parent interview\n` +
                   `4. Pay fees & complete registration\n\n` +
                   `💰 **Fees:**\n` +
                   `• Registration: R750 (once-off)\n` +
                   `• Monthly Tuition: R1,200\n` +
                   `• Sibling discount: 10% from second child\n\n` +
                   `📋 **Required Documents:**\n` +
                   `• Certified birth certificate\n` +
                   `• Latest school report\n` +
                   `• 2 passport photos\n` +
                   `• Parent/guardian ID copy\n\n` +
                   `Would you like more details about any specific part of the admission process?`;
        }
        
        // Fee questions
        else if (message.includes('fee') || message.includes('price') || message.includes('cost') || 
                 message.includes('payment') || message.includes('tuition')) {
            return `Here's our fee structure for 2024:\n\n` +
                   `📊 **Fee Breakdown:**\n` +
                   `• **Registration Fee:** R750 (once-off, non-refundable)\n` +
                   `• **Monthly Tuition:** R1,200 per month\n` +
                   `• **Sibling Discount:** 10% off tuition for second child onward\n\n` +
                   `💳 **Payment Terms:**\n` +
                   `• Registration fee payable upon application\n` +
                   `• Monthly tuition paid in advance\n` +
                   `• Flexible payment plans available\n\n` +
                   `📝 **What's included:**\n` +
                   `• All textbooks and workbooks\n` +
                   `• Stationery and learning materials\n` +
                   `• Access to school facilities\n` +
                   `• No hidden costs\n\n` +
                   `🎯 **Additional Costs:**\n` +
                   `• School uniform: R800-R1200 (annual)\n` +
                   `• After-care: Additional fee (optional)\n` +
                   `• Transport: Separate fee based on distance`;
        }
        
        // School hours questions
        else if (message.includes('hour') || message.includes('time') || message.includes('schedule')) {
            return `⏰ **School Hours:**\n\n` +
                   `**Monday - Thursday:**\n` +
                   `• School starts: 7:30 AM\n` +
                   `• School ends: 2:00 PM\n\n` +
                   `**Friday:**\n` +
                   `• School starts: 7:30 AM\n` +
                   `• School ends: 2:00 PM\n\n` +
                   `**After-Care Service:**\n` +
                   `• Available until 5:00 PM\n` +
                   `• Additional fee applies\n\n` +
                   `**Office Hours:**\n` +
                   `• Monday - Friday: 7:30 AM - 4:00 PM\n` +
                   `• Saturday: By appointment only`;
        }
        
        // Contact questions
        else if (message.includes('contact') || message.includes('call') || message.includes('email') || 
                 message.includes('phone') || message.includes('address')) {
            return `📞 **Contact Information:**\n\n` +
                   `**Phone Numbers:**\n` +
                   `• Main Office: 078 602 2279\n` +
                   `• Alternative: 071 216 5560\n\n` +
                   `**Email Address:**\n` +
                   `• celesteacademy17@gmail.com\n\n` +
                   `**School Address:**\n` +
                   `Dikgale Polokwane Branch\n` +
                   `Madiga next to Lunds Farm\n` +
                   `Solomondale Road\n` +
                   `Polokwane, 0700\n\n` +
                   `📍 **Office Hours:**\n` +
                   `Monday - Friday: 7:30 AM - 4:00 PM`;
        }
        
        // Programs questions
        else if (message.includes('program') || message.includes('grade') || message.includes('class') || 
                 message.includes('curriculum')) {
            return `📚 **Academic Programs:**\n\n` +
                   `**Primary School (Grade R-7):**\n` +
                   `• Foundation Phase (Grade R-3)\n` +
                   `• Intermediate Phase (Grade 4-6)\n` +
                   `• Senior Phase (Grade 7)\n\n` +
                   `**High School (Grade 8-12):**\n` +
                   `• Senior Phase (Grade 8-9)\n` +
                   `• FET Phase (Grade 10-12)\n\n` +
                   `🌟 **Enrichment Programs:**\n` +
                   `• Sports & Athletics\n` +
                   `• Arts & Culture\n` +
                   `• Music & Drama\n\n` +
                   `What specific program are you interested in?`;
        }
        
        // School information
        else if (message.includes('school') || message.includes('academy') || message.includes('celeste')) {
            return `🏫 **About Celeste Academy:**\n\n` +
                   `• Registered EMIS: 99550231\n` +
                   `• Grade R to Grade 12\n` +
                   `• Modern teaching methods\n` +
                   `• Secure campus environment\n` +
                   `• Skilled educators\n` +
                   `• Small class sizes\n\n` +
                   `🎯 **Our Mission:**\n` +
                   `To provide innovative and engaging education that empowers students to become confident learners and responsible individuals.\n\n` +
                   `Would you like to know more about our facilities or teaching approach?`;
        }
        
        // Transport questions
        else if (message.includes('transport') || message.includes('bus') || message.includes('pickup')) {
            return `🚌 **School Transport:**\n\n` +
                   `• Available for most areas in and around Polokwane\n` +
                   `• Reliable and safe service\n` +
                   `• Separate transport fees\n` +
                   `• Fees vary based on distance\n\n` +
                   `For specific route information and pricing, please contact our office at 078 602 2279.`;
        }
        
        // Uniform questions
        else if (message.includes('uniform') || message.includes('dress')) {
            return `👔 **School Uniform:**\n\n` +
                   `• Annual uniform cost: R800 - R1200\n` +
                   `• Includes all required items\n` +
                   `• Available through school suppliers\n` +
                   `• Specific uniform requirements for each grade\n\n` +
                   `For detailed uniform lists and suppliers, please visit our office.`;
        }
        
        // Greetings
        else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello! 👋 I'm here to help you with information about Celeste Academy. \n\nWhat would you like to know about?\n• Admissions\n• Fees\n• Programs\n• School hours\n• Contact information`;
        }
        
        // Thank you responses
        else if (message.includes('thank') || message.includes('thanks')) {
            return `You're welcome! 😊 If you have any more questions about Celeste Academy, feel free to ask.\n\nIs there anything else I can help you with today?`;
        }
        
        // Default response
        else {
            return `I'm here to help you with information about Celeste Academy! Here are some topics I can assist with:\n\n` +
                   `🎓 **Admissions** - Application process, requirements, fees\n` +
                   `💰 **Fee Structure** - Tuition, registration, payment plans\n` +
                   `⏰ **School Hours** - Daily schedule, after-care\n` +
                   `📚 **Programs** - Grade R-12 curriculum\n` +
                   `📞 **Contact Info** - Phone, email, address\n` +
                   `🚌 **Transport** - School bus services\n\n` +
                   `What specific information are you looking for?`;
        }
    }
    
    // Add greeting based on time of day
    function addTimeBasedGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good day';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        // Update initial greeting
        const greetingElement = chatMessages.querySelector('.bot-message .message-content');
        if (greetingElement) {
            greetingElement.innerHTML = `<strong>${greeting}! 👋</strong><br>I'm your Celeste Academy assistant. How can I help you today?`;
        }
    }
    
    // Initialize chatbot
    addTimeBasedGreeting();
    
    // Auto-open on specific pages if needed
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'admissions.html' || currentPage === 'contact.html') {
        setTimeout(() => {
            chatbotWindow.classList.add('active');
            chatbotToggle.classList.add('active');
            chatbotIcon.classList.remove('bi-chat-dots');
            chatbotIcon.classList.add('bi-x');
        }, 3000);
    }
});

