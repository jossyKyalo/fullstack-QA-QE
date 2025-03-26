document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Reset error message
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    errorMessage.classList.remove("show");

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    // Get selected role
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    
    // Validation
    if (!selectedRoleElement) {
        errorMessage.textContent = "Please select a user role";
        errorMessage.classList.add("show");
        return;
    }

    const selectedRole = selectedRoleElement.value;

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.classList.add("show");
        return;
    }

    // Password strength validation
    if (password.length < 8) {
        errorMessage.textContent = "Password must be at least 8 characters long";
        errorMessage.classList.add("show");
        return;
    }

    const userData = {
        name: username,
        email: email,
        password_hash: password,
        role_id: parseInt(selectedRole),
        hasRole: true,
        // Additional flags for approval
        is_approved: selectedRole === "3" // Only borrowers auto-approved
    };

    try {
        const response = await fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            if (selectedRole === "3") {
                // Borrower can immediately login
                alert("Registration successful! Redirecting to login...");
                window.location.href = "login.html";
            } else {
                // Librarian/Admin need approval
                alert("Registration submitted. Awaiting administrator approval.");
                window.location.href = "index.html";
            }
        } else {
            errorMessage.textContent = data.message || "Registration failed";
            errorMessage.classList.add("show");
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "Network error. Please try again.";
        errorMessage.classList.add("show");
    }
});

// Add styling for role selection
document.querySelectorAll('.role-option').forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        document.querySelectorAll('.role-option').forEach(opt => 
            opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Check the radio button
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
    });
});