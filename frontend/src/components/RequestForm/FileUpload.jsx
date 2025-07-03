import { Form } from "react-bootstrap";

function FileUpload({ setFiles }) {
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const base64Files = await Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      })
    );

    setFiles(base64Files); // postavi niz base64 stringova u roditelj komponentu
  };

  return (
    <Form.Group className="mt-4">
      <Form.Label className="m-1" style={{ textTransform: "none" }}>Priloži izvještaj</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        capture="environment" // ili "user" za prednju kameru
        multiple
        onChange={handleFileChange}
      />
    </Form.Group>
  );
}

export default FileUpload;
