-- Data Dump(Initial data and structure)

-- UserInfo table
CREATE TABLE UserInfo (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Title ENUM('Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Sir', 'Madam', 'Prof') NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Mobile VARCHAR(20),
    Email VARCHAR(255) NOT NULL
);

-- UserAddress table
CREATE TABLE UserAddress (
    Eircode VARCHAR(20) PRIMARY KEY,
    UserID INT,
    AddressLine1 VARCHAR(255) NOT NULL,
    AddressLine2 VARCHAR(255),
    Town VARCHAR(100) NOT NULL,
    County VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES UserInfo(UserID) ON DELETE CASCADE
);

-- Inserting users
INSERT INTO UserInfo (UserID, Title, FirstName, Surname, Mobile, Email) VALUES
(1, 'Ms', 'Alice', 'Johnson', '9876543210', 'alice@example.com'),
(2, 'Mr', 'Bob', 'Smith', '1234567890', 'bob@example.com'),
(3, 'Mrs', 'Emily', 'Brown', '5551234567', 'emily@example.com'),
(4, 'Dr', 'Michael', 'Davis', '9998887776', 'michael@example.com'),
(5, 'Miss', 'Samantha', 'Wilson', '3334445558', 'samantha@example.com'),
(6, 'Mr', 'David', 'Martinez', '7779998885', 'david@example.com'),
(7, 'Ms', 'Olivia', 'Anderson', '6667778884', 'olivia@example.com'),
(8, 'Mr', 'Ethan', 'Thompson', '1112223332', 'ethan@example.com'),
(9, 'Mrs', 'Isabella', 'Thomas', '2223334441', 'isabella@example.com'),
(10, 'Miss', 'Amelia', 'Hernandez', '4445556660', 'amelia@example.com'),
(11, 'Mr', 'James', 'Young', '5556667773', 'james@example.com'),
(12, 'Ms', 'Mia', 'Lee', '8889990009', 'mia@example.com'),
(13, 'Mr', 'Benjamin', 'King', '9990001118', 'benjamin@example.com'),
(14, 'Dr', 'Charlotte', 'Garcia', '3332221117', 'charlotte@example.com'),
(15, 'Mrs', 'Henry', 'Rodriguez', '2221110006', 'henry@example.com'),
(16, 'Mr', 'Emma', 'Lewis', '6667778885', 'emma@example.com');

-- Inserting addresses
INSERT INTO UserAddress (UserID, AddressLine1, AddressLine2, Town, County, Eircode) VALUES
(1, '123 Main St', 'Apt 101', 'Springfield', 'Sometown', 'S12345'),
(2, '456 Oak St', '', 'Maplewood', 'Countyville', 'M67890'),
(3, '789 Elm St', '', 'Greenville', 'Countytown', 'G54321'),
(4, '321 Pine St', 'Suite 200', 'Birchville', 'Pinetown', 'B98765'),
(5, '654 Cedar St', '', 'Cypressville', 'Foresttown', 'C34567'),
(6, '987 Spruce St', '', 'Oaktown', 'Woodshire', 'O87654'),
(7, '123 Maple St', 'Apt 301', 'Pineville', 'Countyplace', 'P23456'),
(8, '456 Elm St', '', 'Sprucetown', 'Forestville', 'S78901'),
(9, '789 Oak St', '', 'Mapletown', 'Countytown', 'M12345'),
(10, '321 Cedar St', 'Suite 100', 'Pineville', 'Pinetown', 'P67890'),
(11, '654 Spruce St', '', 'Birchville', 'Foresttown', 'B23456'),
(12, '987 Pine St', '', 'Cypressville', 'Pinetown', 'C78901'),
(13, '123 Cedar St', 'Apt 401', 'Greenville', 'Countyplace', 'G23456'),
(14, '456 Oak St', '', 'Mapletown', 'Maplecounty', 'M78901'),
(15, '789 Elm St', '', 'Pineville', 'Pinetown', 'P34567'),
(16, '321 Maple St', 'Suite 300', 'Sprucetown', 'Forestville', 'S89012');
