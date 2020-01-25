import fs from "fs";
import path from "path";
import archiver from "archiver";

export default ({
	files,
	dest,
	zipname,
	format = "zip",
	level = 9,
	filenamer
}: {
	files: [{ buffer: Buffer; originalname: string, filename: string, size: Number }];
	dest: string;
	zipname: string;
	format: "zip" | "tar";
	level: Number;
	filenamer: ({ originalname, filename, size }: { originalname: string, filename: string, size: Number }) => string;
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

		files.forEach(({ buffer, originalname, filename, size }) => {
			const name =
				typeof filenamer === "function"
					? filenamer({ originalname, filename, size })
					: originalname;
			archive.append(buffer, { name });
		});

		archive.finalize();
	});
};
