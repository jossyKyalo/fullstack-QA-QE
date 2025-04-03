 -- Create Employees Table (If Not Exists)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    city VARCHAR(100),
    contact_no VARCHAR(15)
);

-- Procedure: Insert Employee
CREATE PROCEDURE insert_employee(
    emp_name VARCHAR(100), 
    emp_city VARCHAR(100), 
    emp_contact VARCHAR(15)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO employees (name, city, contact_no) 
    VALUES (emp_name, emp_city, emp_contact);
END;
$$;

-- Function: Get Employee by ID  
CREATE FUNCTION get_employee_by_id(emp_id INT)
RETURNS TABLE(id INT, name VARCHAR, city VARCHAR, contact_no VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT * FROM employees WHERE id = emp_id;
END;
$$;

-- Procedure: Update Employee
CREATE PROCEDURE update_employee(
    emp_id INT,
    new_name VARCHAR(100),
    new_city VARCHAR(100),
    new_contact VARCHAR(15)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employees 
    SET name = new_name, city = new_city, contact_no = new_contact
    WHERE id = emp_id;
END;
$$;

-- Procedure: Delete Employee
CREATE PROCEDURE delete_employee(emp_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM employees WHERE id = emp_id;
END;
$$;

-- Function: Insert and Retrieve Employee
CREATE FUNCTION insert_and_get_employee(
    emp_name VARCHAR(100), 
    emp_city VARCHAR(100), 
    emp_contact VARCHAR(15)
) RETURNS TABLE(id INT, name VARCHAR, city VARCHAR, contact_no VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO employees (name, city, contact_no) 
    VALUES (emp_name, emp_city, emp_contact) 
    RETURNING *;
END;
$$;
