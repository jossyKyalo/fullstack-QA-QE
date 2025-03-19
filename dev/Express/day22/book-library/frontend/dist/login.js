document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password_hash: password,  
    };

    try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("user", JSON.stringify(data.user));  
            window.location.href = "dashboard.html";  
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Login failed!");
    }
});
