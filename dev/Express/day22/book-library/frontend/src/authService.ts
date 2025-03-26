export interface User {
    user_id?: number;
    name: string;
    email: string;
    password_hash?: string;
    role_id?: number;
    role_name: string;
}

export class AuthService {
    private static API_BASE_URL = 'http://localhost:4000/api';  
    private static STORAGE_KEY = 'user_session';

    // User Registration
    static async register(userData: {
        name: string, 
        email: string, 
        password_hash: string, 
        role_id?: number
    }): Promise<{ success: boolean, message: string, userId?: number }> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password_hash: userData.password_hash,  
                    role_id: userData.role_id || 3 // Default to borrower if not specified
                })
            });

            const result = await response.json();

            if (response.ok) {
                return { 
                    success: true, 
                    message: 'Registration successful!',
                    userId: result.user_id
                };
            } else {
                return { 
                    success: false, 
                    message: result.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                message: 'Network error. Please try again.' 
            };
        }
    }

    // User Login
    static async login(email: string, password_hash: string): Promise<{ 
        success: boolean, 
        user?: User, 
        message?: string 
    }> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password_hash })
            });

            const result = await response.json();

            if (response.ok) {
                // Store user session
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(result.user));

                return { 
                    success: true, 
                    user: result.user 
                };
            } else {
                return { 
                    success: false, 
                    message: result.message || 'Login failed' 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: 'Network error. Please try again.' 
            };
        }
    }

    // Logout
    static logout() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    // Get Current User
    static getCurrentUser(): User | null {
        const userJson = localStorage.getItem(this.STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    // Check Authentication
    static isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    }

    // Check User Permissions
    static hasPermission(requiredRoleId: number): boolean {
        const user = this.getCurrentUser();
        return user ? (user.role_id || 3) <= requiredRoleId : false;
    }

    // Fetch User Roles
    static async getUserRoles(): Promise<{role_id: number, role_name: string}[]> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles`);
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    }
    static hasRole(roleName: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        const roleMap: {[key: string]: number} = {
            'Admin': 1,
            'Librarian': 2,
            'Borrower': 3
        };

        const requiredRoleId = roleMap[roleName];
        return requiredRoleId ? (user.role_id || 3) <= requiredRoleId : false;
    }
}