# multer-zip

> Promise based multer file upload zipping utility

# Example

```javascript
const path = require("path");

const express = require("express");
const zipper = require("multer-zip");
const multer = require("multer");
const upload = multer(/* ... multer opts ... */);
const app = express();

// ... app definitions

app.post("/", upload.array("documents", 5), (req, res) => {
	const { files } = req;
	const dest = path.join(__dirname, "uploads");
	const zipname = `files_${Math.random()}.zip`;
	zipper({ files, dest, zipname })
		.then(() => {
			console.log("successfully zipped files");
		})
		.catch(error => {
			console.log(error);
		});

	res.send("zipping...");
});

app.listen(/* ... */);
```
