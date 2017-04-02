ybookmarks.sqlite-update
------------------------

[![Greenkeeper badge](https://badges.greenkeeper.io/unlight/ybookmarks.sqlite-update.svg)](https://greenkeeper.io/)
Update database (ybookmarks.sqlite) of FireFox extension Delicious Bookmarks by AVOS System Inc.
This script get your bookmarks from delicious.com exported file and imports to Firefox.

REQUIREMENTS
------------
1. Node.js (http://nodejs.org/download/)
2. sqlite3 shell (http://www.sqlite.org/download.html)

USAGE
-----
1. Export your delicious links http://export.delicious.com/settings/bookmarks/export
2. Click "Export", save file
3. Move file to directory
4. Run script `node update.js`