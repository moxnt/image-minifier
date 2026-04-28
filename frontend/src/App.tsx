import Dropzone from "react-dropzone";
import "./App.css";

function App() {
  return (
    <>
      <section id="center" className="border-0">
        <h1>Image optimizer</h1>
        <h2>
          Convert your images to .webp and save on space without compromising
          visuals
        </h2>
        <div className="w-2/3 grid grid-cols-2 justify-between">
          <input type="range"></input>
          <input type="range"></input>
        </div>
        <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section className="w-2/3 h-1/2 border-6 border-green-800 rounded-lg content-center">
              <div {...getRootProps()} className="max-w-1/2 m-auto">
                <input {...getInputProps()} />
                <h1 className=" text-gray-600">
                  Drag 'n' drop some files here, or click to select files
                </h1>
              </div>
            </section>
          )}
        </Dropzone>
      </section>
    </>
  );
}

export default App;
