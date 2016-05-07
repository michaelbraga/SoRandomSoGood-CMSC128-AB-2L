-- *************************************************************************
--  mysql -uroot < database-setup.sql
-- *************************************************************************

-- Create user for SOGO
DROP USER IF EXISTS 'sogo_user'@'localhost'; -- if ERROR okay lang
CREATE USER 'sogo_user'@'localhost' IDENTIFIED BY 'sogolicious';

-- Create Database Sogo
DROP DATABASE IF EXISTS sogo; -- if ERROR okay lang
CREATE DATABASE sogo;
USE sogo;

-- TEACHER Table
CREATE TABLE IF NOT EXISTS `teacher` (
`username` varchar(64) NOT NULL,
`password` varchar(128) NOT NULL,
`fname` varchar(64) NOT NULL,
`mname` varchar(64) NOT NULL,
`lname` varchar(64) NOT NULL,
`colorScheme` varchar(64) NOT NULL DEFAULT 'red',
PRIMARY KEY (`username`)
) ENGINE = Innodb;
-- CLASS Table
CREATE TABLE IF NOT EXISTS `class` (
`lecturesection` varchar(32) NOT NULL,
`courseno` varchar(32) NOT NULL,
`coursename` varchar(128),
`room` varchar(128),
`tusername` varchar(64) NOT NULL,
`no_lrsections` int(2) NOT NULL, -- number of lab or recit sections
PRIMARY KEY (`courseno`, `lecturesection`),
FOREIGN KEY (`tusername`) REFERENCES `teacher`(`username`) ON UPDATE CASCADE
) ENGINE = Innodb;
-- STUDENT Table
CREATE TABLE IF NOT EXISTS `student` (
`studentno` varchar(16) NOT NULL,
`fname` varchar(128) NOT NULL,
`mname` varchar(128) NOT NULL,
`lname` varchar(128) NOT NULL,
`degcourse` varchar(128) NOT NULL,
`college` varchar(128) NOT NULL,
`sex` varchar(8) NOT NULL,
`picture` varchar(512),
`seatno` varchar(4),
`courseno` varchar(32),
`lecturesection` varchar(32), -- from table class
`lrsection` int(2), -- (lab or recit section , e.g 1L, 2L, 3L, or 1R, 2R) NOT from table class
`priority` int(2), -- for buro function
FOREIGN KEY (`courseno`, `lecturesection`) REFERENCES `class`(`courseno`, `lecturesection`) ON UPDATE CASCADE,
PRIMARY KEY (`studentno`,`courseno`, `lecturesection`),
UNIQUE KEY(`studentno`,`courseno`, `lecturesection`,`seatno`)
) ENGINE = Innodb;
CREATE TABLE IF NOT EXISTS `log` (
`logid` int(11) NOT NULL AUTO_INCREMENT,
`logdate` datetime NOT NULL,
`courseno` VARCHAR(32) NOT NULL,
`lecturesection` VARCHAR(32) NOT NULL,
`studentno`varchar(16) NOT NULL,
PRIMARY KEY (`logid`),
FOREIGN KEY (`courseno`, `lecturesection`) REFERENCES `class`(`courseno`, `lecturesection`) ON UPDATE CASCADE
) ENGINE = Innodb;

create table `user_activity_log`(
	_id int(10) AUTO_INCREMENT,
	activity varchar(128) NOT NULL,
	user varchar(64) NOT NULL,
	ip_address varchar(64) NOT NULL,
	time datetime DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (_id)
) ENGINE = Innodb;

-- Grant all privileges on user sogo
GRANT ALL PRIVILEGES on sogo.* TO 'sogo_user'@'localhost';
exit
