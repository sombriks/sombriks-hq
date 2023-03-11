CREATE TABLE employees (
	id integer NOT NULL auto_increment PRIMARY KEY,
	name varchar(255) NOT NULL,
	salary decimal(10,2) NOT NULL
);

INSERT INTO EMPLOYEES (name,salary) VALUES ('alice',100);
INSERT INTO EMPLOYEES (name,salary) VALUES ('bob',100.55);
INSERT INTO EMPLOYEES (name,salary) VALUES ('jane',200);
INSERT INTO EMPLOYEES (name,salary) VALUES ('rick',205);
INSERT INTO EMPLOYEES (name,salary) VALUES ('eve',100);


CREATE TABLE sales (
	id integer NOT NULL auto_increment PRIMARY KEY,
	product_code integer NOT NULL,
	product_quantity integer NOT NULL DEFAULT 1,
	product_category_code integer NOT NULL,
	total_cost decimal(10,2) NOT NULL,
	created_at timestamp NOT NULL DEFAULT now() 
);

INSERT INTO sales (product_code,PRODUCT_QUANTITY,PRODUCT_CATEGORY_CODE,TOTAL_COST,CREATED_AT)
VALUES 
	(1,1,1,10,'2022-07-10'),
	(2,1,1,20,'2022-07-10'),
	(1,3,1,30,'2022-07-10'),
	(3,1,2,10,'2022-07-10'),
	(3,1,2,10,'2022-07-10'),
	(1,1,1,10,'2022-08-10'),
	(2,1,1,20,'2022-08-10'),
	(1,3,1,30,'2022-08-10'),
	(3,1,2,10,'2022-08-10'),
	(3,4,2,40,'2022-08-10'),
	(4,8,3,80,'2022-09-10'),
	(4,4,3,40,'2022-09-10');
	