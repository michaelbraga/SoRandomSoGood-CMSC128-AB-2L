USE sogo;
-- sample datas for the database

-- salt 4s1np4m0r3
-- pepper p4m1nt4p4m0r3
-- salt + word + pepper
INSERT IGNORE INTO teacher (username, password, fname, mname, lname)
VALUES ("rncrecario", password(sha("4s1np4m0r3sirregp4m1nt4p4m0r3")), "Reginald Neil", "C.", "Recario");
INSERT IGNORE INTO teacher (username, password, fname, mname, lname)
VALUES ("lkrlactuan", password(sha("4s1np4m0r3sirleip4m1nt4p4m0r3")), "Lei Kristoffer", "R.", "Lactuan");

INSERT IGNORE INTO class (lecturesection, courseno, coursename, room, tusername, no_lrsections)
VALUES ("AB", "CMSC 128", "Introduction to Software Engineering", "ICSMH", "rncrecario", 7);
INSERT IGNORE INTO class (lecturesection, courseno, coursename, room, tusername, no_lrsections)
VALUES ("T", "CMSC 132", "Computer Architecture", "ICSMH", "rncrecario", 7);

INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-11111", "Celyne", "Reyes", "Zarraga", "BSCS", "CAS", "F", "celyne.jpeg", "1", "CMSC 128", "AB", 0);
INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-22222", "Jared", "Astudillo", "Espineli", "BSCS", "CAS", "M", "jared.jpeg", "2", "CMSC 128", "AB", 0);
INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-33333", "Paul Jhon", " ", "Villaro", "BSCS", "CAS", "M", "paul.jpeg", "3", "CMSC 128", "AB", 0);
INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-44444", "Angelica Grace", "Aldea", "Carrasco", "BSCS", "CAS", "F", "angec.jpeg", "4","CMSC 128", "AB", 0);
INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-55555", "Michael Arvin Jay", "C", "Braga", "BSCS", "CAS", "M", "mike.jpeg", "5", "CMSC 128", "AB", 0);
INSERT IGNORE INTO student (studentno, fname, mname, lname, degcourse, college, sex, picture, seatno, courseno, lecturesection, priority)
VALUES ("2013-66666", "Ma. Patricia", "Santos", "Ganaden", "BSCS", "CAS", "F", "path.jpeg", "6","CMSC 128", "AB", 0);

INSERT IGNORE INTO log (logdate, courseno, lecturesection, studentno)
VALUES (NOW(), "CMSC 128", "AB", "2013-11111");
INSERT IGNORE INTO log (logdate, courseno, lecturesection, studentno)
VALUES (NOW(), "CMSC 128", "AB", "2013-22222");
INSERT IGNORE INTO log (logdate, courseno, lecturesection, studentno)
VALUES (NOW(), "CMSC 128", "AB", "2013-33333");
INSERT IGNORE INTO log (logdate, courseno, lecturesection, studentno)
VALUES (NOW(), "CMSC 128", "AB", "2013-44444");
