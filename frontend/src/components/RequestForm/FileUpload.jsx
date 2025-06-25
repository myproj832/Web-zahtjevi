import { Form } from "react-bootstrap";

function FileUpload() {
  return (
    <Form.Group className="mt-4">
      <Form.Label className="m-1">Priloži izvještaj</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        capture="environment" // ili "user" za prednju kameru
        multiple
      />
    </Form.Group>
  );
}

export default FileUpload;
