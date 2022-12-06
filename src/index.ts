import fs from "node:fs";
import path from "node:path";
import stream from "node:stream";
import archiver from "archiver";

type File = {
	buffer: Buffer;
	originalname: string;
	filename: string;
	size: number;
}

type MulterZipOpts = {
	files: File[];
	dest: string | stream.Writable;
	zipname: string;
	format: "zip" | "tar";
	level: number;
	filenamer: ({ originalname, filename, size }: Omit<File, "buffer">) => string;
}

const multerZip = ({
	files,
	dest,
	zipname,
	format = "zip",
	level = 9,
	filenamer
}: MulterZipOpts): Promise<void> => {
	return new Promise((resolve, reject) => {
		const archive = archiver(format, {
			zlib: { level }
		});

		archive.on("warning", function (err: any) {
			if (err.code !== "ENOENT") reject(err);
		});

		archive.on("error", function (err: any) {
			reject(err);
		});

		archive.on("finish", function () {
			resolve();
		});

		let output: stream.Writable;

		if (typeof dest === "string") {
			output = fs.createWriteStream(path.join(dest, zipname));
		} else {
			output = dest;
		}

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

export default multerZip;
