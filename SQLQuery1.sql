create database FutaBus
--drop database FutaBus
go
use FutaBus
go

CREATE TABLE Bus (
    ID INT PRIMARY KEY,
    Departure VARCHAR(255),
    Destination VARCHAR(255),
    Quantity INT,
    Type VARCHAR(255),
    Distance INT,
    Discription VARCHAR(255),
    Total_time VARCHAR(255)
);


CREATE TABLE Bus_time (
    ID VARCHAR(255) PRIMARY KEY,
    Start_time TIME,
    End_time TIME,
    Departure VARCHAR(255),
    Destination VARCHAR(255)
);

CREATE TABLE Bus_Bus_time (
    Bus_ID INT,
    Bus_time_ID VARCHAR(255),
    FOREIGN KEY (Bus_ID) REFERENCES Bus(ID),
    FOREIGN KEY (Bus_time_ID) REFERENCES Bus_time(ID)
);

INSERT INTO Bus (ID, Departure, Destination, Quantity, Type, Distance, Discription, Total_time) VALUES
(1, 'TPHCM', 'Vung Tau', 15, 'Limousine', 30, 'None', '2h'),
(2, 'Long Hai', 'Binh Phuoc', 40, 'Sleeper bus', 35, 'None', '2h'),
(3, 'Nha Trang', 'Can Tho', 35, 'Limousine', 45, 'None', '2h'),
(4, 'TPHCM', 'Binh Phuoc', 40, 'Normal', 30, 'None', '2h'),
(5, 'Vung Tau', 'Da Nang', 30, 'Sleeper bus', 25, 'None', '2h');

INSERT INTO Bus_time (ID, Start_time, End_time, Departure, Destination) VALUES
('T1', '07:30:00', '09:30:00', '03/05/2024', '03/05/2024'),
('T2', '08:30:00', '10:30:00', '03/05/2024', '03/05/2024'),
('T3', '09:30:00', '11:30:00', '03/05/2024', '03/05/2024'),
('T4', '10:30:00', '12:30:00', '03/05/2024', '03/05/2024');

INSERT INTO Bus_Bus_time (Bus_ID, Bus_time_ID) VALUES
(1, 'T1'), (1, 'T2'),
(2, 'T1'), (2, 'T4'),
(3, 'T2'), (3, 'T3'),
(4, 'T4'), (4, 'T2'),
(5, 'T1'), (5, 'T3');

drop proc searchBuses1
GO
CREATE PROCEDURE searchBuses
    @departureKeyword VARCHAR(255),
    @destinationKeyword VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT b.*, bt.Start_time, bt.End_time, bt.Departure_Day, bt.Destination_Day
    FROM Bus b
    JOIN Bus_Bus_time bbt ON b.ID = bbt.Bus_ID
    JOIN Bus_time bt ON bbt.Bus_time_ID = bt.ID
    WHERE b.Departure LIKE '%' + @departureKeyword + '%'
        AND b.Destination LIKE '%' + @destinationKeyword + '%';
END;

GO
CREATE PROCEDURE searchBuses1
    @departureKeyword VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT b.*, bt.Start_time, bt.End_time, bt.Departure_Day, bt.Destination_Day
    FROM Bus b
    JOIN Bus_Bus_time bbt ON b.ID = bbt.Bus_ID
    JOIN Bus_time bt ON bbt.Bus_time_ID = bt.ID
    WHERE b.Departure LIKE '%' + @departureKeyword + '%';
END;

GO
CREATE PROCEDURE searchBuses2
    @destinationKeyword VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT b.*, bt.Start_time, bt.End_time, bt.Departure_Day, bt.Destination_Day
    FROM Bus b
    JOIN Bus_Bus_time bbt ON b.ID = bbt.Bus_ID
    JOIN Bus_time bt ON bbt.Bus_time_ID = bt.ID
    WHERE b.Destination LIKE '%' + @destinationKeyword + '%';
END;