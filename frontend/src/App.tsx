import Dropzone from "react-dropzone";
import "./App.css";

function App() {
  return (
    <>
      <section id="center">
        <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </section>
    </>
  );
}

export default App;
