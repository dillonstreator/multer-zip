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
	const filenamer = ({ originalname }) => `${new Date().getTime()}_${originalname}`; 
	zipper({ files, dest, zipname, filenamer })
		.then(() => {
			console.log("successfully zipped files");
		})
		.catch(error => {
			console.log(error);
		});

	res.send("zipping...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT => console.log(`listening on port ${PORT}`));
```

# Options

Key | Description | Note
--- | --- | ---
`files` | Multer files array | **\*Must contain buffers**
`dest` | Destination of zipped files |
`zipname` | Name of zipped files |
`filenamer` | Optional function to change name of file |