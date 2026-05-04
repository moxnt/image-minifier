import { useDropzone } from "react-dropzone";
import "./App.css";
import { useCallback, useState } from "react";
import ImageStatusChip from "./components/ImageStatusChip";
import type { FileStatus, PresignerBody } from "./types";

type FileInProcessing = {
  file: File;
  status: FileStatus;
  index: number;
  url: URL | null;
};

function App() {
  const [files, setFiles] = useState<FileInProcessing[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file, index) => ({
      file: file,
      status: "added" as const,
      index: index,
      url: null,
    }));
    setFiles(files);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function updateStatus(index: number, status: FileStatus) {
    setFiles((files) =>
      files.map((file) =>
        file.index === index
          ? {
              file: file.file,
              status: status,
              index: index,
              url: file.url,
            }
          : file,
      ),
    );
  }

  function updateURL(index: number, url: URL) {
    setFiles((files) =>
      files.map((file) =>
        file.index === index
          ? {
              file: file.file,
              status: "processed",
              index: index,
              url: url,
            }
          : file,
      ),
    );
  }

  async function upload() {
    const request_url =
      "https://4i1tuw3qjb.execute-api.eu-north-1.amazonaws.com/default/ImageMinifierPresigner";

    if (files[0] === undefined) {
      console.warn("No files yet (u)");
      return;
    }

    const index = files[0].index;

    try {
      const presigner_data = await fetch(request_url, {
        method: "POST",
        body: JSON.stringify({
          fileType: files[0].file.type,
          fileName: files[0].file.name,
          action: "getUploadURL",
        }),
      });

      const presigned_url: PresignerBody = await presigner_data.json();

      updateStatus(index, "signed");

      const upload_response = await fetch(presigned_url.presignedURL, {
        method: "PUT",
        body: files[0].file,
        headers: {
          "Content-Type": files[0].file.type,
        },
      });

      if (!upload_response.ok) {
        updateStatus(index, "faulty");
      }

      const optimizedKey = presigned_url.key.replace(/\.[^/.]+$/, ".webp");

      const presigned_download = await fetch(request_url, {
        method: "POST",
        body: JSON.stringify({
          key: optimizedKey,
          action: "getDownloadURL",
        }),
      });

      const download_data: PresignerBody = await presigned_download.json();
      updateURL(index, download_data.presignedURL);
    } catch (error) {
      console.error("An error ocurred within fetch ", error);
      updateStatus(index, "faulty");
    }
  }

  return (
    <>
      <section id="center" className="border-0 w-2/3 m-auto">
        <h1>Image optimizer</h1>
        <h2>
          Convert your images to .webp and save on space without compromising
          visuals
        </h2>
        {/*
        <div className="grid grid-cols-2 gap-4 px-4 justify-between w-full">
          <input type="range"></input>
          <input type="range"></input>
        </div>*/}
        <section className="h-1/2 w-full border-6 border-green-800 rounded-lg content-center">
          <div className="w-full h-full" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="h-full flex justify-center items-center p-2 gap-2">
              {files.length === 0
                ? "Click to upload an image or drag 'n' drop it in the area!"
                : files.map((uploaded_file, index) => (
                    <ImageStatusChip
                      key={index}
                      filename={uploaded_file.file.name || "test"}
                      status={uploaded_file.status}
                      url={uploaded_file.url || undefined}
                    />
                  ))}
            </div>
          </div>
        </section>
        <button
          className="transition-colors duration-200 hover:bg-green-600 text-2xl font-semibold text-gray-200 w-full bg-green-800 p-2 rounded-lg"
          onClick={upload}
        >
          Convert!
        </button>
        <p>
          If you're reading this, the converter still does one image at a time.
        </p>
      </section>
    </>
  );
}

export default App;
