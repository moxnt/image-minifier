import { useDropzone } from "react-dropzone";
import "./App.css";
import { useCallback, useState } from "react";

type PresignerBody = {
  uploadURL: URL;
};

function InternalContent({ filename }: { filename: string | undefined }) {
  if (filename === undefined) {
    return <h1>"Drag 'n' drop some files here, or click to select files"</h1>;
  } else {
    return <div className="p-4 rounded-lg bg-gray-800">{filename}</div>;
  }
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [filename, setFilename] = useState<string | undefined>(undefined);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles[0] === undefined) {
      console.warn("No files yet (c)");
      return;
    }
    setFilename(acceptedFiles[0].name);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  async function upload() {
    const request_url =
      "https://4i1tuw3qjb.execute-api.eu-north-1.amazonaws.com/default/ImageMinifierPresigner";

    if (files[0] === undefined) {
      console.warn("No files yet (u)");
      return;
    }

    try {
      const presigner_data = await fetch(request_url, {
        method: "POST",
        body: JSON.stringify({
          fileType: files[0].type,
          fileName: files[0].name,
        }),
      });
      const presigned_url: PresignerBody = await presigner_data.json();

      const upload_response = await fetch(presigned_url.uploadURL, {
        method: "PUT",
        body: files[0],
        headers: {
          "Content-Type": files[0].type,
        },
      });
      console.log(upload_response);
    } catch (error) {
      console.error("An error ocurred within fetch ", error);
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
        <div className="grid grid-cols-2 gap-4 px-4 justify-between w-full">
          <input type="range"></input>
          <input type="range"></input>
        </div>
        <section className="h-1/2 w-full border-6 border-green-800 rounded-lg content-center">
          <div className="w-full h-full" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="h-full flex justify-center items-center">
              <InternalContent filename={filename} />
            </div>
          </div>
        </section>
        <button
          className="transition-colors duration-200 hover:bg-green-600 text-2xl font-semibold text-gray-200 w-full bg-green-800 p-2 rounded-lg"
          onClick={upload}
        >
          Convert!
        </button>
      </section>
    </>
  );
}

export default App;
