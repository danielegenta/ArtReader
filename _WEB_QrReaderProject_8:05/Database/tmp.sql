BEGIN TRANSACTION;
CREATE TABLE "artworks" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`title`	TEXT NOT NULL,
	`author`	TEXT NOT NULL,
	`abstract`	TEXT NOT NULL,
	`pictureUrl`	TEXT NOT NULL
);
INSERT INTO `artworks` VALUES (1,'La Gioconda','Leonardo Da Vinci','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','http://lorempixel.com/400/400/');
INSERT INTO `artworks` VALUES (2,'I Girasoli','Van Gogh','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','http://lorempixel.com/400/400/');
COMMIT;
