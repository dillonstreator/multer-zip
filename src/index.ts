import fs from "fs";
import path from "path";
import archiver from "archiver";

export default ({
	files,
	dest,
	zipname,
	format = "zip",
	level = 9
}: {
	files: [{ buffer: Buffer, originalname: string }];
	dest: string;
	zipname: string;
	format: "zip" | "tar";
	level: Number;
}): Promise<any> => {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(path.join(dest, zipname));
		const archive = archiver(format, {
			zlib: { level }
		});

		archive.on("warning", function(err: any) {
			if (err.code !== "ENOENT") reject(err);
		});

		archive.on("error", function(err: any) {
			reject(err);
		});

		archive.on("finish", function() {
			resolve();
		});

		archive.pipe(output);

		files.forEach(({ buffer, originalname }) => {
			archive.append(buffer, { name: originalname });
		});

		archive.finalize();
	});
};
