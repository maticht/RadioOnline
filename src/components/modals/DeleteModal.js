import {Button, Form, Modal} from "react-bootstrap";

const CreateLanguage = ({show, onHide}) => {


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h2>Подтвердить удаление</h2>
                </Modal.Title>
            </Modal.Header>

            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={console.log("log")}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateLanguage;